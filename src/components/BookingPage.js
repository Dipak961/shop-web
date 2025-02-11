import React, { useState } from 'react';
import './BookingPage.css';

const BookingPage = ({ bookings, setBookings, onSubmit, products }) => {
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([{ name: '', code: '' }, { name: '', code: '' }, { name: '', code: '' }, { name: '', code: '' }]);
    const [startDate, setStartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');

    const availableProducts = [
        'Sherwani',
        'Indo Western',
        'Jodhpuri',
        'Blazer',
        // Add more products as needed
    ];

    const handleProductChange = (index, field, value) => {
        const newProducts = [...selectedProducts];
        newProducts[index][field] = value;
        setSelectedProducts(newProducts);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (totalAmount <= 0 || advanceAmount < 0) {
            alert("Total Amount must be greater than 0 and Advance Amount cannot be negative.");
            return;
        }

        const bookingDetails = {
            customerName,
            address,
            mobile,
            products: selectedProducts,
            startDate,
            returnDate,
            totalAmount: Number(totalAmount),
            advanceAmount: Number(advanceAmount),
            balanceAmount: Number(totalAmount) - Number(advanceAmount),
        };

        // Call onSubmit to handle booking submission
        onSubmit(bookingDetails);

        resetForm();
    };

    const resetForm = () => {
        setCustomerName('');
        setAddress('');
        setMobile('');
        setSelectedProducts([{ name: '', code: '' }, { name: '', code: '' }, { name: '', code: '' }, { name: '', code: '' }]);
        setStartDate('');
        setReturnDate('');
        setTotalAmount('');
        setAdvanceAmount('');
    };

    return (
        <div>
            <h2>Booking Page</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                />

                {/* Product Selection */}
                {selectedProducts.map((product, index) => (
                    <div key={index}>
                        <label>Product {index + 1}:</label>
                        <select
                            value={product.name}
                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                            required
                        >
                            <option value="">Select a product</option>
                            {availableProducts.map((availableProduct, idx) => (
                                <option key={idx} value={availableProduct}>
                                    {availableProduct}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Enter Product Code"
                            value={product.code}
                            onChange={(e) => handleProductChange(index, 'code', e.target.value)}
                        />
                    </div>
                ))}

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Total Amount"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Advance Amount"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Balance Amount"
                    value={totalAmount - advanceAmount} // Calculate balance dynamically
                    readOnly
                />
                <button type="submit">Submit Booking</button>
            </form>
        </div>
    );
};

export default BookingPage;
