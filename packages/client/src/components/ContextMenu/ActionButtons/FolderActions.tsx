import { uuid } from '../../../utils';
import { useState } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { useContextMenuSignal } from '../../../signals';
import { AddFolderToFolder, AddQuizToFolder, RenameFolder } from '../../VirtualFileSystem';

const folderActions = [
    {
        name: 'Create Quiz Here'
    },
    {
        name: 'Add Folder'

    },
    {
        name: 'Rename'

    },
    {
        name: 'Delete'
    }
];


export interface IFolderActionsProps {
    className?: string
}


export function FolderActions(props: Readonly<IFolderActionsProps>): JSX.Element {
    const [handleAddNewQuiz, setHandleAddNewQuiz] = useState(false);
    const [handleAddFolder, setHandleAddFolder] = useState(false);
    const [handleRename, setHandleRename] = useState(false);
    const [handleDelete, setHandleDelete] = useState(false);
    const { id, showContextMenu } = useContextMenuSignal();


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

        if (name === 'Add Folder') {
            console.log('Add Folder');
            setHandleAddFolder(true);
        } else {
            setHandleAddFolder(false);
        }

        if (name === 'Create Quiz Here') {
            setHandleAddNewQuiz(true);
        } else {
            setHandleAddNewQuiz(false);
        }
    };

    const toggleAddFolderToFolder = () => {
        setHandleAddFolder(false);
        showContextMenu.value = false;
    }

    return (
        <>
            {folderActions.map(({ name }) => (
                <button
                    key={uuid()}
                    onClick={(e: Event) => handleClick(e, name)}
                    className={className ?? ''}>
                    {name}
                </button>
            ))}
            {handleRename && <RenameFolder />}
            {handleDelete && <></>}
            {handleAddFolder && <AddFolderToFolder toggleClose={toggleAddFolderToFolder} targetFolderName={id.value} />}
            {handleAddNewQuiz && <AddQuizToFolder targetFolderName={id.value} />}
        </>
    );
}