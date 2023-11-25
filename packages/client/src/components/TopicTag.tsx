import { JSX } from 'preact/jsx-runtime';

const pClasses = 'bg-slate-700 flex px-2 py-1 rounded-md min-w-max text-xs md:text-sm';

export function TopicTag({ topic }: Readonly<{ topic: string }>): JSX.Element {
    return (
        <p className={pClasses}># {topic}</p>
    )
}
