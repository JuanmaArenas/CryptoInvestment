# CryptoInvestment Tracker 📈

Una aplicación web simple y moderna construida para el grupo "CryptoInvestment", permitiéndoles seguir un portafolio personalizado de criptomonedas en tiempo real. Este proyecto proporciona una vista consolidada, dinámica y de una sola página de los datos del mercado, reemplazando la necesidad de hojas de cálculo y sitios web dispersos.

[Imagen de la aplicación CryptoInvestment Tracker en modo oscuro]

## Features

* **Datos en Tiempo Real:** Visualización de precios en vivo para las criptomonedas, con actualizaciones periódicas.
* **Navegación por Categorías:** Descubre y explora criptomonedas organizadas por categorías (ej. DeFi, A16Z Portfolio).
* **Watchlist Personalizada:** Crea una lista de seguimiento personalizada añadiendo o eliminando criptomonedas con un solo clic a través de un intuitivo ícono de estrella.
* **Información Detallada:** Haz clic en cualquier criptomoneda para ver información detallada en una ventana modal, incluyendo su logo, descripción, enlaces sociales y estadísticas de mercado.
* **Visualización de Datos:** Gráficos interactivos que muestran estadísticas clave para cada categoría y datos detallados de capitalización de mercado para cada criptomoneda individual.
* **UI en Modo Oscuro:** Un tema oscuro elegante y moderno construido con Material-UI para una visualización cómoda.
* **Watchlist Persistente:** La lista de seguimiento del usuario se guarda en el `localStorage` del navegador, por lo que sus selecciones nunca se pierden.
* **Diseño Responsivo:** El layout se adapta perfectamente desde dispositivos de escritorio a móviles.

---

## Requisitos del Proyecto

Este proyecto fue desarrollado en base a los siguientes requisitos funcionales y no funcionales.

### Requisitos Funcionales (RF)

* [cite_start]**RF1:** El sistema debe permitir a los usuarios seleccionar un conjunto personalizado de criptomonedas para su seguimiento. [cite: 1]
* [cite_start]**RF2:** La aplicación debe mostrar información actualizada para cada criptomoneda, incluyendo precio, cambios porcentuales y volumen del mercado. [cite: 1]
* [cite_start]**RF3:** El sistema debe persistir datos a lo largo del tiempo. [cite: 2]
* **RF4:** Los usuarios deben poder visualizar datos a través de gráficos.
* **RF5:** La aplicación debe permitir buscar o filtrar criptomonedas para añadirlas a la lista de seguimiento.
* [cite_start]**RF6:** Los datos de las criptomonedas seleccionadas deben actualizarse de forma automática y periódica. [cite: 6]

### Requisitos No Funcionales (RNF)

* [cite_start]**RNF1:** La aplicación debe ser una Single-Page Application (SPA) con actualizaciones dinámicas sin recarga de página. [cite: 3]
* [cite_start]**RNF2:** La interfaz debe ser responsiva y adaptarse a diferentes dispositivos y resoluciones. [cite: 2, 12]
* [cite_start]**RNF3:** Todos los datos de mercado deben obtenerse de la API de CoinMarketCap. [cite: 5]
* [cite_start]**RNF4:** El backend debe ser desarrollado en **Node.js**. [cite: 4]
* [cite_start]**RNF5:** El frontend debe ser desarrollado con **React**. [cite: 4]
* [cite_start]**RNF6:** La persistencia de los datos debe ser manejada por una base de datos **MySQL**. 
* [cite_start]**RNF7:** El proyecto debe ser gestionado con Git y alojado en GitHub. [cite: 11]
* [cite_start]**RNF8:** Las actualizaciones de datos deben ser percibidas por el usuario como "en tiempo real". [cite: 1, 13]

---

## Tech Stack & Herramientas

* **Backend:** Node.js, Express.js, Axios, `mysql2`
* **Frontend:** React, Vite, Material-UI (MUI), Recharts
* **Base de Datos:** MySQL
* **API:** CoinMarketCap
* **Control de Versiones:** Git & GitHub

---

## Instalación y Puesta en Marcha

Sigue estos pasos para ejecutar el proyecto localmente.

### Prerrequisitos

