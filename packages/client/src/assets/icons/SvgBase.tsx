export type IconProps = {
    className?: string
    color?: string
}

export const defaultIconProps = {
    IconClassName: 'w-6 h-6',
    IconColor: 'currentColor'
};

export type SvgBaseProps = & IconProps & {
    d: string
}

export function SvgBase({
    className = defaultIconProps.IconClassName,
    color = defaultIconProps.IconColor,
    d = ''
}) {

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke={color}
            class={className}>

            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d={d}
            />
        </svg>
    )
}
