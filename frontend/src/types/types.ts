export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export type Option = { text: string; isCorrect: boolean };
export type AnswerText = { value: string };

export type CreateQuestion = {
  type: QuestionType;
  text: string;
  orderIndex?: number;
  options?: Option[];
  answers?: AnswerText[];
};

export type CreateQuiz = {
  title: string;
  questions: CreateQuestion[];
};

export type QuizListItem = {
  id: number;
  title: string;
  questionCount: number;
  createdAt: string;
};

export type QuizDetail = {
  id: number;
  title: string;
  questions: Array<{
    id: number;
    type: QuestionType;
    text: string;
    orderIndex: number;
    options: Option[];
    answers: AnswerText[];
  }>;
};
