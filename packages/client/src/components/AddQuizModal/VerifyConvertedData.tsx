import { useMountedState } from '../../hooks';
import { ChangeEvent, JSX, useEffect, useState } from 'preact/compat';
import { PopulatedQuizModel, jsonQuizData, API } from '../../utils';
import { handleUpdateVfsWithQuizData } from './helpers';
import { useShowAddQuizModalSignal } from '../../signals';

export function VerifyConvertedData({ data }: { data: jsonQuizData[] }): JSX.Element {
    const [quizData, setQuizData] = useState<jsonQuizData[]>(data);
    const [dataVerified, setDataVerified] = useState<boolean>(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
    const [textAreaError, setTextAreaError] = useState<string | null>(null);
    const [createdQuizData, setCreatedQuizData] = useState<PopulatedQuizModel[]>([]);
    const [textAreaState, setTextAreaState] = useState<string>(JSON.stringify(quizData[currentQuizIndex], null, 2));

    const isMounted = useMountedState();
    const showModal = useShowAddQuizModalSignal().showAddQuizModalSignal;

    const resetState = () => {
        setQuizData(data);
        setCurrentQuizIndex(0);
        setTextAreaState(JSON.stringify(data[0], null, 2));
        setTextAreaError(null);
        setCreatedQuizData([]);
        setDataVerified(false);
    };

    const handleTextAreaChange = (e: ChangeEvent) => {
        const target = e.target as HTMLTextAreaElement;
        setTextAreaState(target.value);
    };

    const handleVerifyTextArea = () => {
        // verify the data is valid JSON before setting the state
        try {
            JSON.parse(textAreaState);
            setTextAreaError(null);
            return true
        } catch (err: any) {
            setTextAreaError(err.message);
            return false;
        }
    };

    const handleCreateQuiz = async () => {

        const _quizData = textAreaState;
        const createdRes = await API.createQuizByJSON(JSON.parse(_quizData)) as PopulatedQuizModel | null;

        if (createdRes) {
            createdQuizData.push(createdRes);
            setCreatedQuizData(createdQuizData);
            // make sure the index isn't out of bounds
            const nextIndex = currentQuizIndex + 1 < quizData.length ? currentQuizIndex + 1 : 0;
            if (nextIndex !== 0) {
                setCurrentQuizIndex(nextIndex);
                setTextAreaState(JSON.stringify(quizData[nextIndex], null, 2));
            } else {
                setDataVerified(true);
                // update the virtual file system
                const tokens = createdQuizData[0].name.split(' ');
                // get the correct quiz title, if more than 1 quiz was created
                const quizTitle = createdQuizData.length > 1 ? tokens.slice(0, tokens.length - 1).join(' ') : createdQuizData[0].name;
                // adds our created quiz to the virtual file system
                await handleUpdateVfsWithQuizData(createdQuizData, quizTitle);
                // close the modal
                resetState();
                showModal.value = false;
            }
        } else {
            // TODO: Handle showing error to user
            console.log('error creating quiz');
        }
    };

    useEffect(() => {
        if (isMounted) {
            resetState();
        }
    }, [isMounted]);



    return (
        <>
            <h2 className={'text-xl my-3'}>Verify Converted Data</h2>
            <div className={'w-full h-full flex flex-col justify-center items-center'}>
                <p className={'text-lg w-full flex flex-row justify-center items-center'}>
                    Verify that the JSON data below is correct.
                </p>
                <p className={'text-lg w-full flex flex-row justify-center items-center my-2'}>
                    If it is not, make any changes necessary and click the "Create Quiz" button.
                </p>

                <p className={'text-lg w-full flex flex-row justify-center items-center my-2'}>
                    Showing data for quiz {currentQuizIndex + 1} of {quizData.length}
                </p>

                {!dataVerified &&
                    <div className={'flex w-full flex-col justify-start items-center gap-5'}>
                        <div>
                            {textAreaError && <p className={'text-red-600'}>{textAreaError}</p>}
                        </div>
                        <pre className={'text-sm text-left w-full h-auto min-h-max'}>
                            <textarea className={'w-full h-full bg-black text-white p-2 rounded-md'}
                                onInput={handleTextAreaChange}
                                onBlur={handleVerifyTextArea}
                                value={textAreaState}
                                rows={15}
                            />
                        </pre>
                        <button
                            onClick={handleCreateQuiz}
                            className={'w-full p-2 bg-slate-900 text-slate-300 rounded-md mt-2 hover:bg-green-700'}>
                            Create Quiz
                        </button>
                    </div>
                }

            </div>
        </>
    )
}
