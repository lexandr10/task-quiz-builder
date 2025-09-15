"use client";

import Link from "next/link";
import { useQuiz } from "@/hooks/useQuiz";

export default function QuizDetailClient({ id }: { id: string }) {
	const { data: quiz, isLoading, error } = useQuiz(id)
	
	if (isLoading) return <div>Loading…</div>;
  if (error)
    return <div className="text-red-600">{(error as Error).message}</div>;
	if (!quiz) return null;
	
	return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/quizzes"
          className="rounded-lg border px-3 py-1.5 hover:bg-gray-50"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
      </div>

      <div className="grid gap-3">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="mb-1 text-sm text-gray-500">
              #{idx + 1} · {q.type}
            </div>
            <div className="mb-3 font-medium">{q.text}</div>

            {q.type !== "INPUT" && q.options?.length > 0 && (
              <ul className="list-inside list-disc space-y-1">
                {q.options.map((o, i) => (
                  <li
                    key={i}
                    className={o.isCorrect ? "font-medium text-green-700" : ""}
                  >
                    {o.text} {o.isCorrect ? "✓" : ""}
                  </li>
                ))}
              </ul>
            )}

            {q.type === "INPUT" && q.answers?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {q.answers.map((a, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {a.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
