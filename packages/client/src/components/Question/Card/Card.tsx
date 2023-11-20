import { JSX } from 'preact/jsx-runtime';
import { ReactNode } from 'preact/compat';
import { trimClasses } from '../../../utils';


const cardClasses = `bg-slate-950 rounded-md w-full max-w-[800px] h-auto  p-5 mt-8 flex
flex-col gap-4 text-gray-300`;

export interface ICardProps {
    children: ReactNode | ReactNode[];
}

export function Card({ children }: ICardProps): JSX.Element {//NOSONAR
    return (
        <section
            className={trimClasses(cardClasses)} >
            {children}
        </section>
    )

};
