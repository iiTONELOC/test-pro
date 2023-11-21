import { ReactNode } from 'preact/compat';


export interface IDroppableAreaProps {
    onDrop: (draggedItemId: string, targetItemId: string) => void;
    children: ReactNode | ReactNode[];
    id?: string;
}

export const DroppableArea = ({ onDrop, children, id = '__root__' }: IDroppableAreaProps) => {
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

        droppedItemId && onDrop(droppedItemId, targetItemId as string);
    };


    return (
        <div
            className={'w-full h-full'}
            onDragOver={handleDragOver}
            // onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-id={id}

        >
            {children}
        </div>
    );
};


