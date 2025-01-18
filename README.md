Sistema de Biblioteca
Este proyecto es un sistema de gestión de biblioteca desarrollado para administrar libros, usuarios y préstamos, con un enfoque moderno y eficiente. El backend está construido con Node.js utilizando TypeScript, mientras que el frontend está desarrollado con React y TypeScript.

El sistema utiliza Firebase para almacenar y gestionar imágenes de forma segura. Está desplegado en Render para garantizar una accesibilidad óptima.

Estructura del Proyecto:

El repositorio está organizado en las siguientes carpetas:

backend: Contiene el código del servidor desarrollado con Node.js y TypeScript.

frontend: Contiene la aplicación cliente desarrollada con React y TypeScript.
_______________________________________________________
Instalación y Configuración

Requisitos Previos:

-Node.js (versión 16 o superior).

-npm o yarn para gestionar dependencias.

-TypeScript instalado globalmente (opcional).

-Firebase configurado para manejar las imágenes (opcional si no se planea modificar esta parte).


Backend:

Instalación de dependencias:

-cd backend

-npm install
_________________________________________________________________________________________________________
Configuración de variables de entorno:

Crea un archivo .env en la carpeta backend y añade las siguientes variables:

-MONGO_URI=<URL_DE_TU_BASE_DE_DATOS_MONGODB>

-JWT_SECRET=<TU_SECRETO_JWT>

-FIREBASE_STORAGE_BUCKET=<TU_BUCKET_DE_FIREBASE>

-PORT=<PUERTO A USAR>

Ejecución del servidor:

Para iniciar en modo desarrollo:

-npm run dev 

Para compilar y ejecutar:

-npm run build

-npm start


Frontend:

Instalación de dependencias:

-cd frontend

-npm install

Ejecución del cliente:

Inicia el servidor de desarrollo:

-npm run dev
______________________________________________________________________________
Tecnologías Utilizadas:

Backend:

-Node.js y TypeScript.

-Express para crear el servidor.

-Mongoose para la conexión con MongoDB.

-Firebase para gestionar imágenes.

-JWT para autenticación segura.

-Multer para la subida de archivos.

Frontend:

-React y TypeScript.

-TailwindCSS para el diseño de la interfaz.

-React Router para el manejo de rutas.

-Axios para las solicitudes HTTP.

-Date-fns para el manejo de fechas.


Despliegue:
El sistema está desplegado en Render, garantizando una integración fluida entre el backend y el frontend. Puedes acceder a la aplicación en:


Frontend: https://sistema-de-biblioteca-tiy0.onrender.com

Backend: https://sistemadebiblioteca.onrender.com

Si quieres probar el modo administrador o usuario(Puedes crear Uno) de la App usa lo siguiente:

Admin: correo: admin@gmail.com  -password: 123

User: correo: user@gmail.com    -password: 123

A veces puede ser lento al principio o, se puede demorar en cargar la primera vez  por que al ser un plan gratuito de render   me ofrece tengo poca memoria .

Descripción del Desarrollo:

El sistema de biblioteca fue diseñado para proporcionar una solución moderna a la gestión bibliotecaria.

Backend:

-Desarrollado con Node.js y TypeScript para garantizar un código robusto y tipado.

-Implementa JWT para autenticación y protege las rutas sensibles.

-Integra Firebase Storage para el manejo de imágenes y Multer para la subida de archivos.

Frontend:

-Creado con React y TypeScript, con un diseño responsivo utilizando TailwindCSS.

-Consume la API del backend mediante Axios.

-Implementa una experiencia de usuario fluida con React Router y componentes reutilizables.


Pasos Futuros:
-Mejorar el sistema de notificaciones para los usuarios.
-Añadir funcionalidades avanzadas como generación de reportes.
-Optimizar el rendimiento general del sistema.
