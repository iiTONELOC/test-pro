import { TopBar, Footer, ActionBar, MainViewContainer, AddQuizModal } from './';
import { InputModal } from './InputModals';

export function Layout() {
    return (
        <>
            <TopBar />
            <ActionBar />
            <MainViewContainer />
            <Footer />
            <InputModal />
            <AddQuizModal />
        </>
    );
}
