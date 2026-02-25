# Soil2Spoon Backend — Implementation Summary

This document summarizes what has been implemented in each section of the backend. Use it to get a quick idea of the structure and where each feature lives.

---

## 1. Project setup & run

**Purpose:** Spring Boot app with Maven, embedded Tomcat, and base configuration.

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Build | `pom.xml` | Spring Boot 3.2, Web, JPA, Security, Validation, PostgreSQL, H2, JWT (jjwt), Lombok |
| Main class | `Soil2SpoonApplication.java` | Entry point; starts the app |
| Config | `application.properties`, `application-dev.properties` | Port, JPA, JWT placeholders; dev: H2, CORS origins |
| CORS | `config/WebConfig.java` | Allows frontend origin (e.g. `http://localhost:5173`) for `/api/**` |
| Security (base) | `config/SecurityConfig.java` | Stateless session; public vs protected routes; JWT filter (added in Auth section) |
| .gitignore | `backend/.gitignore` | Ignores `target/`, IDE files, env files |

**How to run:** `mvn spring-boot:run` from `backend/` or run `Soil2SpoonApplication` from IntelliJ. Default profile: `dev`.

---

## 2. Health

**Purpose:** Simple endpoint to check that the API is up.

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Controller | `controller/HealthController.java` | `GET /api/health` |
| Response | — | `{ "status": "UP", "service": "soil2spoon-backend" }` |

**Endpoint:** `GET /api/health` (no auth).

---

## 3. Categories

**Purpose:** Expose product categories (e.g. Spices, Pastes, Powders) for the frontend.

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Entity | `domain/Category.java` | `id` (String), `name`, `icon` |
| Repository | `repository/CategoryRepository.java` | `JpaRepository<Category, String>` |
| DTO | `dto/CategoryResponse.java` | `id`, `name`, `icon` |
| Service | `service/CategoryService.java` | `findAll()` |
| Controller | `controller/CategoryController.java` | `GET /api/categories` |
| Seed data | `config/DevDataLoader.java` | Seeds 3 categories (spices, pastes, powders) when profile is `dev` |

**Endpoint:** `GET /api/categories` (no auth). Returns array of `{ id, name, icon }`.

---

## 4. Products

**Purpose:** Product catalog: list, filter by category, get by slug, featured/trending; product shape matches frontend (including highlights).

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Entities | `domain/Category.java`, `domain/Product.java`, `domain/ProductHighlights.java` | Category; Product (slug, price, category, images, highlights); embeddable ProductHighlights |
| Repositories | `repository/CategoryRepository.java`, `repository/ProductRepository.java` | Categories; products by slug, featured, trending, category, pagination |
| DTOs | `dto/CategoryResponse.java`, `dto/ProductResponse.java`, `dto/ProductHighlightsResponse.java` | Category; full product + nested highlights (id as string, category as id) |
| Services | `service/CategoryService.java`, `service/ProductService.java` | Categories; products list (with optional category + page), featured, trending, by slug |
| Controller | `controller/ProductController.java` | `GET /api/products`, `/api/products/featured`, `/api/products/trending`, `/api/products/{slug}` |
| Seed data | `config/DevDataLoader.java` | Seeds 4 sample products (Garlic Paste, Garlic Ginger Paste, Garlic Powder, Red Chilli Powder) in `dev` |

**Endpoints:**  
- `GET /api/products` (optional `?category=`, `?page=`, `?size=`)  
- `GET /api/products/featured`  
- `GET /api/products/trending`  
- `GET /api/products/{slug}` (e.g. `garlic-paste`)  
All public (no auth).

---

## 5. Reviews

**Purpose:** Show reviews per product; API shape matches frontend (id, author, rating, date, text).

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Entity | `domain/Review.java` | `id`, `product` (ManyToOne), `author`, `rating`, `reviewDate` (LocalDate), `text` |
| Repository | `repository/ReviewRepository.java` | `findByProductIdOrderByReviewDateDesc(Long productId)` |
| DTO | `dto/ReviewResponse.java` | `id`, `author`, `rating`, `date` (string), `text` |
| Service | `service/ReviewService.java` | `findByProductId(Long productId)` |
| Controller | `controller/ProductController.java` | `GET /api/products/{productId}/reviews` |
| Seed data | `config/DevDataLoader.java` | Seeds 9 sample reviews for the 4 products in `dev` |

**Endpoint:** `GET /api/products/{productId}/reviews` (e.g. product id `1`, `2`, `3`, `4`). No auth.

---

## 6. Auth (JWT)

**Purpose:** User signup/login and protected routes using JWT (Bearer token). Passwords hashed with BCrypt.

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Entity | `domain/User.java` | `id`, `email` (unique), `password`, `name`, `createdAt`, `updatedAt` |
| Repository | `repository/UserRepository.java` | `findByEmail`, `existsByEmail` |
| JWT | `security/JwtService.java` | Build/parse token (HS256); `generateToken`, `isValid`, `getEmailFromToken`, `getUserIdFromToken` |
| Filter | `security/JwtAuthenticationFilter.java` | Reads `Authorization: Bearer <token>`, validates, sets SecurityContext |
| UserDetails | `security/CustomUserDetailsService.java` | Loads `User` by email for Spring Security |
| DTOs | `dto/LoginRequest.java`, `dto/SignupRequest.java`, `dto/AuthResponse.java`, `dto/UserResponse.java` | Login/signup request bodies; token + user response; user info |
| Service | `service/AuthService.java` | `register(SignupRequest)`, `login(LoginRequest)`, `getCurrentUser(email)` |
| Controller | `controller/AuthController.java` | `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` |
| Security | `config/SecurityConfig.java` | `PasswordEncoder` (BCrypt); JWT filter in chain; `/api/auth/signup`, `/api/auth/login` public; `/api/auth/me` and other `/api/**` require auth |
| Seed data | `config/DevDataLoader.java` | Test user `test@soil2spoon.com` / `password123` in `dev` |

