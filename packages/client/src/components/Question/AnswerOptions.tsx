import { JSX } from 'preact/jsx-runtime';
import { trimClasses } from '../../utils';
import { useMountedState } from '../../hooks';
import { QuizQuestionProps } from '../QuizView/Quiz/QuizQuestion';
import { PopulatedQuizQuestionResultType } from '../../utils/api';
import { AnswersMatching } from '../QuizView/Quiz/Answers/AnswersMatching';
import { AnsweredMatching } from '../QuizView/QuizHistory/Answered/AnsweredMatching';
import { AnswersMultipleChoice } from '../QuizView/Quiz/Answers/AnswersMultipleChoice';
import { AnswersSelectAllThatApply } from '../QuizView/Quiz/Answers/AnswersSelectAllThatApply';
import { AnsweredMultipleChoice } from '../QuizView/QuizHistory/Answered/AnsweredMultipleChoice';
import { AnsweredSelectAllThatApply } from '../QuizView/QuizHistory/Answered/AnsweredSelectAllThatApply';



enum AnswerTypes {
    SelectAllThatApply = 'SelectAllThatApply',
    MultipleChoice = 'MultipleChoice',
    FillInTheBlank = 'FillInTheBlank',
    ShortAnswer = 'ShortAnswer',
    Matching = 'Matching',
    Ordering = 'Ordering',
    Image = 'Image'
};

export interface AnswerOptionProps {
    quizState: QuizQuestionProps['quizState'];
    question: QuizQuestionProps['question'];
    isHistory?: boolean;
}

export interface AnsweredQuizQuestionProps {
    quizState?: QuizQuestionProps['quizState'];
    question: QuizQuestionProps['question'];
    isHistory?: boolean;
}


// for quizzes
function AnswerOptionSwitch({ quizState, question }: Readonly<AnswerOptionProps>): JSX.Element {
    const selectedQuestionType = question?.questionType as unknown as AnswerTypes;

    switch (selectedQuestionType) {
        case AnswerTypes.SelectAllThatApply:
            return <AnswersSelectAllThatApply
                options={question?.options ?? []}
                quizState={quizState} />;

        case AnswerTypes.MultipleChoice:
            return <AnswersMultipleChoice options={question?.options ?? []} quizState={quizState} />;
        case AnswerTypes.FillInTheBlank:
            // TODO: implement FillInTheBlank
            return <>Fill in The Blank</>;
        case AnswerTypes.ShortAnswer:
            // TODO: implement ShortAnswer
            return <>Short Answer</>;
        case AnswerTypes.Matching:
            return <AnswersMatching
                options={question?.options ?? []}
                matchingOptions={question?.matchOptions ?? []}
                quizState={quizState}
                reUsableOptions={question?.question.toLocaleLowerCase().includes('more than once')}
            />;
        case AnswerTypes.Ordering:
            // TODO: implement Ordering
            return <>Ordering</>;
        // TODO: implement Image
        case AnswerTypes.Image:
            return <>Image</>;
        default:
            return <></>;
    }
}


// for history
function AnsweredAnswerOptionSwitch({ questionResult }:
    {
        questionResult: PopulatedQuizQuestionResultType
    }): JSX.Element {
    const selectedQuestionType = questionResult?.question?.questionType as unknown as AnswerTypes;

    switch (selectedQuestionType) {
        case AnswerTypes.SelectAllThatApply:
            return <AnsweredSelectAllThatApply options={questionResult?.question?.options ?? []} />;
        case AnswerTypes.MultipleChoice:
            return <AnsweredMultipleChoice options={questionResult?.question?.options ?? []} />;
        case AnswerTypes.FillInTheBlank:
            // TODO: implement FillInTheBlank
            return <>Fill in The Blank</>;
        case AnswerTypes.ShortAnswer:
            // TODO: implement ShortAnswer
            return <>Short Answer</>;
        case AnswerTypes.Matching:
            return <AnsweredMatching questionResult={questionResult} />;

        case AnswerTypes.Ordering:
            // TODO: implement Ordering
            return <>Ordering</>;
        // TODO: implement Image
        case AnswerTypes.Image:
            return <>Image</>;
        default:
            return <></>;
    }
}

const sectionClasses = 'flex flex-col flex-start w-full h-full items-center p-2';

type IsHistoryProps = { isHistory: boolean, question: PopulatedQuizQuestionResultType };
export function AnswerOptions(props: Readonly<(AnswerOptionProps | AnsweredQuizQuestionProps | IsHistoryProps)>): JSX.Element { // NOSONAR
    const isMounted = useMountedState();

    const histProps = props as IsHistoryProps;

    return isMounted ? (
        <section className={trimClasses(sectionClasses)}>
            {
                (!props.isHistory ?
                    <AnswerOptionSwitch {...props as AnswerOptionProps} /> :
                    <AnsweredAnswerOptionSwitch questionResult={histProps.question} />
                )
            }
        </section>
    ) : <></>
}
