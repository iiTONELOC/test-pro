import type {
    IQuizAttempt,
    IApiResponse,
    IQuizHistory,
    dbQueryParams,
    TopicModelType,
    QuizHistoryType,
    QuizAttemptType,
    QuestionTypeEnums,
    QuizModelResponse,
    PopulatedQuizModel,
    QuestionModelResponse,
    QuizQuestionResultType,
    PopulatedQuizAttemptType,
    PopulatedQuizHistoryType,
    QuizAttemptModelResponse,
    PopulatedQuestionModelType,
    PopulatedQuizQuestionResultType
} from '../../../server/types';

import { IQuizAttemptData, IAnsweredQuestionData } from '.';
import { useQuizzesDbSignal, QuizzesDbSignal } from '../signals';

export type {
    IQuizAttempt,
    IApiResponse,
    IQuizHistory,
    dbQueryParams,
    TopicModelType,
    QuizHistoryType,
    QuizAttemptType,
    QuestionTypeEnums,
    QuizModelResponse,
    PopulatedQuizModel,
    QuestionModelResponse,
    QuizQuestionResultType,
    PopulatedQuizAttemptType,
    PopulatedQuizHistoryType,
    QuizAttemptModelResponse,
    PopulatedQuestionModelType,
    PopulatedQuizQuestionResultType
};

/**
 * ```ts
 * const defaultAPIQueryParams: dbQueryParams = {
 *    showTimestamps: false,
 *    needToPopulate: true
 * };
 * ```
 */
export const defaultAPIQueryParams: dbQueryParams = {
    showTimestamps: false,
    needToPopulate: true
};

const API_URL = `http://localhost:3000/api`;

function buildURL(baseUrl: string, params: dbQueryParams): string {
    const { showTimestamps, needToPopulate } = params ?? defaultAPIQueryParams;
    let url = baseUrl;

    showTimestamps && (url += '?timestamps=true');
    !needToPopulate && (url.includes('?') ? (url += '&no-populate=true') : (url += '?no-populate=true'));

    return url;
}


async function _createQuizAttempt(attemptData: IQuizAttempt, props: dbQueryParams): Promise<QuizAttemptModelResponse | null> {
    try {
        const quizAttemptURL = `${API_URL}/quiz-attempts`;
        const baseUrl = buildURL(quizAttemptURL, props);

        const createQuizAttemptResponse: Response = await fetch(baseUrl,
            {
                body: JSON.stringify(attemptData),
                method: 'POST', headers: { 'Content-Type': 'application/json' }
            });

        const createQuizAttemptData: IApiResponse<QuizAttemptModelResponse> = await createQuizAttemptResponse.json() as IApiResponse<QuizAttemptModelResponse>;

        return createQuizAttemptData.data ?? null
    } catch (error) {
        console.error('An error occurred while creating a quiz attempt', error);
        return null;
    }
}
// TODO: FIX THE BACKEND API TO USE AN ARRAY
async function _addAnswersToQuizAttempt(answeredQuestions: IAnsweredQuestionData[], attemptId: string, props: dbQueryParams): Promise<QuizAttemptModelResponse | null> {
    try {

        let returnData: QuizAttemptModelResponse | null = null;
        const url = `${API_URL}/quiz-attempts/${attemptId}/answered-questions`;
        const baseUrl = buildURL(url, props);

        for (const answeredQuestion of answeredQuestions) {
            const response: Response = await fetch(baseUrl,
                {
                    body: JSON.stringify({ ...answeredQuestion }),
                    method: 'POST', headers: { 'Content-Type': 'application/json' }
                });
            const data: IApiResponse<QuizAttemptModelResponse> = await response.json() as IApiResponse<QuizAttemptModelResponse>;
            returnData = data.data ?? null;
        }
        return returnData;
    } catch (error) {
        console.error('An error occurred while adding an answer to a quiz attempt', error);
        return null;
    }
}

async function _createQuizHistory(attemptId: string, props: dbQueryParams): Promise<PopulatedQuizHistoryType | null> {
    try {
        const url = `${API_URL}/history`;
        const baseUrl = buildURL(url, props);

        const data = { attempt: attemptId } as unknown as IQuizHistory;
        const response: Response = await fetch(baseUrl, {
            body: JSON.stringify(data),
            method: 'POST', headers: { 'Content-Type': 'application/json' }
        });

        const responseData: IApiResponse<PopulatedQuizHistoryType> = await response.json() as IApiResponse<PopulatedQuizHistoryType>;
        return responseData.data ?? null;

    } catch (error) {
        console.error('An error occurred while creating a quiz history', error);
        return null;
    }
}
async function _gradeQuizAttempt(attemptId: string, props: dbQueryParams): Promise<PopulatedQuizAttemptType | null> {
    try {
        const url = `${API_URL}/quiz-attempts/${attemptId}/grade-quiz`;
        const baseUrl = buildURL(url, props);

        const response: Response = await fetch(baseUrl, { method: 'GET' });
        const responseData: IApiResponse<PopulatedQuizAttemptType> = await response.json() as IApiResponse<PopulatedQuizAttemptType>;

        return responseData.data ?? null;
    } catch (error) {
        console.error('An error occurred while grading a quiz attempt', error);
        return null
    }
}

