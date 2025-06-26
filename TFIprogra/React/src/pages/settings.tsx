import { useConfigStore } from "../store/configStore"

export default function SettingsPage() {
  const {
    limit,
    uppercase,
    autoRefetchInterval,
    setLimit,
    setUppercase,
    setAutoRefetchInterval,
  } = useConfigStore()

  return (
  <div className="max-w-xl mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Configuración</h1>

    <div className="space-y-4">
      <div>
        <label className="block font-medium">Tareas por página</label>
        <input
          type="number"
          className="border p-2 w-full"
          min={1}
          max={100}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          />
      </div>

    <div>
      <label className="block font-medium">Mayúsculas en títulos</label>
      <input
        type="checkbox"
        className="mr-2"
        checked={uppercase}
        onChange={(e) => setUppercase(e.target.checked)}
      />
      <span>{uppercase ? "Activado" : "Desactivado"}</span>
    </div>

    <div>
      <label className="block font-medium">Intervalo de refresco (ms)</label>
      <input
        type="number"
        className="border p-2 w-full"
        min={1000}
        step={1000}
        value={autoRefetchInterval}
        onChange={(e) => setAutoRefetchInterval(Number(e.target.value))}
      />
    </div>
  </div>
  </div>
  )
}
