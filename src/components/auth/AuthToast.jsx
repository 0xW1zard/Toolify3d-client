"use client";

export default function AuthToast({ toast }) {
  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm border-l-4 shadow-xl flex items-center gap-3 font-mono text-sm transition-all duration-300 ${
        isSuccess
          ? "bg-[#1c1c1c] text-white border-brand"
          : "bg-[#1c1c1c] text-white border-red-600"
      }`}
      role="status"
    >
      <span className={`material-symbols-outlined ${isSuccess ? "text-brand" : "text-red-500"}`}>
        {isSuccess ? "check_circle" : "error"}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}
