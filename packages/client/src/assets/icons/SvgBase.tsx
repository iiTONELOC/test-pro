export type IconProps = {
    className?: string
    color?: string,
    onClick?: () => void
}

export const defaultIconProps = {
    IconClassName: 'w-6 h-6',
    IconColor: 'currentColor',
    IconFill: 'currentColor'
};

export type SvgBaseProps = & IconProps & {
    d: string,
    IconFill?: string
}

export function SvgBase({ // NOSONAR
    className = defaultIconProps.IconClassName,
    color = defaultIconProps.IconColor,
    d = '',
    IconFill,
    onClick
}: SvgBaseProps) {


    return (<svg
        onClick={onClick ?? (() => { })}
        xmlns="http://www.w3.org/2000/svg"
        fill={IconFill ?? 'none'}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke={color}
        className={className}>

        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={d}
        />
    </svg>
    )
}
