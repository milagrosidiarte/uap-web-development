export async function createTask(boardId: string, content: string) {
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

  return await res.json()
}

export async function toggleTask(taskId: string) {
  const res = await fetch(`http://localhost:3000/api/boards/tasks/${taskId}/toggle`, {
    method: 'PATCH',
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Error al cambiar estado de tarea')
  }

  return await res.json()
}

export async function deleteTask(taskId: string) {
  const res = await fetch(`http://localhost:3000/api/boards/tasks/${taskId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Error al eliminar tarea')
  }

  return await res.json()
}

export async function deleteCompletedTasks(boardId: string) {
  const res = await fetch(`http://localhost:3000/api/boards/${boardId}/tasks/completed`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Error al eliminar tareas completadas')
  }

  return await res.json()
}
