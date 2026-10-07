# ⚙️ Nexora — E-Commerce Backend

Nexora Backend is a RESTful e-commerce API built with **Node.js, Express.js, and MySQL**. It powers authentication, products, cart, wishlist, orders, payments, profiles, notifications, settings, and admin functionality.

## 🚀 Production API

**Backend:** https://e-commerce-backend-71hj.onrender.com/

**API Base URL:** https://e-commerce-backend-71hj.onrender.com/api

## ✨ Features

### Authentication
- User registration
- Email/password login
- JWT authentication
- HTTP-only authentication cookies
- Google authentication
- Protected routes

### E-Commerce
- Product management
- Category management
- Cart management
- Wishlist management
- Order management
- Payment method management
- Address management
- Feedback

### User
- Profile management
- Profile image support
- Notifications
- Account settings

### Admin
- User management
- Product management
- Protected admin APIs

## 🛠️ Tech Stack

- Node.js
- Express.js
- JavaScript
- MySQL
- Aiven MySQL
- JWT
- bcrypt
- Google OAuth
- CORS
- Cookie Parser
- dotenv
- Git & GitHub
- Render

## 📁 Project Structure

```text
backend/
├── src/
│   ├── Configurations/
│   │   └── db.config.js
│   └── E-Commerce/
│       ├── Auth/
│       ├── Profile/
│       ├── Category/
│       ├── Product/
│       ├── Cart/
│       ├── Wishlist/
│       ├── Feedback/
│       ├── Address/
│       ├── Payment/
│       ├── Order/
│       ├── Notifications/
│       ├── Settings/
│       └── Admin/
├── uploads/
├── server.js
├── package.json
└── .env
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
cd nexora-ecommerce-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env`

```env
PORT=5000

DB_HOST=YOUR_DATABASE_HOST
DB_PORT=3306
DB_USER=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
DB_NAME=YOUR_DATABASE_NAME

JWT_SECRET_KEY=YOUR_JWT_SECRET

MAIL_USER=YOUR_EMAIL
MAIL_PASSWORD=YOUR_EMAIL_PASSWORD

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start the server

```bash
npm run dev
```

Or:

```bash
node server.js
```

The API will run at:

```text
http://localhost:5000
```

## 🔗 Main API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google-login
POST /api/auth/logout
```

### Profile

```text
GET /api/profile
PUT /api/profile
```

### Products

```text
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Cart

```text
GET /api/cart
POST /api/cart
PUT /api/cart/:id
DELETE /api/cart/:id
```

### Wishlist

```text
GET /api/wishlist
POST /api/wishlist
DELETE /api/wishlist/:id
```

### Orders

```text
GET /api/orders
POST /api/orders
GET /api/orders/:id
```

### Addresses

```text
GET /api/addresses
POST /api/addresses
PUT /api/addresses/:id
DELETE /api/addresses/:id
```

## 🔐 Authentication

Nexora uses JWT authentication with HTTP-only cookies.

Example:

```js
const token = jwt.sign(
  {
    id: user.id,
    email: user.email,
    role: user.role,
  },
  process.env.JWT_SECRET_KEY,
  {
    expiresIn: "30d",
  }
);
```

The token is stored in an HTTP-only cookie and used to protect authenticated routes.

## 🗄️ Database

The application uses **MySQL**.

The production database is hosted using **Aiven MySQL**.

Database credentials are loaded through environment variables and must never be committed to GitHub.

## 🖼️ Image Uploads

Uploaded images are served through:

```text
/uploads
```

Example:

```text
https://e-commerce-backend-71hj.onrender.com/uploads/image.jpg
```

Express serves the upload directory using:

```js
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);
```

## 🌐 CORS

The API supports requests from the deployed frontend and local development environment.

```js
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
```

Production frontend:

```text
https://e-commerce-frontend-six-neon.vercel.app
```

## 🚀 Deployment

The backend is deployed on **Render**.

Production environment variables should include:

```env
NODE_ENV=production
FRONTEND_URL=https://e-commerce-frontend-six-neon.vercel.app
```

Database and authentication secrets should be configured directly in Render's environment settings.

## 🧪 Health Check

Open:

```text
https://e-commerce-backend-71hj.onrender.com/
```

Expected response:

```json
{
  "success": true,
  "message": "Nexora E-commerce API is running"
}
```

## 🔒 Security

- JWT authentication
- HTTP-only cookies
- Password hashing
- Protected routes
- Role-based authorization
- CORS configuration
- Environment variables for secrets
- `.env` excluded from Git

## 🎯 Project Goal

The backend demonstrates real-world backend development concepts including REST APIs, authentication, authorization, relational database integration, file uploads, API architecture, and cloud deployment.

## 👩‍💻 Author

**Bhoomi Kaushik**

B.Tech Computer Science & Engineering

GitHub: https://github.com/bhumi-94

---

⭐ If you like the project, consider giving the repository a star.
