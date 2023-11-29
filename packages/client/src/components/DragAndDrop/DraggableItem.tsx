import { ReactNode } from 'preact/compat';
import { trimClasses } from '../../utils';
import { useDraggingContextSignal } from '../../signals';

export interface IDraggableItemProps {
    id: string;
    children: ReactNode | ReactNode[];
}

export const DraggableItem = ({ id, children }: IDraggableItemProps) => {
    const { isDragging } = useDraggingContextSignal();

    const dragging = isDragging.value;

    const handleDragStart = (e: DragEvent) => {
        if (!dragging) {
            isDragging.value = true;
            e?.dataTransfer?.setData('text/plain', id);
        }
    };

    const classes = `w-full h-auto ${dragging ? 'border-2 border-gray-400' : ''} 
    ${dragging ? 'opacity-50' : ''} ${dragging ? 'cursor-move' : ''}`

    return (
        <span
            draggable
            onDragStart={handleDragStart}
            className={trimClasses(classes)}
            data-id={id}
        >
            {children}
        </span >
    );
};
