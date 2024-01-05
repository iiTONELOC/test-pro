import { ReactNode } from 'preact/compat';
import { useDraggingContextSignal } from '../../signals';


export interface IDroppableAreaProps {
    onDrop: (draggedItemId: string, targetItemId: string) => void;
    children: ReactNode | ReactNode[];
    className?: string;
    id?: string;
}

export const DroppableArea = ({ onDrop, children, id = '__root__',
    className = 'w-full min-h-[calc(100vh-97px)] overflow-auto overscroll-contain bg-slate-950' }: IDroppableAreaProps) => {
    const { isDragging } = useDraggingContextSignal();

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };


    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedItemId = e?.dataTransfer?.getData('text/plain');

        //@ts-ignore
        let targetItemId = e?.target?.dataset?.id;

        // if the targetItemId is undefined, then look for one amongst the targets parents
        if (targetItemId === undefined) {
            //@ts-ignore
            targetItemId = e?.target?.parentElement?.dataset?.id
        }

        droppedItemId && (() => {
            onDrop(droppedItemId, targetItemId as string);
        })();
        isDragging.value = false;
    };


    return (
        <div
            className={className}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-id={id}>
            {children}
        </div>
    );
};


