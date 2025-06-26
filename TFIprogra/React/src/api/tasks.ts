import { toast } from 'react-hot-toast'

export async function createTask(boardId: string, content: string) {
  try {
	const res = await fetch(`http://localhost:3000/api/boards/${boardId}/tasks`, {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json' },
	  credentials: 'include',
	  body: JSON.stringify({ content }),
	})

	if (!res.ok) {
	  const error = await res.text()
	  throw new Error(error || 'Error al crear tarea')
	}

	toast.success('Tarea agregada')
	return await res.json()
  } catch (err) {
	toast.error((err as Error).message)
	throw err
  }
}

export async function toggleTask(taskId: string) {
  try {
	const res = await fetch(`http://localhost:3000/api/boards/tasks/${taskId}/toggle`, {
	  method: 'PATCH',
	  credentials: 'include',
	})

	if (!res.ok) {
	  const error = await res.text()
	  throw new Error(error || 'Error al cambiar estado de tarea')
	}

	toast.success('Estado de tarea actualizado')
	return await res.json()
  } catch (err) {
	toast.error((err as Error).message)
	throw err
  }
}

export async function deleteTask(taskId: string) {
  try {
	const res = await fetch(`http://localhost:3000/api/boards/tasks/${taskId}`, {
	  method: 'DELETE',
	  credentials: 'include',
	})

	if (!res.ok) {
	  const error = await res.text()
	  throw new Error(error || 'Error al eliminar tarea')
	}

	toast.success('Tarea eliminada')
	return await res.json()
  } catch (err) {
	toast.error((err as Error).message)
	throw err
  }
}

export async function deleteCompletedTasks(boardId: string) {
  try {
	const res = await fetch(`http://localhost:3000/api/boards/${boardId}/tasks/completed`, {
	  method: 'DELETE',
	  credentials: 'include',
	})

	if (!res.ok) {
	  const error = await res.text()
	  throw new Error(error || 'Error al eliminar tareas completadas')
	}

	toast.success('Tareas completadas eliminadas')
	return await res.json()
  } catch (err) {
	toast.error((err as Error).message)
	throw err
  }
}


export async function editTask(taskId: string, content: string) {
  try {
	const res = await fetch(`http://localhost:3000/api/boards/tasks/${taskId}`, {
	  method: 'PUT',
	  headers: { 'Content-Type': 'application/json' },
	  credentials: 'include',
	  body: JSON.stringify({ content }),
	})

	const data = await res.json()
	if (!res.ok) throw new Error(data.error || 'Error al editar tarea')

	toast.success('Tarea actualizada')
	return data
  } catch (err) {
	toast.error((err as Error).message)
	throw err
  }
}

