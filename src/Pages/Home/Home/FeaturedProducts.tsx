import { motion } from 'framer-motion';
import { useGetFeaturedProductsQuery } from '../../../Redux/features/products/productsApi';
import Loader from '../../../utils/Loader';
import AllProductCard from '../../../components/ProductCard/AllProductCard';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const groupProducts = (products: any[], itemsPerSlide: number) => {
  const groups = [];
  for (let i = 0; i < products.length; i += itemsPerSlide) {
    groups.push(products.slice(i, i + itemsPerSlide));
  }
  return groups;
};

const getItemsPerSlide = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 640) return 2;
  }
  return 1;
};

const FeaturedProducts = () => {
  // All hooks at the top!
  const {
    data: featuredData = [],
    isLoading,
    isError
  } = useGetFeaturedProductsQuery(undefined) as {
    data?: any[];
    isLoading: boolean;
    isError: boolean;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide());

  useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const groupedProducts = groupProducts(featuredData, itemsPerSlide);

  if (isLoading) {
    return <Loader />
  }

  if (isError || !featuredData) {
    return <div className="py-12 text-center text-red-600">Error loading featured products.</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-900 text-center mb-12"
        >
          Featured Products
        </motion.h2>
        <Carousel
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          showIndicators={true}
          infiniteLoop={true}
          autoPlay={true}
          interval={3000}
          swipeable={true}
          emulateTouch={true}
          className="featured-products-carousel"
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
          {groupedProducts.map((group, idx) => (
            <div key={idx} className="flex gap-6 justify-center items-stretch">
              {group.map((product: any, index: number) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 h-full flex flex-col transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 w-full max-w-xs"
                >
                  <AllProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default FeaturedProducts;