// API
export const API = {
    async getAllQuizzes(props: dbQueryParams): Promise<QuizModelResponse[]> {
        const { setQuizzes }: QuizzesDbSignal = useQuizzesDbSignal();

        try {
            const { showTimestamps, needToPopulate } = props ?? defaultAPIQueryParams;
            let baseUrl = `${API_URL}/quizzes`;
            baseUrl = buildURL(baseUrl, { showTimestamps, needToPopulate });

            const response: Response = await fetch(baseUrl);
            const data: IApiResponse<QuizModelResponse[]> = await response.json() as IApiResponse<QuizModelResponse[]>;

            const quizzes = data?.data ?? [];
            // update the quizzesDb signal
            setQuizzes(quizzes);
            return quizzes;
        } catch (error) {
            console.error('An error occurred while fetching quizzes', error);
            return [];
        }
    },
    async getQuizById(id: string, props: dbQueryParams): Promise<QuizModelResponse | null> {
        try {
            const { showTimestamps, needToPopulate } = props ?? defaultAPIQueryParams;
            let baseUrl = `${API_URL}/quizzes/${id}`;
            baseUrl = buildURL(baseUrl, { showTimestamps, needToPopulate });

            const response: Response = await fetch(baseUrl);
            const data: IApiResponse<QuizModelResponse> = await response.json() as IApiResponse<QuizModelResponse>;

            return data.data ?? null;
        } catch (error) {
            console.error('An error occurred while fetching quiz by id', error);
            return null;
        }
    },

    async createQuizAttemptWithAnswers(attemptData: IQuizAttemptData, props: dbQueryParams): Promise<PopulatedQuizHistoryType | null> {
        try {
            const { answeredQuestions, ...quizAttemptData } = attemptData;
            const data = { ...quizAttemptData, answeredQuestions: [] } as unknown as IQuizAttempt;

            const defaultProps = {
                showTimestamps: false,
                needToPopulate: false
            };

            // create the attempt
            const createdAttempt: QuizAttemptModelResponse | null = await _createQuizAttempt(data, defaultProps);
            if (!createdAttempt) throw new Error('An error occurred while creating a quiz attempt');

            // add the answers to the attempt
            const addedAnswers: QuizAttemptModelResponse | null = await
                _addAnswersToQuizAttempt(answeredQuestions, createdAttempt._id.toString(), defaultProps);
            if (!addedAnswers) throw new Error('An error occurred while adding answers to a quiz attempt');

            // grade the attempt
            await _gradeQuizAttempt(createdAttempt._id.toString(),
                { showTimestamps: false, needToPopulate: false });

            // create the history object and return it
            const createdHistory: PopulatedQuizHistoryType | null = await _createQuizHistory(
                createdAttempt._id.toString(), props);

            return createdHistory ?? null;
        } catch (error) {
            console.error('An error occurred while creating a quiz attempt', error);
            return null;
        }
    },
    async getQuizHistoryById(id: string, props: dbQueryParams): Promise<PopulatedQuizHistoryType | null> {
        try {
            const { showTimestamps, needToPopulate } = props ?? defaultAPIQueryParams;
            let baseUrl = `${API_URL}/history/${id}`;
            baseUrl = buildURL(baseUrl, { showTimestamps, needToPopulate });

            const response: Response = await fetch(baseUrl);
            const data: IApiResponse<PopulatedQuizHistoryType> = await response.json() as IApiResponse<PopulatedQuizHistoryType>;

            return data.data ?? null;
        } catch (error) {
            console.error('An error occurred while fetching quiz history by id', error);
            return null;
        }
    },
    async getQuizHistoriesForQuiz(quizId: string, props: dbQueryParams): Promise<PopulatedQuizHistoryType[] | null> {
        try {
            const { showTimestamps, needToPopulate } = props ?? defaultAPIQueryParams;
            let baseUrl = `${API_URL}/history/quiz/${quizId?.toString() ?? ''}`;
            baseUrl = buildURL(baseUrl, { showTimestamps, needToPopulate });

            const response: Response = await fetch(baseUrl, {
                method: 'GET', headers: { 'Content-Type': 'application/json' }
            });
            const data: IApiResponse<PopulatedQuizHistoryType[]> = await response.json() as IApiResponse<PopulatedQuizHistoryType[]>;

            return data.data ?? null;
        } catch (error) {
            console.error('An error occurred while fetching quiz histories for quiz', error);
            return null;
        }
    }
};

export default API;
