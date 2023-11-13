import { QuizDetails } from './index';

/**
 * The different views that can be displayed in the main view
 * ```ts
 *  enum QuizViews {
 *     QuizDetails = 'QuizDetails',
 *     Quiz = 'Quiz',
 *     QuizEdit = 'QuizEdit',
 *     QuizCreate = 'QuizCreate',
 *     QuizDelete = 'QuizDelete',
 *     QuizHistory = 'QuizHistory'
 * }
 * ```
 */
export enum QuizViews {
    QuizDetails = 'QuizDetails',
    Quiz = 'Quiz',
    QuizEdit = 'QuizEdit',
    QuizCreate = 'QuizCreate',
    QuizDelete = 'QuizDelete',
    QuizHistory = 'QuizHistory'
}

export function QuizViewRouter({ view }: Readonly<{ view: QuizViews }>): JSX.Element {
    switch (view) {
        case QuizViews.QuizDetails:
            return <QuizDetails />;
        case QuizViews.Quiz:
            return <>QuizExam </>;
        case QuizViews.QuizEdit:
            return <>QuizEdit </>;
        case QuizViews.QuizCreate:
            return <>QuizCreate </>;
        case QuizViews.QuizDelete:
            return <>QuizDelete </>;
        case QuizViews.QuizHistory:
            return <>QuizHistory </>;
        default:
            return <QuizDetails />;
    }
}
