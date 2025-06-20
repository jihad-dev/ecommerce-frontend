import { useParams, Link } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../Redux/features/products/productsApi";
import { motion } from "framer-motion";
import Loader from "./Loader";
import AllProductCard from "../components/ProductCard/AllProductCard";
import { FaBoxOpen, FaExclamationTriangle } from "react-icons/fa";

const DynamicCategory = () => {
  const { category } = useParams();
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsByCategoryQuery(category) as {
    data?: any[];
    isLoading: boolean;
    isError: boolean;
  };

  // Capitalize category name for display
  const displayCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Category";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-600">
        <FaExclamationTriangle className="text-4xl mb-2" />
        <div className="text-lg font-semibold">Error loading products for this category.</div>
        <Link to="/" className="mt-4 text-blue-600 underline">Go Home</Link>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FaBoxOpen className="text-4xl mb-2" />
        <div className="text-lg font-semibold">No products found in this category.</div>
        <Link to="/" className="mt-4 text-blue-600 underline">Browse All Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4" aria-label="Breadcrumb">
        <ol className="list-reset flex text-gray-600">
          <li>
            <Link to="/" className="hover:underline text-blue-600">Home</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="font-semibold text-gray-900">{displayCategory}</li>
        </ol>
      </nav>

      {/* Category Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">{displayCategory} Products</h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product: any, index: number) => (
          <motion.div
            key={product._id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col relative group transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 shadow-sm"
          >
            <AllProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DynamicCategory;

