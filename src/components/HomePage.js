import React, { useState, useEffect } from 'react';
import './Home.css';

const HomePage = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState("");

   
    useEffect(() => {
        const savedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
        setUploadedImages(savedImages);
    }, []);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);

        Promise.all(files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
            });
        })).then(imageBase64Array => {
            const newImages = [...uploadedImages, ...imageBase64Array];
            setUploadedImages(newImages);
            localStorage.setItem('uploadedImages', JSON.stringify(newImages)); 
        });
    };

   
    const handleDeleteImage = () => {
        if (selectedImageIndex === "") return;
        const index = parseInt(selectedImageIndex);
        const newImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(newImages);
        localStorage.setItem('uploadedImages', JSON.stringify(newImages));
        setSelectedImageIndex(""); 
    };

    return (
        <div className="home-page">
            <h1 className="brand-title">Raj Shakti Sherwani & Safa Rental</h1>
            <p className="brand-tagline">
                Elevate your style with our premium traditional outfits for every occasion.
            </p>

            <h2 className="section-title">Our Exclusive Collection</h2>
            <div className="product-grid">
                {[
                    { img: "https://shreeman.in/cdn/shop/products/RG406407-Edit.jpg?v=1630067721&width=3161", name: "Sherwani" },
                    { img: "https://images.indianweddingsaree.com/images/tr:w-240,q-95/1872918.jpg", name: "Indo Western" },
                    { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyqDAixZ2tPs6uzLF8pjiFiDpLoHyBhhNVqg&s", name: "Jodhpuri" },
                    { img: "https://m.media-amazon.com/images/I/81AXenWWDYL._AC_UY1100_.jpg", name: "Blazer" }
                ].map((product, index) => (
                    <div key={index} className="product-card">
                        <img src={product.img} alt={product.name} className="product-image" />
                        <h3 className="product-name">{product.name}</h3>
                    </div>
                ))}

                {uploadedImages.map((image, index) => (
                    <div key={index} className="product-card uploaded">
                        <img src={image} alt={`Uploaded ${index + 1}`} className="product-image" />
                        <h3 className="product-name">Uploaded Image {index + 1}</h3>
                    </div>
                ))}
            </div>

            <h2 className="section-title">Why Choose Us?</h2>
            <ul className="features-list">
                <li>✔ Premium Quality Fabrics</li>
                <li>✔ Affordable Rental Prices</li>
                <li>✔ Elegant & Exclusive Designs</li>
                <li>✔ Hassle-Free Booking & Delivery</li>
            </ul>

            <h2 className="section-title">Upload Your Own Designs</h2>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="upload-btn" />

            {uploadedImages.length > 0 && (
                <div className="delete-section">
                    <select 
                        value={selectedImageIndex} 
                        onChange={(e) => setSelectedImageIndex(e.target.value)} 
                        className="delete-dropdown"
                    >
                        <option value="">Select Image to Delete</option>
                        {uploadedImages.map((_, index) => (
                            <option key={index} value={index}>Delete Image {index + 1}</option>
                        ))}
                    </select>
                    <button className="delete-btn" onClick={handleDeleteImage}>
                        ❌ Delete Selected Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default HomePage;
