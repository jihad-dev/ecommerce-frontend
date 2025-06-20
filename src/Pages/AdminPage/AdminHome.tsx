import {  useEffect } from 'react';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiActivity } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGetAllUsersQuery } from '../../Redux/features/admin/adminApi';
import { useGetAllOrdersQuery } from '../../Redux/features/order/orderApi';
const AdminHome = () => {
  const { data: users } = useGetAllUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as { data: { data: { _id: string }[] } };
  const { data: orders } = useGetAllOrdersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as any;
  

  useEffect(() => {
    const timer = setTimeout(() => {
     
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
      <motion.div 
        className="max-w-7xl mx-auto space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div 
          className="bg-white rounded-2xl shadow-md p-6 sm:p-8 overflow-hidden"
          variants={itemVariants}
        >
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500">
              Welcome to Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your e-commerce platform with powerful tools and insights
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
        >
          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold">৳24,567</h3>
                <p className="text-xs text-green-600">+12% from last month</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Customers</p>
                <h3 className="text-2xl font-bold">{users?.data?.length}</h3>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white p-6 rounded-2xl shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-pink-100 rounded-lg">
                <FiShoppingBag className="w-6 h-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold">{orders?.data?.length}</h3>
                  <p className="text-xs text-green-600">+15% from last month</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
         
           <motion.button 
                className="p-4 bg-gray-50 rounded-xl"
                whileHover={{ scale: 1.05, backgroundColor: '#F3F4F6' }}
              >
                  <Link to={'/dashboard/products/add-product'}>
                  <FiPackage className="w-6 h-6 mx-auto text-blue-600" />
                  <span className="block mt-2 text-sm">Add Product</span>
           </Link>
              
              </motion.button>
              
              <Link to={'/dashboard/customers'}>
                <motion.button 
                  className="p-4 bg-gray-50 rounded-xl w-full cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: '#F3F4F6' }}
                >
                  <FiUsers className="w-6 h-6 mx-auto text-purple-600" />
                  <span className="block mt-2 text-sm">View Customers</span>
                </motion.button>
              </Link>

              <motion.button 
                className="p-4 bg-gray-50 rounded-xl"
                whileHover={{ scale: 1.05, backgroundColor: '#F3F4F6' }}
              >
                <FiShoppingBag className="w-6 h-6 mx-auto text-pink-600" />
                <span className="block mt-2 text-sm">Process Orders</span>
              </motion.button>

              <motion.button 
                className="p-4 bg-gray-50 rounded-xl"
                whileHover={{ scale: 1.05, backgroundColor: '#F3F4F6' }}
              >
                <FiActivity className="w-6 h-6 mx-auto text-green-600" />
                <span className="block mt-2 text-sm">View Analytics</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-md p-6"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <motion.div 
                  key={item} 
                  className="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer"
                  whileHover={{ x: 8, backgroundColor: '#F3F4F6' }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">New order #1234</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Chart */}
        <motion.div 
          className="bg-white rounded-2xl shadow-md p-6"
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
        >
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Chart will be implemented here</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminHome;
