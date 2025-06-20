import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../Redux/hooks';
import { useAddToCartMutation, useGetCartQuery } from '../../Redux/features/cart/cartApi';
import { toast } from 'sonner';

// removed: import styles from './ProductCard.module.css';

// Define the structure of a Product based on the provided JSON
export interface Product {
    _id: string | number;
    title: string; // Changed from name
    description: string;
    images: string[]; // Changed from { url: string }[]
    price: number; // Original price
    discount?: number; // Optional discount percentage
    finalPrice: number; // Price after discount
    category: string;
    // type?: string; // Optional field from JSON
    brand?: string; // Optional field from JSON
    stock: number;
    isFeatured: boolean;
    // quantity?: number; // Field from JSON, not typically needed on card
    // tags?: string[]; // Optional field from JSON
    ratings?: number; // Optional rating value
    ratingsCount?: number; // Optional count of ratings
    // isFeatured?: boolean; // Optional field from JSON
    // status?: string; // Optional field from JSON
    // shipping?: number; // Optional field from JSON
    // seller?: string; // Optional field from JSON
    // isDeleted?: boolean; // Optional field from JSON
    // __v?: number; // Optional field from JSON
}

interface ProductCardProps {
    product: Product;
}

// Simple Star Icon component (replace with a proper icon library if available)
const StarIcon = () => (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

// Simple Heart Icon component (replace with a proper icon library if available)
const HeartIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

// Simple Cart Icon component
const CartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const AllProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const user = useAppSelector((state) => state.auth.user);
    const { data: cartItems } = useGetCartQuery(undefined, {
        skip: !user,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,

    });


    const items = (cartItems as { items?: any[] } | undefined)?.items ?? [];
    const existingCartItem = items.find((item: any) => item.productId?._id === product._id);
    const cartQuantity = existingCartItem ? existingCartItem?.quantity : 0;
    const isOutOfStock = cartQuantity >= product?.stock;

    const [cart] = useAddToCartMutation();
    const navigate = useNavigate();


    const addToCart = async (productId: string) => {

        let toastId: string | number | undefined; // Declare toastId here
        try {
            toastId = toast.loading('Adding to cart...'); // Assign value inside try
            const res: any = await cart({ productId, quantity: 1 });

            if (res?.data?.success) {
                toast.success('Product added to cart successfully!', { id: toastId });
            } else if (res?.error) {
                toast.error(res.error.data.message || 'Failed to add product to cart', { id: toastId });
            }
        } catch (error) {
            toast.error('Something went wrong! Please try again.', { id: toastId });
            console.error('Add to cart error:', error);
        }
    }


    const getStockStatusClasses = (stock: number) => {
        if (stock > 10) {
            return 'text-green-600'; // In Stock
        }
        if (stock > 0) {
            return 'text-yellow-600'; // Only X left
        }
        return 'text-red-600'; // Out of Stock
    };

    const getStockStatusText = (stock: number) => {
        if (stock > 10) {
            return 'In Stock';
        }
        if (stock > 0) {
            return `Only ${stock} left`;
        }
        return 'Out of Stock';
    };



    const discountPercent = product.discount; // Use discount field directly if it's percentage
    const isFeaturedProduct = product.isFeatured; // Use discount field directly if it's percentage



    const stockStatusText = getStockStatusText(product.stock);
    const stockStatusClasses = getStockStatusClasses(product.stock);
    const rating = product.ratings ?? 0; // Default to 0 if undefined
    const reviewCount = product.ratingsCount ?? 0; // Use ratingsCount, default to 0

    return (
        <Link to={`/product/${product._id}`} className=" rounded-lg overflow-hidden  flex flex-col  transition-shadow duration-300 ease-in-out group">
            <div className="relative w-full pt-[75%]"> {/* Aspect ratio container */}
                <img
                    src={product.images?.[0]} // Use images[0] directly
                    alt={product.title} // Use title
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {(discountPercent && discountPercent > 0) && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        -{discountPercent}%
                    </span>
                )}

                {isFeaturedProduct && (
                    <span className={`absolute top-2 ${discountPercent && discountPercent > 0 ? 'left-[72px]' : 'left-2'} bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-10`}>
                        Featured
                    </span>
                )}

                <button
                    className="absolute top-2 right-2 bg-white/80 border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-gray-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200 z-10"
                    aria-label="Add to wishlist"
                >
                    <HeartIcon />
                </button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    {rating > 0 ? <StarIcon /> : <span className="w-4 h-4"></span>} {/* Placeholder if no rating */}
                    {rating > 0 && <span>{rating.toFixed(1)}</span>}
                    <span className="ml-1">({reviewCount} ratings)</span> {/* Use reviewCount */}
                </div>
                <h3 className="text-base font-semibold mb-2 hover:underline text-gray-800 line-clamp-2 min-h-[2.8em] group-hover:text-blue-600 transition-colors">

                    <button className='text-blue-600 hover:text-blue-700 hover:underline cursor-pointer'> {product.title} </button>


                </h3>

                <div className="mt-auto"> {/* Pushes price and stock down */}
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-lg font-bold ${discountPercent && discountPercent > 0 ? 'text-red-600' : 'text-gray-900'}`}> {/* Check discount */}
                            ৳{product.finalPrice.toFixed(2)} {/* Use finalPrice */}
                        </span>
                        {discountPercent && discountPercent > 0 && product.price > product.finalPrice && ( // Check discount and prices
                            <span className="text-sm text-gray-500 line-through">
                                ৳{product.price.toFixed(2)} {/* Use price as original */}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${stockStatusClasses}`}>
                            {stockStatusText}
                        </span>
                        <button

                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200
                               ${isOutOfStock
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'}`}
                            disabled={isOutOfStock}
                            onClick={(event) => {
                                event.stopPropagation(); // link e jete dibe na
                                event.preventDefault(); // link default behavior bondho

                                if (isOutOfStock) return;

                                if (user) {
                                    addToCart(product._id.toString());
                                } else {
                                    navigate('/login');
                                }
                            }}
                        >
                            <CartIcon />
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}

                        </button>

                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AllProductCard; 