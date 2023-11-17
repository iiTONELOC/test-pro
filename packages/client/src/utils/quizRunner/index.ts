import { useMountedState } from '../../hooks';
import { useEffect, useState } from 'preact/hooks';
import { useCurrentFileSignal, useQuizViewSignal, QuizViews } from '../../signals';
import {
    PopulatedQuizModel, QuizModelResponse,
    calculatePassingScore, PopulatedQuestionModelType, shuffle, API
} from '..';

export interface IAnsweredQuestionData {
    answeredQuestion: {
        question: string;
        selectedAnswer: string;
        elapsedTimeInMs: number
    }
}

export interface IQuizAttemptData {
    quizId: string;
    answeredQuestions: IAnsweredQuestionData[];
    earnedPoints: number;
    passingPoints: number;
    passed: boolean;
    dateTaken: Date;
    elapsedTimeInMs: number;
}

/*
 * NOTES:
 *
 * The API is configured to create an Attempt then add an answeredQuestion to it via
 * the quiz-attempt/:attemptID route. An answered Question uses the QuizQuestionResult model
 * and NEEDS a valid quizAttempt ID before the model can be created.
 *
 * Completed Quizzes will be automatically graded via the quiz-attempt/:attemptID/grade-quiz route
 * And will not be graded by the front end.
 *
 */


export function quizRunnerState() {
    const isMounted = useMountedState();

    // user's currently selected file is stored in the fileDetails signal
    const { fileDetails } = useCurrentFileSignal()
    const { setCurrentQuizView } = useQuizViewSignal();
    const currentFileDetails: QuizModelResponse | null = fileDetails.value;

    // use local-state to manage all the quizData
    const [quizIsComplete, setQuizIsComplete] = useState<boolean>(false);
    const [quizData, setQuizData] = useState<PopulatedQuizModel | null>(null);
    const [elapsedQuizTime, setElapsedQuizTime] = useState<number | null>(null);
    const [elapsedQuestionTime, setElapsedQuestionTime] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [attemptedQuizData, setAttemptedQuizData] = useState<IQuizAttemptData | null>(null);
    const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState<string | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<PopulatedQuestionModelType | null>(null);


    const addAnsweredQuestionToAttempt = (answeredQuestion: IAnsweredQuestionData) => {
        if (attemptedQuizData) {
            setAttemptedQuizData({
                ...attemptedQuizData,
                answeredQuestions: [...attemptedQuizData.answeredQuestions, answeredQuestion]
            });
            setCurrentQuestionIndex((currentQuestionIndex ?? 0) + 1);
        }
    };

    const createQuizAttempt = () => {
        // create the quiz attempt
        if (quizData) {
            const quizAttemptData: IQuizAttemptData = {
                quizId: quizData._id.toString(),
                // do not set as this requires IDs of created answered questions,
                // which can not be created until the quiz attempt is created
                answeredQuestions: [],
                earnedPoints: 0,
                passingPoints: calculatePassingScore(quizData.questions),
                passed: false,
                dateTaken: new Date(),
                elapsedTimeInMs: 0
            }
            setAttemptedQuizData(quizAttemptData);
        }
    };

    const randomizeQuestions = () => currentFileDetails?.questions &&
        (currentFileDetails.questions = shuffle(currentFileDetails?.questions));

    // @ts-ignore
    const randomizeAnswerOptions = () => currentFileDetails?.questions.forEach((question: PopulatedQuestionModelType) => {
        question.options = shuffle(question.options);
    });

    const resetState = () => {
        setQuizIsComplete(false);
        randomizeQuestions();
        randomizeAnswerOptions();
        setQuizData(currentFileDetails as PopulatedQuizModel);
        setCurrentQuestionIndex(0);
        setCurrentQuestionAnswered(null);
        setCurrentQuestion(null);
        setElapsedQuizTime(null);
        setElapsedQuestionTime(null);
        setAttemptedQuizData(null);
    };

    const handleQuizComplete = async () => {
        const elapsed = Date.now() - (elapsedQuizTime ?? 0);
        setQuizIsComplete(true);
        setElapsedQuizTime(elapsed);

        if (attemptedQuizData) {
            attemptedQuizData.elapsedTimeInMs = elapsed;
            attemptedQuizData.passed = attemptedQuizData.earnedPoints >= attemptedQuizData.passingPoints;
            setAttemptedQuizData(attemptedQuizData);
            await API.createQuizAttemptWithAnswers(
                attemptedQuizData, { needToPopulate: true, showTimestamps: false });

            resetState();
            setCurrentQuizView(QuizViews.QuizHistory);
        }
    };

    // update the quizData on component mount and when the currentFileDetails change
    useEffect(() => {
        isMounted && resetState();
    }, [currentFileDetails, isMounted]);

    useEffect(() => {
        isMounted && quizData && (() => {
            createQuizAttempt();
            // set the starting timestamp, we will calculate the elapsed time at the end of the quiz
            setElapsedQuizTime(Date.now());
            // set the starting question index
            setCurrentQuestionIndex(0);
        })();
    }, [quizData]);

    // when the question Index changes, set the starting timestamp for the question
    // set the current question and reset the current question answered
    useEffect(() => {
        isMounted && (() => {
            setElapsedQuestionTime(Date.now());
            setCurrentQuestion(quizData?.questions[currentQuestionIndex ?? 0] ?? null);
            setCurrentQuestionAnswered(null);

            // if the currentQuestionIndex is equal to the number of questions in the quiz, the quiz is complete
            if (currentQuestionIndex === quizData?.questions.length) {
                handleQuizComplete();
            }
        })();
    }, [currentQuestionIndex]);

    return {
        quizIsComplete,
        setQuizIsComplete,
        quizData,
        setQuizData,
        elapsedQuizTime,
        setElapsedQuizTime,
        elapsedQuestionTime,
        setElapsedQuestionTime,
        currentQuestionAnswered,
        setCurrentQuestionAnswered,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        attemptedQuizData,
        setAttemptedQuizData,
        currentQuestion,
        setCurrentQuestion,
        addAnsweredQuestionToAttempt,
        createQuizAttempt,
        resetState
    }
}
