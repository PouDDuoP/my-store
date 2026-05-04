# My Store API

API REST para gestión de tienda online construida con Node.js, Express y Sequelize.

## 🚀 Descripción

**My Store API** es una API robusta para comercio electrónico con arquitectura **Monolítica** y patrones **MVC**. Proporciona endpoints para gestión de productos, pedidos, usuarios y comisiones.

## ✨ Características Principales

- **Gestión Completa de Productos:** CRUD con categorización y filtrado por categoría
- **Gestión de Pedidos:** Control de estados y asignación a usuarios (tiers)
- **Autenticación JWT:** Login (con `username`), registro, recuperación de contraseña, perfiles (admin, tier, customer)
- **Comisiones:** Sistema de comisiones por producto y usuario
- **Multimedia:** Soporte para imágenes, videos y audio en productos
- **Soft Delete:** Eliminación lógica preservando integridad de datos
- **Transacciones:** Operaciones ACID en creación de tiers y pedidos
- **API REST Documentada:** Swagger UI disponible en `/api/v1/docs`

## 🛠️ Tecnologías

### Backend
- **Node.js 24.x** + **Express 4.x**
- **Sequelize ORM** (PostgreSQL)
- **JWT** para autenticación
- **Bcrypt** para hashing de contraseñas
- **Passport.js** (JWT + Local strategies)
- **Swagger** para documentación API
- **Joi** para validación de esquemas

### Base de Datos
- **PostgreSQL** (vía Sequelize ORM)

### Testing
- **Jest 30.x** + **Supertest**
- **Cobertura objetivo:** >80%

### Herramientas
- **Docker** + **Docker Compose**
- **Nodemon** para desarrollo

## 🚀 Instalación

### Requisitos
- Node.js 24.x
- PostgreSQL (o Docker)
- npm o yarn

### Pasos

1. **Clonar repositorio:**
```bash
git clone https://github.com/PouDDuoP/my-store.git
cd my-store
```

2. **Configurar variables de entorno:**
Crear `.env` en la raíz:
```env
PORT=3000
DB_NAME=my_store
DB_USER=poud
DB_PASSWORD=123456
DB_HOST=postgres
DB_PORT=5432
JWT_SECRET=your-super-secret-key-change-this
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
FRONTEND_URL=http://localhost:8080
```

3. **Instalar dependencias:**
```bash
npm install
```

4. **Ejecutar migraciones:**
```bash
npm run migrations:run
```

5. **Cargar datos de prueba (seeders):**
```bash
npx sequelize-cli db:seed:all
```
Seeds disponibles:
- Status (pending, paid, shipped, delivered, cancelled)
- Users (admin, tiers, customers)
- Categories (Clothing, Electronics, Home & Garden)
- Tiers, Products, Orders, OrderProducts, Multimedia, Commissions, OrderProductCommissions

6. **Iniciar aplicación:**
```bash
npm start
# o en modo desarrollo:
npm run start:dev
```

---

## 🐳 Ejecución con Docker

El proyecto incluye configuración completa para Docker y Docker Compose, ideal para desarrollo y producción.

### Requisitos
- Docker Desktop instalado
- Docker Compose (incluido en Docker Desktop)

### Servicios Disponibles

El archivo `docker-compose.yml` incluye:

| Servicio | Descripción | Puerto |
|----------|--------------|--------|
| `app-dev` | API en modo desarrollo (con nodemon) | 3000 + 9229 (debug) |
| `postgres` | Base de datos PostgreSQL 17 | 5432 |
| `postgres-admin` | Interfaz web pgAdmin4 | 5050 |

### Pasos para ejecutar con Docker

1. **Configurar variables de entorno:**
   Asegúrate de tener el archivo `.env` configurado (ver sección de instalación manual).

2. **Ejecutar los contenedores:**
   ```bash
   docker-compose up app-dev postgres postgres-admin --build
   ```
   
   **¿Qué hace este comando?**
   - Construye la imagen de la aplicación usando el `Dockerfile` (target: development)
   - Levanta PostgreSQL 17 con los datos iniciales
   - Inicia pgAdmin4 para administrar la base de datos
   - Ejecuta migraciones y seeders automáticamente (vía `entrypoint.sh`)
   - La API estará disponible en `http://localhost:3000`

3. **Acceder a pgAdmin4 (opcional):**
   - URL: `http://localhost:5050`
   - Email: `admin@admin.com`
   - Password: `root`

4. **Ver logs en tiempo real:**
   ```bash
   docker-compose logs -f app-dev
   ```

5. **Detener los contenedores:**
   ```bash
   docker-compose down
   ```
   
   Para eliminar también los volúmenes (incluyendo datos de PostgreSQL):
   ```bash
   docker-compose down -v
   ```

### Estructura de Docker