* Node.js (v18 o superior recomendado)
* Servidor MySQL (ej. XAMPP, WAMP, o instalador standalone)
* Una clave de API gratuita de [CoinMarketCap](https://coinmarketcap.com/api/).

### 1. Configuración de la Base de Datos

1.  Ejecuta el script `script.sql` (proporcionado en la raíz del proyecto) en tu cliente de MySQL. Esto creará la base de datos `cryptoinvestment_db` y las tablas necesarias.

### 2. Configuración del Backend

1.  Navega al directorio del backend:
    ```sh
    cd backend
    ```
2.  Instala las dependencias:
    ```sh
    npm install
    ```
3.  Crea un archivo `.env` en el directorio `backend` y llénalo con tus credenciales:
    ```env
    # CoinMarketCap API
    COINMARKETCAP_API_KEY=tu_api_key_aqui
    COINMARKETCAP_BASE_URL=[https://pro-api.coinmarketcap.com](https://pro-api.coinmarketcap.com)

    # MySQL Database
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=tu_contraseña_mysql
    DB_NAME=cryptoinvestment_db
    ```
4.  Ejecuta el script seeder para poblar la base de datos con la lista de criptomonedas. Este es un paso que se realiza una sola vez.
    ```sh
    node seeder.mjs
    ```
5.  Inicia el servidor del backend:
    ```sh
    node index.js
    ```
    El servidor estará corriendo en `http://localhost:5000`.

### 3. Configuración del Frontend

1.  Abre una **nueva terminal** y navega al directorio del frontend:
    ```sh
    cd frontend
    ```
2.  Instala las dependencias:
    ```sh
    npm install
    ```
3.  Inicia el servidor de desarrollo del frontend:
    ```sh
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (u otro puerto si está ocupado).

---

## Proceso de Desarrollo

El proyecto fue construido de manera iterativa, siguiendo una progresión lógica desde el backend hacia el frontend.

1.  **Análisis y Diseño de la Base de Datos:** El proceso comenzó analizando los requisitos iniciales. Se diseñó un esquema simple pero efectivo de dos tablas en MySQL.

2.  **Desarrollo del Backend (Node.js):** Se construyó un servidor con Express.js para actuar como un proxy seguro entre el frontend y la API de CoinMarketCap. Se crearon endpoints para manejar categorías, cotizaciones en tiempo real e información detallada de las criptomonedas.

3.  **Desarrollo del Frontend (React):** La interfaz de usuario se construyó con React y Vite.
    * **UI y Theming:** Se eligió Material-UI (MUI) por su rica biblioteca de componentes y su robusto sistema de theming, que facilitó la implementación del modo oscuro.
    * **Arquitectura de Componentes:** La UI se dividió en componentes modulares como `CryptoTable`, `WatchlistTable`, `CategoryPills`, y `CryptoDetailModal`.
    * **Gestión de Estado:** Se utilizaron Hooks de React (`useState`, `useEffect`, `useMemo`) para toda la gestión de estado.
    * **Actualizaciones en Tiempo Real:** Se creó un hook personalizado (`useCryptoPolling`) para manejar la obtención periódica de precios, proporcionando un mecanismo centralizado y eficiente para las actualizaciones en vivo.

### Nota sobre la Evolución de la Base de Datos

> Al principio, pensamos en tener una gran lista de todas las criptomonedas en nuestra base de datos (la tabla `cryptocurrencies`) para hacer búsquedas rápidas. Sin embargo, cuando introdujimos la navegación por categorías, la aplicación evolucionó. Ahora, la forma principal de encontrar monedas es seleccionando una categoría y obteniendo esa lista directamente de la API. Esto hizo que nuestra tabla `cryptocurrencies` local quedara en segundo plano, casi como un respaldo que no se consulta activamente.
>
> Diseñamos la tabla `price_history` para cumplir el requisito de guardar un historial de precios. Cuando descubrimos que el plan gratuito de la API no nos daba acceso a datos históricos, esta tabla quedó completamente sin uso.
>
> En resumen: Para la funcionalidad que tiene la aplicación ahora mismo, la base de datos no es estrictamente necesaria (excepto por el seeder inicial). La aplicación funciona principalmente como una interfaz en tiempo real con la API de CoinMarketCap, y la única persistencia de datos crucial (la watchlist del usuario) la estamos manejando con `localStorage` en el navegador.