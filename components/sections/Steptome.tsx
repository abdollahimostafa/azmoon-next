"use client";

import React from "react";
import { Instagram, PhoneCall, TableCellsMerge } from "lucide-react";

export default function ContactUs() {


  return (
    <section className="bg-gray-50 py-16 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">با ما در ارتباط باشید</h2>
        <p className="text-gray-600 mb-8">
          برای دریافت اطلاعات بیشتر، پشتیبانی یا خرید اشتراک، از طریق شبکه‌های اجتماعی ما  با ما تماس بگیرید.
        </p>

        <div className="flex justify-center gap-6 mb-8">
          <a
            href="https://t.me/Internist_support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition"
          >
            <TableCellsMerge className="w-5 h-5" />
            تلگرام
          </a>
          <a
            href="https://www.instagram.com/askinternist?igsh=MXBtZG4weGR1d3o2dg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition"
          >
            <Instagram className="w-5 h-5" />
            اینستاگرام
          </a>
<a
  href="https://wa.me/9935212877"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 text-green-500 hover:text-green-600 transition"
>
  <PhoneCall className="w-5 h-5" />
  واتساپ
</a>
        </div>


      </div>
    </section>
  );
}
