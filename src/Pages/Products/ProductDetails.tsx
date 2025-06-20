import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../Redux/features/products/productsApi";
import Loader from "../../utils/Loader";
import { useAddToCartMutation, useGetCartQuery } from "../../Redux/features/cart/cartApi";
import { useAppSelector } from "../../Redux/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

interface Product {
    _id: string;
    title: string;
    images: string[];
    category: string;
    description: string;
    price: number;
    finalPrice: number;
    discount: number;
    ratings: number;
    ratingsCount: number;
    stock: number;
    brand: string;
    shipping: number;
}

const ProductDetails = () => {
    const user = useAppSelector((state) => state.auth.user);
    interface CartItem {
        productId: { _id: string };
        quantity: number;
        // add other properties if needed
    }

    interface CartData {
        items: CartItem[];
        // add other properties if needed
    }

    const { data: cartItems } = useGetCartQuery(undefined, {
        skip: !user,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,

    }) as { data: CartData | undefined };

    
    const { id } = useParams();
    const { data, isLoading } = useGetProductByIdQuery(id, {
        skip: !id,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const product = data as Product | undefined;
    const existingCartItem = cartItems?.items?.find((item: any) => item?.productId?._id === product?._id)
    const cartQuantity = existingCartItem ? existingCartItem?.quantity : 0;
    const isOutOfStock = cartQuantity >= (product?.stock ?? 0);
    const [selectedImage, setSelectedImage] = useState(0);
    const [cart] = useAddToCartMutation();
    const navigate = useNavigate();

    const addToCart = async (productId: string) => {
        let toastId: string | number | undefined;
        try {
            toastId = toast.loading('Adding to cart...');
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

    if (isLoading) {
        return <Loader />;
    }

    if (!product) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-[60vh] flex items-center justify-center p-4"
            >
                <div className="text-center text-gray-500 max-w-md">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">Product Not Found</h2>
                    <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Browse Products
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start"
                >
                    {/* Image gallery */}
                    <div className="flex flex-col space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg"
                        >
                            <img
                                src={product?.images[selectedImage]}
                                alt={product?.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            {product.discount > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {product.discount}% OFF
                                </div>
                            )}
                        </motion.div>

                        {/* Thumbnail gallery */}
                        <div className="grid grid-cols-4 gap-4">
                            {product?.images?.map((image: string, idx: number) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative aspect-square rounded-lg overflow-hidden ${selectedImage === idx ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Product ${idx + 1}`}
                                        className="w-full h-full object-cover hover:opacity-75 transition-opacity"
                                    />
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Product info */}
                    <div className="mt-10 lg:mt-0 lg:pl-8">
                        <nav className="mb-6">
                            <ol className="flex items-center space-x-2 text-sm">
                                <li><a href="/products" className="text-blue-600 hover:text-blue-800">Products</a></li>
                                <li>/</li>
                                <li><a href={`/products?category=${product.category}`} className="text-blue-600 hover:text-blue-800">{product.category}</a></li>
                            </ol>
                        </nav>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                        >
                            {product?.title}
                        </motion.h1>

                        <div className="flex flex-wrap items-center gap-6 mb-8">
                            <div className="flex items-center">
                                <div className="flex">
                                    {[0, 1, 2, 3, 4].map((rating) => (
                                        <svg
                                            key={rating}
                                            className={`h-6 w-6 ${rating < (product.ratings || 0)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="ml-2 text-gray-600">({product?.ratingsCount} reviews)</p>
                            </div>

                            <div className={`px-4 py-2 rounded-full ${product?.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product?.stock > 0 ? `${product?.stock} in stock` : 'Out of Stock'}
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4 mb-8">
                            <h2 className="text-4xl font-bold text-gray-900">৳{product?.finalPrice?.toFixed(2)}</h2>
                            {product?.discount > 0 && (
                                <>
                                    <span className="text-xl text-gray-500 line-through">৳{product?.price?.toFixed(2)}</span>
                                    <span className="text-lg font-medium text-red-600">Save {product?.discount}%</span>
                                </>
                            )}
                        </div>

                        <div className="prose prose-lg text-gray-700 mb-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                            <div className="space-y-4">{product?.description}</div>
                        </div>

                        <div className="border-t border-gray-200 pt-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                    <h4 className="text-sm text-gray-500 uppercase mb-2">Brand</h4>
                                    <p className="font-medium">{product?.brand || 'N/A'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                    <h4 className="text-sm text-gray-500 uppercase mb-2">Category</h4>
                                    <p className="font-medium">{product?.category}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                    <h4 className="text-sm text-gray-500 uppercase mb-2">Stock</h4>
                                    <p className="font-medium">{product?.stock}</p>
                                </div>
                                {product?.shipping > 0 && (
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <h4 className="text-sm text-gray-500 uppercase mb-2">Shipping</h4>
                                        <p className="font-medium">৳{product?.shipping}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => user ? addToCart(product._id) : navigate('/login')}
                                disabled={isOutOfStock}
                                className={`flex-1 py-4 px-8 text-lg font-medium rounded-xl shadow-lg transition-all
                                    ${isOutOfStock
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'}`}
                            >
                                {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 cursor-pointer py-4 px-8 text-lg font-medium bg-white border-2 border-gray-300 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
                            >
                                Add to Wishlist
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetails;
