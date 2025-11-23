import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';


export default function App() {
return (
<BrowserRouter>
<Header />
<main className="main-content">
<Routes>
<Route path="/" element={<HomePage />} />
<Route path="/product/:id" element={<ProductPage />} />
<Route path="/cart" element={<CartPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
<Route path="/profile" element={<ProfilePage />} />
<Route path="/checkout" element={<CheckoutPage />} />
<Route path="/admin" element={<AdminDashboard />} />
</Routes>
</main>
<Footer />
</BrowserRouter>
);
}