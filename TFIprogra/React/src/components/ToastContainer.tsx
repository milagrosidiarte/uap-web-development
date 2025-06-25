import { useEffect } from "react";
import { useToastStore } from "../store/useToastStore";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    if (toasts.length > 0) {
      const timers = toasts.map((toast) =>
        setTimeout(() => {
          removeToast(toast.id);
        }, 3000) // Dismiss toast after 3 seconds
      );

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-5 right-5 flex flex-col gap-2 z-[9999]">
      {toasts.map(({id, message, type}) => (
        <div
          key={id}
          onClick={() => removeToast(id)}
          className={`
            cursor-pointer min-w-[200px] px-5 py-2.5 rounded-md text-white shadow-md
            ${type === "success" ? "bg-green-600 hover:bg-green-700" : type === "error" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
            transition-colors duration-200
          `}
        >
          {message}
        </div>
      ))}
    </div>
  );
}