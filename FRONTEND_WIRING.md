# Frontend wiring — summary

This document summarizes how the React frontend is wired to the Spring Boot backend so you can understand the flow and where each piece lives.

---

## 1. API layer

| File | Purpose |
|------|--------|
| **`src/api/client.js`** | `getBaseUrl()` reads the API URL from `VITE_API_URL`. `fetchApi(path, options)` calls the backend and automatically adds `Authorization: Bearer <token>` when a token is present. The token is provided by AuthContext via `setAuthTokenGetter()`. |
| **`src/api/products.js`** | `getCategories()`, `getProducts(params)` (paginated), `getProductBySlug(slug)`, `getFeaturedProducts()`, `getTrendingProducts()`, `getProductReviews(productId)`. |
| **`src/api/auth.js`** | `login(email, password)`, `signup(email, password, name)`, `getMe()`. |
| **`src/api/cart.js`** | `getCart()` — GET /api/cart (auth required). `setCart(items)` — PUT /api/cart with `[{ productId, quantity }, ...]` (auth required). |
| **`src/api/orders.js`** | `getOrders()` — GET /api/orders (auth required), returns list of orders. `createOrder()` — POST /api/orders (auth required); backend creates order from server cart and clears server cart. |

---

## 2. Auth

| Item | Description |
|------|--------------|
| **`src/context/AuthContext.jsx`** | Holds **token** and **user** state. Exposes **login**, **signup**, **logout** and registers the token getter with the API client. Token is stored in `localStorage` and restored on page load; then **getMe()** is called to load the current user. |
| **`main.jsx`** | The app is wrapped with **AuthProvider** (outside **CartProvider**) so auth state is available everywhere. |

---

## 2b. Cart sync with backend

| Item | Description |
|------|--------------|
| **`src/context/CartContext.jsx`** | Uses **useAuthState()** to get `user`. When **user is set**, loads cart from **GET /api/cart** once and dispatches **SET_CART** so local cart matches server. When **cart** or **user** changes and the change was from the user (add/update/remove/clear), calls **PUT /api/cart** with the current cart so server stays in sync. Uses a **skipSync** ref to avoid syncing immediately after loading from API. **SET_CART** reducer action replaces the whole cart (used when loading from API). When user logs out, local cart is kept (guest cart); when user logs in again, server cart replaces local. |

---

## 3. Pages

| Page | What it does |
|------|----------------|
| **Home** | Fetches featured products, trending products, and categories from the API. Shows loading and error state; layout unchanged. |
| **ProductListing** | Fetches categories once and products (with optional category, size 100) from the API. Search is done **client-side** on the fetched list. Loading and error state. |
| **ProductDetail** | Fetches product by slug and reviews by product id from the API. Loading and error state. Still uses `getProductInformation()` from `siteInformation.js` for the info card. |
| **Login** | Calls **login()** from AuthContext with email and password. On success, navigates to `/`. Shows API error message on failure. Submitting state while the request is in progress. |
| **Signup** | Calls **signup()** from AuthContext with email, password, and name. On success, navigates to `/`. Shows API error message on failure. Password min length 6 to match backend. Submitting state. |
| **Cart** | When **logged in**: shows **Place order** button. On click, navigates to **/checkout**. When **not logged in**: **Sign in to place order** link to `/login`. Cart synced with backend when logged in. “Order placed successfully.” |
| **Checkout** | Requires login. Delivery address form (name, phone, address, city, state, pincode). Payment options (COD, Card, UPI, Net Banking). **Place order** sends address + paymentMethod to createOrder(), then clears cart and navigates to `/dashboard`. |
| **Dashboard** | When **not logged in**: shows "Sign in to view your orders and account" with link to `/login`. When **logged in**: fetches **getOrders()** (GET /api/orders) and shows **Order history** — list of orders with id, date, status, total, and line items. Loading and error state. Quick actions: Continue shopping, View cart. |

---

## 4. Navbar

- **If user is set:** Shows the user’s name and a **Logout** button. Logout clears the token and navigates to `/`.
- **If user is not set:** Shows the **Sign in** link as before.

---

## 5. Config and docs

| Item | Description |
|------|--------------|

| **`.env.example`** | Example env file with `VITE_API_URL=http://localhost:8080`. 
Copy to `.env` and adjust if needed. |

| **`.env.example`** | Example env file with `VITE_API_URL=http://localhost:8081`. Copy to `.env` and adjust if needed. |
| **Root README** | Section **“Using the backend API”** explains how to start backend, set `.env`, and start frontend. Routes table and technologies/data description updated for API usage. |
| **backend/IMPLEMENTATION_SUMMARY.md** | **“Frontend wiring”** section added to describe how the React app calls the backend. |

---

## Checkout + cart sync (full summary)

Use this section when you need a single reference for what was implemented for checkout and cart sync.

**1. API**
- **`src/api/cart.js`** — `getCart()` (GET /api/cart), `setCart(items)` (PUT /api/cart with `[{ productId, quantity }, ...]`).
- **`src/api/orders.js`** — `createOrder()` (POST /api/orders).

**2. CartContext**
- **Auth:** Uses `useAuthState()` so cart can react to login/logout.
- **Reducer:** New **SET_CART** action to replace the whole cart (used when loading from API).
- **Load from API:** When `user` is set, calls `getCart()` once and dispatches **SET_CART** so local cart matches the server. On logout, `user` is cleared and local cart is left as-is (guest cart).
- **Sync to API:** When `cart` or `user` changes, if the change came from the user (add/update/remove/clear), calls `setCart()` with the current cart. A **skipSync** ref avoids calling PUT right after loading from API.

**3. Cart page**
- **Logged in:** **Place order** button calls `createOrder()`. On success, clears the cart and shows “Order placed successfully.”
- **Not logged in:** **Sign in to place order** link to `/login`.
- **Errors:** Order errors (e.g. “Cart is empty”) are shown under the button. **Placing order…** while the request is in progress.

**4. FRONTEND_WIRING.md**
- Documented `api/cart.js`, `api/orders.js`, cart sync (section 2b), Cart page checkout, and removed “cart/checkout not wired”; only “Dashboard / order history” is left as not wired.

**Flow**
- **Guest:** Cart is only in memory; **Place order** is replaced by “Sign in to place order.”
- **Logged in:** Cart loads from GET /api/cart on login; add/update/remove/clear are sent with PUT /api/cart. **Place order** → POST /api/orders → success → cart cleared locally (and already cleared on the server by the backend).

**How to test:** Sign in, add items, open cart (should match server), and click **Place order**.

---

## How to run end-to-end

1. **Backend:** From the project root, run:
   ```bash
   cd backend && mvn spring-boot:run
   ```
   Uses the **dev** profile (H2 + seed data). API is at `http://localhost:8080`.

   Uses the **dev** profile (H2 + seed data). API is at `http://localhost:8081`.


2. **Frontend:** Copy `.env.example` to `.env`, ensure `VITE_API_URL=http://localhost:8081`, then run:
   ```bash
   npm run dev
   ```
   Frontend is at `http://localhost:5173`.

3. Open **http://localhost:5173**. Home loads products and categories from the API. Use **Sign in** with `test@soil2spoon.com` / `password123`; after login the Navbar shows the user name and **Logout**.

---

## What is not wired yet

- Nothing critical; core flow (products, auth, cart, checkout, order history) is wired. You can add more later (e.g. addresses, payment methods, order detail page).
