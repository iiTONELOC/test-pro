import { parsedQuestionsType } from '../types';
import { IQuizQuestionJsonData } from '../../../../types';

export const QUESTION_EXTRACTOR_U_OF_A = /Question (\d+)\s+([\s\S]+?)(?=\nQuestion \d+|$)/g;
export const QUESTION_EXTRACTOR_TEST_OUT = /Question (\d+):\s+([\s\S]+?)(Explanation\s+([\s\S]+?))?References\s+([\s\S]+?)(?=\nQuestion \d+|$)/g


const cleanOptions = (options: string[]) => options.map(answerOption => answerOption.trim())
    .filter(answerOption => answerOption.length > 0)
    .filter(Boolean);

const cleanQuestionText = (questionText: string) => questionText.replace('\n\n', '\n').split('\n');

/**
 * Parses questions from a user provided text file for a quiz
 * @param text - The text to parse questions from
 * @returns - An array of parsed questions
 */
export const extractQuestionsFromTextUofA = (text: string): Partial<Partial<IQuizQuestionJsonData>>[] => {
    const extractedQuestions: IterableIterator<RegExpMatchArray> = text.matchAll(QUESTION_EXTRACTOR_U_OF_A);
    const parsedQuestions: Partial<parsedQuestionsType>[] = [];

    for (const question of extractedQuestions) {
        const questionText = question[2];

        const questionTextLines = cleanQuestionText(questionText);
        const [_question, ..._answerOptions] = questionTextLines;

        const answerOptions = cleanOptions(_answerOptions)

        parsedQuestions.push({
            question: _question.trim(),
            options: answerOptions
        });
    }

    return parsedQuestions;
};

export const extractedQuestionsFromTextTestOut = (text: string): Partial<Partial<IQuizQuestionJsonData>>[] => {
    const extractedQuestions: IterableIterator<RegExpMatchArray> = text.matchAll(QUESTION_EXTRACTOR_TEST_OUT);
    const parsedQuestions: Partial<parsedQuestionsType>[] = [];

    for (const question of extractedQuestions) {
        const questionText = question[2];
        const explanation = question[4];
        const referenceText = question[5]

        const questionTextLines = cleanQuestionText(questionText);
        const [_question, ..._answerOptions] = questionTextLines;

        const answerOptions = cleanOptions(_answerOptions)

        parsedQuestions.push({
            question: _question.trim(),
            options: answerOptions,
            explanation: explanation.trim(),
            areaToReview: referenceText.split('\n').map(word => word.trim())
        })
    }
    return parsedQuestions
}




export const extractQuestionsFromText = {
    UofA: extractQuestionsFromTextUofA,
    TestOut: extractedQuestionsFromTextTestOut
};
