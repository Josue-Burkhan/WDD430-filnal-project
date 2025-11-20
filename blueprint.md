# Handcrafted Haven - Blueprint

## Overview

Handcrafted Haven is a vibrant online marketplace designed to connect talented artisans with a discerning audience that values unique, handmade goods. Our platform empowers artisans to showcase their creations, manage their inventory, and build their brand, while providing customers with a curated selection of high-quality, handcrafted products.

## Project Outline

### Phase 1: Initial Setup and API Integration

*   **Framework:** Next.js with TypeScript
*   **Styling:** Tailwind CSS for a modern, responsive design.
*   **API Layer:** An `api.ts` module using `axios` for all backend communication.
*   **Core Components:**
    *   `Header.tsx`: Global navigation.
    *   `Footer.tsx`: Consistent site footer.
    *   `layout.tsx`: Root layout for the application.
    *   `page.tsx`: The main landing page.

### Phase 2: Core Marketplace Features

*   **Product Listing Page (`/products`):
    *   Fetches and displays a grid of all available products.
    *   `ProductCard.tsx` component for individual product representation.
    *   Filtering by category and price range.
    *   Sorting by product name and price.
*   **Product Details Page (`/products/[id]`):
    *   Dynamic route to display detailed information for a single product.
    *   Image gallery, description, pricing, and artisan information.
    *   Review section with a form for submitting new reviews.
*   **User Authentication Pages:
    *   `/login`: User sign-in form.
    *   `/register`: User sign-up form.

### Phase 3: User Authentication and Authorization

*   **Auth Context (`lib/auth.tsx`):
    *   `AuthProvider` to manage user state globally.
    *   `useAuth` hook for easy access to user data and auth functions.
    *   JWT decoding (`jwt-decode`) to extract user information from the token.
*   **Protected Routes:
    *   `withAuth.tsx` Higher-Order Component (HOC) to protect routes.
    *   Redirects unauthenticated users to the login page.
*   **Artisan Dashboard (`/dashboard`):
    *   A protected page for artisans to manage their products.
    *   Displays a personalized welcome message.
*   **Dynamic Header:**
    *   Navigation links change based on the user's authentication status.
    *   Shows links to Dashboard and Logout when logged in.
    *   Shows links to Login and Register when logged out.

### Phase 4: Final Touches

*   **Visual Polish:** Final review of all pages for consistent and appealing design.
*   **Linting:** Run `npm run lint -- --fix` to ensure code quality.
*   **Deployment:** Deploy the application to a production environment.

### Phase 5: UI/UX Refinement & Final Polish

*   **Authentication System Refactor:**
    *   Introduced a `loading` state to `AuthProvider` to gracefully handle the initial authentication check, preventing UI flickers.
    *   Refactored the `withAuth` HOC to use the `loading` state, showing a loading indicator and moving the redirection logic into a `useEffect` for cleaner side-effect handling.
*   **Homepage Redesign:**
    *   Converted the homepage into a Server Component to fetch data server-side, improving performance.
    *   Added a **"Featured Products"** section by creating a `getFeaturedProducts` function in `lib/api.ts`.
    *   Designed and implemented a **"Value Proposition"** section using icons from `react-icons` to highlight the key benefits of the platform (Quality, Support for Artisans, Secure Shopping).
    *   Performed a general visual overhaul, improving typography, color scheme, and spacing for a more modern and professional look.
*   **Header Component Redesign:**
    *   Modernized the header's style with improved spacing and a subtle box-shadow.
    *   Implemented a user dropdown menu for authenticated users, providing access to the dashboard and logout functionality in a clean, organized manner.
    *   Used `react-icons` to add visual cues to the user menu.
*   **Code Quality:**
    *   Resolved all outstanding ESLint errors, particularly the `set-state-in-effect` rule, ensuring the codebase adheres to best practices.

### Phase 6: Artisan Dashboard & Product Management (CRUD)

*   **Dashboard Overhaul (`/dashboard`):
    *   Transformed the static welcome page into a dynamic product management hub.
    *   Fetches and displays a list of products belonging to the currently logged-in artisan.
    *   Implemented a `handleDelete` function to allow artisans to delete their products directly from the dashboard, with a confirmation step.
    *   The UI now features a clean, table-based layout to display products, including their name, price, and action buttons (Edit, Delete).
    *   Includes a prominent "Add New Product" button.
*   **Add Product Page (`/dashboard/add-product`):
    *   Created a new, protected route for adding products.
    *   Built a comprehensive form using `react-hook-form` for robust, client-side validation.
    *   The form captures essential product details: name, description, price, category, stock, and image URL.
    *   Upon successful submission, the `createProduct` API endpoint is called, and the user is redirected back to the main dashboard.
*   **Edit Product Page (`/dashboard/edit-product/[id]`):
    *   Implemented a dynamic, protected route for editing existing products.
    *   On page load, it fetches the specific product's data using `getProductById`.
    *   The form, also built with `react-hook-form`, is pre-populated with the fetched data, allowing for easy modification.
    *   On submission, the `updateProduct` API endpoint is called, and the user is redirected back to the dashboard.

### Phase 7: Shopping Cart & Checkout Experience

*   **Cart Context (`lib/cart.tsx`):
    *   Created a `CartContext` to manage the shopping cart's state across the entire application, persisting the data in `localStorage`.
    *   `CartProvider` makes the context available to all components.
    *   The context exposes functions like `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart`, along with state variables like `cartItems`, `cartCount`, and `totalPrice`.
*   **Global UI Integration:**
    *   Wrapped the root layout in `app/layout.tsx` with the `CartProvider` to enable global state access.
    *   Modified `components/Header.tsx` to include a dynamic shopping cart icon that displays the current number of items in the cart (`cartCount`) and links to the cart page.
*   **Cart Page (`/cart`):
    *   Created a dedicated page at `/cart` for a comprehensive cart view.
    *   Lists all items in the cart with their details (image, name, price, quantity).
    *   Allows users to adjust the quantity of each item or remove items individually.
    *   Features a "Clear Cart" button to empty the entire cart.
    *   Displays a real-time "Order Summary" with the subtotal and total price.
    *   Includes a "Proceed to Checkout" button that navigates to the checkout page.
*   **Add to Cart Functionality:**
    *   Updated `components/ProductCard.tsx` to include an "Add to Cart" button, allowing users to add products directly from product listing pages.
    *   Enhanced the Product Details Page (`/products/[id]/page.tsx`) with a prominent "Add to Cart" button and a redesigned image gallery for a better user experience.
*   **Checkout Flow:**
    *   **Checkout Page (`/checkout`):** Created a protected route, accessible only to logged-in users. It features a multi-step form for a smooth user experience, collecting shipping and payment information separately. An order summary is persistently displayed.
    *   **Order Simulation:** Upon final submission, the form simulates an order placement, clears the user's cart, and redirects them to a success page.
    *   **Order Success Page (`/order-success`):** A dedicated page to confirm the successful order, providing positive feedback to the user and a link to continue shopping.
