import { signal, Signal } from '@preact/signals';


export interface InputModalSignal {

    show: Signal<boolean>;
    input: Signal<string>;
    toggleModal: () => void;
    headingText: Signal<string>;
    errorMessage: Signal<string | null>;
    handleSubmit: Signal<(e: Event) => void>;

}

const input = signal<string>('');
const show = signal<boolean>(false);
const headingText = signal<string>('');
const errorMessage = signal<string | null>(null);
const handleSubmit = signal<(e: Event) => void>(() => { });

export const useInputModalSignal = (): InputModalSignal => {
    const toggleModal = () => {
        show.value = !show.value;
    }

    return {
        show,
        input,
        headingText,
        toggleModal,
        errorMessage,
        handleSubmit
    };
}

