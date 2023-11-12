import { Document as DocumentIcon } from '../../assets/icons';
import { clickHandler, keyHandler, trimClasses } from '../../utils';
import { useSelectedFileState } from '../../signals';
import { ToolTip } from '../ToolTip';

import type { IVirtualFile } from '../../utils/virtualFileSystem';
import { useEffect, useRef } from 'preact/hooks';

const listItemClasses = `text-gray-300 w-full flex flex-row items-center hover:bg-slate-800
rounded-md p-1 transition ease-in delay-100 cursor-pointer gap-1`;

export function VirtualFile({ file }: Readonly<{ file: IVirtualFile }>): JSX.Element {
    const { setSelectedFile, selectedFile } = useSelectedFileState();
    const listItemRef = useRef<HTMLLIElement>(null);

    const tip = 'Topics:\n' + file.topics?.map((topic: string) => `# ${topic}`).join('\n');

    const handleSetSelectedFile = () => {
        if (selectedFile.value !== file.entryId) {
            setSelectedFile(file.entryId);
        }
    };

    const handleClick = (event: MouseEvent) => {
        clickHandler({ event, callback: handleSetSelectedFile, stopPropagation: true });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        keyHandler({ event, keyToWatch: 'Enter', direction: 'down', callback: handleSetSelectedFile, stopPropagation: true })
    };

    useEffect(() => {
        // if the element within the list item is focused then change the background color like it would be if it was hovered
        const handleFocus = () => {
            if (listItemRef.current?.contains(document.activeElement)) {
                listItemRef.current.classList.add('bg-slate-800');
            }
        };

        const handleFocusOut = () => {
            listItemRef?.current?.classList.remove('bg-slate-800');
        };

        listItemRef?.current?.addEventListener('focusin', handleFocus);
        listItemRef?.current?.addEventListener('focusout', handleFocusOut);

        return () => {
            listItemRef?.current?.removeEventListener('focusin', handleFocus);
            listItemRef?.current?.removeEventListener('focusout', handleFocusOut);
        };
    }, [listItemRef]);

    return (
        <li
            ref={listItemRef}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={trimClasses(listItemClasses)}
        >
            <ToolTip
                toolTipText={tip}
                tipPosition='bottom'
                offset={8}
            >
                <span
                    tabIndex={0}
                    className={'w-full flex flex-row gap-1 items-center'}>
                    <DocumentIcon className='w-4 h-4' />

                    <p className={'text-base'}>{file.name}</p>
                </span>
            </ToolTip>
        </li>
    )
}
