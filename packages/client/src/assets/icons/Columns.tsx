import { JSX } from 'preact/jsx-runtime';
import type { IconProps } from './SvgBase';
import { SvgBase, defaultIconProps } from './SvgBase';

const d = 'M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z'

export function Columns({
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
