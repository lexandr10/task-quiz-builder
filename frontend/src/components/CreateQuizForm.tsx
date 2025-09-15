"use client";

import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useCreateQuiz } from "@/hooks/useQuiz";
import type { QuestionType } from "@/types/types";
import { CreateQuizSchema, FormValues } from "@/app/create/schema";
import OptionsEditor from "@/app/helpers/OptionEditor";
import AnswersEditor from "@/app/helpers/AnswersEditor";

const defaultBooleanOptions = [
  { text: "True", isCorrect: false },
  { text: "False", isCorrect: true },
];

export default function CreateQuizPage() {
  const create = useCreateQuiz();
  const methods = useForm<FormValues>({
    resolver: zodResolver(CreateQuizSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      questions: [
        { type: "BOOLEAN", text: "", options: defaultBooleanOptions },
      ],
    },
  });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = async (values: FormValues) => {
    const payload = {
      title: values.title,
      questions: values.questions.map((q, i) => ({
        ...q,
        orderIndex: q.orderIndex ?? i,
      })),
    };

    try {
      await create.mutateAsync(payload);
      console.log("✅ Quiz created:", create);
      reset({
        title: "",
        questions: [
          { type: "BOOLEAN", text: "", options: defaultBooleanOptions },
        ],
      });
    } catch (err) {
      console.error("❌ Create failed:", err);
    }
  };

  const addQuestion = (type: QuestionType) => {
    if (type === "BOOLEAN") {
      append({ type, text: "", options: defaultBooleanOptions });
    } else if (type === "CHECKBOX") {
      append({
        type,
        text: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
    } else {
      append({ type, text: "", answers: [{ value: "" }] });
    }
  };
  const getArrayError = (err: unknown) => {
    const e: any = err;
    return (
      (typeof e?.message === "string" && e.message) ||
      (Array.isArray(e?._errors) && e._errors[0]) ||
      ""
    );
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Quiz</h1>
          <Link
            href="/quizzes"
            className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
          >
            View all quizzes
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              {...register("title")}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Quiz title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {fields.map((field, index) => {
              const type = watch(`questions.${index}.type`);
              const qErr = errors.questions?.[index];
              const optionsGroupError = getArrayError(qErr?.options);
              const answersGroupError = getArrayError(qErr?.answers);

              return (
                <div key={field.id} className="rounded-xl border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Question #{index + 1}
                    </div>
                    <button
                      type="button"
                      className="text-sm text-red-600"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Type
                      </label>
                      <select
                        {...register(`questions.${index}.type` as const)}
                        className="w-full rounded-lg border px-3 py-2"
                        onChange={(e) => {
                          const t = e.target.value as QuestionType;
                          if (t === "BOOLEAN") {
                            setValue(
                              `questions.${index}.options`,
                              defaultBooleanOptions
                            );
                            setValue(`questions.${index}.answers`, undefined);
                          } else if (t === "CHECKBOX") {
                            setValue(`questions.${index}.options`, [
                              { text: "", isCorrect: false },
                              { text: "", isCorrect: false },
                            ]);
                            setValue(`questions.${index}.answers`, undefined);
                          } else {
                            setValue(`questions.${index}.answers`, [
                              { value: "" },
                            ]);
                            setValue(`questions.${index}.options`, undefined);
                          }
                        }}
                      >
                        <option value="BOOLEAN">BOOLEAN</option>
                        <option value="INPUT">INPUT</option>
                        <option value="CHECKBOX">CHECKBOX</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Text
                      </label>
                      <input
                        {...register(`questions.${index}.text` as const)}
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Question text"
                      />
                      {qErr?.text && (
                        <p className="mt-1 text-sm text-red-600">
                          {qErr.text.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* BOOLEAN / CHECKBOX options */}
                  {(type === "BOOLEAN" || type === "CHECKBOX") && (
                    <>
                      {optionsGroupError && (
                        <p className="mt-2 text-sm text-red-600">
                          {optionsGroupError}
                        </p>
                      )}
                      <OptionsEditor index={index} type={type} />
                    </>
                  )}

                  {/* INPUT answers */}
                  {type === "INPUT" && (
                    <>
                      {answersGroupError && (
                        <p className="mt-2 text-sm text-red-600">
                          {answersGroupError}
                        </p>
                      )}
                      <AnswersEditor index={index} />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addQuestion("BOOLEAN")}
              className="rounded-lg border px-3 py-1.5"
            >
              + Boolean
            </button>
            <button
              type="button"
              onClick={() => addQuestion("INPUT")}
              className="rounded-lg border px-3 py-1.5"
            >
              + Input
            </button>
            <button
              type="button"
              onClick={() => addQuestion("CHECKBOX")}
              className="rounded-lg border px-3 py-1.5"
            >
              + Checkbox
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || create.isPending}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting || create.isPending ? "Saving…" : "Create quiz"}
          </button>
        </form>
      </div>
    </FormProvider>
  );
}
