import { uuid } from '../../../utils';
import { useState } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { DeleteFile, RenameFile } from '../../VirtualFileSystem';

const fileActions = [
    {
        name: 'Rename'
    },
    {
        name: 'Delete'
    }
];

export interface IFileActionsProps {
    className?: string,
}


export function FileActions(props: Readonly<IFileActionsProps>): JSX.Element {
    const [handleRename, setHandleRename] = useState(false);
    const [handleDelete, setHandleDelete] = useState(false);
    const { className } = props;

    const handleClick = (e: Event, name: string) => {
        e.stopPropagation();
        e.preventDefault();

        if (name === 'Rename') {
            setHandleRename(true);
        } else {
            setHandleRename(false);
        }

        if (name === 'Delete') {
            setHandleDelete(true);
        } else {
            setHandleDelete(false);
        }
    };

    return (
        <>
            {fileActions.map(({ name }) => (
                <button
                    key={uuid()}
                    onClick={(e) => handleClick(e, name)}
                    className={className ?? ''}>
                    {name}
                </button>
            ))}
            {handleRename && <RenameFile />}
            {handleDelete && <DeleteFile />}
        </>
    );
}
