import { useGetAllCategoriesQuery } from '../../Redux/features/categories/categoryApi';
import { motion } from 'framer-motion';
import { useGetAllProductsQuery } from '../../Redux/features/products/productsApi';
import Loader from '../../utils/Loader';
import { FaEdit, FaTrash } from 'react-icons/fa';

// Placeholder types - Define properly in shared types files
interface Product {
    _id: string;
    category: string;
    // Add other product properties if needed
}

interface Category {
    _id: string;
    name: string;
    image: string;
    description?: string;
}

interface ApiResponse<T> {
    data?: T[];
    // Add other potential API response fields (message, success, etc.)
}

const AllCategories = () => {
    // Explicitly type the hook results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: categories, isLoading: isLoadingCategories } = useGetAllCategoriesQuery<any>(undefined,{
        refetchOnMountOrArgChange: true,    
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const { data: products} = useGetAllProductsQuery<ApiResponse<Product>>(undefined,{
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });

    // Count products per category
    const getProductCountByCategory = (categoryName: string) => {
        // Now 'products' is correctly typed as Product[]
        return products?.filter((product: Product) => product?.category === categoryName).length || 0;
    };

    if (isLoadingCategories) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader/>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen"
        >
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    All Categories
                </h1>
                <p className="text-md text-gray-600 max-w-2xl">
                    Manage your product categories and organize your inventory efficiently
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories && categories?.map((category: Category) => (
                    <motion.div
                        key={category._id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                        <div className="relative h-36 overflow-hidden">
                            <img 
                                src={category.image} 
                                alt={category.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <span className="absolute bottom-4 left-4 text-white font-semibold text-xl">
                                {category.name}
                            </span>
                        </div>
                        
                        <div className="p-6">
                           
                            
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    {getProductCountByCategory(category.name)} Products
                                </span>
                                
                                <div className="flex gap-2">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    >
                                        <FaEdit size={18} />
                                    </motion.button>
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <FaTrash size={18} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {categories && categories?.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16 bg-white rounded-lg shadow-sm"
                >
                    <p className="text-gray-500 text-lg">No categories found</p>
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Add Your First Category
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AllCategories;
