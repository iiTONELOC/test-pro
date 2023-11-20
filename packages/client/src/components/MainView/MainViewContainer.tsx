import { useMountedState } from '../../hooks'
import { InfoDrawer, MainView } from '../';

const containerClasses = 'w-full h-full fixed left-12 top-8 flex flex-row';

export function MainViewContainer() { //NOSONAR
    const isMounted: boolean = useMountedState();


    return isMounted ? (
        <div className={containerClasses}>
            <InfoDrawer />
            <MainView />
        </div>
    ) : <></>
}

export default MainViewContainer;
