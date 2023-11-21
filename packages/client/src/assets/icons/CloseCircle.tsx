import { JSX } from 'preact/jsx-runtime';
import type { IconProps } from './SvgBase';
import { SvgBase, defaultIconProps } from './SvgBase';

const d = 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'

export function CloseCircle({
    className = defaultIconProps.IconClassName,
    color = defaultIconProps.IconColor,
    onClick
}: Readonly<IconProps>): JSX.Element {
    return (
        <SvgBase
            onClick={onClick}
            className={className}
            color={color}
            d={d}
        />
    )
}
