// DraggableItem.js
import { ReactNode } from 'preact/compat';
import { useState } from 'preact/hooks';
import { trimClasses } from '../../utils';

export interface IDraggableItemProps {
    id: string;
    children: ReactNode | ReactNode[];
}

export const DraggableItem = ({ id, children }: IDraggableItemProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: DragEvent) => {
        setIsDragging(true);
        e?.dataTransfer?.setData('text/plain', id);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const classes = `w-full h-auto ${isDragging ? 'border-2 border-gray-400' : ''} 
    ${isDragging ? 'opacity-50' : ''} ${isDragging ? 'cursor-move' : ''}`

    return (
        <span
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={trimClasses(classes)}
            data-id={id}
        >
            {children}
        </span >
    );
};
