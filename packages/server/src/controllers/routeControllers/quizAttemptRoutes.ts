import { Request, Response } from 'express';
import { shouldShowTimestamps, handleRouteError, httpStatusCodes, extractDbQueryParams } from './routeUtils';
import { quizAttemptController, quizQuestionResultController, quizController, questionController } from '../dbControllers';

import type { IApiResponse, QuizModelResponse } from '../types';
import type { QuizAttemptModelResponse } from '../dbControllers/quizAttemptController';
import type { PopulatedQuizAttemptType, IQuizQuestionResult, QuizQuestionResultType } from '../../db/types';
import QuizQuestionResult, { PopulatedQuizQuestionResultType } from '../../db/models/QuizQuestionResult';


export interface IQuizAttemptRouteController {
    getAll(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse[]>>;
    create(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>>;
    getById(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>>;
    updateById(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>>;
    deleteById(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>>;
    getByQuizId(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse[]>>;
    addAnsweredQuestion(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>>;
    gradeQuizAttempt(req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>>;
}

export const quizAttemptRouteController: IQuizAttemptRouteController = {
    getAll: async (req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse[]>> => {
        try {
            const quizAttempts = await quizAttemptController.getAll(extractDbQueryParams(req));
            return res.status(httpStatusCodes.OK).json({ data: quizAttempts });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    create: async (req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>> => {
        try {
            // lookup the quiz by id, if it doesn't exist, throw an error
            const existingQuiz = await quizController.getById(req.body.quizId, extractDbQueryParams(req));
            if (!existingQuiz) throw new Error('Quiz not found.');
            const quizAttempt = await quizAttemptController.create(req.body, extractDbQueryParams(req));
            return res.status(httpStatusCodes.CREATED).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getById: async (req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>> => {
        try {
            const quizAttempt = await quizAttemptController.getById(req.params.id, extractDbQueryParams(req));
            if (!quizAttempt) throw new Error('Quiz attempt not found.');
            return res.status(httpStatusCodes.OK).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    updateById: async (req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>> => {
        try {
            const quizAttempt = await quizAttemptController.updateById(req.params.id, req.body, extractDbQueryParams(req));
            if (!quizAttempt) throw new Error('Quiz attempt not found.');
            return res.status(httpStatusCodes.OK).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    deleteById: async (req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>> => {
        try {
            const quizAttempt = await quizAttemptController.deleteById(req.params.id, extractDbQueryParams(req));
            if (!quizAttempt) throw new Error('Quiz attempt not found.');
            return res.status(httpStatusCodes.OK).json({ data: quizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    getByQuizId: async (req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse[]>> => {
        const { quizId } = req.params;
        try {
            const quizAttempts = await quizAttemptController.getByQuizId(quizId, extractDbQueryParams(req));
            return res.status(httpStatusCodes.OK).json({ data: quizAttempts });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    addAnsweredQuestion: async (req: Request, res: Response): Promise<IApiResponse<QuizAttemptModelResponse>> => {
        // quizAttemptId
        const { id } = req.params;
        // extract the answeredQuestion from the request body
        const { answeredQuestion } = req.body;

        const showTimeStamps = shouldShowTimestamps(req);
        const queryParams = extractDbQueryParams(req);

        try {
            // we need to make sure the quizAttempt exists
            const quizAttempt: QuizAttemptModelResponse | null = await quizAttemptController
                .getById(id, queryParams);
            if (!quizAttempt) throw new Error('Quiz attempt not found.');

            // we need to make sure the question hasn't already been answered
            const questionId = answeredQuestion?.question ?? null
            for (const question of quizAttempt.answeredQuestions as QuizQuestionResultType[]) {
                if (questionId === (question?.question?._id?.toString() ?? question)) throw new Error('Question has already been answered.');
            }

            // need to grade the question, first we need to get the original question so we can compare the answers
            const originalQuestion = await questionController.getById(questionId, queryParams);
            if (!originalQuestion) throw new Error('Question not found.');

            const correctAnswer = originalQuestion.answer.trim().toLowerCase();
            const isCorrect = correctAnswer === answeredQuestion.selectedAnswer.trim().toLowerCase();

            // create the question result using the quizAttemptId from the request params
            const questionResult = await quizQuestionResultController.create({
                ...answeredQuestion,
                quizAttempt: id,
                isCorrect
            } as IQuizQuestionResult, showTimeStamps);

            // if this returns null, throw an error
            if (!questionResult) throw new Error('Could not create question result.');

            // add the question result to the quizAttempt
            const updatedQuizAttempt = await quizAttemptController
                .updateById(id, { answeredQuestions: [questionResult._id] }, queryParams);

            // if this returns null, throw an error
            if (!updatedQuizAttempt) throw new Error('There was an adding the answered question.');

            return res.status(httpStatusCodes.CREATED).json({ data: updatedQuizAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    },
    gradeQuizAttempt: async (req: Request, res: Response): Promise<IApiResponse<PopulatedQuizAttemptType>> => {
        const { id } = req.params;
        const queryParams = extractDbQueryParams(req);

        try {
            // get the quizAttempt
            const ungradedAttempt: QuizAttemptModelResponse | null = await quizAttemptController
                .getById(id, { ...queryParams, needToPopulate: true });
            if (!ungradedAttempt) throw new Error('Quiz attempt not found.');
            // get the quiz
            const originalQuizData: QuizModelResponse | null = await quizController
                .getById(ungradedAttempt.quizId.toString(), queryParams);
            if (!originalQuizData) throw new Error('Quiz not found.');

            // check for answered questions, if there are none, throw an error
            if (!ungradedAttempt.answeredQuestions?.length) throw new Error('Quiz attempt has no answered questions.');

            // get the number of questions
            const totalNumberOfQuestions = originalQuizData.questions.length;

            // loop over the answered questions and check if they are correct
            const answeredQuestions = ungradedAttempt.answeredQuestions as unknown as PopulatedQuizQuestionResultType[];


            // TODO: handle other question types
            // TODO: Refactor the question grading logic into a separate function
            for (const answeredQuestion of answeredQuestions) {
                // check if the answer is correct if  if it is ensure the isCorrect flag is set to true
                const question = answeredQuestion.question;
                const correctAnswer = question.answer.trim().toLowerCase();

                let isCorrect = false;

                if (question.questionType === 'MultipleChoice'
                    || question.questionType === 'FillInTheBlank'
                    || question.questionType === 'ShortAnswer') {
                    isCorrect = correctAnswer === answeredQuestion.selectedAnswer.trim().toLowerCase();

                } else if (question.questionType === 'Matching') {
                    const aiProvidedDelims = ['|', ':', '->', '=>', '-'];

                    // we dont exactly know what the delimiter is as GPT-4 doesn't exactly follow the rules
                    // these are the ones I have seen returned so far
                    const userSelections = answeredQuestion.selectedAnswer.split(',')
                        .map((selection: string) => selection.trim().toLowerCase());

                    const correctSelections = correctAnswer.split(',')
                        .map((selection: string) => selection.trim().toLowerCase());

                    const foundDelim = aiProvidedDelims.find((delim: string) => correctSelections[0].includes(delim));

                    // Hopefully this does not happen but we need it to error if it does, we would have no immediate
                    // way to grade the question
                    if (!foundDelim) throw new Error('Could not find delimiter: ' + correctSelections[0]);

                    const [correctLeft, correctRight] = correctSelections[0].split(foundDelim);
                    const [userLeft, userRight] = userSelections[0].split('-');

                    isCorrect = correctLeft === userLeft && correctRight === userRight;

                } else if (question.questionType === 'SelectAllThatApply') {
                    //here we need to check if the selected answers are all correct the order doesn't matter
                    const selectedAnswers = answeredQuestion.selectedAnswer.split(',');
                    const correctAnswers = correctAnswer.split(',');

                    (() => {
                        selectedAnswers.length !== correctAnswers.length && (isCorrect = false);
                        selectedAnswers.length === correctAnswers.length && (() => {
                            // set the isCorrect flag to true, if any of the answers are incorrect, set it to false
                            isCorrect = true;

                            // ensure that the selected answers are all correct
                            selectedAnswers.forEach((selectedAnswer: string) => {
                                !correctAnswers.includes(selectedAnswer.trim().toLowerCase()) &&
                                    (isCorrect = false);
                            });

                            // ensure that all of the correct answers were selected
                            correctAnswers.forEach((correctAnswer: string) => {
                                !selectedAnswers.includes(correctAnswer.trim().toLowerCase()) &&
                                    (isCorrect = false);
                            });
                        })();
                    })();
                } else {
                    // TODO: handle other question types
                }

                // check the isCorrect variable against the isCorrect flag on the question
                const isCorrectFlag = answeredQuestion.isCorrect;

                // if they don't match, update the question result
                if (isCorrect !== isCorrectFlag) {
                    await QuizQuestionResult.updateOne({ _id: answeredQuestion._id }, { isCorrect });
                }
            }

            // find the number of correct answers
            const numberOfCorrectAnswers = ungradedAttempt.answeredQuestions
                .filter((answer: any) => answer?.isCorrect).length;

            // calculate the percentage
            const percentage = numberOfCorrectAnswers / totalNumberOfQuestions * 100;
            const passed = percentage >= 70;

            // update the quizAttempt and set the correct data for earnedPoints, passingPoints, and passed
            const gradedAttempt = await quizAttemptController.updateById(id, {
                earnedPoints: numberOfCorrectAnswers,
                passingPoints: totalNumberOfQuestions,
                passed
            }, queryParams);

            if (!gradedAttempt) throw new Error('There was an error grading the quiz attempt.');
            return res.status(httpStatusCodes.OK).json({ data: gradedAttempt });
        } catch (error: any) {
            return handleRouteError(res, error.message);
        }
    }
}

export default quizAttemptRouteController;
