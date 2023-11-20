import { ReactNode } from 'preact/compat';


export interface IDroppableAreaProps {
    onDrop: (draggedItemId: string, targetItemId: string) => void;
    children: ReactNode | ReactNode[];
}

export const DroppableArea = ({ onDrop, children }: IDroppableAreaProps) => {
    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };


    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedItemId = e?.dataTransfer?.getData('text/plain');
        //@ts-ignore
        const targetItemId = e?.target?.dataset?.id;

        droppedItemId && onDrop(droppedItemId, targetItemId as string);
    };


    return (
        <div
            class={'w-full h-auto'}
            onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {children}
        </div>
    );
};


