import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = "info") => {
    set((state) => {
      const id = Date.now();
      return { toasts: [...state.toasts, { id, message, type }] };
    });
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));