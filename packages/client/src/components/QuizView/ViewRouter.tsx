import { QuizDetails, QuizHistory, QuizOptions, Quiz } from './index';

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
            return <Quiz />
        case QuizViews.QuizEdit:
            return <QuizOptions />;
        case QuizViews.QuizCreate:
            return <>QuizCreate </>;
        case QuizViews.QuizDelete:
            return <QuizOptions />;
        case QuizViews.QuizHistory:
            return <QuizHistory />;
        default:
            return <QuizDetails />;
    }
}