**Endpoints:**  
- `POST /api/auth/signup` — body: `{ email, password, name }` → 201 + `{ token, type, user }`  
- `POST /api/auth/login` — body: `{ email, password }` → 200 + `{ token, type, user }`  
- `GET /api/auth/me` — header: `Authorization: Bearer <token>` → 200 + `{ id, email, name }`  

Signup/login are public; `/api/auth/me` is protected.

---

## 7. Cart

**Purpose:** Persist cart per user; get and replace full cart. Used only for logged-in users (JWT required).

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Entity | `domain/CartItem.java` | `id`, `user` (ManyToOne), `product` (ManyToOne), `quantity`; unique (user, product) |
| Repository | `repository/CartItemRepository.java` | `findByUserIdOrderByIdAsc`, `deleteByUserId` |
| DTOs | `dto/CartItemRequest.java`, `dto/CartItemResponse.java` | Request: `productId`, `quantity`; Response: product id (as string), name, slug, price, image, fallbackImage, quantity (frontend-compatible) |
| Service | `service/CartService.java` | `getCart(userEmail)`, `setCart(userEmail, List<CartItemRequest>)` — replace entire cart |
| Controller | `controller/CartController.java` | `GET /api/cart`, `PUT /api/cart` (body: array of `{ productId, quantity }`) |
| Security | `config/SecurityConfig.java` | `/api/cart` not in permit list → protected by “authenticated” for `/api/**` |

**Endpoints:**  
- `GET /api/cart` — returns current user’s cart (auth required).  
- `PUT /api/cart` — body: `[ { "productId": 1, "quantity": 2 }, ... ]`; replaces entire cart and returns new cart (auth required).

---

## 8. Orders

**Purpose:** Checkout: create an order from the current user’s cart and list that user’s orders. Cart is cleared after order creation. Order items store price at time of order.

**What was implemented:**

| Item | Location | Description |
|------|----------|-------------|
| Entities | `domain/Order.java`, `domain/OrderItem.java` | Order: `id`, `user`, `orderDate`, `totalAmount`, `status` (PENDING, CONFIRMED, etc.); OrderItem: `order`, `product`, `quantity`, `priceAtOrder` |
| Repository | `repository/OrderRepository.java` | `findByUserIdOrderByOrderDateDesc` with EntityGraph for items and product |
| DTOs | `dto/OrderResponse.java`, `dto/OrderItemResponse.java` | Order: id, orderDate, totalAmount, status, items; OrderItem: productId, name, slug, price, quantity |
| Service | `service/OrderService.java` | `createOrder(userEmail)` — build order from cart, clear cart, return order; `getOrders(userEmail)` — list user’s orders (newest first) |
| Controller | `controller/OrderController.java` | `POST /api/orders` (create from cart), `GET /api/orders` (list my orders) |
| Security | — | `/api/orders` not in permit list → protected by “authenticated” for `/api/**` |

**Endpoints:**  
- `POST /api/orders` — create order from current cart; cart is cleared; returns created order (auth required). 400 if cart empty.  
- `GET /api/orders` — list current user’s orders, newest first (auth required).

---

## Summary table

| Section      | Main endpoints                          | Auth        | Key entities / concepts        |
|-------------|------------------------------------------|------------|---------------------------------|
| Health      | `GET /api/health`                        | No         | —                               |
| Categories  | `GET /api/categories`                    | No         | Category                        |
| Products    | `GET /api/products`, `.../featured`, `.../trending`, `.../{slug}` | No  | Product, ProductHighlights      |
| Reviews     | `GET /api/products/{productId}/reviews` | No         | Review                          |
| Auth (JWT)  | `POST /api/auth/signup`, `.../login`, `GET /api/auth/me` | Signup/login no; me yes | User, JWT, BCrypt |
| Cart        | `GET /api/cart`, `PUT /api/cart`         | Yes        | CartItem (user + product + qty) |
| Orders      | `POST /api/orders`, `GET /api/orders`    | Yes        | Order, OrderItem (price at order) |

For full request/response examples and status codes, see **README.md** (API reference section).

---

## Frontend wiring

The React app (project root) can call this backend when `VITE_API_URL` is set (e.g. `http://localhost:8080`).
The React app (project root) can call this backend when `VITE_API_URL` is set (e.g. `http://localhost:8081`).

- **`src/api/client.js`** — base URL and `fetchApi()`; sends `Authorization: Bearer <token>` when the user is logged in.
- **`src/api/products.js`** — getCategories, getProducts, getProductBySlug, getFeaturedProducts, getTrendingProducts, getProductReviews.
- **`src/api/auth.js`** — login, signup, getMe.
- **`src/context/AuthContext.jsx`** — token and user state; login/signup/logout; token stored in localStorage and restored on load.
- **Pages:** Home, ProductListing, and ProductDetail fetch from the API; Login and Signup call the auth API and update AuthContext; Navbar shows user name and Logout when logged in.

Cart and orders are not yet synced from the frontend to the backend in the UI (cart stays in-memory; order creation can be added to the checkout flow later).
