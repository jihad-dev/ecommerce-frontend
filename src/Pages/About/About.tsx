import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserFriends, FaTruck, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">About Us</h1>
                    <p className="text-2xl text-gray-600 max-w-2xl mx-auto">Transforming the way you shop with innovation, quality, and exceptional service</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 leading-tight">Our Journey to Excellence</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Since our inception in 2020, we've been driven by a singular vision: revolutionizing online shopping
                            by combining premium quality products with unmatched customer service. Our journey began as a modest
                            online store, but through dedication and customer trust, we've evolved into a global marketplace.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We take pride in fostering meaningful connections with both our customers and partners. Every interaction,
                            every transaction, and every delivery is handled with meticulous attention to ensure your complete satisfaction.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg transition duration-300"
                        >
                            Learn More
                        </motion.button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl transform rotate-6 opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
                            alt="Our Team"
                            className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                >
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <FaShieldAlt className="w-12 h-12 text-blue-600 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Quality</h3>
                        <p className="text-gray-600 text-lg">
                            Every product undergoes rigorous quality checks to meet our exceptional standards.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <FaUserFriends className="w-12 h-12 text-blue-600 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer First</h3>
                        <p className="text-gray-600 text-lg">
                            24/7 dedicated support to ensure your shopping experience is seamless.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        <FaTruck className="w-12 h-12 text-blue-600 mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Swift Delivery</h3>
                        <p className="text-gray-600 text-lg">
                            Efficient logistics network ensuring timely delivery to your doorstep.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white"
                >
                    <h2 className="text-4xl font-bold mb-8 text-center">Connect With Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center justify-center space-x-4">
                            <FaPhoneAlt className="w-6 h-6" />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div className="flex items-center justify-center space-x-4">
                            <FaEnvelope className="w-6 h-6" />
                            <span>support@example.com</span>
                        </div>
                        <div className="flex items-center justify-center space-x-4">
                            <FaMapMarkerAlt className="w-6 h-6" />
                            <span>123 Business Ave, NY</span>
                        </div>
                    </div>
                    <div className="text-center mt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition duration-300"
                        >
                            Get in Touch
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
