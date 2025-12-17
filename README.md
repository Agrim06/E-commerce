# MyShop - E-Commerce Platform

A modern, full-stack e-commerce application built with React and Node.js, featuring user authentication, product management, shopping cart, order processing, and an admin dashboard.

**Live Demo:** [https://e-commerce-mauve-sigma.vercel.app/](https://e-commerce-mauve-sigma.vercel.app/)

## 🚀 Features

- **User Authentication**
  - User registration and login
  - Google OAuth integration
  - JWT-based authentication
  - Protected routes

- **Product Management**
  - Browse products with pagination
  - Product search functionality
  - Featured products display
  - Product categories and filtering
  - Product reviews and ratings

- **Shopping Experience**
  - Shopping cart with local storage
  - Add/remove items from cart
  - Quantity management
  - Secure checkout process

- **Order Management**
  - Order placement and tracking
  - Order history
  - Order status updates

- **Admin Dashboard**
  - Product management (CRUD operations)
  - Order management
  - User management

- **User Profile**
  - Profile management
  - Order history
  - Account settings

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React OAuth Google** - Google authentication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SearchResultsPage.jsx
│   │   │   └── ShopPage.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

   Create a `.env` file in the `frontend` directory (if needed):
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

### Production Mode

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login
- `POST /api/users/google-login` - Google OAuth login

### Products
- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status (Admin only)

## 🌐 Deployment

The application is currently deployed on Vercel:
- **Frontend:** Vercel
- **Backend:** Configure your backend deployment (e.g., Heroku, Railway, or Vercel Serverless Functions)
- **Database:** MongoDB Atlas (recommended for production)

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration
- Input validation and error handling

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for modern e-commerce experiences.

---

**Note:** This project is currently in development. Some features may be subject to change.
