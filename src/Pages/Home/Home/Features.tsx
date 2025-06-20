const Features = () => {
    return (
        <div>
            <div className="bg-white lg:py-16 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center transform transition-all duration-300 hover:scale-105 rounded-lg p-4">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping opacity-75"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10 transform transition-transform hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-gray-800 transform transition-all duration-300 hover:text-blue-500">Free Shipping</h3>
                            <p className="text-gray-600 transform transition-all duration-300 hover:text-purple-500">On all orders over $50</p>
                        </div>
                        <div className="text-center transform transition-all duration-300 hover:scale-105 rounded-lg p-4">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10 transform transition-transform hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-gray-800 transform transition-all duration-300 hover:text-purple-500">Easy Returns</h3>
                            <p className="text-gray-600 transform transition-all duration-300 hover:text-pink-500">30-day return policy</p>
                        </div>
                        <div className="text-center transform transition-all duration-300 hover:scale-105 rounded-lg p-4">
                            <div className="bg-gradient-to-r from-pink-500 to-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-ping opacity-75"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10 transform transition-transform hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-gray-800 transform transition-all duration-300 hover:text-pink-500">Secure Payments</h3>
                            <p className="text-gray-600 transform transition-all duration-300 hover:text-red-500">Protected by industry leaders</p>
                        </div>
                        <div className="text-center transform transition-all duration-300 hover:scale-105  rounded-lg p-4">
                            <div className="bg-gradient-to-r from-red-500 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full animate-ping opacity-75"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white relative z-10 transform transition-transform hover:rotate-180 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-xl mb-3 text-gray-800 transform transition-all duration-300 hover:text-red-500">24/7 Support</h3>
                            <p className="text-gray-600 transform transition-all duration-300 hover:text-yellow-500">Dedicated customer service</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};      

export default Features;
