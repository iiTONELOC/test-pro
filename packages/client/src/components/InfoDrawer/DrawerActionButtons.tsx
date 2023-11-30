import { ToolTip } from '../ToolTip';
import { useState } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { trimClasses } from '../../utils';
import { useMountedState } from '../../hooks';
import { FolderPlus } from '../../assets/icons';
import { AddFolderToRoot } from '../VirtualFileSystem';
import { useInputModalSignal } from '../../signals';

const actionIconStyle = `h-5 w-5 text-gray-300 hover:text-white cursor-pointer hover:w-6 hover:h-6 ease-in-out
duration-300 transition-all`;

export function DrawerActionButtons(): JSX.Element {

    const [showInputModal, setShowInputModal] = useState(false);
    const { toggleModal } = useInputModalSignal();
    const isMounted = useMountedState();

    const toggleState = () => {
        setShowInputModal(!showInputModal);
        toggleModal();
    };

    return isMounted ? (
        <>
            <div className={'w-full h-8 bg-slate-950 flex flex-row justify-end items-center p-2 text-gray-200'}>
                <ToolTip toolTipText={'Create a New Folder'} >
                    <FolderPlus className={trimClasses(actionIconStyle)} onClick={toggleState} />
                </ToolTip>
            </div>
            {showInputModal && <AddFolderToRoot toggleClose={toggleState} />}
        </>
    ) : <></>;
}
