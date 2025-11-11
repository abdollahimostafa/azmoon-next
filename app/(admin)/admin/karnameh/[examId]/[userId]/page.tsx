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
  duration: number;
  questions: Question[];
  userAnswers: UserAnswer[];
  totalParticipants: number;
  topicStats: Record<string, { min: number; max: number }>;
  overtime?: boolean;
};

export default function AdminKarnameh({
  params,
}: {
  params: Promise<{ examId: string; userId: string }>;
}) {
  const { examId, userId } = use(params);

  const [exam, setExam] = useState<ExamData | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchExam() {
      try {
        const res = await fetch(`/api/admin/karnameh/${examId}/${userId}`);

        if (!res.ok) {
          console.error("Error fetching exam:", res.status);
          return;
        }

        const data = await res.json();
        setExam(data.exam);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    }

    fetchExam();
  }, [examId, userId]);

  if (!exam) return <p className="p-6 text-center">در حال بارگذاری...</p>;

  // map user answers
  const answersMap: Record<string, string> = {};
  exam.userAnswers.forEach((ua) => (answersMap[ua.questionId] = ua.answer));

  // compute topic stats
  const topics = Array.from(new Set(exam.questions.map((q) => q.topic)));
  const topicStats = topics.map((topic) => {
    const qs = exam.questions.filter((q) => q.topic === topic);
    const total = qs.length;
    const correct = qs.filter((q) => answersMap[q.id] === q.correct).length;
    const empty = qs.filter((q) => !answersMap[q.id] || answersMap[q.id] === "X").length;
    const wrong = total - correct - empty;

    // 🔧 Use negative scoring: each wrong = -1/3 correct (fractional)
    const net = correct - (wrong / 3); // can be negative and fractional
    const netFraction = total > 0 ? net / total : 0; // fraction of total (may be < 0)
    const percentage = netFraction * 100; // can be negative

    const min = exam.topicStats?.[topic]?.min ?? 0;
    const max = exam.topicStats?.[topic]?.max ?? 0;
    const avg = (min + max) / 2;

    // calculate normalized taraz (same logic as student side)
    let topicTaraz;
    if (max === min) {
      // single participant or all identical — use netFraction to allow negative taraz
      topicTaraz = 6000 + netFraction * 1500;
    } else {
      // Note: here min/max/avg are percentages (0..100) from API; percentage is also percent scale
      // Keep the same normalization formula as before but using 'percentage' (which may be negative)
      topicTaraz = 6000 + ((percentage - avg) / (max - min)) * 1500;
    }

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
      taraz: Math.max(2000, Math.min(9000, topicTaraz)),
    };
  });

  // ✅ NEW — compute total and mean taraz
  const totalTaraz = topicStats.reduce((sum, t) => sum + t.taraz, 0);
  const meanTaraz = totalTaraz / topicStats.length;

  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(exam.startedAt));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold">کارنامه کاربر - {exam.name}</h1>

        <div className="flex gap-3 no-print">
          <button onClick={() => window.print()} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
            <Printer className="w-5 h-5" />
          </button>

          <button onClick={() => router.push("/admin/exam")} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exam Info */}
      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-center text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2">سامانه</th>
              <th className="border px-4 py-2">عنوان آزمون</th>
              <th className="border px-4 py-2">تاریخ</th>
              <th className="border px-4 py-2">تعداد شرکت‌کنندگان</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-gray-50">
              <td className="border px-4 py-2">سامانه ماد</td>
              <td className="border px-4 py-2">{exam.name}</td>
              <td className="border px-4 py-2">{persianDate}</td>
              <td className="border px-4 py-2">{exam.totalParticipants}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Topic Performance */}
      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-center text-sm border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th rowSpan={2} className="border px-4 py-2">موضوع</th>
              <th colSpan={2} className="border px-4 py-2 text-blue-700">عملکرد کاربر</th>
              <th colSpan={4} className="border px-4 py-2">وضعیت پاسخ‌گویی</th>
              <th colSpan={3} className="border px-4 py-2 text-green-700">عملکرد سایرین</th>
              <th rowSpan={2} className="border px-4 py-2 text-purple-700">تراز</th>
            </tr>
            <tr>
              <th className="border px-4 py-2">از ۱۰۰</th>
              <th className="border px-4 py-2">از ۲۰</th>
              <th className="border px-4 py-2">کل</th>
              <th className="border px-4 py-2">صحیح</th>
              <th className="border px-4 py-2">غلط</th>
              <th className="border px-4 py-2">سفید</th>
              <th className="border px-4 py-2">کمترین</th>
              <th className="border px-4 py-2">بیشترین</th>
              <th className="border px-4 py-2">میانگین</th>
            </tr>
          </thead>

          <tbody>
            {topicStats.map((t) => (
              <tr key={t.topic} className="even:bg-gray-50">
                <td className="border px-4 py-2">{t.topic}</td>
                <td className="border px-4 py-2 text-blue-700">{t.percentage.toFixed(2)}</td>
                <td className="border px-4 py-2 text-blue-700">{(t.percentage / 5).toFixed(2)}</td>
                <td className="border px-4 py-2">{t.total}</td>
                <td className="border px-4 py-2 text-green-700">{t.correct}</td>
                <td className="border px-4 py-2 text-red-600">{t.wrong}</td>
                <td className="border px-4 py-2">{t.empty}</td>
                <td className="border px-4 py-2 text-red-600">{t.min.toFixed(2)}</td>
                <td className="border px-4 py-2 text-green-700">{t.max.toFixed(2)}</td>
                <td className="border px-4 py-2 text-blue-700">{t.avg.toFixed(2)}</td>
                <td className="border px-4 py-2 font-bold text-purple-700">{t.taraz.toFixed(0)}</td>
              </tr>
            ))}

            {/* ✅ Total Taraz Row */}
            <tr className="bg-purple-100 font-bold">
              <td className="border px-4 py-2">تراز کل</td>
              <td colSpan={9}></td>
              <td className="border px-4 py-2 text-purple-700">{meanTaraz.toFixed(0)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Answer Sheet */}
      <div className="border rounded-lg shadow-sm p-4 bg-white">
        <h2 className="text-lg font-bold mb-4">پاسخ برگ</h2>
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
                  <td className="border px-4 py-2 font-medium text-gray-700">{idx + 1}</td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-2">
                      {options.map((opt) => {
                        let bg = "bg-gray-200 text-gray-800";
                        if (opt === q.correct) bg = "bg-green-500 text-white";
                        if (opt === userAnswer && userAnswer !== q.correct) bg = "bg-black text-white";
                        if (opt === "X" && userAnswer === "X") bg = "bg-yellow-400 text-gray-900";

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
