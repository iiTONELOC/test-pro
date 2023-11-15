import { useRef, Ref } from 'preact/hooks';

export const useVirtualScrollBar = ({ containerRef }: { containerRef: Ref<HTMLElement | undefined> }) => {
    const scrollThumbRef = useRef<HTMLDivElement>(null);
    let prevMouseX = 0;

    // attach event listeners
    const handleMouseDown = (event: MouseEvent) => {
        const scrollThumb = scrollThumbRef.current;

        if (scrollThumb && event.buttons === 1) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };

    // remove event listeners
    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // move event handler
    const handleMouseMove = (event: MouseEvent) => {
        const scrollThumb = scrollThumbRef.current;
        const container = containerRef.current;

        if (container && scrollThumb && event.buttons === 1) {
            const containerWidth = container.clientWidth;
            const scrollThumbWidth = scrollThumb.clientWidth;

            const mouseX = event.clientX - container.getBoundingClientRect().left;
            const newScrollPosition = ((mouseX - scrollThumbWidth / 2) / containerWidth);

            const maxThumbLeft = containerWidth - scrollThumbWidth;
            const thumbLeft = Math.min(maxThumbLeft, Math.max(0, newScrollPosition * containerWidth));
            scrollThumb.style.left = `${thumbLeft}px`;

            // Calculate the actual change in scroll position
            const deltaX = mouseX - prevMouseX;
            container.scrollLeft += deltaX * (container.scrollWidth / containerWidth);

            prevMouseX = mouseX;
        }
    };

    const VirtualScrollBar = () => {
        return (
            <div className={`w-[calc(100vw-220px)] md:w-[calc(100vw-305px)] h-[10px] absolute z-40 top-[calc(100vh-66px)] bg-[#252525] rounded-sm scroll-smooth`} >
                <div ref={scrollThumbRef}
                    className={'absolute w-[55%] h-[98%] bg-[#4f4f5c] rounded-md'} />
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

