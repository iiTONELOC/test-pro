import { signal, Signal } from '@preact/signals';

const ContextIdSignal = signal<string>('');
const ContextMenuSignal = signal<boolean>(false);
const ContextIsFileSignal = signal<boolean>(false);
const ContextPositionSignal = signal<{ x: number, y: number }>({ x: 0, y: 0 });

export type CurrentContextMenuSignal = {
    id: Signal<string>;
    isFolder: Signal<boolean>;
    position: Signal<{ x: number, y: number }>;
    showContextMenu: Signal<boolean>;
}

export function useContextMenuSignal(): CurrentContextMenuSignal {
    return {
        id: ContextIdSignal,
        isFolder: ContextIsFileSignal,
        position: ContextPositionSignal,
        showContextMenu: ContextMenuSignal
    }
}
