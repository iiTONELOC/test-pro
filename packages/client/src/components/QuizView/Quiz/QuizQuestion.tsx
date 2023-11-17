import { TopicTag } from '../..';
import { AnswerOptions } from './Answers/AnswerOptions';
import { useMountedState } from '../../../hooks';
import {
    PopulatedQuestionModelType, PopulatedQuizModel,
    TopicModelType, quizRunnerState, trimClasses, uuid
} from '../../../utils';
import { NextQuestionBtn } from './NextQuestionBtn';


export type QuizQuestionProps = {
    question: PopulatedQuestionModelType | null;
    quizState: ReturnType<typeof quizRunnerState>;
}

const sectionClasses = `bg-slate-950 rounded-md w-full max-w-[800px] h-auto min-h-[425px] p-5 mt-8 flex
flex-col gap-4 text-gray-300`;

const getTotalNumberOfQuestions = (quizData: PopulatedQuizModel | null) => !quizData ? 0 : quizData.questions.length;
const currentQuestionNumber = (currentQuestionIndex: number | null) => !currentQuestionIndex ? 1 : currentQuestionIndex + 1;

export function QuizQuestion({ question, quizState }: Readonly<QuizQuestionProps>): JSX.Element {// NOSONAR
    const isMounted = useMountedState();
    const { currentQuestionIndex, quizData } = quizState;

    return isMounted ? (
        <section className={trimClasses(sectionClasses)}>
            <header className={'w-full flex flex-col place-content-start'}>
                <h2 className={'text-xs '}>
                    Question {currentQuestionNumber(currentQuestionIndex)} of {getTotalNumberOfQuestions(quizData)}
                </h2>
                <span className={'flex flex-wrap flex-row gap-2 text-xs mt-1'}>
                    {question?.topics.map((topic: TopicModelType) =>
                        <TopicTag key={uuid()} topic={topic.name ?? ''} />
                    )}
                </span>
            </header>
            <div className={'w-full h-full flex flex-col justify-center items-center my-2'}>
                <h3 className={'text-xl sm:text-2xl font-thin text-start'}>{question?.question}</h3>
            </div>

            <AnswerOptions quizState={quizState} question={question} />
            <NextQuestionBtn quizState={quizState} />
        </section>
    ) : <></>
}
