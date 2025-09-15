import { z } from "zod";

export const OptionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});
export const AnswerTextSchema = z.object({ value: z.string().min(1) });

export const QuestionSchema = z
  .object({
    type: z.enum(["BOOLEAN", "INPUT", "CHECKBOX"]),
    text: z.string().min(1, "Required"),
    orderIndex: z.number().int().nonnegative().optional(),
    options: z.array(OptionSchema).optional(),
    answers: z.array(AnswerTextSchema).optional(),
  })
  .superRefine((q, ctx) => {
    if (q.type === "BOOLEAN") {
      const opts = q.options ?? [];
      if (opts.length !== 2)
        ctx.addIssue({
          code: "custom",
          message: "BOOLEAN needs exactly 2 options",
          path: ["options"],
        });
      const correct = opts.filter((o) => o.isCorrect).length;
      if (correct !== 1)
        ctx.addIssue({
          code: "custom",
          message: "BOOLEAN needs exactly 1 correct option",
          path: ["options"],
        });
    }
    if (q.type === "CHECKBOX") {
      const opts = q.options ?? [];
      if (opts.length < 2)
        ctx.addIssue({
          code: "custom",
          message: "CHECKBOX needs at least 2 options",
          path: ["options"],
        });
      const correct = opts.filter((o) => o.isCorrect).length;
      if (correct < 1)
        ctx.addIssue({
          code: "custom",
          message: "CHECKBOX needs at least 1 correct option",
          path: ["options"],
        });
    }
    if (q.type === "INPUT") {
      const a = q.answers ?? [];
      if (a.length < 1)
        ctx.addIssue({
          code: "custom",
          message: "INPUT needs at least 1 answer",
          path: ["answers"],
        });
    }
  });

export const CreateQuizSchema = z.object({
  title: z.string().min(1),
  questions: z.array(QuestionSchema).min(1),
});

export type FormValues = z.infer<typeof CreateQuizSchema>;
