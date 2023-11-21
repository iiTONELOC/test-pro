import { JSX } from 'preact/jsx-runtime';
import type { IconProps } from './SvgBase';
import { SvgBase, defaultIconProps } from './SvgBase';

const d = 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776'

export function FolderOpen({
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
