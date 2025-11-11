"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

type Question = {
  id: string;
  topic: string;
  correct: string;
};

type UserAnswer = {
  questionId: string;
  answer: string;
};

type ExamData = {
  id: string;
  name: string;
  startedAt: string;
  date: string;
  questions: Question[];
  userAnswers: UserAnswer[];
  totalParticipants: number;
  topicStats: Record<string, { min: number; max: number; rank?: number }>;
  rank: number;
  percentage?: number;
};

export default function Karnameh({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: examId } = use(params);
  const [exam, setExam] = useState<ExamData | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchExam() {
      const res = await fetch(`/api/exam/${examId}/karnameh`);
      const data = await res.json();
      setExam(data.exam);
    }
    fetchExam();
  }, [examId]);

  if (!exam)
    return <p className="p-6 text-center text-gray-600">در حال بارگذاری...</p>;

  const topics = Array.from(new Set(exam.questions.map((q) => q.topic)));

  const answersMap: Record<string, string> = {};
  exam.userAnswers.forEach((ua) => (answersMap[ua.questionId] = ua.answer));

  /** ✅ Konkoor scoring applied here */
  const topicStats = topics.map((topic) => {
    const qs = exam.questions.filter((q) => q.topic === topic);
    const total = qs.length;

    const correct = qs.filter((q) => answersMap[q.id] === q.correct).length;
    const empty = qs.filter(
      (q) => !answersMap[q.id] || answersMap[q.id] === "X"
    ).length;
    const wrong = total - correct - empty;

    // ✅ Konkoor scoring: +3 for correct, -1 for wrong
    const rawScore = correct * 3 - wrong * 1;
    const maxScore = total * 3;

    // ✅ Allow negative percent
    const percentage = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;

    const topicData =
      exam.topicStats?.[topic] ?? { min: 0, max: 0, rank: undefined };
    const { min, max, rank } = topicData;
    const avg = (min + max) / 2;

    // ✅ Taraz formula unchanged, just using new percentage
    const topicTaraz =
      max > min
        ? 6000 + ((percentage - avg) / (max - min)) * 1500
        : 6000 + (percentage / 100) * 1500;

    return {
      topic,
      total,
      correct,
      wrong,
      empty,
      percentage,
      min,
      max,
      avg,
      rank,
      taraz: Math.max(2000, Math.min(9000, topicTaraz)),
    };
  });

  /** ✅ Total Taraz now uses negative-based topic percentages */
  const totalPercentage =
    topicStats.reduce((sum, t) => sum + t.percentage, 0) / topicStats.length;

