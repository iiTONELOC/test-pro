import { JSX } from 'preact/jsx-runtime';
import { ModalCard } from './ModalCard';
import { trimClasses } from '../../utils';
import { AddQuizForm } from './AddQuizForm';
import { useMountedState } from '../../hooks';
import { jsonQuizData } from '../../utils/api';
import { CloseCircle } from '../../assets/icons';
import { useEffect, useState } from 'preact/hooks';
import { ModalBackground } from './ModalBackground';
import { useShowAddQuizModalSignal } from '../../signals';
import { VerifyConvertedData } from './VerifyConvertedData';
import { WaitForJsonConversion } from './WaitForJsonConversion';


const iconClasses = `w-7 h-7 hover:w-8 hover:h-8 hover:text-red-600 hover:text-bold cursor-pointer 
text-gray-400 justify-self-end absolute top-1 right-1 ease-in-out transition-all duration-200`;

export const handleCloseModal = () => useShowAddQuizModalSignal().showAddQuizModalSignal.value = false;

export function AddQuizModal(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(false);
    const [fileUploaded, setFileUploaded] = useState<boolean>(false);
    const [waitingForJsonConversion, setWaitingForJsonConversion] = useState<boolean>(false);
    const [convertedFileData, setConvertedFileData] = useState<jsonQuizData[] | null>(null);

    const isMounted = useMountedState();
    const show = useShowAddQuizModalSignal().showAddQuizModalSignal.value;

    const resetState = () => {
        setLoading(false);
        setFileUploaded(false);
        setConvertedFileData(null);
        setWaitingForJsonConversion(false);
    };

    useEffect(() => {
        if (isMounted && show) {
            resetState();
        }
    }, [show]);

    useEffect(() => {
        if (convertedFileData) {
            setFileUploaded(true);
        }
    }, [convertedFileData]);

    useEffect(() => {
        if (loading) {
            setWaitingForJsonConversion(true);
        } else {
            setWaitingForJsonConversion(false);
        }
    }, [loading]);

    return show && isMounted ? (
        <ModalBackground>
            <ModalCard>
                <CloseCircle className={trimClasses(iconClasses)} onClick={handleCloseModal} />
                {/* FILE UPLOADING */}
                {!loading && !fileUploaded &&
                    <AddQuizForm setConvertedFileData={setConvertedFileData} setLoading={setLoading} />
                }

                {/* FILE CONVERTING */}
                {waitingForJsonConversion && !fileUploaded &&
                    <WaitForJsonConversion />
                }

                {/* FILE CONVERSION VERIFICATION */}
                {convertedFileData && fileUploaded &&
                    <VerifyConvertedData data={convertedFileData} />
                }
            </ModalCard>
        </ModalBackground>
    ) : <></>;
}
