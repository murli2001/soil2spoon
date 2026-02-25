# Soil2Spoon Backend

Spring Boot API (Maven, embedded Tomcat) for Soil2Spoon.

## Prerequisites

- Java 17+
- Maven 3.6+

## Run (development)

**From the command line** (from the `backend/` directory):

```bash
mvn spring-boot:run
```

**From IntelliJ UI**

1. Open the `backend` folder as a project (or ensure the backend module is in your project).
2. Find `Soil2SpoonApplication.java` in the project tree.
3. Right‑click it → **Run 'Soil2SpoonApplication'**, or click the green Run icon next to the `main` method.
4.
The server starts on http://localhost:8080. The default profile is `dev` (from 
`application.properties`). 
The server starts on http://localhost:8081. The default profile is `dev` (from `application.properties`).

To **change the profile in IntelliJ**:
- **Run** → **Edit Configurations** → select your **Soil2SpoonApplication** run configuration.
- Either:
  - **Active profiles:** set to e.g. `prod`, or  
  - **VM options:** add `-Dspring.profiles.active=prod`, or  
  - **Environment variables:** add `SPRING_PROFILES_ACTIVE=prod`.
- Click **Apply** → **OK**, then run again.

- API: http://localhost:8081
- Health: http://localhost:8081/api/health
- **Categories:** http://localhost:8081/api/categories
- **Products:** http://localhost:8081/api/products (optional: `?category=spices`, `?page=0&size=20`)
- **Product by slug:** http://localhost:8081/api/products/garlic-paste
- **Reviews for product:** http://localhost:8081/api/products/1/reviews (use product id: 1, 2, 3, 4)
- **Featured:** http://localhost:8081/api/products/featured
- **Trending:** http://localhost:8081/api/products/trending
- **Auth (JWT):**
  - `POST /api/auth/signup` — body: `{ "email", "password", "name" }`
  - `POST /api/auth/login` — body: `{ "email", "password" }` → returns `{ "token", "type": "Bearer", "user" }`
  - `POST /api/auth/forgot-password` — body: `{ "email" }` → sends reset link by email (see [Configuration](#configuration-and-environment))
  - `POST /api/auth/reset-password` — body: `{ "token", "newPassword" }` → sets new password from reset link
  - `GET /api/auth/me` — requires header: `Authorization: Bearer <token>` → returns current user
- **Cart (auth required):**
  - `GET /api/cart` — returns current user's cart
  - `PUT /api/cart` — body: `[ { "productId": 1, "quantity": 2 }, ... ]` — replace entire cart
- **Orders (auth required):**
  - `POST /api/orders` — create order from current cart (cart is cleared)
  - `GET /api/orders` — list current user's orders
- **Admin (role ADMIN required):**
  - `POST /api/admin/products` — create product (body: ProductRequest)
  - `PUT /api/admin/products/{id}` — update product
  - `DELETE /api/admin/products/{id}` — delete product
- **Dev test user:** `test@soil2spoon.com` / `password123` (only when running with `dev` profile)
- **Dev admin user:** `admin@soil2spoon.com` / `admin123` — created automatically on every dev startup if missing. Full rights to add, edit, and delete products via `POST/PUT/DELETE /api/admin/products`.
- H2 console (dev): http://localhost:8081/h2-console (JDBC URL: `jdbc:h2:mem:soil2spoon`)

Uses the `dev` profile: H2 in-memory DB, CORS allowed for `http://localhost:5173`.

## Configuration and environment

Spring Boot loads properties in this order (later overrides earlier):

| File | When it is used | Purpose |
|------|------------------|--------|
| **`application.properties`** | Always (base) | App name, JPA defaults, server port, JWT and mail placeholders. Default profile is set here (`spring.profiles.active=dev`). |
| **`application-dev.properties`** | When `spring.profiles.active=dev` | H2 in-memory DB, CORS for Vite, dev seed, frontend URL and optional SMTP for local testing. |
| **`application-prod.properties`** | When `spring.profiles.active=prod` | Comments only; production values come from **environment variables** (see below). |

**When to use which:**

- **Local development** — Use the **`dev`** profile (default). No env vars required; `application.properties` + `application-dev.properties` apply. Optional: set SMTP in `application-dev.properties` (e.g. Mailtrap) to test password-reset emails.
- **Production** — Use the **`prod`** profile and set all secrets and URLs via **environment variables**. Do not commit production secrets into any properties file.

**Environment variables (when to set them):**

| Variable | When to use | Description |
|----------|----------------|-------------|
| `SPRING_PROFILES_ACTIVE` | Optional | Set to `prod` (or `dev`) to choose profile. If unset, `application.properties` value is used (`dev` by default). |
| `JWT_SECRET` | **Production** (recommended) | Secret key for JWT signing. Set a long, random value. Default in properties is for dev only. |
| `APP_FRONTEND_BASE_URL` | **Production** (required for reset emails) | Public URL of the frontend, e.g. `https://yourdomain.com` (no trailing slash). Used in password-reset link. In **dev**, this is set in `application-dev.properties` to `http://localhost:5173`. |
| `SPRING_MAIL_HOST` | **Production** (required to send reset emails) | SMTP host (e.g. `smtp.sendgrid.net`, `smtp.gmail.com`). |
| `SPRING_MAIL_PORT` | Production | SMTP port; default `587` (TLS). |
| `SPRING_MAIL_USERNAME` | **Production** (required to send reset emails) | SMTP username (often the “from” address). |
| `SPRING_MAIL_PASSWORD` | **Production** (required to send reset emails) | SMTP password or API key. |
| `app.dev.seed.force` | Dev only (in `application-dev.properties` or env) | Set to `true` to re-run seed when DB already has data. Set back to `false` after use. |
| `GOOGLE_GEOCODING_API_KEY` | **Optional** (address verification) | Google Geocoding API key. If set, shipping addresses are validated via Google (pincode, city, state must be verifiable). Leave unset for format-only validation (e.g. dev). |

Summary: use **`dev`** for local work (no env needed); use **`prod`** and set the env vars above for production (JWT, frontend URL, and mail so password-reset emails work).

## Populating the database

Data is populated automatically when you run the backend with the **dev** profile.

1. **From project root:**  
   `cd backend` then `mvn spring-boot:run`  
   (default profile is already `dev` in `application.properties`.)

2. **What gets seeded:**
   - **When the DB is empty:** Categories (Spices, Pastes, Powders), 4 sample products, 9 reviews, **test user** (`test@soil2spoon.com` / `password123`) and **admin user** (`admin@soil2spoon.com` / `admin123`).
   - **When the DB already has data:** The full seed is skipped, but the **admin user** is still ensured: if `admin@soil2spoon.com` does not exist, it is created. So you can always log in as admin after a restart, even if the DB was populated before the admin was added to the seed.

3. **H2 in-memory (default dev):** The DB is recreated on every restart, so the full seed runs every time you start the app.

4. **Re-seed when DB already has data (e.g. file-based H2 or PostgreSQL):**  
   Set in `application-dev.properties` or as an env var:
   - `app.dev.seed.force=true`  
   Then start the app once. Seed will clear existing seed data and repopulate (including both test and admin users). Set back to `false` after use.

## API reference

Base URL: `http://localhost:8081` (replace with your server in production).

---

### 1. Health

**Endpoint:** `GET /api/health`  
**Auth:** None.

**Request:**
```http
GET /api/health HTTP/1.1
Host: localhost:8081
```

**Response:** `200 OK`
```json
{
  "status": "UP",
  "service": "soil2spoon-backend"
}
```

---

### 2. Categories

**Endpoint:** `GET /api/categories`  
**Auth:** None.

**Request:**
```http
GET /api/categories HTTP/1.1
Host: localhost:8081
```

**Response:** `200 OK`
```json
[
  { "id": "spices", "name": "Spices", "icon": "🌶️" },
  { "id": "pastes", "name": "Pastes", "icon": "🫙" },
  { "id": "powders", "name": "Powders", "icon": "🧂" }
]
```

---

### 3. Products (list)

**Endpoint:** `GET /api/products`  
**Auth:** None.  
**Query (optional):** `category` (e.g. `spices`), `page` (default `0`), `size` (default `20`).

**Request:**
```http
GET /api/products?category=pastes&page=0&size=10 HTTP/1.1
Host: localhost:8081
```

**Response:** `200 OK` (paginated)
```json
{
  "content": [
    {
      "id": "1",
      "name": "Garlic Paste",
      "slug": "garlic-paste",
      "price": 299,
      "originalPrice": 349,
      "category": "pastes",
      "rating": 4.8,
      "reviewCount": 1247,
      "netQty": "1 pack (200 g)",
      "image": "https://...",
      "images": ["https://..."],
      "fallbackImage": "https://...",
      "description": "Fresh, pure garlic paste...",
      "featured": true,
      "trending": true,
      "highlights": {
        "brand": "Soil2Spoon",
        "productType": "Paste",
        "dietaryPreference": "Veg",
        "keyFeatures": "...",
        "flavour": "Garlic",
        "ingredients": "...",
        "allergenInformation": "...",
        "weight": "200 g",
        "unit": "1 pack (200 g)",
        "packagingType": "Jar"
      }
    }
  ],
  "totalElements": 4,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

---

### 4. Product by slug

**Endpoint:** `GET /api/products/{slug}`  
**Auth:** None.  
**Example:** `GET /api/products/garlic-paste`

**Request:**
```http
GET /api/products/garlic-paste HTTP/1.1
Host: localhost:8081
```

**Response:** `200 OK` (single product, same shape as one item in the list above).  
**Response:** `404 Not Found` if slug does not exist.

---

### 5. Product reviews

**Endpoint:** `GET /api/products/{productId}/reviews`  
**Auth:** None.  
**Example:** `GET /api/products/1/reviews` (product id: 1, 2, 3, or 4 in dev).

**Request:**
```http
GET /api/products/1/reviews HTTP/1.1
Host: localhost:8081
```

**Response:** `200 OK`
```json
[
  {
    "id": "1",
    "author": "Priya S.",
    "rating": 5,
    "date": "2024-01-15",
    "text": "Best garlic paste I've used. Fresh smell, no preservatives..."
  },
  {
    "id": "2",
    "author": "Rahul M.",
    "rating": 4,
    "date": "2024-01-08",
    "text": "Convenient and saves a lot of time. Would buy again."
  }
]
```

---

### 6. Featured products

**Endpoint:** `GET /api/products/featured`  
**Auth:** None.

**Request:**
```http
GET /api/products/featured HTTP/1.1
Host: localhost:8081
```

**Response:** `200 OK` — array of products (same shape as list items in §3).

---

### 7. Trending products

**Endpoint:** `GET /api/products/trending`  
**Auth:** None.

**Request:**
```http
GET /api/products/trending HTTP/1.1
Host: localhost:8081
```

**Response:** `200 OK` — array of products (same shape as list items in §3).

---

### 8. Auth — Signup

**Endpoint:** `POST /api/auth/signup`  
**Auth:** None.

**Request:**
```http
POST /api/auth/signup HTTP/1.1
Host: localhost:8081
Content-Type: application/json

{
  "email": "you@example.com",
  "password": "mypass123",
  "name": "Your Name"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "user": {
    "id": "1",
    "email": "you@example.com",
    "name": "Your Name"
  }
}
```

**Response:** `400 Bad Request` (e.g. email already registered)
```json
{
  "message": "Email already registered"
}
```

---

### 9. Auth — Login

**Endpoint:** `POST /api/auth/login`  
**Auth:** None.

**Request:**
```http
POST /api/auth/login HTTP/1.1
Host: localhost:8081
Content-Type: application/json

{
  "email": "test@soil2spoon.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "user": {
    "id": "1",
    "email": "test@soil2spoon.com",
    "name": "Test User"
  }
}
```

**Response:** `401 Unauthorized` (invalid credentials)
```json
{
  "message": "Invalid email or password"
}
```

---

### 10. Auth — Forgot password

**Endpoint:** `POST /api/auth/forgot-password`  
**Auth:** None.

Sends a password-reset email to the user if the account exists. The email contains a link to the reset-password page (valid 1 hour). In production, set `APP_FRONTEND_BASE_URL` and SMTP env vars so emails are sent; in dev without SMTP, the reset link is only logged.

**Request:**
```http
POST /api/auth/forgot-password HTTP/1.1
Host: localhost:8081
Content-Type: application/json

{
  "email": "you@example.com"
}
```

**Response:** `200 OK` (same body whether the email exists or not)
```json
{
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

---

### 11. Auth — Reset password

**Endpoint:** `POST /api/auth/reset-password`  
**Auth:** None.

Sets a new password using the token from the reset link (sent by forgot-password).

**Request:**
```http
POST /api/auth/reset-password HTTP/1.1
Host: localhost:8081
Content-Type: application/json

{
  "token": "uuid-from-reset-link",
  "newPassword": "newpass123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password has been reset. You can sign in with your new password."
}
```

**Response:** `400 Bad Request` (invalid or expired token)
```json
{
  "message": "Invalid or expired reset link"
}
```

---

### 12. Auth — Current user (me)

**Endpoint:** `GET /api/auth/me`  
**Auth:** Required. Send the token from login/signup in the `Authorization` header.

**Request:**
```http
GET /api/auth/me HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response:** `200 OK`
```json
{
  "id": "1",
  "email": "test@soil2spoon.com",
  "name": "Test User"
}
```

**Response:** `401 Unauthorized` if the token is missing or invalid (no body).

---

### 13. Cart — Get cart

**Endpoint:** `GET /api/cart`  
**Auth:** Required. Send the token in the `Authorization: Bearer <token>` header.

**Request:**
```http
GET /api/cart HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response:** `200 OK`
```json
[
  {
    "id": "1",
    "name": "Garlic Paste",
    "slug": "garlic-paste",
    "price": 299,
    "image": "https://...",
    "fallbackImage": "https://...",
    "quantity": 2
  },
  {
    "id": "3",
    "name": "Garlic Powder",
    "slug": "garlic-powder",
    "price": 199,
    "image": "https://...",
    "fallbackImage": "https://...",
    "quantity": 1
  }
]
```

**Response:** `401 Unauthorized` if the token is missing or invalid.

---

### 14. Cart — Set cart (replace entire cart)

**Endpoint:** `PUT /api/cart`  
**Auth:** Required. Send the token in the `Authorization: Bearer <token>` header.

**Request:**
```http
PUT /api/cart HTTP/1.1
Host: localhost:8081
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

[
  { "productId": 1, "quantity": 2 },
  { "productId": 3, "quantity": 1 }
]
```

- **Body:** Array of `{ "productId": number, "quantity": number }`. Replaces the user's entire cart. Use `productId` from the product API (e.g. `1`, `2`, `3`, `4`). `quantity` must be at least 1. Omit or skip invalid product ids.

**Response:** `200 OK` — returns the new cart (same shape as GET /api/cart).
```json
[
  {
    "id": "1",
    "name": "Garlic Paste",
    "slug": "garlic-paste",
    "price": 299,
    "image": "https://...",
    "fallbackImage": "https://...",
    "quantity": 2
  },
  {
    "id": "3",
    "name": "Garlic Powder",
    "slug": "garlic-powder",
    "price": 199,
    "image": "https://...",
    "fallbackImage": "https://...",
    "quantity": 1
  }
]
```

**Response:** `401 Unauthorized` if the token is missing or invalid.

---

### 15. Orders — Create order (checkout)

**Endpoint:** `POST /api/orders`  
**Auth:** Required. Send the token in the `Authorization: Bearer <token>` header.

Creates an order from the current user's cart and clears the cart. No request body.

**Request:**
```http
POST /api/orders HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response:** `201 Created`
```json
{
  "id": "1",
  "orderDate": "2025-02-18T12:00:00Z",
  "totalAmount": 797,
  "status": "PENDING",
  "items": [
    {
      "productId": "1",
      "name": "Garlic Paste",
      "slug": "garlic-paste",
      "price": 299,
      "quantity": 2
    },
    {
      "productId": "3",
      "name": "Garlic Powder",
      "slug": "garlic-powder",
      "price": 199,
      "quantity": 1
    }
  ]
}
```

**Response:** `400 Bad Request` if cart is empty
```json
{
  "message": "Cart is empty"
}
```

**Response:** `401 Unauthorized` if the token is missing or invalid.

---

### 16. Orders — List my orders

**Endpoint:** `GET /api/orders`  
**Auth:** Required. Send the token in the `Authorization: Bearer <token>` header.

**Request:**
```http
GET /api/orders HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response:** `200 OK` — array of orders (newest first), each with the same shape as the create-order response.
```json
[
  {
    "id": "1",
    "orderDate": "2025-02-18T12:00:00Z",
    "totalAmount": 797,
    "status": "PENDING",
    "items": [...]
  }
]
```

**Response:** `401 Unauthorized` if the token is missing or invalid.

---

### 15. Orders — Create order (checkout)

**Endpoint:** `POST /api/orders`  
**Auth:** Required. Send the token in the `Authorization: Bearer <token>` header.

Creates an order from the current user's cart and clears the cart. No request body.

**Request:**
```http
POST /api/orders HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response:** `201 Created`
```json
{
  "id": "1",
  "orderDate": "2025-02-18T12:00:00Z",
  "totalAmount": 797,
  "status": "PENDING",
  "items": [
    {
      "productId": "1",
      "name": "Garlic Paste",
      "slug": "garlic-paste",
      "price": 299,
      "quantity": 2
    },
    {
      "productId": "3",
      "name": "Garlic Powder",
      "slug": "garlic-powder",
      "price": 199,
      "quantity": 1
    }
  ]
}
```

**Response:** `400 Bad Request` if cart is empty
```json
{
  "message": "Cart is empty"
}
```

**Response:** `401 Unauthorized` if the token is missing or invalid.

---

### 16. Orders — List my orders

**Endpoint:** `GET /api/orders`  
**Auth:** Required. Send the token in the `Authorization: Bearer <token>` header.

**Request:**
```http
GET /api/orders HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Response:** `200 OK` — array of orders (newest first), each with the same shape as the create-order response.
```json
[
  {
    "id": "1",
    "orderDate": "2025-02-18T12:00:00Z",
    "totalAmount": 797,
    "status": "PENDING",
    "items": [...]
  }
]
```

**Response:** `401 Unauthorized` if the token is missing or invalid.

---

## Changing the profile

The active profile is set in `application.properties` as `spring.profiles.active=dev`. To use a different profile:

**1. Command line (Maven)**  
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

**2. Environment variable**  
```bash
# Windows (PowerShell)
$env:SPRING_PROFILES_ACTIVE="prod"; mvn spring-boot:run

# Windows (CMD)
set SPRING_PROFILES_ACTIVE=prod && mvn spring-boot:run

# Linux / macOS
SPRING_PROFILES_ACTIVE=prod mvn spring-boot:run
```

**3. When running the JAR**  
```bash
java -jar target/soil2spoon-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

**4. In `application.properties`**  
Change `spring.profiles.active` to the profile you want (e.g. `prod`). Create `application-prod.properties` for that profile’s settings (e.g. PostgreSQL URL, CORS for production frontend).

## Auth (JWT)

### 1. User & repository

- **User** — id, email (unique), password (stored hashed), name, createdAt, updatedAt
- **UserRepository** — `findByEmail`, `existsByEmail`

### 2. JWT

- **JwtService** — builds and parses JWTs (HS256), reads `app.jwt.secret` and `app.jwt.expiration-ms` from config  
  - `generateToken(email, userId)`  
  - `isValid(token)`, `getEmailFromToken(token)`, `getUserIdFromToken(token)`
- **JwtAuthenticationFilter** — reads `Authorization: Bearer <token>`, validates token, loads user, sets SecurityContext
- **CustomUserDetailsService** — loads User by email for Spring Security

### 3. Auth API

- **POST /api/auth/signup** — body: `{ "email", "password", "name" }` (password min 6 chars). Returns 201 + `{ "token", "type": "Bearer", "user": { "id", "email", "name" } }`.  
  - 400 if email already registered.
- **POST /api/auth/login** — body: `{ "email", "password" }`. Returns 200 + same shape.  
  - 401 if credentials invalid.
- **POST /api/auth/forgot-password** — body: `{ "email" }`. If the account exists, generates a reset token and sends an email with a link to the frontend reset page (`{app.frontend.base-url}/reset-password?token=...`). Token expires in 1 hour. Requires `APP_FRONTEND_BASE_URL` and SMTP env vars in production for emails to be sent.
- **POST /api/auth/reset-password** — body: `{ "token", "newPassword" }`. Validates token and expiry, then sets the user’s new password. 400 if token invalid or expired.
- **GET /api/auth/me** — protected; needs `Authorization: Bearer <token>`. Returns current user `{ "id", "email", "name", "role" }` (role is `USER` or `ADMIN`).

### 4. Security

- **SecurityConfig** — BCryptPasswordEncoder bean; JwtAuthenticationFilter in the chain before UsernamePasswordAuthenticationFilter.
- **Public:** `/api/health`, `/h2-console/**`, `/api/auth/signup`, `/api/auth/login`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/categories`, `/api/products`, `/api/products/**`, `/api/faqs`, `/api/content/**`.
- **Admin only:** `/api/admin/**` — requires JWT with role `ADMIN` (e.g. `admin@soil2spoon.com`).
- **Protected:** all other `/api/**` (e.g. `/api/auth/me`, `/api/cart`, `/api/orders`, `/api/addresses`).

### 5. Dev seed

With **dev** profile, on startup: if the DB is empty, categories, products, reviews, **test user** (`test@soil2spoon.com` / `password123`) and **admin user** (`admin@soil2spoon.com` / `admin123`) are created. If the DB already has data, the **admin user** is still ensured (created if missing), so you can always log in as admin.

### 6. How to try it

1. Run the backend with the **dev** profile.
2. **Signup:**  
   `POST http://localhost:8081/api/auth/signup`  
   Body: `{ "email": "you@example.com", "password": "mypass123", "name": "Your Name" }`
3. **Login (or use test user):**  
   `POST http://localhost:8081/api/auth/login`  
   Body: `{ "email": "test@soil2spoon.com", "password": "password123" }`  
   Use the returned `token` in the next step.
4. **Current user:**  
   `GET http://localhost:8081/api/auth/me`  
   Header: `Authorization: Bearer <token>`.

## Build

```bash
mvn clean install
java -jar target/soil2spoon-backend-0.0.1-SNAPSHOT.jar
```

## Project layout

- `src/main/java/com/soil2spoon/` — application, config, controller, domain, dto, repository, service
- `src/main/resources/` — `application.properties` (base), `application-dev.properties` (dev profile), `application-prod.properties` (prod profile; see [Configuration](#configuration-and-environment))

With the `dev` profile, categories, sample products, reviews, and a test user are seeded on startup.

For a short overview of what each section implements (entities, repos, services, endpoints), see **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**.
