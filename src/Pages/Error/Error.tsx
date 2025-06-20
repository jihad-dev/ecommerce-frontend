import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity
              }}
              className="relative w-full max-w-md mx-auto mb-12"
            >
              <img 
                src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                alt="Error animation"
                className="w-full h-auto object-contain rounded-2xl"
              />
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZDn8GxnXJyLamJDSZcRhi5T3s_nKotSL95A&s"
                alt="Error icon"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 w-32 h-32 rounded-full border-4 border-red-500 shadow-xl transform hover:rotate-12 transition-all duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-6"
            >
              <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent animate-pulse">
                404 Error
              </h1>
              
              <div className="space-y-3">
                <p className="text-2xl text-gray-800 font-semibold">
                  Oops! Page Not Found 🤔
                </p>
                <p className="text-lg text-gray-600">
                  The page you're looking for seems to have gone on vacation!
                </p>
                <p className="text-sm text-gray-500 italic">
                  Don't worry, even the best of us get lost sometimes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/")}
                  className=" cursor-pointer group inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-3 text-2xl group-hover:animate-bounce">🏠</span>
                  Return Home
                </motion.button>

              </div>
            </motion.div>
          </motion.div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Error Code: 404 Page Not Found
        </p>
      </div>
    </div>
  );
};

export default Error;
