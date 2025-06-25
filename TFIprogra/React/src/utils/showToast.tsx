import { useToastStore } from "../store/useToastStore";
import type { ToastType } from "../store/useToastStore";

export function showToast(message: string, type: ToastType = "info") {
  const addToast = useToastStore.getState().addToast;
  addToast(message, type);
}
