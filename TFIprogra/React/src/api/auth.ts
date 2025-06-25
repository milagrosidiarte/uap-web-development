export async function login(email: string, password: string): Promise<string> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Login fallido')
  }

  const data = await res.json()
  return data.token
}

export async function register(email: string, password: string): Promise<string> {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Registro fallido')
  }

  const data = await res.json()
  return data.token
}
