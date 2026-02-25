# Soil2Spoon

A full-stack e-commerce app for **Soil2Spoon** — authentic Indian spices, pastes, and powders. React (Vite) frontend with a Spring Boot backend. Supports products, cart, auth, checkout, saved addresses, and address validation (including optional Google Geocoding).

---

## Full summary

| Layer | Stack | Purpose |
|-------|--------|---------|
| **Frontend** | React 18, Vite 7, React Router v6, Tailwind CSS v4, Framer Motion | UI, routing, cart (Context), auth (JWT). Fetches products, categories, reviews, FAQs, and content from the backend when running. |
| **Backend** | Spring Boot 3, Java 21, JPA, PostgreSQL/H2, JWT, Mail | REST API: products, categories, reviews, auth, cart, orders, addresses, content (FAQs, policies, contact, site info). Optional Google Geocoding for address validation. |

**Data flow**

- **Products, categories, reviews** — Fetched from backend (`/api/products`, `/api/categories`, `/api/products/{id}/reviews`, etc.). Frontend uses `src/api/products.js` and shows loading/error states; no static product data when backend is used. Only logged-in users can submit reviews (`POST /api/products/{productId}/reviews`). Authors can edit their own review (`PUT /api/products/{productId}/reviews/{reviewId}`). Admins can delete any review (`DELETE /api/admin/products/{productId}/reviews/{reviewId}`).
- **Content** — FAQs, shipping/returns policies, contact info, and product-page site information are fetched from `/api/faqs` and `/api/content/*`. Frontend falls back to static data in `src/data/` if the API is unavailable.
- **Auth** — Login, signup, forgot/reset password via `/api/auth/*`. JWT in localStorage; token sent as `Authorization: Bearer <token>` for protected routes.
- **Cart** — Synced with backend when logged in (`GET/PUT /api/cart`). Checkout creates an order (`POST /api/orders`) with shipping address; cart is cleared after success.
- **Address validation** — Backend validates shipping address when saving an address or placing an order: required fields, Indian phone (10 digits), pincode (6 digits). If `GOOGLE_GEOCODING_API_KEY` is set, the backend calls Google Geocoding API to verify the address (must resolve in India; pincode must match). Frontend also validates phone and pincode format before submit.

**Environment**

- **Frontend:** Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:8081` to point at the backend.
- **Backend:** Reads env at runtime. Key vars: `JWT_SECRET` (production), `GOOGLE_GEOCODING_API_KEY` (optional, for address verification), `APP_FRONTEND_BASE_URL` and SMTP vars for password-reset emails. See [Environment variables](#environment-variables) and `backend/README.md`. Root `.env.example` documents `JWT_SECRET` and `GOOGLE_GEOCODING_API_KEY`; set them in your shell or deployment when running the backend.

**Quick start**

1. **Backend:** `cd backend && mvn spring-boot:run` (default dev profile, H2, port 8081).
2. **Frontend:** Copy `.env.example` to `.env`, set `VITE_API_URL=http://localhost:8081`, then `npm install && npm run dev` (e.g. http://localhost:5173).
3. **Dev users (when backend runs with dev profile):**
   - **Test user:** `test@soil2spoon.com` / `password123`
   - **Admin user:** `admin@soil2spoon.com` / `admin123` — full rights to add, edit, and delete products via the Admin page (`/admin`), and to delete any review on product detail pages. The admin user is created automatically on every dev startup if missing.

---

## Table of contents

