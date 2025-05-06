import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Context from "../context";
import summaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import AddressSelection from '../components/AddressSelection';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');

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





    useEffect(() => {
        fetchCartData();

    }, []);


    const handlePayment = async () => {
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
                    cartItems: data,
                })
            });

            const result = await response.json();

            console.log("Payment response result:", result); // Log the full result for debugging

            // Check if result has a success field and id
            if (result?.success && result?.id) {
                const sessionId = result.id; // Directly access the id here

                const { error } = await stripe.redirectToCheckout({ sessionId });

                if (error) {
                    toast.error("Payment failed: " + error.message);
                }
            } else {
                toast.error("Payment failed: Invalid response data");
                console.error("Invalid response data:", result); // Log invalid response
            }

        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment processing failed");
        } finally {
            setLoading(false);
        }

        navigate("/success");
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
                <div className='w-full max-w-3xl overflow-y-scroll md:h-[calc(100vh-190px)] h-[calc(100vh-730px)] scrollbar-none '>
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
                                        loading="lazy"
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


                        <AddressSelection />

                        <div className='bg-white rounded-lg shadow-md overflow-hidden'>


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

                                >
                                    Proceed to payment
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