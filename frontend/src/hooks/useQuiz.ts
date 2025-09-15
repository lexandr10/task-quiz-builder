"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { CreateQuiz, QuizDetail, QuizListItem } from "../types/types";

const qk = {
  list: () => ["quizzes", "list"],
  detail: (id: number | string) => ["quizzes", "detail", String(id)],
};

export function useQuizzes() {
  return useQuery({
    queryKey: qk.list(),
    queryFn: async () => {
      const { data } = await api.get<QuizListItem[]>("/quizzes");
      return data;
    },
  });
}

export function useQuiz(id: number | string | null | undefined) {
  return useQuery({
    queryKey: qk.detail(String(id ?? "")),
    enabled: id !== null && id !== undefined && String(id).trim().length > 0,
    retry: false,
    queryFn: async () => {
      if (id === null || id === undefined)
        throw new Error("Quiz id is required");
      const { data } = await api.get<QuizDetail>(`/quizzes/${id}`);
      return data;
    },
  });
}

export function useCreateQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateQuiz) => {
      const { data } = await api.post<QuizDetail>("/quizzes", payload);
      return data;
    },
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: qk.list() });
      if (created?.id) {
        qc.setQueryData(qk.detail(created.id), created);
      }
    },
  });
}

export function useDeleteQuiz() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/quizzes/${id}`);
      return id;
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: qk.list() });
      qc.removeQueries({ queryKey: qk.detail(id) });
    },
  });
}
