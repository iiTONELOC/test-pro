import { ToolTip } from '../ToolTip';
import { useRef } from 'preact/hooks';
import { JSX } from 'preact/jsx-runtime';
import { useMountedState } from '../../hooks';
import VirtualComponent from './VirtualComponent';
import { Document as DocumentIcon } from '../../assets/icons';
import { dateTime, keyHandler, IVirtualFile } from '../../utils';
import { useSelectedFileSignal, useQuizViewSignal, QuizViews } from '../../signals';

const listItemClasses = `text-gray-300 w-full flex flex-row items-center hover:bg-slate-800 focus:bg-slate-800
rounded-md p-1 transition ease-in delay-100 cursor-pointer gap-1`;

export function VirtualFile({ file }: Readonly<{ file: IVirtualFile }>): JSX.Element {
    const { setSelectedFile, selectedFile } = useSelectedFileSignal();
    const { setCurrentQuizView } = useQuizViewSignal();
    const listItemRef = useRef<HTMLLIElement>(null);
    const isMounted = useMountedState();

    const currentFile = selectedFile.value;
    const createdAndModified = `\nCreated:  ${dateTime(file.createdAt)}\nModified: ${dateTime(file.updatedAt)}`;
    const toolTipText = `${file.name}\nTopics:\n${file.topics?.map((topic: string) => `# ${topic}`).join('\n')}${createdAndModified}`

    const handleSetSelectedFile = () => {
        if (currentFile !== file.entryId) {
            setSelectedFile(file.entryId);
        }
    };

    const handleClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        handleSetSelectedFile();
        setCurrentQuizView(QuizViews.QuizDetails);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        keyHandler({ event, keyToWatch: 'Enter', direction: 'down', callback: handleSetSelectedFile, stopPropagation: true })
    };


    return isMounted ? (
        <VirtualComponent
            ref={listItemRef}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            draggableId={file.entryId}
            className={listItemClasses}
        >
            <ToolTip toolTipText={toolTipText}>
                <span
                    className={'w-full flex flex-row gap-1 items-center ml-1 truncate overflow-clip'}>
                    <DocumentIcon className='w-3 h-3' />

                    <p data-id={file.entryId} className={'text-xs '}>{file.name}</p>
                </span>
            </ToolTip>
        </VirtualComponent>
    ) : <></>
}
