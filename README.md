# My Store - Tu Tienda Online Personalizable

-----

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
