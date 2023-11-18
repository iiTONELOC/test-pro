import { trimClasses } from '../../../../utils';
import { useMountedState } from '../../../../hooks';
import { QuizQuestionProps } from '../QuizQuestion';
import { MultipleChoice } from './MultipleChoice';

enum AnswerTypes {
    MultipleChoice = 'MultipleChoice',
    TrueFalse = 'TrueFalse',
    FillInTheBlank = 'FillInTheBlank',
    ShortAnswer = 'ShortAnswer',
    Matching = 'Matching',
    Ordering = 'Ordering',
    Image = 'Image'
};


function AnswerOptionSwitch({ quizState, question }: Readonly<QuizQuestionProps>): JSX.Element {
    const selectedQuestionType = question?.questionType as unknown as AnswerTypes;

    switch (selectedQuestionType) {
        case AnswerTypes.MultipleChoice:
            return <MultipleChoice options={question?.options ?? []} quizState={quizState} />
        case AnswerTypes.TrueFalse:
            // TODO: implement TrueFalse
            return <>True False</>;
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


const sectionClasses = 'flex flex-col flex-start w-full h-full items-center p-2 overflow--auto';

export function AnswerOptions({ quizState, question }: Readonly<QuizQuestionProps>): JSX.Element { // NOSONAR

    const isMounted = useMountedState();
    return isMounted && quizState ? (
        <section className={trimClasses(sectionClasses)}>
            <AnswerOptionSwitch quizState={quizState} question={question} />
        </section>
    ) : <></>
}
