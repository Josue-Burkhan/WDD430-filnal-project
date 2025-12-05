# GenialMarketHub - Artisan Marketplace

**Author:** Josue A. Bailon Velasquez  
**Course:** WDD430 - Web Full Stack Development (Final Project)

## Project Overview

GenialMarketHub is a full-featured e-commerce marketplace platform designed to connect artisans (sellers) with buyers. It allows sellers to effectively manage their business through a comprehensive dashboard, while providing buyers with a seamless shopping experience for unique, handcrafted products.

This application demonstrates full-stack web development skills, integrating a modern React-based frontend with a robust Node.js/Express backend and a MySQL database.

## Key Features

### For Sellers (Dashboard)
-   **Comprehensive Overview**: Real-time sales statistics (hourly, daily, monthly), order summaries, and stock alerts.
-   **Product Management**: Create, read, update, and delete (CRUD) products with image support.
-   **Order Management**: View and manage incoming orders, update shipping status.
-   **Profile Customization**:
    -   Upload and update profile avatar and banner images.
    -   Customize public bio, location, and tags.
    -   Real-time UI updates across the dashboard.
-   **Search**: Functional dashboard search to quickly find products.

### For Buyers & Public
-   **Public Seller Profiles**: View seller ratings, bio, and complete product catalog.
-   **Interactive Features**:
    -   **Rate Sellers**: Logged-in users can rate sellers (1-5 stars).
    -   **Share Profiles**: Easily share seller profiles with a single click.
-   **Shopping Experience**: Browse products, view details, and (simulated) cart/checkout flows.

## Technology Stack

### Frontend
-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Components**: Custom UI components (Toast, Cards, Modals)
-   **Data Visualization**: Recharts (for sales analytics)

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MySQL (relational data model)
-   **ORM/Driver**: mysql2 (with direct SQL queries for performance)
-   **Authentication**: JSON Web Tokens (JWT) & bcryptjs
-   **File Storage**: Multer (local storage for avatars/banners)

## How It Works

1.  **Architecture**: The app follows a client-server architecture. The Next.js frontend fetches data from the Express REST API.
2.  **Database**: A normalized MySQL database stores users (buyers/sellers), products, orders, reviews, and profiles.
3.  **Real-time Interactions**:
    -   **Sales Data**: Aggregated on-the-fly via advanced SQL queries.
    -   **Profile Updates**: handled via `FormData` uploads, processed by Multer, and synchronized across the UI using custom events.

## Getting Started

1.  **Configure Environment**:
    -   Ensure MySQL is running.
    -   Set up `.env` with database credentials and JWT secret.
    -   Run `schema.sql` to initialize the database.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Backend Server**:
    Ensure the Express server (typically `server/index.ts`) is running concurrently (often handled via `concurrently` in `npm run dev` or a separate terminal).

---
*Built with ❤️ by Josue A. Bailon Velasquez*
