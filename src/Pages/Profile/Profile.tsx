import { useGetSingleUserQuery } from "../../Redux/features/auth/authApi";
import { useAppSelector } from "../../Redux/hooks";
import { motion } from "framer-motion";
import { FiEdit2, FiKey, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { data: singleUser } = useGetSingleUserQuery(user?.id);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
        variants={itemVariants}
        transition={{ delay: 0.2 }}
      >
        Welcome Back! {singleUser?.name || ""}
      </motion.h1>

      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
        variants={itemVariants}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="flex flex-col md:flex-row items-center mb-12 gap-8"
          variants={itemVariants}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="w-30 h-30 rounded-full overflow-hidden ring-8 ring-indigo-100 hover:ring-indigo-200 transition-all duration-300 relative group"
            whileHover={{ scale: 1.05 }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full text-gray-400 group-hover:text-indigo-500 transition-colors duration-300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                fill="currentColor"
              />
            </svg>
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiEdit2 className="text-white text-2xl" />
            </div>
          </motion.div>
          <div className="text-center md:text-left flex-1">
            <motion.h2
              className="text-4xl font-bold text-gray-900 mb-2"
              variants={itemVariants}
              transition={{ delay: 0.5 }}
            >
              {singleUser?.name || "User Name"}
            </motion.h2>
            <motion.div
              className="flex items-center justify-center md:justify-start gap-2 text-lg text-gray-600"
              variants={itemVariants}
              transition={{ delay: 0.6 }}
            >
              <FiMail className="text-indigo-500" />
              {user?.email}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="border-t border-gray-100 pt-10"
          variants={itemVariants}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-3">
            <span className="bg-indigo-100 p-2 rounded-lg">
              <FiMapPin className="text-indigo-600" />
            </span>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 text-indigo-900 font-semibold mb-3">
                <FiPhone className="text-xl" />
                <label>Phone</label>
              </div>
              <p className="text-gray-800 text-lg">{user?.phone || "Not provided"}</p>
            </motion.div>
            <motion.div
              className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 text-indigo-900 font-semibold mb-3">
                <FiMapPin className="text-xl" />
                <label>Address</label>
              </div>
              <p className="text-gray-800 text-lg">{user?.address || "Not provided"}</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="border-t border-gray-100 mt-10 pt-10"
          variants={itemVariants}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-3">
            <span className="bg-indigo-100 p-2 rounded-lg">
              <FiKey className="text-indigo-600" />
            </span>
            Account Settings
          </h3>
          <div className="flex flex-wrap gap-6">
            <motion.button
              className="group bg-gradient-to-r from-indigo-600 to-indigo-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiEdit2 className="text-xl group-hover:rotate-12 transition-transform duration-300" />
              Edit Profile
            </motion.button>
            <motion.button
              className="group bg-gradient-to-r from-gray-600 to-gray-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiKey className="text-xl group-hover:rotate-12 transition-transform duration-300" />
              Change Password
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
