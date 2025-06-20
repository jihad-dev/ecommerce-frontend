import React, { useState, useMemo } from 'react';
import { useGetAllCategoriesQuery } from '../../Redux/features/categories/categoryApi';
import { useGetAllProductsQuery } from '../../Redux/features/products/productsApi';
import AllProductCard, { Product } from '../../components/ProductCard/AllProductCard';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../utils/Loader';

// Define or import Category type if possible
// For now, using 'any' as a placeholder, replace with actual type if available
type Category = any;

const SORT_OPTIONS = [
    'Best Rating',
    'Price: Low to High',
    'Price: High to Low',
    'Newest Arrivals'
];

const PRODUCTS_PER_PAGE = 9;

// --- Component ---
const Products = () => {
   
    const { data: categoriesData } = useGetAllCategoriesQuery(undefined);
    const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery(undefined);
    // Explicitly type the arrays, providing default empty arrays if data is null/undefined
    const CATEGORIES: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
    const ALL_PRODUCTS: Product[] = Array.isArray(productsData) ? productsData : [];

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 }); // Initial max might need adjustment
    const [currentMin, setCurrentMin] = useState(0);
    const [currentMax, setCurrentMax] = useState(2000);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(1);

    // --- Filtering Logic ---
    const filteredProducts = useMemo(() => {
        if (!ALL_PRODUCTS || ALL_PRODUCTS.length === 0) return [];

        let result = [...ALL_PRODUCTS];

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter((p) => p.category === selectedCategory);
        }

        // Filter by price (use discountPrice if available, otherwise original price)
        result = result.filter((p) => {
            const priceToCompare = p.finalPrice ?? p.price;
            return priceToCompare >= priceRange.min && priceToCompare <= priceRange.max;
        });

        return result;
    }, [ALL_PRODUCTS, selectedCategory, priceRange]);

    // --- Sorting Logic ---
    const sortedProducts = useMemo(() => {
        let result = [...filteredProducts];

        switch (sortBy) {
            case 'Price: Low to High':
                result.sort((a: any, b: any) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
                break;
            case 'Price: High to Low':
                result.sort((a: any, b: any) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
                break;
            case 'Newest Arrivals':
                // Assuming presence of a createdAt field, otherwise sort by ID
                result.sort((a: any, b: any) =>
                    (b.createdAt ? new Date(b.createdAt).getTime() : b._id) -
                    (a.createdAt ? new Date(a.createdAt).getTime() : a._id)
                );
                break;
            case 'Best Rating':
            default:
                result.sort((a, b) => (b.ratings ?? 0) - (a.ratings ?? 0));
                break;
        }
        return result;
    }, [filteredProducts, sortBy]);

    // --- Get max price from all products for slider --- TODO: Maybe adjust dynamically based on category?
    const maxProductPrice = useMemo(() => {
        if (!ALL_PRODUCTS || ALL_PRODUCTS.length === 0) return 2000; // Default max
        return Math.ceil(Math.max(...ALL_PRODUCTS.map(p => p.price)) / 100) * 100; // Round up to nearest 100
    }, [ALL_PRODUCTS]);

    // Update initial max price once products load
    React.useEffect(() => {
        if (maxProductPrice > 0 && currentMax === 2000) { // Only set initial max if not already adjusted
            setCurrentMax(maxProductPrice);
            setPriceRange(prev => ({ ...prev, max: maxProductPrice }));
        }
    }, [maxProductPrice, currentMax]);


    // --- Pagination Logic ---
    const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE));
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        return sortedProducts.slice(startIndex, endIndex);
    }, [sortedProducts, currentPage]);

    // --- Event Handlers ---
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.max(0, Number(e.target.value));
        setCurrentMin(Math.min(newMin, currentMax)); // Ensure min doesn't exceed max
    };

    const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Number(e.target.value);
        setCurrentMax(Math.max(newMax, currentMin)); // Ensure max doesn't go below min
    };

    // Apply price range filter when slider thumbs stop moving (or on input blur)
    // Using useEffect with currentMin/currentMax for simplicity, debounce would be better
    React.useEffect(() => {
        setPriceRange({ min: currentMin, max: currentMax });
        setCurrentPage(1); // Reset page when price changes
    }, [currentMin, currentMax]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // --- Loading State --- //
    if (productsLoading) {
        return <Loader />
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl mx-auto">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
                    <div className="bg-white p-5 rounded-lg shadow-sm sticky top-24"> {/* Sticky sidebar */}
                        {/* Categories Filter */}
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">Categories</h3>
                            <ul className="space-y-2">
                                <li>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition-colors">
                                        <input
                                            type="radio"
                                            name="category"
                                            value="All"
                                            checked={selectedCategory === 'All'}
                                            onChange={() => handleCategoryChange('All')}
                                            className="cursor-pointer accent-blue-600 w-4 h-4"
                                        />
                                        All Categories
                                    </label>
                                </li>
                                {CATEGORIES?.map((category: any) => (
                                    <li key={category?._id}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-blue-600 transition-colors">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={category?.name}
                                                checked={selectedCategory === category?.name}
                                                onChange={() => handleCategoryChange(category?.name)}
                                                className="cursor-pointer accent-blue-600 w-4 h-4"
                                            />
                                            {category?.name}
                                            
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Price Range</h3>
                            <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                                <span>৳{currentMin}</span>
                                <span>৳{currentMax}</span>
                            </div>
                            {/* Simple dual range slider placeholder - Use a library for a proper one */}
                            <div className="relative h-2 bg-gray-200 rounded-full mb-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={maxProductPrice} // Use dynamic max price
                                    value={currentMin}
                                    onChange={handleMinPriceChange}
                                    // Removed complex range-slider class - basic range input appearance will be used
                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 left-0 z-10"
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max={maxProductPrice} // Use dynamic max price
                                    value={currentMax}
                                    onChange={handleMaxPriceChange}
                                    // Removed complex range-slider class - basic range input appearance will be used
                                    className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-0 left-0"
                                />
                                {/* Add styling for track/thumbs in global CSS if needed for better dual range appearance */}
                            </div>
                            {/* Number inputs (optional, could be removed if slider is good) */}
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label htmlFor="minPrice" className="block text-xs text-gray-500 mb-1">Min</label>
                                    <input
                                        type="number"
                                        id="minPrice"
                                        value={currentMin}
                                        min="0"
                                        max={maxProductPrice}
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        onChange={handleMinPriceChange}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="maxPrice" className="block text-xs text-gray-500 mb-1">Max</label>
                                    <input
                                        type="number"
                                        id="maxPrice"
                                        value={currentMax}
                                        min="0"
                                        max={maxProductPrice}
                                        className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        onChange={handleMaxPriceChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Display Area */}
                <main className="flex-grow">
                    {/* Top Bar: Count & Sorting */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-5 p-4 bg-white rounded-lg shadow-sm">
                        <span className="text-sm text-gray-600 mb-2 sm:mb-0">
                            Showing {paginatedProducts.length} of {filteredProducts.length} products
                        </span>
                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="p-2 border border-gray-300 rounded bg-white cursor-pointer text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product: any) => (
                                <AllProductCard key={product._id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center p-10 text-gray-500 text-lg bg-white rounded-lg shadow-sm">
                                No products found matching your criteria.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
