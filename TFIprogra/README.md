
# TODO App — Backend + Frontend con Autenticación y Autorización

Este proyecto es una aplicación web completa para gestionar tareas, con múltiples tableros, autenticación segura, permisos por usuario y configuración personalizable.

---

## Tecnologías

- **Frontend:** React + Vite + TanStack Router + Zustand + Tailwind
- **Backend:** Node.js + Express + SQLite + JWT
- **Base de Datos:** SQLite con mejor-sqlite3

---

## Requisitos previos

- Node.js (versión 18+ recomendada)
- npm o pnpm
- SQLite (o simplemente usar el archivo `.db` generado)

---

## Instalación

### Clonar el repositorio

```bash
git clone <REPO_URL>
cd TFIprogra
```

### Backend

```bash
cd backend
npm install
npm run dev
```

> Esto inicia el servidor Express en `http://localhost:3000` y crea automáticamente la base de datos (`initDB.js`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> El frontend se ejecuta en `http://localhost:5173`

---

## Usuarios de prueba

Podés registrarte o usar estos usuarios de ejemplo:

| Usuario | Contraseña | Rol    |
|---------|------------|--------|
| juan    | 1234       | owner  |
| sofia   | 1234       | viewer |
| marco   | 1234       | editor |

---

## Scripts útiles

```bash
# Iniciar backend
npm run dev

# Resetear base de datos (borrar manualmente archivo .db si es necesario)
```

---

## Documentación de la API

Podés encontrar la documentación completa de los endpoints en el archivo [`API.md`](./API.md)

---

## Funcionalidades implementadas

- Registro, login y logout
- JWT en cookie HTTP-only
- CRUD de tableros y tareas
- Compartir tableros con `editor` o `viewer`
- Autorización por rol
- Paginación, búsqueda, filtros
- Configuración de preferencias (limit, mayúsculas, auto-refresh)
- Interfaz en React completamente funcional

---

## Seguridad

- Contraseñas hasheadas con bcrypt
- Validación de permisos por tablero
- Cookies seguras (HTTP-only)
- Sanitización básica de inputs

