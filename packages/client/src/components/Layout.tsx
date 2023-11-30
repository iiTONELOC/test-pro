import { TopBar, Footer, ActionBar, MainViewContainer } from './';
import { InputModal } from './InputModals';

export function Layout() {
    return (
        <>
            <TopBar />
            <ActionBar />
            <MainViewContainer />
            <Footer />
            <InputModal />
        </>
    );
}
