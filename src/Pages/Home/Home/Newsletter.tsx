const Newsletter = () => {
    return (
        <div>
            <div className="container mx-auto  py-16">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600  p-8 md:p-12 shadow-xl">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4 text-white">Subscribe to Our Newsletter</h2>
                        <p className="text-gray-100 mb-8 text-lg">Stay updated with our latest products, exclusive offers, and tech tips.</p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-6 py-4 rounded-lg border-2 border-transparent focus:border-purple-300 focus:outline-none text-gray-700 bg-white/90 backdrop-blur-sm transition duration-300"
                            />
                            <button className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-lg hover:bg-purple-50 transition duration-300 shadow-md">
                                Subscribe
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-gray-200 mt-6 max-w-lg mx-auto">
                            By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
