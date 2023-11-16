import { useEffect } from 'preact/hooks';
import { useCurrentFileSignal } from '../../../signals';
import DetailHeader from '../QuizDetails/DetailHeader';

export function Quiz() {
    const { fileDetails } = useCurrentFileSignal()
    const currentFileDetails = fileDetails.value;

    useEffect(() => {
        console.log('Quiz: ', currentFileDetails)
    }, [currentFileDetails])
    return (
        <section className={'flex justify-start lg:justify-center p-2'}>
            <DetailHeader />
        </section>
    )
}
