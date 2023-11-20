import { JSX } from 'preact/jsx-runtime';
import type { IconProps } from './SvgBase';
import { defaultIconProps, SvgBase } from './SvgBase';

const d = 'M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'

export function FolderPlus({
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
