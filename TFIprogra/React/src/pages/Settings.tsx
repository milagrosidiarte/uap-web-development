import { useNavigate } from "@tanstack/react-router";
import { useSettings } from "../hooks/useSettings";
import { useEffect, useState } from "react";

export function Settings() {
  const {
    refetchInterval,
    setRefetchInterval,
    uppercaseDescriptions,
    setUppercaseDescriptions,
    loadSettings,
    saveSettings,
  } = useSettings();

  const [tempRefetchInterval, setTempRefetchInterval] = useState(refetchInterval);
  const [tempUppercaseDescriptions, setTempUppercaseDescriptions] = useState(uppercaseDescriptions);

  useEffect(() => {
    loadSettings().then(() => {
      setTempRefetchInterval(refetchInterval);
      setTempUppercaseDescriptions(uppercaseDescriptions);
    });
  }, []);

  const handleSave = () => {
    setRefetchInterval(tempRefetchInterval);
    setUppercaseDescriptions(tempUppercaseDescriptions);
    saveSettings();
  };

  const navigate = useNavigate();


  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded bg-[#e4dfd9]">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <label className="block mb-4">
        <span className="font-medium">Refetch Interval (ms)</span>
        <input
          type="number"
          value={tempRefetchInterval ?? 10000}
          onChange={(e) => setTempRefetchInterval(Number(e.target.value))}
          className="mt-1 block w-full border rounded p-2"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={tempUppercaseDescriptions}
          onChange={(e) => setTempUppercaseDescriptions(e.target.checked)}
        />
        <span>Show Uppercase Descriptions</span>
      </label>

      <div className="flex gap-4 justify-end">
        <button
          onClick={() => navigate({ to: "/" })} // Ajustá el path según tu router
          className="bg-gray-200 text-black px-4 py-2 rounded shadow hover:bg-gray-300"
        >
          Volver
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}