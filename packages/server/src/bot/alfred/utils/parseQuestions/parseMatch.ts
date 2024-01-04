import { IQuizQuestionJsonData } from '../../../../types';

export const parseMatchOptionsFromOptions = (question: Partial<IQuizQuestionJsonData>): Partial<IQuizQuestionJsonData> => {
    if (!question) return question;

    if (question.type === 'Matching') {
        question.options = (question?.options ?? [])
            .filter(option => option !== '' && option !== '\n')
            .filter(Boolean).map(option => option.trim())

        const realOptions = question
            .options
            .filter((_, index) => index % 2 === 0);

        // match options are at the odd indexes
        const matchOptions = question
            .options
            .filter((_, index) => index % 2 !== 0);
        question.question = question.question?.replace(/\?/g, '.');
        question.options = realOptions;
        question.matchOptions = matchOptions;
    }

    return question;
}
