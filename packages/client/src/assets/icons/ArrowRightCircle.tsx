import { JSX } from 'preact/jsx-runtime';
import type { IconProps } from './SvgBase';
import { SvgBase, defaultIconProps } from './SvgBase';

const d = 'M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z';

export function ArrowRightCircle({
    className = defaultIconProps.IconClassName,
    color = defaultIconProps.IconColor }: Readonly<IconProps>): JSX.Element {
    return (
        <SvgBase
            className={className}
            color={color}
            d={d}
        />
    )
}


