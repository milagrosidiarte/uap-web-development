
# API - TODO App con Autenticación y Autorización

Esta API permite a usuarios registrados gestionar tableros y tareas, compartir tableros con distintos niveles de permiso y configurar preferencias personales.

---

## Autenticación

### POST /api/auth/register
Crea un nuevo usuario.

**Body:**
```json
{
  "username": "juan",
  "password": "secreta"
}
```

### POST /api/auth/login
Inicia sesión. Devuelve cookie con JWT.

**Body:**
```json
{
  "username": "juan",
  "password": "secreta"
}
```

### POST /api/auth/logout
Cierra la sesión del usuario.

---

## Tableros

### GET /api/boards
Lista todos los tableros a los que el usuario tiene acceso.

### POST /api/boards
Crea un nuevo tablero.

**Body:**
```json
{
  "name": "Trabajo"
}
```

### POST /api/boards/:boardId/share
Comparte un tablero con otro usuario.

**Body:**
```json
{
  "username": "sofia",
  "role": "editor" // o "viewer"
}
```

---

## Tareas

### GET /api/boards/:boardId/tasks
Lista tareas de un tablero con filtros opcionales.

**Query params:**
- `limit`: número de tareas por página
- `offset`: desplazamiento
- `completed`: `0`, `1`, o `all`
- `q`: búsqueda por contenido

### POST /api/boards/:boardId/tasks
Crea una nueva tarea.

**Body:**
```json
{
  "content": "Terminar entrega"
}
```

### PUT /api/boards/:boardId/tasks/:taskId
Edita una tarea.

**Body:**
```json
{
  "content": "Tarea actualizada"
}
```

### PATCH /api/boards/:boardId/tasks/:taskId/toggle
Alterna el estado completado de una tarea.

### DELETE /api/boards/:boardId/tasks/:taskId
Elimina una tarea.

### DELETE /api/boards/:boardId/tasks/completed
Elimina todas las tareas completadas de ese tablero.

---

## Configuraciones del Usuario

### GET /api/user/settings
Obtiene las configuraciones del usuario actual.

### PUT /api/user/settings
Actualiza las preferencias del usuario.

**Body:**
```json
{
  "auto_refresh_interval": 30000,
  "mostrar_mayusculas": true
}
```

---

## Permisos

- `owner`: acceso total, puede compartir, modificar y eliminar
- `editor`: puede ver y modificar tareas
- `viewer`: solo puede ver tareas

---

## Seguridad

- JWT se guarda en cookie HTTP-only.
- Todas las rutas protegidas usan `checkAuth`.
- Las acciones están protegidas según el rol del usuario.

---

## Errores comunes

```json
{ "error": "Acceso denegado" }
{ "error": "No estás autenticado" }
{ "error": "Usuario no encontrado" }
```
