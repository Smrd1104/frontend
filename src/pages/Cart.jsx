import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Context from "../context";
import summaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
    const navigate = useNavigate();
    const context = useContext(Context);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        pincode: '',
        city: '',
        state: ''
    });

    const fetchCartData = async () => {
        setLoading(true);
        try {
            const response = await fetch(summaryApi.addToCartProductView.url, {
                method: summaryApi.addToCartProductView.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                }
            });
            const responseData = await response.json();
            if (responseData?.success) {
                setData(responseData?.data);
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            toast.error("Failed to load cart items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, []);

    const updateQuantity = async (id, newQuantity) => {
        try {
            const response = await fetch(summaryApi.updateCartProduct.url, {
                method: summaryApi.updateCartProduct.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: newQuantity
                })
            });
            const responseData = await response.json();
            if (responseData.success) {
                fetchCartData();
                context.fetchUserAddToCart();
                toast.success("Quantity updated");
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
            toast.error("Failed to update quantity");
        }
    };

    const deleteCartProduct = async (id) => {
        try {
            const response = await fetch(summaryApi.deleteCartProduct.url, {
                method: summaryApi.deleteCartProduct.method,
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ _id: id })
            });
            const responseData = await response.json();
            if (responseData.success) {
                fetchCartData();
                context.fetchUserAddToCart();
                toast.success("Product removed from cart");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to remove product");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateDeliveryDetails = () => {
        const requiredFields = ['name', 'phone', 'email', 'address', 'pincode', 'city', 'state'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());

        if (missingFields.length > 0) {
            setError(`Please fill out: ${missingFields.join(', ')}`);
            return false;
        }

        // Basic phone validation
        if (!/^\d{10}$/.test(formData.phone)) {
            setError("Please enter a valid 10-digit phone number");
            return false;
        }

        // Basic email validation
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        setError("");
        return true;
    };

    const handlePayment = async () => {
        if (!validateDeliveryDetails()) {
            setIsDeliveryOpen(true);
            return;
        }

        setLoading(true);
        try {
            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

            const response = await fetch(summaryApi.payment.url, {
                method: summaryApi.payment.method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    shippingDetails: formData,
                    cartItems: data,
                })
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.message);
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId: result.id
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment processing failed");
        } finally {
            setLoading(false);
        }

        navigate("/success")
    };

    const totalQty = data.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = data.reduce((total, item) => total + (item.quantity * item.productId.sellingPrice), 0);

    return (
        <div className='container mx-auto p-4'>
            <div className='text-center text-lg my-3'>
                {data.length === 0 && !loading && (
                    <p className='bg-white py-5'>Your cart is empty</p>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/* Product List */}
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        Array(context.cartProductCount).fill(null).map((_, index) => (
                            <div key={`loading-${index}`} className='w-full h-32 bg-slate-200 my-2 border border-slate-300 animate-pulse rounded'></div>
                        ))
                    ) : (
                        data.map((product) => (
                            <div key={product._id} className='w-full h-32 bg-white my-2 border border-slate-300 rounded flex'>
                                <div className='w-32 h-32 bg-slate-200'>
                                    <img
                                        src={product?.productId?.productImage[0]}
                                        className='w-full h-full object-scale-down mix-blend-multiply'
                                        alt={product?.productId?.productName}
                                    />
                                </div>
                                <div className='px-4 py-2 relative w-full'>
                                    <div
                                        className='absolute right-2 top-2 p-2 hover:bg-red-600 hover:text-white text-red-600 rounded-full cursor-pointer'
                                        onClick={() => deleteCartProduct(product._id)}
                                    >
                                        <MdDelete />
                                    </div>
                                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>
                                        {product?.productId?.productName}
                                    </h2>
                                    <p className='text-slate-400 capitalize'>{product?.productId?.category}</p>

                                    <div className='flex justify-between items-center'>
                                        <p className='text-red-500 font-medium text-md lg:text-lg'>
                                            {displayINRCurrency(product?.productId?.sellingPrice)}
                                        </p>
                                        <p className='text-red-500 font-medium text-md lg:text-lg'>
                                            {displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-2 mt-2'>
                                        <button
                                            className='text-center w-6 h-6 rounded hover:bg-red-600 hover:text-white text-red-500 border border-red-600 cursor-pointer'
                                            onClick={() => updateQuantity(product._id, product.quantity - 1)}
                                            disabled={product.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{product.quantity}</span>
                                        <button
                                            className='w-6 h-6 text-red-500 rounded hover:bg-red-600 hover:text-white border border-red-600 cursor-pointer'
                                            onClick={() => updateQuantity(product._id, product.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary Section */}
                {data[0] && (
                    <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                            {/* Delivery Details */}
                            <div
                                className="flex justify-between items-center bg-gray-100 px-4 py-3 cursor-pointer"
                                onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                            >
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Delivery Details
                                </h3>
                                {isDeliveryOpen ? <FaMinus /> : <FaPlus />}
                            </div>

                            {isDeliveryOpen && (
                                <div className="p-4 border-t">
                                    {error && (
                                        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 gap-3 mb-4">
                                        {[
                                            { name: 'name', label: 'Full Name', type: 'text' },
                                            { name: 'phone', label: 'Phone Number', type: 'tel' },
                                            { name: 'email', label: 'Email', type: 'email' },
                                            { name: 'address', label: 'Address', type: 'text' },
                                            { name: 'pincode', label: 'Pincode', type: 'text' },
                                            { name: 'city', label: 'City', type: 'text' },
                                            { name: 'state', label: 'State', type: 'text' }
                                        ].map((field) => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {field.label}
                                                </label>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded text-sm"
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className='border-t border-gray-200 px-4 py-3'>
                                <h3 className='text-lg font-semibold text-gray-700 mb-3'>Order Summary</h3>
                                <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Subtotal ({totalQty} items)</span>
                                        <span className='font-medium'>{displayINRCurrency(totalPrice)}</span>
                                    </div>
                                    {/* <div className='flex justify-between'>
                                        <span className='text-gray-600'>Shipping</span>
                                        <span className='font-medium'>{displayINRCurrency(shipping_rate)}</span>
                                    </div> */}
                                    <div className='border-t border-gray-200 pt-2 mt-2'>
                                        <div className='flex justify-between font-bold'>
                                            <span>Total</span>
                                            <span className='text-red-600'>{displayINRCurrency(totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <div className='p-4 bg-gray-50'>
                                <button
                                    onClick={handlePayment}
                                    className={`w-full py-3 rounded font-medium text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Proceed to Payment'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;