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
