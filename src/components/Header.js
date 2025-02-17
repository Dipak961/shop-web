import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Ensure this path is correct

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <h1>Raj Shakti Sherwani & Safa Rental</h1>
            </div>
            <nav className="nav-links">
                <div className="nav-item">
                    <Link to="/">🏠 Home</Link>
                </div>
                <div className="nav-item">
                    <Link to="/booking">📅 Booking</Link>
                </div>
                <div className="nav-item">
                    <Link to="/orders">📜 Order Management</Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
