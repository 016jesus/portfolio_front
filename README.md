# 🚀 Portafolio Frontend - React + Vite + Tailwind CSS

Este proyecto es el frontend de un portafolio profesional que consume una Web API en .NET 9 con PostgreSQL.

## 📦 Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS v4
- **Enrutamiento**: React Router v6
- **Estado Global**: Zustand
- **Cliente HTTP**: Axios
- **Iconografía**: Lucide-React
- **Autenticación**: OAuth 2.0 (Google + GitHub) con JWT

## 🏗️ Arquitectura

El proyecto sigue una **Clean Architecture** con separación de responsabilidades.

## 🔧 Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
```bash
cp .env.example .env
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🔑 Autenticación

### Flujo OAuth 2.0

1. Usuario hace clic en "Login with GitHub/Google"
2. Es redirigido al proveedor OAuth
3. El proveedor devuelve un `code` en la URL: `/auth/callback?code=123&provider=github`
4. El componente `OAuthCallback` captura el `code` y lo envía a tu API
5. La API devuelve un JWT que se guarda en una Cookie
6. El Axios interceptor añade automáticamente el token a todas las peticiones

## 🛣️ Rutas

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/` | Landing Page | ❌ |
| `/p/:slug` | Perfil público de un usuario | ❌ |
| `/login` | Página de login | ❌ |
| `/auth/callback` | Callback OAuth | ❌ |
| `/admin/dashboard` | Dashboard admin | ✅ |

## 🪝 Custom Hooks

### `useProjects(username)`
```tsx
const { projects, loading, error } = useProjects('usuario1');
```

### `useProfile(username?)`
```tsx
const { profile, loading, error } = useProfile();
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run preview  # Vista previa del build
npm run lint     # Linter
```

## 📄 Licencia

MIT
