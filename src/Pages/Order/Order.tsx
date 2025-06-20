import React, { useState, FormEvent } from 'react';
import { useClearCartMutation, useGetCartQuery } from '../../Redux/features/cart/cartApi';
import { useAppSelector } from '../../Redux/hooks';
import { toast } from 'sonner';
import Loader from '../../utils/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCreateOrderMutation } from '../../Redux/features/order/orderApi';

// Define the expected structure for cart items and the overall cart data
interface Product {
    _id: string;
    title: string;
    images: string[];
    price: number;
}

interface CartItem {
    productId: Product;
    quantity: number;
}

interface CartData {
    items: CartItem[];
    // Add other potential properties from your API response if necessary
}

// Define a type for the error structure from RTK Query
interface RtkError {
    status: number;
    data: {
        message: string;
        // Include other potential error fields if known
    };
}

// Define the expected structure for the successful response
interface PaymentSession {
    payment_url?: string; // Optional based on your API
}

interface CreateOrderSuccessResponse {
    data?: {
        paymentSession?: PaymentSession;
        // Include other potential properties in the data object if relevant
    };
    // Include other top-level properties if relevant
}

const Order = () => {
    const [createOrder, { isLoading: isOrderLoading }] = useCreateOrderMutation();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [clearCart] = useClearCartMutation();
    const user = useAppSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const location = useLocation();
    const totalPrice = location.state?.totalPrice;
    // Fetch data first
    const { data, isLoading } = useGetCartQuery(undefined, {
        skip: !user,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    // Explicitly type cart after fetching
    const cart: CartData | undefined = data as CartData | undefined;

    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
    });
    // Define payment methods
    const paymentOptions = [
        { id: 'Card', name: 'Credit/Debit Card', description: 'Pay securely using your credit or debit card.', buttonText: 'Pay Now' },
        { id: 'Nagad', name: 'Nagad', description: 'Pay using your Nagad account.', buttonText: 'Pay Now' },
        {
            id: 'bKash', name: 'Save bKash Account', description: <>
                <p>1) Users paying with bkash for the first time: Enter bKash Wallet Number and OTP for successful account saving.</p>
                <p>2) For all subsequent users: Enter PIN to make payment</p>
                <p className="mt-2 font-semibold">Disclaimer: you will be redirected back to Checkout for first transaction to complete payment</p>
                <p className="mt-2 font-semibold">Please Note</p>
                <ol className="list-decimal list-inside ml-4">
                    <li>You have an activated bKash account</li>
                    <li>Ensure you have sufficient balance in your bKash account to cover the total cost of the order</li>
                    <li>Ensure you are able to receive your OTP (one-time-password) on your mobile and have bKash PIN</li>
                </ol>
                <p className="mt-2 font-bold">***Please note that one bkash account can only be saved in one Daraz account.***</p>
            </>, buttonText: 'Pay Now'
        },
        {
            id: 'COD', name: 'Cash on Delivery', description: <>
                <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>You may pay in cash to our courier upon receiving your parcel at the doorstep</li>
                    <li>Before agreeing to receive the parcel, check if your delivery status has been updated to 'Out for Delivery'</li>
                    <li>Before receiving, confirm that the airway bill shows that the parcel is from Daraz</li>
                    <li>Before you make payment to the courier, confirm your order number, sender information and tracking number on the parcel</li>
                </ul>
            </>, buttonText: 'Confirm Order'
        },


    ];
    // Initialize with 'COD' as default
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('COD');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShippingInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const selectedMethod = paymentOptions.find(p => p.id === selectedPaymentMethodId)?.name || 'Unknown';
        const toastId = toast.loading("Processing order...");
        if (!cart?.items?.length) {
            toast.error("Your cart is empty.", { id: toastId });
            return;
        }
        if (!user?.id) {
            toast.error("User not found. Please log in.", { id: toastId });
            return;
        }
        if (!totalPrice) {
            toast.error("Total price is missing.", { id: toastId });
            return;
        }


        try {
            const formattedOrderItems = cart.items.map(item => ({
                product: item.productId._id,
                qty: item.quantity,
                price: item.productId.price
            }));

            if (!formattedOrderItems.length) {
                toast.error("No items to order.", { id: toastId });
                return;
            }
            const orderData = {
                userId: user?.id,
                phone: user?.phone,
                orderItems: formattedOrderItems,
                shippingInfo,
                paymentMethod: selectedMethod,
                totalPrice,
                status: "Pending" // Consider if this should be set on the backend
            };

            // Validate shipping info - basic check
            if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
                toast.error("Please fill in all shipping information.", { id: toastId });
                return;
            }
            const res = await createOrder(orderData).unwrap() as CreateOrderSuccessResponse;

            if (selectedMethod === 'Cash on Delivery') {
                toast.success("Order placed successfully!", { id: toastId });
                clearCart({});
                navigate('/my-order');
            } else {
                // Check if the payment URL exists before redirecting
                const paymentUrl = res?.data?.paymentSession?.payment_url;
                

                if (paymentUrl) {
                    toast.success("Redirecting to payment page...", { id: toastId });
                    setIsRedirecting(true);

                    setTimeout(() => {
                        clearCart({});
                        window.location.href = paymentUrl;

                    }, 1000);
                } else {
                    // Handle cases where the payment URL is missing
                    console.error("Payment URL not found in response:", res);
                    toast.error("Could not initiate payment. Please try again or contact support.", { id: toastId });
                }
            }


        } catch (error) {
            console.error("Failed to create order:", error); // Log the detailed error for debugging

            let errorMessage = "Failed to place order. Please try again."; // Default error message

            // Check if it's an RTK Query error object
            if (typeof error === 'object' && error !== null && 'status' in error && 'data' in error) {
                const rtkError = error as RtkError;
                if (rtkError.data && typeof rtkError.data === 'object' && 'message' in rtkError.data) {
                    // Use the server's error message if available and it's a string
                    if (typeof rtkError.data.message === 'string') {
                        errorMessage = rtkError.data.message;
                    }
                }
            } else if (error instanceof Error) {
                errorMessage = error.message; // Use message from standard Error object
            }

            toast.error(errorMessage, { id: toastId });
        }
    };


    if (isLoading) return <Loader />;

    if (!isRedirecting && !cart?.items?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <p className="text-gray-600">Please add items to your cart before checking out</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {cart?.items?.map((item: any) => (
                            <div key={item.productId._id} className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <img
                                        src={item.productId.images[0]}
                                        alt={item.productId.title}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="ml-4">
                                        <p className="font-medium">{item.productId.title}</p>
                                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-semibold">৳{(item.productId.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>৳{totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shippingInfo.address}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                value={shippingInfo.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={shippingInfo.city}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="postalCode" className="block text-gray-700 mb-2">Postal Code</label>
                            <input
                                type="number" // Changed to number for potentially better validation/input control
                                id="postalCode"
                                name="postalCode"
                                value={shippingInfo.postalCode}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            // Consider adding min/max or pattern if applicable
                            />
                        </div>
                        <div>
                            <label htmlFor="country" className="block text-gray-700 mb-2">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value={shippingInfo.country}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mt-8 mb-4">Select Payment Method</h2>
                    {/* Payment Method Selection Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                        {paymentOptions.map((option) => (
                            <button
                                type="button" // Important: Prevent form submission
                                key={option.id}
                                onClick={() => setSelectedPaymentMethodId(option.id)}

                                className={`p-4 border rounded-lg text-center transition-colors duration-200
                                            ${selectedPaymentMethodId === option.id ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                            >
                                {/* Placeholder for Icon */}
                                <div className="mb-2 text-2xl">{/* Icon could go here */}</div>
                                <span className="block text-sm font-medium">{option.name}</span>
                                <span className="block text-xs text-gray-500">{option.id === 'COD' ? 'Cash on Delivery' : option.id === 'Card' ? 'Credit/Debit Card' : ''}</span>
                            </button>
                        ))}
                    </div>

                    {/* Payment Method Details */}
                    <div className="bg-white rounded-lg shadow-inner p-6 border border-gray-200 min-h-[150px]">
                        {paymentOptions.find(p => p.id === selectedPaymentMethodId)?.description}
                    </div>


                    <button
                        type="submit"
                        disabled={isOrderLoading} // Disable button while processing
                        className={`w-full mt-8 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 text-lg font-semibold ${isOrderLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isOrderLoading ? 'Processing...' : (paymentOptions.find(p => p.id === selectedPaymentMethodId)?.buttonText || 'Place Order')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Order;
