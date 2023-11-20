import { useInfoDrawerSignal, useQuizzesDbSignal } from '../../signals';
import { useMountedState } from '../../hooks'
import { InfoDrawer, MainView } from '../';
import { useEffect } from 'preact/hooks';
import { API } from '../../utils';

const containerClasses = 'w-full h-full fixed left-12 top-8 flex flex-row';

export function MainViewContainer() { //NOSONAR
    const { isDrawerOpen } = useInfoDrawerSignal();
    const isMounted: boolean = useMountedState();
    const isOpen = isDrawerOpen.value;

    useEffect(() => {
        if (isMounted && isOpen) {
            (async () => {
                await API.getAllQuizzes({
                    showTimestamps: true,
                    needToPopulate: true
                });
            })();
        }
    }, [isMounted]);

    return isMounted ? (
        <div className={containerClasses}>
            <InfoDrawer />
            <MainView />
        </div>
    ) : <></>
}

export default MainViewContainer;
