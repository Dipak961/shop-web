import React, { useState } from 'react';
import './order.css';

const OrderManagement = ({ bookings, setBookings }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [productCodeSearchTerm, setProductCodeSearchTerm] = useState(''); // State for product code search

    const handleDelete = (index) => {
        const updatedBookings = bookings.filter((_, i) => i !== index);
        setBookings(updatedBookings);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings)); // Update localStorage
    };

    const handleEdit = (index) => {
        const bookingToEdit = { ...bookings[index], index };
        if (!bookingToEdit.products) {
            bookingToEdit.products = [];  // Initialize products array if undefined
        }
        setCurrentBooking(bookingToEdit);
        setIsEditing(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedBookings = bookings.map((booking, index) => 
            index === currentBooking.index ? currentBooking : booking
        );
        setBookings(updatedBookings);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings)); // Update localStorage
        setIsEditing(false);
        setCurrentBooking(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "products" || name === "productCodes") {
            const productNames = name === "products" ? value.split(',').map(p => p.trim()) : currentBooking.products.map(p => p.name);
            const productCodes = name === "productCodes" ? value.split(',').map(c => c.trim()) : currentBooking.products.map(p => p.code);

            const updatedProducts = productNames.map((name, index) => ({
                name,
                code: productCodes[index] || ''
            }));
            
            setCurrentBooking((prev) => ({ ...prev, products: updatedProducts }));
        } else {
            setCurrentBooking((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleProductSearch = (e) => {
        setProductSearchTerm(e.target.value);
    };

    const handleProductCodeSearch = (e) => { // Handler for product code search
        setProductCodeSearchTerm(e.target.value);
    };

    // First filter the bookings by customer name and product code
    const filteredBookings = (bookings || []).filter(booking =>
        booking.customerName && booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Now filter bookings by matching products' names or product codes
    const filteredProducts = filteredBookings.filter(booking =>
        booking.products && booking.products.some(product => 
            (product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) || 
            product.code.toLowerCase().includes(productCodeSearchTerm.toLowerCase())) // Product code search logic
        )
    );

    // Sort the filtered products so that matched ones come to the top
    const sortedFilteredBookings = filteredProducts.sort((a, b) => {
        const aMatch = a.products.some(p => p.code.toLowerCase().includes(productCodeSearchTerm.toLowerCase()));
        const bMatch = b.products.some(p => p.code.toLowerCase().includes(productCodeSearchTerm.toLowerCase()));

        if (aMatch && !bMatch) {
            return -1; // a comes before b if a matches and b doesn't
        } else if (!aMatch && bMatch) {
            return 1; // b comes before a if b matches and a doesn't
        }

        // If both or neither match the product code, sort by customer name
        return a.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ? -1 : 1;
    });

    const totalAmount = bookings.reduce((acc, booking) => acc + Number(booking.totalAmount || 0), 0);
    const totalAdvanceAmount = bookings.reduce((acc, booking) => acc + Number(booking.advanceAmount || 0), 0);

    return (
        <div>
            <h2>Order Management</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search Customer Name"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <input
                    type="text"
                    placeholder="Search Products"
                    value={productSearchTerm}
                    onChange={handleProductSearch}
                />
                <input
                    type="text"
                    placeholder="Search Product Codes" // Input for product code search
                    value={productCodeSearchTerm}
                    onChange={handleProductCodeSearch}
                />
            </div>
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <h3>Edit Booking</h3>
                    <input
                        type="text"
                        name="customerName"
                        placeholder="Customer Name"
                        value={currentBooking.customerName || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={currentBooking.address || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={currentBooking.mobile || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="products"
                        placeholder="Products (comma separated)"
                        value={currentBooking.products.map(p => p.name).join(', ') || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="productCodes"
                        placeholder="Product Codes (comma separated)"
                        value={currentBooking.products.map(p => p.code).join(', ') || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="startDate"
                        value={currentBooking.startDate || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="returnDate"
                        value={currentBooking.returnDate || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="totalAmount"
                        placeholder="Total Amount"
                        value={currentBooking.totalAmount || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="advanceAmount"
                        placeholder="Advance Amount"
                        value={currentBooking.advanceAmount || ''}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="balanceAmount"
                        placeholder="Balance Amount"
                        value={currentBooking.totalAmount - currentBooking.advanceAmount || 0} // Calculate balance dynamically
                        readOnly
                    />
                    <button type="submit">Update Booking</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <>
                    {sortedFilteredBookings.length === 0 ? (
                        <p>No bookings found.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Address</th>
                                    <th>Mobile</th>
                                    <th>Products</th>
                                    <th>Start Date</th>
                                    <th>Return Date</th>
                                    <th>Total Amount</th>
                                    <th>Advance Amount</th>
                                    <th>Balance Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedFilteredBookings.map((booking, index) => (
                                    <tr key={index}>
                                        <td>{booking.customerName || 'N/A'}</td>
                                        <td>{booking.address || 'N/A'}</td>
                                        <td>{booking.mobile || 'N/A'}</td>
                                        <td>
                                            {booking.products.map(p => `${p.name} (Code: ${p.code})`).join(', ')}
                                        </td>
                                        <td>{booking.startDate || 'N/A'}</td>
                                        <td>{booking.returnDate || 'N/A'}</td>
                                        <td>{booking.totalAmount || 0}</td>
                                        <td>{booking.advanceAmount || 0}</td>
                                        <td>{(booking.totalAmount || 0) - (booking.advanceAmount || 0)}</td> {/* Calculate balance dynamically */}
                                        <td>
                                            <button onClick={() => handleEdit(index)}>Edit</button>
                                            <button onClick={() => handleDelete(index)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <h3>Total Amount: {totalAmount}</h3>
                    <h3>Total Advance Amount: {totalAdvanceAmount}</h3>
                </>
            )}
        </div>
    );
};

export default OrderManagement;
