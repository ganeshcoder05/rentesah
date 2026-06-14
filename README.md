# 🏠 RentEase – Furniture & Appliance Rental Platform

A full-stack web app for renting furniture and appliances on a monthly basis. Built for students and working professionals who relocate frequently.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Custom CSS with CSS variables |

---

## Project Structure

```
rentease/
├── backend/
│   ├── models/         # Mongoose schemas (User, Product, Cart, Order)
│   ├── routes/         # Express routes (auth, products, cart, orders, admin)
│   ├── middleware/     # JWT auth middleware
│   ├── scripts/        # Admin user creation script
│   ├── server.js       # Main Express server
│   └── .env            # Environment config
├── frontend/
│   └── src/
│       ├── components/ # Navbar, Footer, ProductCard, ProtectedRoute
│       ├── context/    # AuthContext, CartContext
│       ├── pages/      # Home, Products, ProductDetail, Cart, Checkout, Orders, Admin, Login, Register
│       ├── api.js      # Axios instance with auth interceptors
│       └── App.js      # Router + providers
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017
- npm

---

### Step 1 — Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure environment

The `.env` file is already created at `backend/.env` with defaults:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/rentease
JWT_SECRET=rentease_jwt_secret_key_2024
NODE_ENV=development
```

Change `JWT_SECRET` to a strong random string before deploying to production.

---

### Step 3 — Create admin user

```bash
# From the root rentease/ folder
node backend/scripts/createAdmin.js
```

Output:
```
✅ Admin user created!
   Email:    admin@rentease.com
   Password: admin123
```

---

### Step 4 — Start the backend

```bash
cd backend
npm start
# or with nodemon (install globally first: npm i -g nodemon)
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### Step 5 — Start the frontend

```bash
cd frontend
npm start
```

Frontend runs at: `http://localhost:3000`

The frontend proxies all `/api/*` calls to the backend automatically (configured in `frontend/package.json`).

---

### Step 6 — Seed sample products

1. Open browser → go to `http://localhost:3000/login`
2. Login with `admin@rentease.com` / `admin123`
3. Go to Admin Panel → click **"Seed Sample Products"**
4. 8 sample products will be created (beds, sofas, tables, fridges, TVs, washing machines)

---

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (auth required) |
| PUT | `/api/auth/profile` | Update profile (auth required) |

### Products
| Method | Route | Description |
|---|---|---|
| GET | `/api/products` | Get all products (supports filters: category, subcategory, search, minRent, maxRent, page, limit) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add product (admin only) |
| PUT | `/api/products/:id` | Update product (admin only) |
| DELETE | `/api/products/:id` | Soft delete product (admin only) |

### Cart
| Method | Route | Description |
|---|---|---|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/update/:itemId` | Update cart item |
| DELETE | `/api/cart/remove/:itemId` | Remove item |
| DELETE | `/api/cart/clear` | Clear entire cart |

### Orders
| Method | Route | Description |
|---|---|---|
| POST | `/api/orders` | Place order from cart |
| GET | `/api/orders` | Get user's orders |
| GET | `/api/orders/:id` | Get single order |

### Admin
| Method | Route | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/orders` | All orders with filters |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/users` | All users |
| POST | `/api/admin/seed` | Seed sample products |

---

## Features Implemented

### User
- Register / Login with JWT auth
- Browse products with category, subcategory, price, and keyword filters
- View product details with tenure selection
- Add to cart with rental tenure
- Checkout with delivery address and date
- View rental order history

### Admin
- Dashboard with stats (users, products, orders, revenue)
- View and update order statuses
- Add / remove products
- View all users
- One-click sample data seeding

---

## User Flows

```
Guest → Browse Products → View Product → Login → Add to Cart → Checkout → Order Placed
Admin → Login → Admin Panel → Seed Products / Manage Orders / View Users
```

---

## Known Limitations (intentional scope decisions)

- No real payment gateway (payment collected offline before delivery)
- No native mobile app (web-only, but mobile-responsive)
- No real-time notifications
- No advanced AI pricing

---

## Future Enhancements

- Razorpay / Stripe payment integration
- OTP-based login
- Mobile app (React Native)
- Subscription bundles
- Smart appliance tracking via IoT
- Multi-city inventory management
