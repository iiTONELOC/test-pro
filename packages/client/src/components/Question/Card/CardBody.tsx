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
            <h3 className={'w-full h-auto'}>
                <pre className={'w-full h-auto flex flex-wrap text-base flex-row text-start whitespace-pre-wrap font-arial'}> {question}</pre>
            </h3>
        </CardBody>
    )
}
