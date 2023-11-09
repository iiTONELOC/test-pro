export function MainView(props: { isOpen: boolean }): JSX.Element {
    const isClosed = !props.isOpen;

    const width = isClosed ? 'w-full' : 'w-2/3 lg:w-3/4 xl:w-5/6';
    const mainClasses = `bg-slate-950 h-full ${width} p-1`

    return (
        <main className={mainClasses}>
            Hello
        </main>
    )
}
