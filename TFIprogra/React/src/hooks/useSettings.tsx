import { useSettingsStore } from "../store/useSettingsStore";
import { BASE_URL } from "./useTasks";
import { useCallback } from "react";

export function useSettings() {
  const {
    refetchInterval,
    setRefetchInterval,
    uppercaseDescriptions,
    toggleUppercaseDescriptions,
    setUppercaseDescriptions,
  } = useSettingsStore();

  const loadSettings = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Error loading settings");

    const data = await response.json();
    setRefetchInterval(data.refetchInterval);

    if (data.uppercaseDescriptions !== uppercaseDescriptions) {
      setUppercaseDescriptions(data.uppercaseDescriptions);
    }
  }, [setRefetchInterval, toggleUppercaseDescriptions, uppercaseDescriptions]);

  const saveSettings = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refetchInterval, uppercaseDescriptions }),
    });

    if (!response.ok) throw new Error("Error saving settings");
  }, [refetchInterval, uppercaseDescriptions]);

  return {
    refetchInterval,
    setRefetchInterval,
    uppercaseDescriptions,
    toggleUppercaseDescriptions,
    setUppercaseDescriptions,
    loadSettings,
    saveSettings,
  };
}
