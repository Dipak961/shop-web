// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Correct path to styles.css

const Header = () => {
    return (
        <header>
            <h1>Deepak Koradiya Rental</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/booking">Booking</Link>
                <Link to="/orders">Order Management</Link>
            </nav>
        </header>
    );
};

export default Header;