import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const bannerImages = [
  {
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&q=80&w=1920',
    alt: 'Shop Banner 1 - Electronics Store Display',
    title: 'Huge Electronics Sale!', 
    description: 'Get up to 50% off on selected gadgets and electronics.',
    buttonText: 'Shop Now',
    buttonLink: '/products'
  },
  {
    src: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&q=80&w=1920', 
    alt: 'Shop Banner 2 - Modern Retail Interior',
    title: 'New Arrivals Weekly',
    description: 'Discover the latest trends in fashion and accessories.',
    buttonText: 'Explore Collection',
    buttonLink: '/products'
  },
  {
    src: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&q=80&w=1920',
    alt: 'Shop Banner 3 - Product Showcase', 
    title: 'Home Essentials Refresh',
    description: 'Upgrade your living space with our curated home goods.',
    buttonText: 'View Home Goods',
    buttonLink: '/products'
  },
  {
    src: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&q=80&w=1920',
    alt: 'Shop Banner 4 - Luxury Watches',
    title: 'Luxury Watch Collection',
    description: 'Discover our premium selection of luxury timepieces.',
    buttonText: 'Shop Watches',
    buttonLink: '/products'
  },
  {
    src: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&q=80&w=1920',
    alt: 'Shop Banner 5 - Sports Equipment',
    title: 'Sports & Fitness Gear',
    description: 'Everything you need for your active lifestyle.',
    buttonText: 'Shop Sports',
    buttonLink: '/products'
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&q=80&w=1920',
    alt: 'Shop Banner 6 - Audio Equipment',
    title: 'Premium Audio Deals',
    description: 'Experience crystal clear sound with our audio collection.',
    buttonText: 'Shop Audio',
    buttonLink: '/products'
  }
];

const Banner = () => {
  return (
    <div className="relative">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        interval={5000}
        transitionTime={500}
        className="w-full"
      >
        {bannerImages.map((image, index) => (
          <div key={index} className="relative">
            <div className="aspect-[16/9] sm:aspect-[21/9] md:aspect-[21/8] lg:aspect-[21/7]">
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover brightness-75"
                width={1920}
                height={1080}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === 0 ? "high" : "low"}
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 animate-fadeIn">
                  {image.title}
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 animate-fadeIn delay-200">
                  {image.description}
                </p>
                <a
                  href={image.buttonLink}
                  className="inline-block bg-white text-black px-6 sm:px-8 py-2 sm:py-3 rounded-full 
                           text-sm sm:text-base font-semibold transition-all duration-300 
                           hover:bg-opacity-90 hover:scale-105 animate-fadeIn delay-400"
                >
                  {image.buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
