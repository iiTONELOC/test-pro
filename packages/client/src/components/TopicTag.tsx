export function TopicTag({ topic }: { topic: string }): JSX.Element {
    return (
        <p className={'bg-slate-700 flex px-2 py-1 rounded-md min-w-max'}># {topic}</p>
    )
}
