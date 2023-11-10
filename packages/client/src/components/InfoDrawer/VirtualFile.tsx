import { Document as DocumentIcon } from '../../assets/icons';
import { useSelectedFileState } from '../../signals';
import { ToolTip } from '../ToolTip';

import type { IVirtualFile } from '../../utils/virtualFileSystem';

const listItemClasses = 'text-gray-300 w-full flex flex-row items-center hover:bg-slate-800 rounded-md p-1 transition ease-in delay-100 cursor-pointer';

export function VirtualFile({ file }: Readonly<{ file: IVirtualFile }>): JSX.Element {
    const { setSelectedFile, selectedFile } = useSelectedFileState();

    const tip = 'Topics:\n' + file.topics?.map((topic: string) => `# ${topic}`).join('\n');

    const handleSetSelectedFile = () => {
        if (selectedFile.value !== file.entryId) {
            setSelectedFile(file.entryId);
        }
    };

    const handleClick = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();
        handleSetSelectedFile();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
            handleSetSelectedFile();
        }
    }

    return (
        <li
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={listItemClasses}
        >
            <ToolTip
                toolTipText={tip}
                tipPosition='bottom'
                offset={8}
            >
                <span className={'w-full flex flex-row gap-1 items-center'}>
                    <DocumentIcon className='w-4 h-4' />

                    <p className={'text-base'}>{file.name}</p>
                </span>
            </ToolTip>
        </li>
    )
}
