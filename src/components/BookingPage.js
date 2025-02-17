import React, { useState } from 'react';
import './BookingPage.css';

const BookingPage = ({ onSubmit }) => {
    const [billNumber, setBillNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([{ name: '', code: '' }]);
    const [startDate, setStartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [advanceAmount, setAdvanceAmount] = useState('');

    const availableProducts = [
        'Sherwani',
        'Indo Western',
        'Jodhpuri',
        'Blazer',
    ];

    const formatDate = (date) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...selectedProducts];
        newProducts[index][field] = value;
        setSelectedProducts(newProducts);
    };

    const handleAddProduct = () => {
        setSelectedProducts([...selectedProducts, { name: '', code: '' }]);
    };

    const handleRemoveProduct = (index) => {
        const newProducts = [...selectedProducts];
        newProducts.splice(index, 1);
        setSelectedProducts(newProducts);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (totalAmount <= 0 || advanceAmount < 0) {
            alert("Total Amount must be greater than 0 and Advance Amount cannot be negative.");
            return;
        }

        const bookingDetails = {
            billNumber, // Added Bill Number
            customerName,
            address,
            mobile,
            products: selectedProducts,
            startDate: formatDate(startDate),
            returnDate: formatDate(returnDate),
            totalAmount: Number(totalAmount),
            advanceAmount: Number(advanceAmount),
            balanceAmount: Number(totalAmount) - Number(advanceAmount),
        };

        onSubmit(bookingDetails);
        resetForm();
    };

    const resetForm = () => {
        setBillNumber('');
        setCustomerName('');
        setAddress('');
        setMobile('');
        setSelectedProducts([{ name: '', code: '' }]);
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
                    placeholder="Bill Number"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    required
                />
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
                            required={index === 0}
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
                        {index > 0 && (
                            <button type="button" onClick={() => handleRemoveProduct(index)}>Remove</button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddProduct}>Add Product</button>

                {/* Date Inputs with Formatted Display */}
                <label>Start Date:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <p>Selected Start Date: {formatDate(startDate)}</p>

                <label>Return Date:</label>
                <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    required
                />
                <p>Selected Return Date: {formatDate(returnDate)}</p>

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
                    value={totalAmount - advanceAmount} // Auto-calculated
                    readOnly
                />
                <button type="submit">Submit Booking</button>
            </form>
        </div>
    );
};

export default BookingPage;
