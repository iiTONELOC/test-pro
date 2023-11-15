import { QuizModelResponse } from '../../../utils/api';
import { dateTime } from '../../../utils';

const metaContainerDivClasses = 'flex flex-col gap-2 w-full items-start lg:items-center';

// need a 70 to pass the quiz
const calculatePassingScore = (questions: any[]): number => {
    questions = questions ?? [];
    const passingScore = Math.ceil(questions.length * 0.7);
    return passingScore;
}

function MetaDetail({ title, value }: Readonly<{ title: string, value: any }>): JSX.Element {
    return (
        <div className={'flex flex-col gap-2 text-gray-300'}>
            <p>
                <span className={'font-bold'}>{title}</span>{' '}
                <span>{value}</span>
            </p>
        </div>
    )
}

export function QuizMetaData({ currentFileDetails }: Readonly<{ currentFileDetails: QuizModelResponse }>): JSX.Element {
    return (
        <div className={metaContainerDivClasses}>
            <MetaDetail title={'Created:'} value={dateTime(currentFileDetails?.createdAt ?? new Date())} />
            <MetaDetail title={'Last Modified:'} value={dateTime(currentFileDetails?.updatedAt ?? new Date())} />
            <MetaDetail title={'Number of Questions:'} value={currentFileDetails?.questions?.length ?? 0} />
            <MetaDetail title={'Passing Score:'} value={`70%`} />
            <MetaDetail title={'Number of Correct Answers To Pass:'} value={`${calculatePassingScore(currentFileDetails?.questions)}`} />
        </div>
    )
}

export default QuizMetaData;
