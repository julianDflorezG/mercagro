# 🌱 MercAgro — Plataforma Agrocomercial Digital

MercAgro es una plataforma web que conecta **agricultores** con **compradores**, eliminando intermediarios y mejorando el acceso directo a productos agrícolas en Colombia.

Proyecto desarrollado en el marco del programa **Talento Tech — Ministerio TIC de Colombia**.

---

## 🚀 Características principales

- 🌾 Publicación de cultivos por agricultores
- 🛒 Catálogo de productos agrícolas
- 🤝 Sistema de solicitudes de compra
- 🔐 Autenticación con JWT
- 👥 Sistema de roles: Administrador, Agricultor, Comprador
- 📊 Módulo de estadísticas para administrador
- 🖼 Gestión de imágenes de cultivos

---

## 🧠 Arquitectura del sistema

Backend desarrollado en **Django + Django REST Framework**:

apimercagro/
├── auth_app → Usuarios y autenticación JWT
├── market_app → Productos del mercado
├── cultivo_app → Gestión de cultivos
├── match_app → Solicitudes de compra
├── data_app → Estadísticas
└── mercagro → Configuración principal

Frontend tipo SPA con routing por hash (#).

---

## 🛠 Tecnologías

Backend:
- Django 6
- Django REST Framework
- SimpleJWT
- SQLite / PostgreSQL

Frontend:
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (ES Modules)

Herramientas:
- Git + GitHub
- XAMPP
- Postman

---

## ⚙️ Instalación

### 1. Clonar repositorio
git clone https://github.com/julianDflorezG/mercagro.git
cd mercagro

### 2. Backend
cd apimercagro
python -m venv env
source env/Scripts/activate

pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow

### 3. Migraciones
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser

### 4. Ejecutar servidor
python manage.py runserver

Backend:
http://localhost:8000

---

### 5. Frontend (XAMPP)

Copiar carpeta frontendmercagro en:
C:/xampp/htdocs/proyecto_mercagro/

Abrir en navegador:
http://localhost/proyecto_mercagro/frontendmercagro/#login

---

## 👥 Roles del sistema

- 👨‍🌾 Agricultor → Publica cultivos y gestiona solicitudes
- 🛒 Comprador → Consulta catálogo y compra cultivos
- 👨‍💼 Administrador → Gestiona productos y estadísticas

---

## 🔄 Flujo del sistema

Registro → Publicación → Solicitud → Aceptación/Rechazo → Finalización

---

## 📡 API REST

Autenticación:
/api/auth/login/
/api/auth/registro/
/api/auth/usuario/

Cultivos:
/api/cultivos/
/api/cultivos/publicados/lista/
/api/cultivos/{id}/

Solicitudes:
/api/solicitudes/crear/
/api/solicitudes/enviadas/
/api/solicitudes/recibidas/

Productos:
/api/mercado/productos/
/api/mercado/productos/{id}/

---

## 📁 Estructura del proyecto

proyecto_mercagro/
├── apimercagro/
│   ├── auth_app/
│   ├── cultivo_app/
│   ├── market_app/
│   ├── match_app/
│   ├── data_app/
│   ├── mercagro/
│   └── manage.py
├── frontendmercagro/
│   ├── index.html
│   ├── styles/
│   ├── scripts/
│   ├── main/
│   ├── partials/
│   └── assets/
└── postman/

---

## 👨‍💻 Autor

Julian Daniel Florez Guzman  
GitHub: https://github.com/julianDflorezG  

---

## 🏅 Certificación

Talento Tech — Ministerio TIC Colombia  
159 horas de formación  
2025

---

## 📄 Licencia

Proyecto académico con fines educativos en el programa Talento Tech.