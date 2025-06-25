const BASE_URL = 'http://localhost:3000/api'

export async function register(username: string, password: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Registro fallido')
  }
}
