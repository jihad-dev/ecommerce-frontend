import { Link } from "react-router-dom";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from "../../Redux/features/cart/cartApi";
import Loader from "../../utils/Loader";
import { toast } from "sonner";
import { useAppSelector } from "../../Redux/hooks";

type CartItem = {
    productId: {
        _id: string;
        title: string;
        description: string;
        images: string[];
        finalPrice: number;
        stock: number;
    };
    quantity: number;
};

type CartType = {
    items: CartItem[];
};

const Cart = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { data: cart, isLoading } = useGetCartQuery(undefined, {
        skip: !user,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    }) as { data: CartType | undefined, isLoading: boolean };
    const [updateCartItem] = useUpdateCartItemMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const cartItems = cart?.items;


    if (isLoading) {
        return <Loader />
    }

    if (!cartItems?.length) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-lg w-full p-6 sm:p-8 md:p-10 text-center">
                    <div className="mb-8 relative">
                        <svg className="w-24 h-24 sm:w-28 sm:h-28 mx-auto text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Your Cart is Empty!!!</h1>
                    <p className="text-gray-600 text-lg sm:text-xl mb-10">Looks like you haven't added anything to your cart yet.</p>
                    <Link
                        to="/products"
                        className="group inline-flex items-center justify-center px-6 py-4 text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        Continue Shopping
                        <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    const handleQuantityChange = async (productId: string, newQuantity: number) => {
        const toastId = toast.loading("Updating quantity...");
        try {
            const res = await updateCartItem({ productId, quantity: newQuantity });
            console.log(res);
            toast.success("Quantity updated", { id: toastId });
        } catch (error) {
            toast.error("Failed to update quantity", { id: toastId });
        }
    };


    const handleRemoveItem = async (productId: string) => {
        const toastId = toast.loading("Removing item...");
        try {
            await removeFromCart({ productId });
            toast.success("Item removed from cart", { id: toastId });
        } catch (error) {
            toast.error("Failed to remove item", { id: toastId });
        }
    };

    
    const subtotal = cartItems.reduce((acc: number, item: any) => acc + (item?.productId?.finalPrice * item?.quantity), 0);
    console.log(subtotal);
    const shipping = 15.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        {cartItems?.map((item: any, index: number) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4">
                                <div className="flex items-center">
                                    <img
                                        src={item?.productId?.images[0]}
                                        alt={item?.productId?.title}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div className="ml-6 flex-1">
                                        <h2 className="text-xl font-semibold">{item?.productId?.title}</h2>
                                        <p className="text-gray-600 mt-1">{item?.productId?.description}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center">
                                                <button
                                                    className={`p-1 hover:bg-gray-100 rounded-full ${item?.quantity <= 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        if (item?.quantity > 1) {
                                                            handleQuantityChange(item?.productId?._id, item?.quantity - 1);
                                                        }
                                                    }}
                                                    disabled={item?.quantity <= 1}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>

                                                <span className="mx-2">{item?.quantity}</span>
                                                <button
                                                    className={`p-1 hover:bg-gray-100 rounded-full ${item?.quantity >= item?.productId?.stock ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        handleQuantityChange(item?.productId?._id, item?.quantity + 1);
                                                    }}
                                                    disabled={item?.quantity >= item?.productId?.stock}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>


                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold">৳{(item?.productId?.finalPrice * item?.quantity).toFixed(2)}</p>
                                                <button
                                                    className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                                                    onClick={() => handleRemoveItem(item?.productId?._id)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>৳{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>৳{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>৳{tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>৳{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <Link  to="/order" state={{ totalPrice:total.toFixed(2)}}>
                                <button className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors">
                                    Proceed to Checkout
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
