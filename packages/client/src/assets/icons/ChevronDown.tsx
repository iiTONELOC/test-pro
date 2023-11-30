import { JSX } from 'preact/jsx-runtime';
import type { IconProps } from './SvgBase';
import { defaultIconProps, SvgBase } from './SvgBase';

const d = 'M19.5 8.25l-7.5 7.5-7.5-7.5';

export function ChevronDown({
    className = defaultIconProps.IconClassName,
    color = defaultIconProps.IconColor,
    onClick = () => { }
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
