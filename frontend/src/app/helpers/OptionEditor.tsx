"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { QuestionType } from "@/types/types";
import type { FormValues } from "../create/schema";

export default function OptionsEditor({
  index,
  type,
}: {
  index: number;
  type: QuestionType;
}) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { fields, append, remove} = useFieldArray({
    control,
    name: `questions.${index}.options` as const,
  });

  return (
    <div className="mt-3 space-y-2">
      {fields.map((f, i) => {
        const err = (errors.questions?.[index] as any)?.options?.[i];
        return (
          <div key={f.id} className="flex items-center gap-2">
            <input
              className={`w-full rounded-lg border px-3 py-2 ${
                err?.text ? "border-red-500" : ""
              }`}
              placeholder={`Option #${i + 1}`}
              {...register(`questions.${index}.options.${i}.text` as const)}
            />
            <input
              type="checkbox"
              {...register(
                `questions.${index}.options.${i}.isCorrect` as const
              )}
            />
            {err?.text && (
              <span className="text-sm text-red-600">
                {err.text.message as string}
              </span>
            )}
            {type === "CHECKBOX" && fields.length > 2 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-lg border px-2 py-1 text-sm"
              >
                Del
              </button>
            )}
          </div>
        );
      })}
      {type === "CHECKBOX" && (
        <button
          type="button"
          onClick={() => append({ text: "", isCorrect: false })}
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          + Add option
        </button>
      )}
    </div>
  );
}
