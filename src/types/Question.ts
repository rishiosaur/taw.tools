export interface Question {
  question: string;
  answer: string;
  name: string;
  answerTime: number;
  askTime: number;
}

export type AnswerableQuestion = Pick<Question, "question">;

export type Questions = Array<Question | AnswerableQuestion>;

export type AnsweredQuestions = Array<Question>;

export interface QuestionState {
  questions: Questions;
  title?: string;
  id?: string;
}
