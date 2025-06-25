const BASE_URL = 'http://localhost:3000/api'

export async function getBoards() {
  const res = await fetch(`${BASE_URL}/boards`, {
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Error al obtener tableros')
  }

  const data = await res.json()
  return data.boards // o data directamente, según tu backend
}
