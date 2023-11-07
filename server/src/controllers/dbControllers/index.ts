export {
    default as topicController,
    getAll as getAllTopics,
    getById as getTopicById,
    create as createTopic,
    updateById as updateTopicById,
    deleteById as deleteTopicById
} from './topicController';

export {
    default as questionController,
    getAll as getAllQuestions,
    getById as getQuestionById,
    create as createQuestion,
    updateById as updateQuestionById,
    deleteById as deleteQuestionById
} from './questionController';

export {
    default as quizController,
    getAll as getAllQuizzes,
    getById as getQuizById,
    create as createQuiz,
    updateById as updateQuizById,
    deleteById as deleteQuizById
} from './quizController';

export {
    default as quizAttemptController,
    getAll as getAllQuizAttempts,
    getById as getQuizAttemptById,
    create as createQuizAttempt,
    updateById as updateQuizAttemptById,
    deleteById as deleteQuizAttemptById
} from './quizAttemptController';

export {
    default as quizQuestionResultController,
    getAll as getAllQuizQuestionResults,
    getById as getQuizQuestionResultById,
    create as createQuizQuestionResult,
    deleteById as deleteQuizQuestionResultById
} from './quizQuestionResultController';

export {
    default as quizHistoryController,
    create as createQuizHistory,
    getAll as getAllQuizHistories,
    getById as getQuizHistoryById,
    deleteById as deleteQuizHistoryById
} from './quizHistoryController';