- [Full summary](#full-summary)
- [Technologies used](#technologies-used)
- [Project structure](#project-structure)
- [Features](#features)
- [How the app flows](#how-the-app-flows)
- [Product data](#product-data)
- [Cart](#cart)
- [Auth and password reset](#auth-and-password-reset)
- [Getting started](#getting-started)
- [Using the backend API](#using-the-backend-api)
- [Environment variables](#environment-variables)
- [Routes](#routes)
- [Frontend wiring (summary)](FRONTEND_WIRING.md)

---

## Technologies used

| Technology | Purpose |
|------------|--------|
| **React 18** | UI components and state |
| **Vite 7** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling, CSS variables |
| **Framer Motion** | Animations (page enter, hover, stagger) |
| **Context API** | Global cart state (`CartContext`) |

- **Language:** JavaScript (JSX).
- **Data:** When the backend is running, the app uses `src/api/` to load products, categories, reviews, auth, cart, and content (FAQs, shipping/returns/contact policies, site information) from the API. Frontend falls back to static data in `src/data/` when content endpoints are missing or fail. See [Environment variables](#environment-variables).
- **Backend:** Spring Boot 3 (Java 21), JPA, JWT auth, PostgreSQL/H2, mail for password reset, content API (FAQs, policies, contact), optional Google Geocoding for address validation. See `backend/README.md` for API, configuration, and env vars.

---

## Project structure

```
soil2spoon/
├── index.html
├── package.json
├── vite.config.js
├── .env.example               # Copy to .env; set VITE_API_URL for backend
├── public/
│   ├── soil2spoon.svg
│   ├── soil2spoon_white.svg
│   └── images/                # Product images, textures
└── src/
    ├── main.jsx               # React root, BrowserRouter, AuthProvider, CartProvider, CSS
    ├── App.jsx                # Routes and Layout (lazy-loaded pages)
    ├── index.css              # Tailwind @theme, theme variables
    ├── theme-overrides.css    # Navbar/footer texture, buttons, section overrides
    ├── api/
    │   ├── client.js          # fetchApi, auth token, GET deduplication
    │   ├── auth.js            # login, signup, getMe, forgotPassword, resetPassword
    │   ├── products.js        # categories, products, featured, trending, reviews, createProductReview, updateProductReview (auth)
    │   ├── content.js         # getFaqs, getShippingPolicy, getReturnsPolicy, getContactInfo, getSiteInformation
    │   ├── admin.js           # createProduct, updateProduct, deleteProduct, deleteReview (admin only)
    │   ├── addresses.js       # getAddresses, createAddress, updateAddress (checkout)
    │   ├── orders.js          # createOrder
    │   └── cart.js            # getCart, setCart
    ├── context/
    │   ├── AuthContext.jsx    # user, login, signup, logout; token in localStorage
    │   └── CartContext.jsx    # cart, addToCart, updateQuantity; syncs with backend when logged in
    ├── data/
    │   ├── products.js        # fallback categories/products (when API unused)
    │   ├── reviews.js         # fallback getProductReviews
    │   ├── faqs.js            # fallback FAQs
    │   ├── siteInformation.js # defaultInformation, getProductInformation (fallback)
    │   └── searchKeywords.js  # client-side search expansion (ProductListing)
    ├── components/
    │   ├── Layout.jsx         # ScrollToTop, AnnouncementBar, Navbar, Outlet, Footer
    │   ├── ScrollToTop.jsx    # Scroll to top on route change
    │   ├── AnnouncementBar.jsx
    │   ├── Navbar.jsx         # Logo, search, nav links; mobile: hamburger + slide-out menu
    │   ├── Footer.jsx         # Logo, links, copyright
    │   ├── ProductCard.jsx    # Cart quantity controls (synced with cart)
    │   ├── ProductImage.jsx   # img with fallback
    │   ├── AddToCartToast.jsx # Toast when adding to cart
    │   └── FAQ.jsx            # FAQ section (e.g. Home)
    └── pages/
        ├── Home.jsx           # Hero, featured, categories, trending
        ├── ProductListing.jsx # Products grid, category/search
        ├── ProductDetail.jsx  # Gallery, quantity (+/− cart), Highlights, Information, Reviews (add/edit own, admin delete any)
        ├── Cart.jsx           # Cart list, quantity, summary
        ├── Checkout.jsx       # Checkout flow (when backend)
        ├── Login.jsx          # Sign in; “Forgot password?” modal
        ├── Signup.jsx         # Register
        ├── ResetPassword.jsx  # Set new password (?token=... from email)
        ├── Dashboard.jsx     # Account / orders
        ├── Admin.jsx         # Admin product list, add/edit/delete (role ADMIN only)
        └── NotFound.jsx      # 404
```

---

## Features

- **Home:** Hero banner, featured products, shop-by-category tiles, trending products. Clicking Home or the logo scrolls to the top.
- **Products:** Listing with category filter and search (when backend); product cards show “Add to cart” or, when in cart, quantity control (trash, quantity, plus) synced with global cart.
- **Product detail:** Sticky left column (gallery); right column with product info. **Quantity** starts at 0 (cart quantity); + and − update the cart directly. “Add to cart” and “Buy now” (no price in label). **Highlights** (brand, type, dietary, features, flavour, ingredients, allergen, weight, unit, packaging). **Information** (disclaimer, customer care, seller, manufacturer, origin, shelf life); when set in admin, per-product information overrides the default. **Customer reviews** (list + “Write a review” form when logged in; “Log in to add a review” when not). Only authenticated users can submit reviews. Authors see **Edit** on their own review; admins see **Delete** on every review (with confirmation). Review count and rating are derived from the loaded reviews list (no fake seed counts).
- **Cart:** Global cart in context; navbar badge; cart page with list and summary. When logged in and backend is used, cart is persisted on the server; otherwise in-memory.
- **Checkout:** Delivery address (saved addresses or new); validation for name, Indian phone (10 digits), pincode (6 digits). Optional: backend validates address via Google Geocoding when `GOOGLE_GEOCODING_API_KEY` is set. Payment method selection; place order creates order and clears cart.
- **Auth:** Login, Sign up; JWT in localStorage; Sign in / Logout and user name in navbar (and in mobile menu).
- **Admin:** Users with role `ADMIN` see an **Admin** link in the navbar and can open `/admin` to list, add, edit, and delete products. Add/Edit product form includes core fields (name, slug, price, category, image, description, net qty, featured, trending) plus **Highlights** (brand, product type, dietary, flavour, key features, ingredients, allergen, weight, unit, packaging) and **Information** (disclaimer, customer care, seller, manufacturer, origin, shelf life). Modal is scrollable. On product detail pages, admins can **delete any review** (Delete link with confirmation). Dev admin: `admin@soil2spoon.com` / `admin123` (created automatically when running with dev profile if missing).
- **Forgot password:** On Login, “Forgot password?” opens a modal; user enters email → backend sends reset link by email. User opens link → **Reset password** page (`/reset-password?token=...`) to set new password. Requires backend mail config in production (see `backend/README.md`).
- **Navbar:** Desktop: logo, search, Home, Products, Cart, **Admin** (only when user has role ADMIN), Sign in/Account, Cart icon. **Mobile:** logo, hamburger (opens slide-out menu with Home, Products, Cart, Admin if admin, Sign in/Logout), search icon, account, cart. Logo and actions sized so the full bar stays visible on small screens.

---

## How the app flows

1. **Entry:** `index.html` → `main.jsx` → `BrowserRouter` → `AuthProvider` → `CartProvider` → `App`.
2. **Layout:** `App.jsx` uses a single layout route `path="/"` with `element={<Layout />}`. Child routes render in `<Outlet />`. Layout = ScrollToTop, AnnouncementBar, Navbar, main (Outlet), Footer.
3. **Navigation:** React Router `<Link>`; `ScrollToTop` scrolls to top on pathname change. Home and logo links also scroll to top when clicked.
4. **Data:** When `VITE_API_URL` is set, products, categories, and reviews come from the backend (`src/api/products.js`). FAQs, shipping/returns/contact content, and product-page site info come from `/api/faqs` and `/api/content/*` with fallbacks in `src/data/`. Cart and auth use the backend when the user is logged in.

---

## Product data

When the backend is used (`VITE_API_URL` set), products, categories, and reviews are loaded from the API (`/api/products`, `/api/categories`, `/api/products/featured`, etc.). Content (FAQs, shipping/returns/contact, site information) is loaded from `/api/faqs` and `/api/content/*` with fallbacks below.

**Fallback / static data (`src/data/`)**

- **products.js** — `categories`, `products`, `getProductBySlug`, `getFeaturedProducts`, `getTrendingProducts`, `getProductsByCategory` (used when API is not configured or as fallback).
- **reviews.js** — `getProductReviews(productId)` for the product detail reviews section.
- **faqs.js** — `faqs` array for Home and FAQs page when content API fails or is unset.
- **siteInformation.js** — `defaultInformation`, `getProductInformation(product)` for the product Information card.
- **searchKeywords.js** — search expansion and matching for client-side filter on ProductListing.

---

## Cart

- **CartContext** holds an array of items: `id`, `name`, `slug`, `price`, `image`, `fallbackImage`, `quantity`.
- **Actions:** `addToCart(product, quantity?)`, `updateQuantity(id, quantity)`, `removeFromCart(id)`, `clearCart()`.
- **Derived:** `cartTotal`, `cartCount` (navbar badge and Cart page).
- **ProductCard:** When the product is in cart, shows quantity control (remove, quantity, add one) synced with cart.
- **ProductDetail:** Quantity display is cart quantity for that product (0 if not in cart); + and − call `addToCart` / `updateQuantity`.
- **Persistence:** When `VITE_API_URL` is set and user is logged in, cart is loaded from and saved to the backend (`GET/PUT /api/cart`). Otherwise in-memory only.

---

## Auth and password reset

- **AuthContext** provides `user`, `login`, `signup`, `logout`. Token is stored in localStorage and sent as `Authorization: Bearer <token>` when `VITE_API_URL` is set.
- **Login:** Email + password; “Forgot password?” opens a modal. Submitting the modal calls `POST /api/auth/forgot-password` with email; backend sends an email with a reset link (in production; in dev without SMTP the link is only logged).
- **Reset link** points to the frontend: `{APP_FRONTEND_BASE_URL}/reset-password?token=...`. User sets a new password on **ResetPassword** page; frontend calls `POST /api/auth/reset-password` with `token` and `newPassword`. Token expires in 1 hour.
- Backend mail and frontend URL are configured via env vars (see `backend/README.md` → Configuration and environment).

---

## Getting started

### Prerequisites

- Node.js (18+)
- npm (or yarn/pnpm)

### Install and run

```bash
npm install
npm run dev      # Dev server (e.g. http://localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

### Customise content

- **Products:** When using the backend, use the Admin page to add/edit products (including highlights and information). For static data, edit `src/data/products.js` (add/change products, categories, highlights).
- **Reviews:** Edit `src/data/reviews.js` (`reviewsByProductId`). When using the API, only logged-in users can submit reviews from the product detail page.
- **Information card:** Edit `src/data/siteInformation.js` (defaultInformation). When using the API, per-product information can be set in Admin (add/edit product); the product detail page uses it when present.
- **Product images:** Place files in `public/images/products/` or use image URLs (e.g. Cloudinary); set `image` / `images` / `fallbackImage` in Admin or in `products.js` for static data.

---

## Using the backend API

To use the React app with the Spring Boot backend:

1. **Start the backend** from the `backend/` directory (e.g. `mvn spring-boot:run`). It runs at `http://localhost:8081` by default.
2. **Set the API base URL** for the frontend: copy `.env.example` to `.env` in the project root and set `VITE_API_URL=http://localhost:8081`.
3. **Start the frontend:** `npm run dev` (e.g. http://localhost:5173).

**Backend API summary**

- **Public:** Health, categories, products (list, by slug, featured, trending), product reviews list (`GET /api/products/{productId}/reviews`), auth (signup, login, forgot/reset password), FAQs (`/api/faqs`), content (`/api/content/shipping`, `/returns`, `/contact`, `/site-information`).
- **Protected (JWT):** Cart, orders, addresses, `GET /api/auth/me`, create review (`POST /api/products/{productId}/reviews` — body: `rating`, `text`), edit own review (`PUT /api/products/{productId}/reviews/{reviewId}` — body: `rating`, `text`). Checkout sends shipping address and payment method; backend validates address (phone, pincode; optional Google Geocoding if `GOOGLE_GEOCODING_API_KEY` is set).
- **Admin only (`/api/admin/**`):** `POST /api/admin/products` (create), `PUT /api/admin/products/{id}` (update), `DELETE /api/admin/products/{id}` (delete), `DELETE /api/admin/products/{productId}/reviews/{reviewId}` (delete any review). Create/update accept full product payload including `highlights` and `information`. Requires user with role `ADMIN`. Dev admin: `admin@soil2spoon.com` / `admin123`.

The app loads products, categories, and reviews from the API. Auth (login, signup, forgot/reset password) uses the backend; JWT is stored in `localStorage` and sent with protected requests. Cart is synced with the backend when the user is logged in; orders are created via `POST /api/orders`. See **[FRONTEND_WIRING.md](FRONTEND_WIRING.md)** for a concise implementation summary.

---

## Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `VITE_API_URL` | Frontend (`.env` in project root) | Backend base URL (e.g. `http://localhost:8081`). If unset, app uses mock data and no auth/cart API. |
| `JWT_SECRET` | Backend (env or `.env` loaded by your process) | JWT signing secret (min 32 bytes). Required in production. See root `.env.example`. |
| `GOOGLE_GEOCODING_API_KEY` | Backend (env) | Optional. If set, shipping addresses are validated via Google Geocoding (pincode, city, state). See root `.env.example`. |
| Other backend vars | Backend (see `backend/README.md`) | `APP_FRONTEND_BASE_URL`, `SPRING_MAIL_*` for production; `SPRING_PROFILES_ACTIVE` for profile. |

Copy `.env.example` to `.env` for the frontend; set backend vars in your shell or deployment when running the backend.

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Hero, featured, categories, trending |
| `/products` | ProductListing | All products, filter `?category=...`, optional `?search=...` |
| `/products/:slug` | ProductDetail | Gallery, quantity (+/− cart), Highlights, Information, Reviews (add/edit own, admin delete any) |
| `/cart` | Cart | Cart list, quantity controls, order summary |
| `/checkout` | Checkout | Checkout flow (when backend); place order |
| `/login` | Login | Sign in; “Forgot password?” modal |
| `/signup` | Signup | Register |
| `/reset-password` | ResetPassword | Set new password (query: `?token=...` from email) |
| `/dashboard` | Dashboard | Account / orders |
| `/admin` | Admin | Product list, add/edit/delete (admin role only; redirects if not admin) |
| `/faqs` | FAQs | FAQ accordion (from API or fallback) |
| `/shipping` | Shipping | Shipping policy (from API or fallback) |
| `/returns` | Returns | Returns & refunds (from API or fallback) |
| `/contact` | Contact | Contact info and message form (from API or fallback) |
| `*` | NotFound | 404 and link home |
