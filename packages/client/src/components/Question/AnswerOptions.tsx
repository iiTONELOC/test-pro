import { JSX } from 'preact/jsx-runtime';
import { trimClasses } from '../../utils';
import { useMountedState } from '../../hooks';
import { QuizQuestionProps } from '../QuizView/Quiz/QuizQuestion';
import { AnswersMultipleChoice } from '../QuizView/Quiz/Answers/AnswersMultipleChoice';
import { AnsweredMultipleChoice } from '../QuizView/QuizHistory/Answered/AnsweredMultipleChoice';

enum AnswerTypes {
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
        case AnswerTypes.MultipleChoice:
            return <AnswersMultipleChoice options={question?.options ?? []} quizState={quizState} />;
        case AnswerTypes.FillInTheBlank:
            // TODO: implement FillInTheBlank
            return <>Fill in The Blank</>;
        case AnswerTypes.ShortAnswer:
            // TODO: implement ShortAnswer
            return <>Short Answer</>;
        case AnswerTypes.Matching:
            // TODO: implement Matching
            return <>Matching</>;
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
function AnsweredAnswerOptionSwitch({ question }: Readonly<AnsweredQuizQuestionProps>): JSX.Element {
    const selectedQuestionType = question?.questionType as unknown as AnswerTypes;

    switch (selectedQuestionType) {
        case AnswerTypes.MultipleChoice:
            return <AnsweredMultipleChoice options={question?.options ?? []} />;
        case AnswerTypes.FillInTheBlank:
            // TODO: implement FillInTheBlank
            return <>Fill in The Blank</>;
        case AnswerTypes.ShortAnswer:
            // TODO: implement ShortAnswer
            return <>Short Answer</>;
        case AnswerTypes.Matching:
            // TODO: implement Matching
            return <>Matching</>;
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

export function AnswerOptions(props: Readonly<(AnswerOptionProps | AnsweredQuizQuestionProps)>): JSX.Element { // NOSONAR
    const isMounted = useMountedState();

    return isMounted ? (
        <section className={trimClasses(sectionClasses)}>
            {
                (!props.isHistory ?
                    <AnswerOptionSwitch {...props as AnswerOptionProps} /> :
                    <AnsweredAnswerOptionSwitch {...props as AnsweredQuizQuestionProps} />
                )
            }
        </section>
    ) : <></>
}
