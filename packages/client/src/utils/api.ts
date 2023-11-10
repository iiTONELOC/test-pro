import type {
    IApiResponse,
    dbQueryParams,
    TopicModelType,
    QuizModelResponse,
    PopulatedQuizModel,
    QuestionModelResponse
} from '../../../server/types';

import { useQuizzesDbState, QuizzesDbState } from '../signals';

export type {
    IApiResponse, QuizModelResponse, QuestionModelResponse, dbQueryParams, PopulatedQuizModel,
    TopicModelType
};

const defaultAPIQueryParams: dbQueryParams = {
    showTimestamps: false,
    needToPopulate: true
};

const API_URL = `http://localhost:3000`

function buildURL(baseUrl: string, params: dbQueryParams): string {
    const { showTimestamps, needToPopulate } = params ?? defaultAPIQueryParams;
    let url = baseUrl;

    showTimestamps && (url += '?showTimestamps=true');
    !needToPopulate && (url.includes('?') ? (url += '&no-populate=false') : (url += '?no-populate=false'));

    return url;
}

export const API = {
    async getAllQuizzes(props: dbQueryParams): Promise<QuizModelResponse[]> {
        const { setQuizzes }: QuizzesDbState = useQuizzesDbState();

        try {
            const { showTimestamps, needToPopulate } = props ?? defaultAPIQueryParams;
            let baseUrl = `${API_URL}/api/quizzes`;
            baseUrl = buildURL(baseUrl, { showTimestamps, needToPopulate });

            const response: Response = await fetch(baseUrl);
            const data: IApiResponse<QuizModelResponse[]> = await response.json() as IApiResponse<QuizModelResponse[]>;

            const quizzes = data?.data ?? [];
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
            let baseUrl = `${API_URL}/api/quizzes/${id}`;
            baseUrl = buildURL(baseUrl, { showTimestamps, needToPopulate });

            const response: Response = await fetch(baseUrl);
            const data: IApiResponse<QuizModelResponse> = await response.json() as IApiResponse<QuizModelResponse>;

            return data.data ?? null;
        } catch (error) {
            console.error('An error occurred while fetching quiz by id', error);
            return null;
        }
    },

};

export default API;
