import { uuid } from '../../../utils';
import { useState } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';

const fileActions = [
    {
        name: 'Rename',
        action: () => {
            console.log('rename');
        }
    },
    {
        name: 'Delete',
        action: () => {
            console.log('delete');
        }
    }
];

export interface IFileActionsProps {
    className?: string,
}


export function FileActions(props: Readonly<IFileActionsProps>): JSX.Element {
    const [handleRename, setHandleRename] = useState(false);
    const [handleDelete, setHandleDelete] = useState(false);
    const { className } = props;

    const handleClick = (e: Event, name: string, action: () => void) => {
        e.stopPropagation();
        e.preventDefault();

        if (name === 'Rename') {
            setHandleRename(true);
        }

        if (name === 'Delete') {
            setHandleDelete(true);
        }

        action();
    };
    return (
        <>
            {fileActions.map(({ name, action }) => (
                <button
                    key={uuid()}
                    onClick={(e) => handleClick(e, name, action)}
                    className={className ?? ''}>
                    {name}
                </button>
            ))}
            {handleRename && <></>}
            {handleDelete && <></>}
        </>
    );
}
