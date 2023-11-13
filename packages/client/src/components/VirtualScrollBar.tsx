import { useRef, Ref } from 'preact/hooks';

export const useVirtualScrollBar = ({ containerRef }: { containerRef: Ref<HTMLDivElement> }) => {
    const scrollThumbRef = useRef<HTMLDivElement>(null);
    // adds listeners on the virtual scroll bar
    const handleMouseDown = (event: MouseEvent,) => {
        const scrollThumb = scrollThumbRef.current;

        if (scrollThumb && event.buttons === 1) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };

    // removes listeners on the virtual scroll bar
    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    let prevMouseX = 0;

    // scrolls the container and moves the virtual scroll bar in response to mouse movement
    const handleMouseMove = (event: MouseEvent) => {
        const scrollThumb = scrollThumbRef.current;
        const container = containerRef.current;

        if (container && scrollThumb && event.buttons === 1) {
            const containerWidth = container.clientWidth;
            const scrollThumbWidth = scrollThumb.clientWidth;

            const mouseX = event.clientX - container.getBoundingClientRect().left;
            const deltaX = mouseX - prevMouseX;
            const newScrollPosition = deltaX / containerWidth;

            container.scrollLeft += newScrollPosition * (container.scrollWidth - containerWidth);

            const maxThumbLeft = containerWidth - scrollThumbWidth;
            const thumbLeft = Math.min(maxThumbLeft, Math.max(0, scrollThumb.offsetLeft + deltaX));
            scrollThumb.style.left = `${thumbLeft}px`;

            prevMouseX = mouseX;
        }
    };

    const VirtualScrollBar = () => {
        return (
            <div className={`w-[calc(100vw-220px)] md:w-[calc(100vw-305px)] h-[10px] absolute z-40 top-[calc(100vh-66px)] bg-[#252525] rounded-sm`} >
                <div ref={scrollThumbRef}
                    className={'absolute w-[80%] h-[98%] bg-[#4f4f5c] rounded-md'} />
            </div>
        )
    };
    return (
        {
            VirtualScrollBar,
            handleMouseMove,
            handleMouseUp,
            handleMouseDown
        }
    );
};

