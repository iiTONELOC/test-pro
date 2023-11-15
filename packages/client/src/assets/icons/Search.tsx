import type { IconProps } from './SvgBase';
import { SvgBase, defaultIconProps } from './SvgBase';

const d = 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z';

export function Search({
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
