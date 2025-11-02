"use client";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import axios from "axios";

type ImageUploaderButtonProps = {
  onUpload: (url: string) => void;
};

export function ImageUploaderButton({ onUpload }: ImageUploaderButtonProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setProgress(0);

      const res = await axios.post("https://valuetech-nl.com/upload.php", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
      });

      if (res.data.success) {
        onUpload(res.data.url);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <Button size="sm" onClick={handleClick} disabled={loading}>
        {loading ? "در حال آپلود..." : "آپلود تصویر"}
      </Button>

      {loading && (
        <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-500 h-2 transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {loading && <p className="text-xs text-gray-600">{progress}%</p>}
    </div>
  );
}
