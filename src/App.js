import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import BookingPage from './components/BookingPage';
import OrderManagement from './components/OrderManagement';
import './styles.css';

const App = () => {
    const [bookings, setBookings] = useState(() => {
        const savedBookings = localStorage.getItem('bookings');
        return savedBookings ? JSON.parse(savedBookings) : [];
    });

    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : [
            { name: 'Sherwani', code: 'SW001' },
            { name: 'Indo Western', code: 'IW001' },
            { name: 'Jodhpuri', code: 'JP001' },
            { name: 'Blazer', code: 'BL001' }
        ]; // Default products
    });

    const handleBookingSubmit = (bookingDetails) => {
        const updatedBookings = [...bookings, bookingDetails];
        setBookings(updatedBookings);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    };

    const handleProductSubmit = (productDetails) => {
        const updatedProducts = [...products, productDetails];
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
    };

    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route 
                        path="/booking" 
                        element={<BookingPage bookings={bookings} setBookings={setBookings} onSubmit={handleBookingSubmit} products={products} />} 
                    />
                    <Route path="/orders" element={<OrderManagement bookings={bookings} setBookings={setBookings} products={products} setProducts={setProducts} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