**Dockerfile:**
- **Base**: `node:24-alpine3.22` (ligero)
- **Desarrollo**: Incluye nodemon, nc (netcat), ejecución de migraciones y seeds
- **Producción**: (comentado) Optimizado para producción con `dumb-init`

**Entrypoint (`scripts/entrypoint.sh`):**
1. Espera a que PostgreSQL esté listo (usando `nc`)
2. Ejecuta migraciones (`npm run migrations:run`)
3. Ejecuta seeders (`npm run seeds:run`)
4. Inicia la aplicación

### Comandos Útiles

```bash
# Ver contenedores corriendo
docker-compose ps

# Reconstruir sin cache
docker-compose build --no-cache

# Ejecutar comando dentro del contenedor
docker-compose exec app-dev npm test

# Ver logs de postgres
docker-compose logs postgres

# Limpiar todo (contenedores, imágenes, volúmenes)
docker system prune -a --volumes
```

---

## 📚 Estructura del Proyecto

```
my-store/
├── api/
│   ├── config/         # Configuración (env vars)
│   ├── db/            # Modelos, migraciones y seeders
│   │   ├── models/    # Modelos Sequelize
│   │   ├── migrations/ # Migraciones de BD
│   │   └── seeders/   # Datos de prueba
│   ├── libs/          # Conexiones (Sequelize, Postgres)
│   ├── middleware/    # Middlewares (auth, errors, validation)
│   ├── routes/        # Rutas de la API
│   ├── schemas/       # Esquemas Joi para validación
│   ├── services/      # Lógica de negocio
│   └── utils/        # Utilidades (Passport config)
├── tests/
│   ├── unit/         # Tests unitarios (services, middleware)
│   └── integration/  # Tests de integración (routes)
├── __mocks__/        # Mocks para Jest (bcrypt, jsonwebtoken, nodemailer)
├── jest.config.js     # Configuración de Jest
└── README.md
```

## 🧪 Tests

Ejecutar tests con cobertura:
```bash
npm test
```

**Estado actual:**
- ✅ 166 tests pasando
- ✅ 22 test suites
- ✅ Cobertura: 88.2% (objetivo cumplido: >80%)
- ✅ Todos los servicios y rutas principales cubiertos

## 📖 Documentación API

Disponible en: `http://localhost:3000/api/v1/docs` (Swagger UI)

### Endpoints Principales

| Método | Endpoint | Descripción | Auth Requerida |
|--------|-----------|-------------|----------------|
| POST | `/api/v1/auth/login` | Login (username + password) | No |
| POST | `/api/v1/auth/register` | Registro de usuario | No |
| POST | `/api/v1/auth/recovery` | Recuperar contraseña | No |
| POST | `/api/v1/auth/change-password` | Cambiar contraseña | No |
| GET | `/api/v1/profile` | Obtener perfil del usuario | Sí (JWT) |
| GET | `/api/v1/products` | Listar productos (con filtros) | Sí (JWT) |
| GET | `/api/v1/categories/:id/products` | Productos por categoría | Sí (JWT) |
| GET | `/api/v1/categories` | Listar categorías | Sí (JWT) |
| POST | `/api/v1/products` | Crear producto | Admin |
| PUT | `/api/v1/products/:id` | Actualizar producto | Admin |
| DELETE | `/api/v1/products/:id` | Eliminar producto (soft delete) | Admin |

### Filtros Disponibles (Products)
- `?price_min=X&price_max=Y` - Rango de precios
- `?limit=N&offset=M` - Paginación

## 👤 Perfiles de Usuario

| Perfil | Credenciales de Prueba | Permisos |
|--------|-------------------------|-----------|
| `admin` | username: `admin`<br>password: `password123` | Acceso total (CRUD en todos los endpoints) |
| `tier` | username: `tier1` o `tier2`<br>password: `password123` | Puede crear órdenes, comisiones y gestionar su perfil |
| `customer` | username: `customer1`, `customer2` o `customer3`<br>password: `password123` | Solo lectura (puede ver productos, categorías, sus propias órdenes) |

**Nota:** El login requiere `username` (no email). Email disponible: `admin@mystore.com`

## 🔒 Variables de Entorno Requeridas

La aplicación valida al iniciar que estas variables estén definidas:
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`
- `JWT_SECRET`
- `EMAIL_USER`, `EMAIL_PASSWORD`

## 📝 Scripts Disponibles

```bash
npm start              # Inicia la aplicación
npm run start:dev      # Inicia con nodemon e inspector
npm test              # Ejecuta tests con cobertura
npm run lint           # Ejecuta ESLint
npm run migrations:run          # Ejecuta migraciones
npm run migrations:generate  # Genera nueva migración
npm run seeds:generate       # Genera nuevo seeder
```

## 🤝 Contacto

- **GitHub:** [PouDDuoP](https://github.com/PouDDuoP)
- **LinkedIn:** [kevin-alvarado-graterol](https://www.linkedin.com/in/kevin-alvarado-graterol/)

## 📄 Licencia

ISC
