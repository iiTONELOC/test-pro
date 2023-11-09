import { TopBar, Footer, ActionBar, InfoDrawer, MainView } from './';
import { useInfoDrawerState } from '../signals';

function MainViewContainer() {
    const containerClasses = 'w-full h-full fixed left-12 top-8 flex flex-row';
    const { isDrawerOpen } = useInfoDrawerState();

    const isOpen = isDrawerOpen.value;

    return (
        <div className={containerClasses}>
            <InfoDrawer isOpen={isOpen} />
            <MainView isOpen={isOpen} />
        </div>
    )
}

export function Layout() {
    return (
        <>
            <TopBar />
            <ActionBar />
            <MainViewContainer />
            <Footer />
        </>
    );
}

