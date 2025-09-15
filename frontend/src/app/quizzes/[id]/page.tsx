import QuizDetailClient from "./quiz-detail-client";


export default function QuizDetailPage({ params }: { params: { id: string } }) {
  return <QuizDetailClient id={params.id} />;
}
