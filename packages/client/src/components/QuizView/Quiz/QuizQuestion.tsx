import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../../hooks';
import {
    PopulatedQuestionModelType, PopulatedQuizModel,
    TopicModelType, quizRunnerState
} from '../../../utils';
import { NextQuestionBtn } from './NextQuestionBtn';
import { AnswerOptions } from '../../Question/AnswerOptions';
import { QuestionCardBody, QuestionCard, QuestionCardHeader } from '../../Question/Card';

export type QuizQuestionProps = {
    question: PopulatedQuestionModelType | null;
    quizState: ReturnType<typeof quizRunnerState>;
}

const getTotalNumberOfQuestions = (quizData: PopulatedQuizModel | null) => !quizData ? 0 : quizData.questions.length;
const currentQuestionNumber = (currentQuestionIndex: number | null) => !currentQuestionIndex ? 1 : currentQuestionIndex + 1;

export function QuizQuestion({ question, quizState }: Readonly<QuizQuestionProps>): JSX.Element {// NOSONAR
    const isMounted = useMountedState();
    const { currentQuestionIndex, quizData } = quizState;

    const questionNumber = currentQuestionNumber(currentQuestionIndex);
    const totalNumberOfQuestions = getTotalNumberOfQuestions(quizData);
    const topics = question?.topics.map((topic: TopicModelType) => topic.name ?? '') ?? [];

    return isMounted ? (

        <QuestionCard>
            <QuestionCardHeader
                questionNumber={questionNumber}
                totalNumberOfQuestions={totalNumberOfQuestions}
                topics={topics}
            />
            <QuestionCardBody question={question?.question ?? ''} />

            <AnswerOptions quizState={quizState} question={question} />
            <NextQuestionBtn quizState={quizState} />
        </QuestionCard>

    ) : <></>
}
