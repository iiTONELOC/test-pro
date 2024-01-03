import { JSX } from 'preact/jsx-runtime';
import { useEffect } from 'preact/hooks';
import { useContextMenuSignal, useShowAddQuizModalSignal } from '../../../signals';

export interface IAddQuizToFolderProps {
    targetFolderName: string;
}

export function AddQuizToFolder(props: Readonly<IAddQuizToFolderProps>): JSX.Element {
    const { showContextMenu } = useContextMenuSignal();
    const { targetFolderName } = props;

    useEffect(() => {
        // hide the context menu
        showContextMenu.value = false;
        // set the target folder name for the add quiz modal
        useShowAddQuizModalSignal().addQuizToFolderNameSignal.value = targetFolderName;
        // show the add quiz modal
        useShowAddQuizModalSignal().showAddQuizModalSignal.value = true;
    }, []);

    return (<></>)
}
