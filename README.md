# My Store API

API REST para gestión de tienda online construida con Node.js, Express y Sequelize.

## 🚀 Descripción

**My Store API** es una API robusta para comercio electrónico con arquitectura **Monolítica** y patrones **MVC**. Proporciona endpoints para gestión de productos, pedidos, usuarios y comisiones.

## ✨ Características Principales

- **Gestión Completa de Productos:** CRUD con categorización
- **Gestión de Pedidos:** Control de estados y asignación a usuarios (tiers)
- **Autenticación JWT:** Login, recuperación de contraseña, perfiles (admin, tier, customer)
- **Comisiones:** Sistema de comisiones por producto y usuario
- **Multimedia:** Soporte para imágenes, videos y audio en productos
- **Soft Delete:** Eliminación lógica preservando integridad de datos
- **Transacciones:** Operaciones ACID en creación de tiers y pedidos

## 🛠️ Tecnologías

### Backend
- **Node.js 20.x** + **Express 4.x**
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
- Node.js 20.x
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
- ✅ 144 tests pasando
- ✅ 21 test suites
- ✅ Cobertura: ~60% (objetivo: >80%)

## 📖 Documentación API

Disponible en: `http://localhost:3000/api/v1/docs`

## 👤 Perfiles de Usuario

| Perfil | Permisos |
|--------|-----------|
| `admin` | Acceso total (CRUD en todos los endpoints) |
| `tier` | Puede crear órdenes, comisiones y gestionar su perfil |
| `customer` | Solo lectura (puede ver productos, categorías, sus propias órdenes) |

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

## 🚀 Descripción General

**My Store** es una aplicación web de comercio electrónico desarrollada con una arquitectura **Monolítica** y un enfoque **MVC (Modelo-Vista-Controlador)**. Este proyecto sirve como una sólida base para crear y gestionar tu propia tienda online, ofreciendo funcionalidades esenciales para la compra y venta de productos.

-----

## ✨ Características Principales

  * **Gestión de Productos:** Añade, edita y elimina productos con facilidad.
  * **Gestión de Pedidos:** Controla el estado de los pedidos y la información de los clientes.
  * **Autenticación de Usuarios:** Registro e inicio de sesión seguro para clientes y administradores.
  * **Interfaz Responsiva:** Adaptable a diferentes dispositivos (escritorio, tabletas y móviles).
  * **Carrito de Compras:** Funcionalidad completa para que los usuarios añadan y gestionen productos antes de la compra.
  * **Base de Datos Relacional:** Utiliza **PostgreSQL** para un almacenamiento de datos robusto y eficiente.

-----

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido con un stack tecnológico robusto y moderno:

  * **Backend:**
      * **Node.js:** Entorno de ejecución de JavaScript.
      * **Express.js:** Framework web para Node.js, utilizado para construir la API y las rutas.
      * **Sequelize ORM:** ORM para Node.js, facilita la interacción con la base de datos PostgreSQL.
      * **Passport.js:** Middleware de autenticación flexible.
      * **Bcrypt:** Para el hashing seguro de contraseñas.
  * **Frontend (Vista):**
      * **EJS (Embedded JavaScript):** Motor de plantillas para generar HTML dinámicamente en el servidor.
      * **HTML5, CSS3, JavaScript (Vanilla):** Fundamentos del desarrollo web.
      * **Bootstrap:** Framework CSS para un diseño responsivo y preestablecido.
  * **Base de Datos:**
      * **PostgreSQL:** Sistema de gestión de bases de datos relacional.
  * **Herramientas de Desarrollo y Despliegue:**
      * **Docker:** Para la contenerización de la aplicación y la base de datos, asegurando un entorno consistente.
      * **Nodemon:** Para el reinicio automático del servidor durante el desarrollo.

-----

## 🚀 Instalación y Ejecución Local

Sigue estos pasos para poner en marcha `My Store` en tu máquina local:

### Requisitos Previos

Asegúrate de tener instalado lo siguiente:

  * **Node.js** (versión 14.x o superior recomendada)
  * **npm** (viene con Node.js) o **Yarn**
  * **Docker** y **Docker Compose**

### Pasos

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/PouDDuoP/my-store.git
    cd my-store
    ```

2.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto (al mismo nivel que `package.json`) y añade las siguientes variables. Adapta los valores según tus necesidades:

    ```env
    # Variables de la aplicación
    PORT=3000
    SECRET_KEY=tu_clave_secreta_para_sesiones # ¡Cámbiala por una cadena segura y larga!

    # Variables de la base de datos (PostgreSQL)
    DB_HOST=db
    DB_USER=miusuario
    DB_PASSWORD=micontrasena
    DB_NAME=mitiendadb
    DB_PORT=5432
    ```

3.  **Inicia la base de datos con Docker Compose:**

    ```bash
    docker-compose up -d --build
    ```

    Esto creará y levantará el contenedor de PostgreSQL. Espera unos segundos hasta que la base de datos esté completamente inicializada.

4.  **Instala las dependencias del proyecto:**

    ```bash
    npm install
    # o
    yarn install
    ```

5.  **Ejecuta las migraciones de la base de datos:**
    Necesitas ejecutar las migraciones de Sequelize para crear las tablas en tu base de datos.

    ```bash
    npx sequelize db:migrate
    ```

    Si tienes seeds (datos de prueba), también puedes ejecutarlos:

    ```bash
    npx sequelize db:seed:all
    ```

6.  **Inicia la aplicación:**

    ```bash
    npm start
    # o para desarrollo con nodemon
    npm run dev
    ```

    La aplicación estará disponible en `http://localhost:3000` (o el puerto que hayas configurado en tu `.env`).

-----

## 📞 Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarme:

  * **GitHub:** [PouDDuoP](https://www.google.com/search?q=https://github.com/PouDDuoP)
  * **LinkedIn:** [kevin-alvarado-gratero](https://www.linkedin.com/in/kevin-alvarado-graterol/) 
-----
