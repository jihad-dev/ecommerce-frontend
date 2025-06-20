import { Link } from "react-router-dom";
import { useGetAllCategoriesQuery } from "../../../Redux/features/categories/categoryApi";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SkeletonCard = () => (
    <div className="relative rounded-xl bg-gray-200 animate-pulse h-64 w-full shadow-md" />
);

const ShopByCategory = () => {
    const { data: categoriesData, isLoading } = useGetAllCategoriesQuery(undefined);

    // Group categories for multi-item slides
    const groupCategories = (categories: any[], itemsPerSlide: number) => {
        const groups = [];
        for (let i = 0; i < categories.length; i += itemsPerSlide) {
            groups.push(categories.slice(i, i + itemsPerSlide));
        }
        return groups;
    };

    // Responsive items per slide
    const getItemsPerSlide = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return 4;
            if (window.innerWidth >= 640) return 2;
        }
        return 1;
    };

    const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

    useEffect(() => {
        const handleResize = () => setItemsPerSlide(getItemsPerSlide());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const groupedCategories = groupCategories(Array.isArray(categoriesData) ? categoriesData : [], itemsPerSlide);

    return (
        <div>
            {/* Categories Section */}
            <div className=" px-4 py-16">
                <h2 className="text-4xl font-extrabold mb-10 text-center tracking-tight text-gray-900">Shop by Category</h2>
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    showArrows={true}
                    showIndicators={true}
                    infiniteLoop={true}
                    autoPlay={false}
                    swipeable={true}
                    emulateTouch={true}
                    renderArrowPrev={(onClickHandler, hasPrev, label) =>
                        hasPrev && (
                            <button
                                type="button"
                                onClick={onClickHandler}
                                title={label}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-blue-500 hover:bg-blue-100"
                            >
                                <FaChevronLeft size={20} />
                            </button>
                        )
                    }
                    renderArrowNext={(onClickHandler, hasNext, label) =>
                        hasNext && (
                            <button
                                type="button"
                                onClick={onClickHandler}
                                title={label}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-blue-500 hover:bg-blue-100"
                            >
                                <FaChevronRight size={20} />
                            </button>
                        )
                    }
                >
                    {isLoading ? (
                        groupCategories([{}, {}, {}, {}], itemsPerSlide).map((group, idx) => (
                            <div key={idx} className="flex gap-6 justify-center items-stretch">
                                {group.map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ))
                    ) : (
                        groupedCategories.map((group, idx) => (
                            <div key={idx} className="flex gap-6 justify-center items-stretch">
                                {group.map((category: any) => (
                                    <Link
                                        key={category._id}
                                        to={`/category/${category?.name}`}
                                        className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl block bg-white"
                                        aria-label={`Shop in ${category?.name}`}
                                    >
                                        <div className="h-64 flex items-center justify-center bg-gray-100 overflow-hidden relative">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-200 to-purple-200">
                                                    <span className="text-6xl font-bold text-white/70">
                                                        {category.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        </div>
                                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                                            <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">{category.name}</h3>
                                            <button
                                                className="inline-flex items-center px-4 py-2 bg-white/90 text-black font-semibold rounded-full shadow hover:bg-blue-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                                                tabIndex={-1}
                                            >
                                                Shop Now
                                                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))
                    )}
                </Carousel>
            </div>
        </div>
    );
};

export default ShopByCategory;
