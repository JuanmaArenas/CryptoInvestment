# CryptoInvestment Tracker 📈

A simple and modern web application built for the "CryptoInvestment" group, allowing them to track a custom portfolio of cryptocurrencies in real-time. This project provides a consolidated, dynamic, single-page view of market data, replacing the need for scattered spreadsheets and websites.



## Features

* **Real-Time Data:** View live price updates for selected cryptocurrencies every 30 seconds.
* **Category-Based Browsing:** Discover and explore cryptocurrencies organized by categories (e.g., DeFi, A16Z Portfolio).
* **Personalized Watchlist:** Create a custom watchlist by adding or removing cryptocurrencies with a single click.
* **Detailed Information:** Click on any cryptocurrency to view detailed information, including its logo, description, social links, and market statistics in a modal window.
* **Data Visualization:** Interactive charts display key statistics for each category and detailed market cap data for each individual cryptocurrency.
* **Dark Mode UI:** A sleek, modern dark theme built with Material-UI for comfortable viewing.
* **Persistent Watchlist:** The user's watchlist is saved in the browser's `localStorage`, so their selections are never lost.
* **Responsive Design:** The layout adapts seamlessly from desktop to mobile devices.

---

## Project Requirements

This project was developed based on the following functional and non-functional requirements.

### Functional Requirements (RF)

* **RF1:** The system must allow users to select a custom set of cryptocurrencies for tracking.
* **RF2:** The application must display updated information for each cryptocurrency, including price, percentage changes, and market volume.
* **RF3:** The system must persist data over time (achieved by populating a local database with a master list of cryptos).
* **RF4:** Users must be able to visualize data through charts.
* **RF5:** The application must allow searching or filtering cryptocurrencies to add them to the watchlist.
* **RF6:** The data for the selected cryptocurrencies must update automatically and periodically.

### Non-Functional Requirements (RNF)

* **RNF1:** The application must be a Single-Page Application (SPA) with dynamic updates and no page reloads.
* **RNF2:** The interface must be responsive and adapt to different devices and resolutions.
* **RNF3:** All market data must be obtained from the CoinMarketCap API.
* **RNF4:** The backend must be developed in **Node.js**.
* **RNF5:** The frontend must be developed using **React**.
* **RNF6:** Data persistence must be handled by a **MySQL** database.
* **RNF7:** The project must be managed with Git and hosted on GitHub.
* **RNF8:** Data updates must be perceived by the user as "real-time".

---

## Tech Stack & Tools

* **Backend:** Node.js, Express.js, Axios, `mysql2`
* **Frontend:** React, Vite, Material-UI (MUI), Recharts
* **Database:** MySQL
* **API:** CoinMarketCap
* **Version Control:** Git & GitHub

---

## Project Setup & Installation

Follow these steps to run the project locally.

### Prerequisites

* Node.js (v18 or higher recommended)
* MySQL Server (e.g., via XAMPP, WAMP, or standalone installer)
* A free API Key from [CoinMarketCap](https://coinmarketcap.com/api/).

### 1. Database Setup

1.  Run the `script.sql` file provided in the root directory in your MySQL client. This will create the `cryptoinvestment_db` database and the necessary tables.

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```sh
    cd backend
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and populate it with your credentials:
    ```env
    # CoinMarketCap API
    COINMARKETCAP_API_KEY=your_api_key_here
    COINMARKETCAP_BASE_URL=[https://pro-api.coinmarketcap.com](https://pro-api.coinmarketcap.com)

    # MySQL Database
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=cryptoinvestment_db
    ```
4.  Run the seeder script to populate the database with the list of all available cryptocurrencies. This is a one-time step.
    ```sh
    node seeder.mjs
    ```
5.  Start the backend server:
    ```sh
    node index.js
    ```
    The server will be running on `http://localhost:5000`.

### 3. Frontend Setup

1.  Open a **new terminal** and navigate to the frontend directory:
    ```sh
    cd frontend
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Start the frontend development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

---

## Development Process Overview

The project was built iteratively, following a logical progression from backend to frontend.

1.  **Analysis and Database Design:** The process began by analyzing the initial requirements to define the project's scope. A simple but effective two-table schema was designed in MySQL to store a master list of cryptocurrencies and their historical price data (though the historical data feature was later scoped out due to API limitations).

2.  **Backend Development:** An Express.js server was built to act as a proxy between the frontend and the CoinMarketCap API. This approach protects the API key and allows for better control over the data. Endpoints were created to:
    * Fetch all crypto categories (`/api/categories`).
    * Fetch the coins within a specific category (`/api/categories/:id`).
    * Fetch detailed metadata for a specific coin (`/api/cryptos/info/:id`).
    * Fetch real-time price quotes for multiple coins (`/api/cryptos/quotes`).

3.  **Frontend Development:** The user interface was built with React and Vite for a fast development experience.
    * **UI Library:** Material-UI (MUI) was chosen for its rich set of pre-built components and its robust theming system, which allowed for the easy implementation of the dark mode.
    * **Component Architecture:** The UI was broken down into modular components (`CryptoTable`, `WatchlistTable`, `CategoryPills`, `CategoryCharts`, `CryptoDetailModal`) to keep the code clean and maintainable.
    * **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`) were used to manage all application state, from the fetched data to the user's watchlist.
    * **Real-Time Updates:** A custom hook (`useCryptoPolling`) was created to handle the periodic fetching of price data, providing a centralized and efficient mechanism for live updates across the application.