// src/api/auth.ts
const BASE_URL = 'http://localhost:3000/api'

export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ⬅️ muy importante para enviar cookies
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Login fallido')
  }

  const data = await fetch(`${BASE_URL}/perfil`, {
    credentials: 'include',
  })

  if (!data.ok) {
    throw new Error('Error al obtener perfil')
  }

  return await data.json() // { user: { id, username } }
}

export async function register(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Registro fallido')
  }
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Logout fallido')
  }
}
