# TODO App – Documentación Completa

Esta es una aplicación web para gestionar tareas por tableros. Incluye autenticación, permisos de usuario, edición colaborativa, configuración personalizada y una API RESTful construida con Express y SQLite.

---

## Autenticación

### POST `/api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{ "username": "usuario", "password": "secreto" }
```

### POST `/api/auth/login`
Inicia sesión y devuelve un token en cookie HTTP-only.

**Body:**
```json
{ "username": "usuario", "password": "secreto" }
```

### POST `/api/auth/logout`
Cierra la sesión.

---

## Usuarios y Permisos

- Cada usuario puede crear tableros.
- Cada tablero tiene un propietario.
- El propietario puede compartir el tablero con otros usuarios.
- Los roles posibles son:
  - `owner`: control total
  - `editor`: puede gestionar tareas
  - `viewer`: solo lectura

---

## Tableros

### GET `/api/boards`
Lista todos los tableros donde el usuario tiene acceso.

### POST `/api/boards`
Crea un nuevo tablero.

**Body:**
```json
{ "name": "Tablero de ejemplo" }
```

### DELETE `/api/boards/:boardId`
Elimina el tablero si sos el dueño.

### POST `/api/boards/:boardId/share`
Comparte el tablero con otro usuario asignando un rol.

**Body:**
```json
{ "username": "otroUsuario", "role": "viewer" }
```

---

## Tareas

### GET `/api/boards/:boardId/tasks`
Lista tareas del tablero.

**Query Params:**

- `limit` (número): cantidad por página
- `offset` (número): desplazamiento
- `completed`: `0`, `1` o `all`
- `q`: texto de búsqueda

### POST `/api/boards/:boardId/tasks`
Crea una nueva tarea.

**Body:**
```json
{ "content": "Estudiar para el parcial" }
```

### PUT `/api/boards/tasks/:taskId`
Edita el contenido de una tarea.

**Body:**
```json
{ "content": "Nuevo texto" }
```

### PATCH `/api/boards/tasks/:taskId/toggle`
Alterna el estado de completado.

### DELETE `/api/boards/tasks/:taskId`
Elimina una tarea.

### DELETE `/api/boards/:boardId/tasks/completed`
Elimina todas las tareas completadas de ese tablero.

---

## Configuraciones por usuario

Cada usuario puede definir:

- `limit`: cantidad de tareas por página
- `autoRefreshInterval`: tiempo de refetch automático
- `uppercase`: mostrar tareas en mayúsculas

Estas configuraciones se guardan en SQLite (`user_settings`) y se aplican automáticamente.

---

## Seguridad

- Contraseñas hasheadas
- JWT en cookies HTTP-only
- Validación de inputs
- Verificación de permisos por acción
- CORS configurado

---

## Frontend

- Hecho en **React + Vite**
- Enrutamiento con **TanStack Router**
- Estado remoto con **TanStack Query**
- Estado local con **Zustand**
- Formularios reutilizables (crear / editar tareas)
- Toasts con `react-hot-toast` para acciones y errores
- Acciones protegidas según permisos

---

## Notificaciones (Toasts)

- Crear tarea
- Editar tarea
- Eliminar tarea
- Eliminar tareas completadas
- Compartir tablero
- Eliminar tablero

---

## Estado actual

✔ Login y Registro  
✔ JWT + Cookies  
✔ CRUD de tareas  
✔ Paginación y filtros  
✔ Compartir tableros  
✔ Edición de tareas  
✔ Eliminación de tableros  
✔ Página de configuraciones  
✔ Toasts en todas las acciones  
✔ Base de datos persistente (SQLite)  
✔ Seguridad con permisos por rol

---

## Estructura del proyecto

```
/backend
  /src
    /controllers
    /routes
    /middlewares
    /db
  index.js
/React
  /src
    /pages
    /components
    /hooks
    /api
    /store
  main.tsx
```
---