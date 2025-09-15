"use client";

import Link from "next/link";
import { useQuizzes, useDeleteQuiz } from '@/hooks/useQuiz'

export default function QuizzesPage() {
	const { data, isLoading, error } = useQuizzes()
	const del = useDeleteQuiz()

	if (isLoading) return <div>Loading…</div>;
	if (error)
		return <div className="text-red-600">{(error as Error).message}</div>;
	
	return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Quizzes</h1>
        <Link
          href="/create"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
        >
          + Create
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {data?.map((q) => (
          <div key={q.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/quizzes/${q.id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {q.title}
                </Link>
                <div className="text-sm text-gray-600">
                  {q.questionCount} questions
                </div>
              </div>
              <button
                onClick={() => {
                  if (!confirm("Delete this quiz?")) return;
                  del.mutate(q.id);
                }}
                disabled={del.isPending}
                className="rounded-lg border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                title="Delete"
              >
                {del.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!data?.length && (
        <div className="text-gray-600">
          No quizzes yet. Create one →{" "}
          <Link className="text-blue-600 underline" href="/create">
            /create
          </Link>
        </div>
      )}
    </div>
  );
	
}
