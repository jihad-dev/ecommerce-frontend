// components/ProductCard.tsx
import { motion } from "framer-motion";
import React from "react";
import { FaShoppingCart, FaStar, FaStarHalfAlt } from "react-icons/fa";
const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    // Simple version: just show full stars
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />); // Requires FaStarHalfAlt import
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };
type Product = {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
    description?: string;
    onAddToCart?: (productId: string) => void;
};
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, // Stagger animation
        duration: 0.5
      }
    })
  };

const ProductCard: React.FC<{ product: Product, index: number }> = ({ product, index }) => {
  console.log(product);

    return (
        <motion.div
            key={product.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
            className="bg-white  rounded-lg shadow-md overflow-hidden flex flex-col relative group cursor-pointer"
        >
            <div className="relative pb-[66.66%]"> {/* Aspect ratio container for image */}
                {/* <img
                    src={product?.image[0]}
                    alt={product?.name}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                /> */}
                <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                </span>

            </div>
            <div className="p-4 md:p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product?.name}</h3>
                <div className="flex items-center mb-2">
                    <div className="flex mr-1">{renderStars(product?.rating)}</div>
                    <span className="text-sm text-gray-600">({product?.rating})</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 flex-grow line-clamp-2">{product?.description}</p>
                <div className="flex items-end justify-between mt-auto">
                    <p className="text-xl font-bold text-gray-900">৳{product?.price.toFixed(2)}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors flex items-center justify-center text-sm"
                    >
                        <FaShoppingCart className="mr-1.5" size={14} /> Add to Cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
