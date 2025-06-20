import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marketing Lead, Acme Co.",
      text: "The quality of products on this site is exceptional. I'm particularly impressed with the fast shipping and excellent customer service. Will definitely shop here again!",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6c63ff&color=fff&size=128",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager, Beta Inc.",
      text: "Found exactly what I was looking for at a great price. The detailed product descriptions and reviews helped me make an informed decision. Very satisfied with my purchase.",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=6c63ff&color=fff&size=128",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Designer, Gamma LLC",
      text: "The website is so easy to navigate and the checkout process was smooth. My order arrived earlier than expected and was exactly as described. Highly recommend!",
      avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=6c63ff&color=fff&size=128",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "CTO, Delta Tech",
      text: "Outstanding selection of electronics. The product recommendations were spot-on and helped me find the perfect laptop for my needs. Great experience overall.",
      avatar: "https://ui-avatars.com/api/?name=David+Thompson&background=6c63ff&color=fff&size=128",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      role: "CEO, Epsilon Group",
      text: "The customer support team went above and beyond to help me with my purchase. The product quality is fantastic and the prices are very competitive.",
      avatar: "https://ui-avatars.com/api/?name=Lisa+Anderson&background=6c63ff&color=fff&size=128",
    },
  ];

  return (
    <div className="bg-white py-16 px-2 min-h-[70vh] flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#3f3dff] mb-2">Testimonials</h2>
      <p className="text-gray-500 text-center mb-10 text-base md:text-lg">What our clients has to say</p>
      <div className="w-full max-w-2xl mx-auto">
        <Carousel
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          showIndicators={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={6000}
          swipeable={true}
          emulateTouch={true}
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-purple-500 hover:bg-purple-100"
              >
                <FaQuoteLeft size={20} />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={onClickHandler}
                title={label}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 text-purple-500 hover:bg-purple-100"
              >
                <FaQuoteRight size={20} />
              </button>
            )
          }
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id}>
              <div className="relative bg-[#f7f7fa] rounded-xl shadow-lg px-6 md:px-12 py-12 flex flex-col items-center justify-center min-h-[320px]">
                <FaQuoteLeft className="absolute left-4 top-4 text-purple-300 text-4xl md:text-5xl opacity-60" />
                <FaQuoteRight className="absolute right-4 bottom-4 text-purple-300 text-4xl md:text-5xl opacity-60" />
                <div className="flex flex-col items-center -mt-20 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-20 h-16 rounded-full border-4 border-white shadow-md object-cover bg-white"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-[#3f3dff] text-lg md:text-xl mb-1 text-center">{testimonial.name}</span>
                  <span className="text-gray-500 text-sm mb-4 text-center">{testimonial.role}</span>
                  <p className="text-gray-700 text-base md:text-lg text-center max-w-xl">
                    {testimonial.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Testimonials;
