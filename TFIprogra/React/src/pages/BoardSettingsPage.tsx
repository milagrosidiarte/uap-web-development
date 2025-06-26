//import { useParams } from '@tanstack/react-router'
import { useConfigStore } from '../store/configStore'

export default function BoardSettingsPage() {
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

	  <div className="space-y-6">
		<div>
		  <label className="block font-medium mb-1">Tareas por página</label>
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
		  <label className="block font-medium mb-1">Mayúsculas en títulos</label>
		  <div className="flex items-center gap-2">
			<input
			  type="checkbox"
			  checked={uppercase}
			  onChange={(e) => setUppercase(e.target.checked)}
			/>
			<span>{uppercase ? 'Activado' : 'Desactivado'}</span>
		  </div>
		</div>

		<div>
		  <label className="block font-medium mb-1">Intervalo de refresco automático (ms)</label>
		  <input
			type="number"
			className="border p-2 w-full"
			min={0}
			step={1000}
			value={autoRefetchInterval}
			onChange={(e) => setAutoRefetchInterval(Number(e.target.value))}
		  />
		  <p className="text-sm text-gray-500 mt-1">0 para desactivar el refresco automático</p>
		</div>
	  </div>
	</div>
  )
}
