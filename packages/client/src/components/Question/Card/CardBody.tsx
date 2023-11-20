import { JSX } from 'preact/jsx-runtime'
import { ReactNode } from 'preact/compat'

export function CardBody({ children }: { children: ReactNode | ReactNode[] }): JSX.Element {//NOSONAR
    return (
        <div className={'w-full h-full flex flex-col justify-center items-center my-2'}>
            {children}
        </div>
    )
}

export function QuestionCardBody({ question }: { question: string }): JSX.Element {//NOSONAR
    return (
        <CardBody>
            <h3 className={'text-xl sm:text-2xl font-thin text-start'}>{question}</h3>
        </CardBody>
    )
}
