import { uuid } from '../../../utils';
import { useState } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';

const folderActions = [
    {
        name: 'Create Quiz Here',
        action: () => {
            console.log('Add File');
        }
    },
    {
        name: 'Add Folder',
        action: () => {
            console.log('Add Folder');
        }
    },
    {
        name: 'Rename',
        action: () => {
            console.log('Rename');
        }
    },
    {
        name: 'Delete',
        action: () => {
            console.log('Delete');
        }
    }
];


export interface IFolderActionsProps {
    className?: string,
}


export function FolderActions(props: Readonly<IFolderActionsProps>): JSX.Element {
    const [handleAddNewQuiz, setHandleAddNewQuiz] = useState(false);
    const [handleAddFolder, setHandleAddFolder] = useState(false);
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

        if (name === 'Add Folder') {
            setHandleAddFolder(true);
        }

        if (name === 'Create Quiz Here') {
            console.log('Create Quiz Here');
            setHandleAddNewQuiz(true);
        }

        action();
    };
    return (
        <>
            {folderActions.map(({ name, action }) => (
                <button
                    key={uuid()}
                    onClick={(e: Event) => handleClick(e, name, action)}
                    className={className ?? ''}>
                    {name}
                </button>
            ))}
            {handleRename && <></>}
            {handleDelete && <></>}
            {handleAddFolder && <></>}
            {handleAddFolder && <></>}
            {handleAddNewQuiz && <></>}
        </>
    );
}