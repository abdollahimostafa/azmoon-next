import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center gap-6 px-4">

      {/* WARNING ICON */}
      <AlertTriangle className="w-16 h-16 text-yellow-500" />

      {/* TITLE */}
      <h1 className="font-bold text-2xl">
        مهلت آزمون شما به اتمام رسیده!
      </h1>

      {/* BUTTON */}
      <a
        href="/dashboard/myexams"
        className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl shadow hover:bg-primary/90 transition"
      >
        بازگشت به صفحه آزمون‌ها
        <ArrowLeft className="w-4 h-4" />
      </a>

    </div>
  );
}
