"use client";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { FormValues } from "../create/schema";

export default function AnswersEditor({ index }: { index: number }) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.answers` as const,
  });

  return (
    <div className="mt-3 space-y-2">
      {fields.map((f, i) => {
        const err = (errors.questions?.[index] as any)?.answers?.[i];
        return (
          <div key={f.id} className="flex items-center gap-2">
            <input
              className={`w-full rounded-lg border px-3 py-2 ${
                err?.value ? "border-red-500" : ""
              }`}
              placeholder={`Answer #${i + 1}`}
              {...register(`questions.${index}.answers.${i}.value` as const)}
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-lg border px-2 py-1 text-sm"
              >
                Del
              </button>
            )}
            {err?.value && (
              <span className="text-sm text-red-600">
                {err.value.message as string}
              </span>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => append({ value: "" })}
        className="rounded-lg border px-3 py-1.5 text-sm"
      >
        + Add answer
      </button>
    </div>
  );
}
