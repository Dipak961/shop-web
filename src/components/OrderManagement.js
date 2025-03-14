import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './order.css';

const OrderManagement = ({ bookings, setBookings }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [billNoSearchTerm, setBillNoSearchTerm] = useState('');
    const [startDateSearchTerm, setStartDateSearchTerm] = useState('');
    const [productCodeSearchTerm, setProductCodeSearchTerm] = useState('');

    // Function to format date to DD-MM-YY
    const formatDateToDDMMYY = (date) => {
        if (!date) return 'N/A'; // Return 'N/A' if date is invalid
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A'; // Check if date is valid
        const day = String(d.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Get month and pad with zero
        const year = String(d.getFullYear()).slice(-2); // Get last two digits of the year
        return `${day}-${month}-${year}`; // Format to DD-MM-YY
    };

    const handleDelete = (index) => {
        const updatedBookings = bookings.filter((_, i) => i !== index);
        setBookings(updatedBookings);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    };

    const handleEdit = (index) => {
        const bookingToEdit = { ...bookings[index], index };
        if (!bookingToEdit.products) {
            bookingToEdit.products = [];
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
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
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

    const handleBillNoSearch = (e) => {
        setBillNoSearchTerm(e.target.value);
    };

    const handleStartDateSearch = (e) => {
        setStartDateSearchTerm(e.target.value);
    };

    const handleProductCodeSearch = (e) => {
        setProductCodeSearchTerm(e.target.value);
    };

    const filteredBookings = (bookings || []).filter(booking =>
        booking.billNumber && booking.billNumber.toLowerCase().includes(billNoSearchTerm.toLowerCase()) &&
        (startDateSearchTerm ? booking.startDate === startDateSearchTerm : true) // Check if startDate matches the search term
    );

    const filteredProducts = filteredBookings.filter(booking =>
        booking.products && booking.products.some(product =>
            product.code.toLowerCase().includes(productCodeSearchTerm.toLowerCase())
        )
    );

    const sortedFilteredBookings = filteredProducts.sort((a, b) => {
        const aMatch = a.products.some(p => p.code.toLowerCase().includes(productCodeSearchTerm.toLowerCase()));
        const bMatch = b.products.some(p => p.code.toLowerCase().includes(productCodeSearchTerm.toLowerCase()));

        if (aMatch && !bMatch) {
            return -1;
        } else if (!aMatch && bMatch) {
            return 1;
        }
        return a.billNumber.toLowerCase().includes(billNoSearchTerm.toLowerCase()) ? -1 : 1;
    });

    const totalAmount = bookings.reduce((acc, booking) => acc + Number(booking.totalAmount || 0), 0);
    const totalAdvanceAmount = bookings.reduce((acc, booking) => acc + Number(booking.advanceAmount || 0), 0);

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(bookings.map(booking => ({
            'Bill No': booking.billNumber,
            'Customer Name': booking.customerName,
            'Address': booking.address,
            'Mobile': booking.mobile,
            'Products': booking.products.map(p => `${p.name} (Code: ${p.code})`).join(', '),
            'Start Date': formatDateToDDMMYY(booking.startDate),
            'Return Date': formatDateToDDMMYY(booking.returnDate),
            'Total Amount': booking.totalAmount,
            'Advance Amount': booking.advanceAmount,
            'Balance Amount': (booking.totalAmount || 0) - (booking.advanceAmount || 0),
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
        XLSX.writeFile(workbook, 'Bookings.xlsx');
    };

    return (
        <div>
            <h2>Order Management</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search Bill No"
                    value={billNoSearchTerm}
                    onChange={handleBillNoSearch}
                />
                <input
                    type="date"
                    placeholder="Search Start Date"
                    value={startDateSearchTerm}
                    onChange={handleStartDateSearch}
                />
                <input
                    type="text"
                    placeholder="Search Product Codes"
                    value={productCodeSearchTerm}
                    onChange={handleProductCodeSearch}
                />
            </div>

            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <h3>Edit Booking</h3>
                    <input type="text" name="billNumber" value={currentBooking.billNumber || ''} readOnly />
                    <input type="text" name="customerName" value={currentBooking.customerName || ''} onChange={handleChange} required />
                    <input type="text" name="address" value={currentBooking.address || ''} onChange={handleChange} required />
                    <input type="text" name="mobile" value={currentBooking.mobile || ''} onChange={handleChange} required />
                    <input type="text" name="products" value={currentBooking.products.map(p => p.name).join(', ') || ''} onChange={handleChange} required />
                    <input type="text" name="productCodes" value={currentBooking.products.map(p => p.code).join(', ') || ''} onChange={handleChange} required />
                    <input type="date" name="startDate" value={currentBooking.startDate || ''} onChange={handleChange} required />
                    <input type="date" name="returnDate" value={currentBooking.returnDate || ''} onChange={handleChange} required />
                    <input type="number" name="totalAmount" value={currentBooking.totalAmount || ''} onChange={handleChange} required />
                    <input type="number" name="advanceAmount" value={currentBooking.advanceAmount || ''} onChange={handleChange} required />
                    <input type="number" name="balanceAmount" value={currentBooking.totalAmount - currentBooking.advanceAmount || 0} readOnly />
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
                                    <th>Bill No</th>
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
                                        <td>{booking.billNumber || 'N/A'}</td>
                                        <td>{booking.customerName || 'N/A'}</td>
                                        <td>{booking.address || 'N/A'}</td>
                                        <td>{booking.mobile || 'N/A'}</td>
                                        <td>{booking.products.map(p => `${p.name} (Code: ${p.code})`).join(', ')}</td>
                                        <td>{formatDateToDDMMYY(booking.startDate)}</td>
                                        <td>{formatDateToDDMMYY(booking.returnDate)}</td>
                                        <td>{booking.totalAmount || 0}</td>
                                        <td>{booking.advanceAmount || 0}</td>
                                        <td>{(booking.totalAmount || 0) - (booking.advanceAmount || 0)}</td>
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

            <button className="download-btn" onClick={handleDownloadExcel}>Download as Excel</button>
        </div>
    );
};

export default OrderManagement;