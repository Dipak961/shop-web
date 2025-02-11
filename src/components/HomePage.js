// src/components/HomePage.js
import React, { useState } from 'react';
import './Home.css'; 

const HomePage = () => {
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setUploadedImages(prevImages => [...prevImages, ...imageUrls]);
    };

    const handleImageDelete = (index) => {
        setUploadedImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="home-page">
            <h2>Welcome to Deepak Koradiya Rental</h2>
            <p>
                At Deepak Koradiya, we offer a wide range of traditional attire for rent, perfect for any special occasion.
                Whether you're looking for a Sherwani, Indo Western outfit, Jodhpuri, or Blazer, we have you covered.
            </p>
            <h3>Our Products</h3>
            <ul className="product-list">
                <li>
                    <img src="https://shreeman.in/cdn/shop/products/RG406407-Edit.jpg?v=1630067721&width=3161" alt="Sherwani" />
                    <span>Sherwani</span>
                </li>
                <li>
                    <img src="https://images.indianweddingsaree.com/images/tr:w-240,q-95/1872918.jpg" alt="Indo Western" />
                    <span>Indo Western</span>
                </li>
                <li>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyqDAixZ2tPs6uzLF8pjiFiDpLoHyBhhNVqg&s" alt="Jodhpuri" />
                    <span>Jodhpuri</span>
                </li>
                <li>
                    <img src="https://m.media-amazon.com/images/I/81AXenWWDYL._AC_UY1100_.jpg" alt="Blazer" />
                    <span>Blazer</span>
                </li>
                {/* Display uploaded images here */}
                {uploadedImages.map((image, index) => (
                    <li key={index}>
                        <img src={image} alt={`Uploaded ${index}`} />
                        <span>Uploaded Image {index + 1}</span>
                    </li>
                ))}
            </ul>
            <h3>Why Choose Us?</h3>
            <ul>
                <li>High-quality garments</li>
                <li>Affordable rental prices</li>
                <li>Excellent customer service</li>
                <li>Convenient booking process</li>
            </ul>
            <p>
                Contact us today to book your attire and make your special occasion unforgettable!
            </p>

            <h3>Upload Your Own Images</h3>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

            {/* Delete button for uploaded images */}
            {uploadedImages.length > 0 && (
                <div className="delete-buttons">
                    {uploadedImages.map((_, index) => (
                        <button key={index} onClick={() => handleImageDelete(index)}>
                            Delete Uploaded Image {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;