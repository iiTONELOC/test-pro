import { ToolTip } from '../ToolTip';
import { clickHandler } from '../../utils';
import { useInfoDrawerSignal } from '../../signals';
import { ArrowRightCircle, ArrowLeftCircle } from '../../assets/icons';

const arrowClasses = 'w-8 h-8 hover:w-10 hover:h-10 transition-all hover:text-emerald-600';

export function ToggleDrawer() { // NOSONAR
    const { isDrawerOpen, toggleDrawer } = useInfoDrawerSignal();

    const handleClick = (event: Event) => clickHandler({
        event: event as MouseEvent,
        callback: toggleDrawer,
        stopPropagation: true
    });


    return (
        <button onClick={handleClick} className={'absolute bg-slate-900/[.8] rounded-full z-10'}>
            <ToolTip toolTipText={isDrawerOpen.value ? 'Close Drawer' : 'Open Drawer'} >
                {isDrawerOpen.value ? <ArrowLeftCircle className={arrowClasses} /> :
                    <ArrowRightCircle className={arrowClasses} />
                }
            </ToolTip>
        </button>
    )
}
