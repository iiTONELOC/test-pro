const pClasses = 'bg-slate-700 flex px-2 py-1 rounded-md min-w-max';

export function TopicTag({ topic }: Readonly<{ topic: string }>): JSX.Element {
    return (
        <p className={pClasses}># {topic}</p>
    )
}