const totalTaraz = topicStats.reduce((sum, t) => sum + t.taraz, 0) / topicStats.length;
  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(exam.startedAt));

  return (
    <div className="p-6 space-y-10 print:p-2 print:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-extrabold text-gray-800">
          {exam.name} - <span className="text-blue-600">کارنامه</span>
        </h1>
        <div className="flex items-center gap-3 no-print">
          <button
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => window.print()}
          >
            <Printer className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exam Info */}
      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-center text-sm border-collapse">
          <thead className="bg-gray-50 font-semibold text-gray-700">
            <tr>
              <th className="border px-4 py-2">پلتفرم</th>
              <th className="border px-4 py-2">عنوان آزمون</th>
              <th className="border px-4 py-2">تاریخ</th>
              <th className="border px-4 py-2">تعداد شرکت‌کنندگان</th>
              <th className="border px-4 py-2">رتبه شما</th>
              <th className="border px-4 py-2">تراز کل</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-50 text-gray-800">
              <td className="border px-4 py-2 font-medium text-gray-600">
                سامانه ماد
              </td>
              <td className="border px-4 py-2">{exam.name}</td>
              <td className="border px-4 py-2">{persianDate}</td>
              <td className="border px-4 py-2">{exam.totalParticipants}</td>
              <td className="border px-4 py-2 font-bold text-blue-600">
                {exam.rank} از {exam.totalParticipants}
              </td>
              <td className="border px-4 py-2 font-bold text-purple-600">
                {totalTaraz.toFixed(0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Topic Performance */}
      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full table-auto text-center text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-800">
            <tr>
              <th rowSpan={2} className="border px-4 py-2">
                موضوع
              </th>
              <th colSpan={2} className="border px-4 py-2 text-blue-700">
                عملکرد شما
              </th>
              <th colSpan={4} className="border px-4 py-2 text-gray-700">
                وضعیت پاسخ‌گویی
              </th>
              <th colSpan={4} className="border px-4 py-2 text-green-700">
                عملکرد سایرین
              </th>
              <th rowSpan={2} className="border px-4 py-2 text-purple-700">
                تراز
              </th>
            </tr>
            <tr>
              <th className="border px-4 py-2">از ۱۰۰</th>
              <th className="border px-4 py-2">از ۲۰</th>
              <th className="border px-4 py-2">کل</th>
              <th className="border px-4 py-2 text-green-600">صحیح</th>
              <th className="border px-4 py-2 text-red-600">غلط</th>
              <th className="border px-4 py-2 text-gray-500">سفید</th>
              <th className="border px-4 py-2">کمترین</th>
              <th className="border px-4 py-2">بیشترین</th>
              <th className="border px-4 py-2">میانگین</th>
              <th className="border px-4 py-2">رتبه شما</th>
            </tr>
          </thead>
          <tbody>
            {topicStats.map((t) => (
              <tr key={t.topic} className="even:bg-gray-50 text-gray-800">
                <td className="border px-4 py-2 font-medium">{t.topic}</td>
                <td className="border px-4 py-2 text-green-700">
                  {t.percentage.toFixed(2)}
                </td>
                <td className="border px-4 py-2 text-blue-700">
                  {(t.percentage / 5).toFixed(2)}
                </td>
                <td className="border px-4 py-2">{t.total}</td>
                <td className="border px-4 py-2 text-green-700">{t.correct}</td>
                <td className="border px-4 py-2 text-red-600">{t.wrong}</td>
                <td className="border px-4 py-2 text-gray-500">{t.empty}</td>
                <td className="border px-4 py-2 text-red-600">
                  {t.min.toFixed(2)}
                </td>
                <td className="border px-4 py-2 text-green-700">
                  {t.max.toFixed(2)}
                </td>
                <td className="border px-4 py-2 text-blue-700">
                  {t.avg.toFixed(2)}
                </td>
                <td className="border px-4 py-2 font-bold text-blue-600">
                  {t.rank ? `${t.rank} از ${exam.totalParticipants}` : "—"}
                </td>
                <td className="border px-4 py-2 font-bold text-purple-600">
                  {t.taraz.toFixed(0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Answer Sheet */}
      <div className="border rounded-lg shadow-sm p-4 bg-white">
        <h2 className="text-lg font-bold mb-4 text-gray-800">پاسخ برگ</h2>
        <table className="min-w-full table-auto text-center border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2">شماره سؤال</th>
              <th className="border px-4 py-2">گزینه‌ها</th>
            </tr>
          </thead>
          <tbody>
            {exam.questions.map((q, idx) => {
              const userAnswer = answersMap[q.id] || "X";
              const options = ["A", "B", "C", "D", "X"];

              return (
                <tr key={q.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2 font-medium text-gray-700">
                    {idx + 1}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-2">
                      {options.map((opt) => {
                        let bg = "bg-gray-200 text-gray-800";
                        if (opt === q.correct) bg = "bg-green-500 text-white";
                        if (opt === userAnswer && userAnswer !== q.correct)
                          bg = "bg-black text-white";
                        if (opt === "X" && userAnswer === "X")
                          bg = "bg-yellow-400 text-white";

                        return (
                          <div
                            key={opt}
                            className={`${bg} w-7 h-7 rounded flex items-center justify-center text-xs font-medium border`}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
