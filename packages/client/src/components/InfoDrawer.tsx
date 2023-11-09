import { trimClasses } from '../utils';

export function InfoDrawer(props: { isOpen: boolean }): JSX.Element {
    const drawerClasses = `bg-gray-950/[.75] h-full w-1/3 lg:w-1/4 xl:w-1/6  p-3 truncate text-xs 
                            sm:text-sm lg:text-md xl:text-base`
    const hideDrawer = !props.isOpen;
    if (hideDrawer) return <></>
    return (
        <div className={trimClasses(drawerClasses)}>
            <p >Folders and Quizzes Go Here</p>
        </div>
    )
}
