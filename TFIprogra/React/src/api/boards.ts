export async function getBoards() {
  const res = await fetch('http://localhost:3000/api/boards', {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Error al obtener tableros')
  }

  const data = await res.json()
  return data // devuelve directamente el array
}

export async function createBoard(name: string) {
  const res = await fetch('http://localhost:3000/api/boards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ name }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Error al crear el tablero')
  }

  return await res.json()
}
