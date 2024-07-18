# Sistema de Gestión de Tareas (NestJS) - API REST

## Descripción

Este proyecto implementa una API REST para un sistema de gestión de tareas, donde los usuarios pueden visualizar, agregar, editar o eliminar sus tareas personales. La API está protegida mediante autenticación JWT y solo los usuarios autenticados pueden acceder a las rutas de las tareas. Además, el sistema guarda una bitácora de todos los movimientos realizados para auditoría.

## Características

- **CRUD de Tareas**: Crear, Leer, Actualizar y Eliminar tareas.
- **Autenticación JWT**: Protección de rutas mediante JSON Web Tokens.
- **Paginación**: Soporte para paginación en las respuestas de las tareas.
- **Búsqueda de Tareas**: Búsqueda de tareas basada en palabra clave, estatus de compleción, días restantes para vencimiento y formato de archivo.
- **Logging**: Registro de todas las acciones realizadas en la API (la información se guarda en la tabla `log`).
- **Transacciones**: Manejo de transacciones para garantizar la integridad de los datos.

## Tecnologías Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [MySQL](https://www.mysql.com/)
- [JWT](https://jwt.io/)

# Configuración del Proyecto

## Requisitos

- Node.js (>= 12.x)
- Base de datos MySQL


### Instalación de Dependencias

Primero, clona el repositorio y navega al directorio del proyecto:

```bash
git clone https://github.com/Max-500/task-managment-nestjs.git
cd task-managment
npm install
mv .env.template .env
```

### Configura las variables de entorno:
Antes de iniciar la aplicación, es necesario configurar las variables de entorno en el archivo `.env`. Este archivo contiene la configuración de la base de datos y la clave secreta para JWT.

```env
# Configuración de la base de datos
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Configuración de JWT
JWT_SECRET=your_jwt_secret_key
```

#### Descripción de los campos

- DB_HOST: La dirección del host de tu base de datos. Asegúrate de que este host esté disponible.
- DB_PORT: El puerto de tu base de datos. Generalmente es 3306 para MySQL.
- DB_USERNAME: El nombre de usuario de tu base de datos. Asegúrate de que este usuario exista y tenga los permisos necesarios.
- DB_PASSWORD: La contraseña de tu base de datos. Asegúrate de que sea correcta para el usuario especificado.
- DB_NAME: El nombre de la base de datos que vas a utilizar. Asegúrate de que esta base de datos exista.
- JWT_SECRET: Una clave secreta para JWT. Debe ser una cadena aleatoria y segura.

### Ejemplo de configuración por defecto

Si no configuras estas variables, la aplicación utilizará los siguientes valores por defecto. Asegúrate de que estos datos sean válidos en tu entorno:


```env
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=task_managment

# Configuración de JWT por defecto
JWT_SECRET=a9c8f7d1e0b2a1234c5d6e7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7
```

En resumen, asegúrate de que:

- Estás usando una base de datos MySQL.
- La base de datos task_managment exista.
- El puerto 3306 esté libre y MySQL esté corriendo en ese puerto.
- Tienes un usuario llamado root con la contraseña especificada (o sin contraseña si está en blanco).


Posteriormente a lo anterior nada mas ejecuta el siguiente comando:
```bash
npm run start
```

# Endpoints

## Endpoints de Tareas
- **GET /tasks**: Regresa información breve de todas las tareas, con soporte para paginación. Acepta los siguientes parámetros de consulta:
  - **page**: Número de página para la paginación (opcional, por defecto es 1).
  - **limit**: Número de tareas por página (opcional, por defecto es 10).
  - Ejemplo de uso: `GET /tasks?page=1&limit=10`

- **GET /tasks/:uuid**: Regresa toda la información de una tarea.
- **POST /tasks/create**: Crear una tarea.
- **PUT /tasks/:uuid**: Editar una tarea.
- **DELETE /tasks/:uuid**: Borrar una tarea.
- **GET  /tasks/download/:uuid**: Descarga el archivo asociado a una tarea
- **POST /tasks/search**: Realizar una búsqueda de tareas.

## Endpoints de Usuarios
- **POST /auth/register**: Registrar un nuevo usuario.
- **POST /auth/login**: Iniciar sesión de usuario.


## Documentación de la API

Para más detalles sobre cómo utilizar la API, puedes consultar la [documentación publicada en Postman](https://documenter.getpostman.com/view/23274593/2sA3kSmN9W).

Las colecciones de Postman también están disponibles en la raíz del proyecto para que puedas importarlas y empezar a hacer pruebas rápidamente.

## Registro de Movimientos

El sistema guarda una bitácora de todos los movimientos realizados en la API para auditoría y seguimiento de acciones.