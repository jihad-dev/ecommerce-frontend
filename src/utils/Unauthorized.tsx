import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full mx-auto">
        <div className=" rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Animation & Images */}
            <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-red-100 to-red-50">
              <div className="relative w-full aspect-square max-w-md ">
                <img 
                  src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                  alt="Unauthorized access animation"
                  className="w-full h-full object-contain "
                />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZDn8GxnXJyLamJDSZcRhi5T3s_nKotSL95A&s"
                  alt="Access denied icon"
                  className="animate-bounce absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-32 h-32 rounded-full border-4 border-red-600 shadow-xl transform hover:rotate-12 transition-all duration-300"
                />
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="p-8 flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse">
                  Access Denied
                </h1>
                
                <div className="space-y-2">
                  <p className="text-2xl text-gray-800 font-semibold">
                    Oops! You've hit a wall 🚧
                  </p>
                  <p className="text-lg text-gray-600">
                    Sorry, but you don't have permission to access this area.
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    Please contact your administrator if you believe this is a mistake.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Link 
                  to="/" 
                  className="group inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-3 text-2xl group-hover:animate-bounce">🏠</span>
                  Return to Homepage
                </Link>
                
                <Link 
                  to="/login" 
                  className="block text-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                >
                  Login with different account
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          Error Code: 401 Unauthorized Access
        </p>
      </div>
    </div>
  );
};

export default Unauthorized;
