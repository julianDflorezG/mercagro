# 🌱 MercAgro — Plataforma Agrocomercial Digital

Proyecto desarrollado en el marco del programa de formación del **Ministerio de las TIC de Colombia**.

MercAgro es una plataforma web que conecta **agricultores** con **compradores** interesados en productos agrícolas locales, eliminando intermediarios y mejorando los ingresos del campo colombiano.

---

## 📋 Tabla de contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints de la API](#endpoints-de-la-api)
- [Roles del sistema](#roles-del-sistema)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Autor](#autor)

---

## 📖 Descripción

MercAgro permite:

- 🌾 **Agricultores**: publicar cultivos con imagen, precio y descripción.
- 🛒 **Compradores**: consultar cultivos disponibles y enviar solicitudes de compra.
- 🔧 **Administradores**: gestionar productos del mercado y consultar estadísticas globales.

### Flujo principal

1. El agricultor publica un cultivo con precio menor al precio de referencia del mercado.
2. El comprador lo ve en el catálogo público y envía una solicitud.
3. El agricultor acepta o rechaza la solicitud.
4. Ambos pueden marcar el intercambio como completado.

---

## 🛠 Tecnologías

| Capa | Tecnología |
|------|-----------|
| Backend | Django 6 + Django REST Framework |
| Autenticación | JWT (SimpleJWT) |
| Base de datos | SQLite (desarrollo) / PostgreSQL (producción) |
| Imágenes | Pillow + ImageField |
| Frontend | HTML5 + CSS3 + Bootstrap 5 + JavaScript (ES Modules) |
| Servidor local | XAMPP (Apache) + Django Dev Server |
| Control de versiones | Git + GitHub |

---

## 🏗 Arquitectura

El backend sigue una estructura modular tipo **microservicios simulados**, donde cada app Django tiene su propia lógica, modelos, serializadores, vistas y rutas.

```
apimercagro/
├── auth_app/        → Usuarios, roles y autenticación JWT
├── market_app/      → Productos del mercado (solo Admin)
├── cultivo_app/     → Publicación y gestión de cultivos
├── match_app/       → Solicitudes de compra
├── data_app/        → Análisis y estadísticas
└── mercagro/        → Configuración principal del proyecto
```

El frontend es una **SPA (Single Page Application)** basada en hash routing (`#ruta`), con vistas dinámicas según el rol del usuario autenticado.

---

## ⚙️ Instalación

### Requisitos previos

- Python 3.10+
- XAMPP (para servir el frontend con Apache)
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/julianDflorezG/mercagro.git
cd mercagro
```

### 2. Configurar el backend

```bash
cd apimercagro

# Crear entorno virtual
python -m venv env

# Activar entorno virtual
# Windows (Git Bash):
source env/Scripts/activate
# Windows (CMD):
env\Scripts\activate
# Mac/Linux:
source env/bin/activate

# Instalar dependencias
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow
```

### 3. Inicializar la base de datos

```bash
python manage.py makemigrations
python manage.py migrate

# Crear superusuario administrador
python manage.py createsuperuser
```

### 4. Levantar el servidor Django

```bash
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### 5. Configurar el frontend

Copia la carpeta `frontendmercagro/` dentro de tu directorio de XAMPP:

```
C:/xampp/htdocs/proyecto_mercagro/frontendmercagro/
```

Accede desde el navegador en:

```
http://localhost/proyecto_mercagro/frontendmercagro/#login
```

---

## 🚀 Uso

### Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@gmail.com | 123456 |
| Agricultor | maria@gmail.com | 123456 |

### Como Administrador
- Crear y gestionar productos del mercado (nombre, precio de referencia, unidad)
- Ver todos los usuarios registrados
- Consultar historial completo de solicitudes

### Como Agricultor
- Crear cultivos asociados a un producto del mercado
- Publicar cultivos (requiere imagen y precio menor al de referencia)
- Aceptar, rechazar o completar solicitudes de compra

### Como Comprador
- Ver catálogo de cultivos publicados
- Enviar solicitudes de compra con mensaje
- Cancelar o completar solicitudes

---

## 📡 Endpoints de la API

### Autenticación — `/api/auth/`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/login/` | Iniciar sesión | No |
| POST | `/api/auth/registro/` | Registrar usuario | No |
| GET | `/api/auth/usuario/` | Ver perfil propio | Sí |
| PUT | `/api/auth/usuario/` | Actualizar perfil | Sí |
| DELETE | `/api/auth/usuario/` | Eliminar cuenta | Sí |
| GET | `/api/auth/usuarios/` | Listar usuarios | Admin |

### Productos del mercado — `/api/mercado/`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/mercado/productos/` | Listar productos | Sí |
| POST | `/api/mercado/productos/` | Crear producto | Admin |
| GET | `/api/mercado/productos/{id}/` | Ver producto | Sí |
| PUT | `/api/mercado/productos/{id}/` | Actualizar producto | Admin |
| DELETE | `/api/mercado/productos/{id}/` | Eliminar producto | Admin |

### Cultivos — `/api/cultivos/`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/cultivos/` | Mis cultivos | Agricultor |
| POST | `/api/cultivos/` | Crear cultivo | Agricultor |
| GET | `/api/cultivos/{id}/` | Ver cultivo | Sí |
| PATCH | `/api/cultivos/{id}/` | Actualizar cultivo | Agricultor |
| DELETE | `/api/cultivos/{id}/` | Eliminar cultivo | Agricultor |
| GET | `/api/cultivos/publicados/lista/` | Cultivos públicos | Sí |

### Solicitudes — `/api/solicitudes/`

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/solicitudes/crear/` | Crear solicitud | Comprador |
| GET | `/api/solicitudes/enviadas/` | Mis solicitudes | Comprador |
| GET | `/api/solicitudes/recibidas/` | Solicitudes recibidas | Agricultor |
| PATCH | `/api/solicitudes/estado/{id}/` | Cambiar estado | Sí |
| GET | `/api/solicitudes/historial/` | Historial completo | Admin |

---

## 👥 Roles del sistema

| Rol | Descripción |
|-----|-------------|
| `AGRICULTOR` | Publica cultivos y gestiona solicitudes recibidas |
| `COMPRADOR` | Consulta el catálogo y envía solicitudes de compra |
| `ADMIN` | Gestiona productos del mercado y consulta estadísticas |

### Estados del cultivo

```
REGISTRO → COSECHA → PUBLICADO
```

### Estados de la solicitud

```
PENDIENTE → ACEPTADA → COMPLETADA
           → RECHAZADA
PENDIENTE/ACEPTADA → CANCELADA (por el comprador)
```

---

## 📁 Estructura del proyecto

```
proyecto_mercagro/
├── apimercagro/               ← Backend Django
│   ├── auth_app/
│   ├── cultivo_app/
│   ├── market_app/
│   ├── match_app/
│   ├── data_app/
│   ├── mercagro/              ← Settings y URLs principales
│   └── manage.py
├── frontendmercagro/          ← Frontend SPA
│   ├── index.html
│   ├── styles/
│   ├── main/                  ← Vistas HTML por rol
│   │   ├── administrador/
│   │   ├── agricultor/
│   │   └── comprador/
│   ├── partials/
│   ├── scripts/               ← Lógica JS modular
│   │   ├── main.js
│   │   ├── router.js
│   │   ├── api.js
│   │   ├── layout.js
│   │   ├── administrador/
│   │   ├── agricultor/
│   │   └── comprador/
│   └── assets/
└── postman/                   ← Colecciones de Postman
```

---

## 👨‍💻 Autor

**Julian Florez**
Desarrollado como proyecto formativo del **Ministerio de las TIC de Colombia**

[![GitHub](https://img.shields.io/badge/GitHub-julianDflorezG-181717?style=flat&logo=github)](https://github.com/julianDflorezG)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos en el marco del programa del Ministerio de las TIC de Colombia.