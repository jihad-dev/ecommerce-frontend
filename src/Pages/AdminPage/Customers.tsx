import { useState } from "react";
import { FiSearch, FiEye, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../utils/Loader";
import { Link } from "react-router-dom";
import { useDeleteUserMutation, useGetAllUsersQuery } from "../../Redux/features/admin/adminApi";
import Swal from "sweetalert2";


const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { data: users, isLoading } = useGetAllUsersQuery<any>(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [deleteUser] = useDeleteUserMutation();

  if (isLoading) {
    return <Loader />
  }

  // delete user
 
     const handleDelete = async (user:any) => {
      Swal.fire({
          title: "Delete Admin Account",
          text: `Are you sure you want to delete ${user.name}'s account? This action cannot be undone.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#dc2626",
          cancelButtonColor: "#6b7280",
          customClass: {
              popup: "rounded-xl",
              title: "text-xl font-semibold text-gray-900",
              htmlContainer: "text-gray-600",
              confirmButton: "px-4 py-2 text-sm font-medium rounded-lg",
              cancelButton: "px-4 py-2 text-sm font-medium rounded-lg"
          }
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                   await deleteUser(user._id).unwrap();
                  // Success notification
                  Swal.fire({
                      title: "Account Deleted",
                      text: `${user.name}'s account has been successfully deleted.`,
                      icon: "success",
                      confirmButtonColor: "#3b82f6",
                      customClass: {
                          popup: "rounded-xl",
                          title: "text-xl font-semibold text-gray-900",
                          htmlContainer: "text-gray-600",
                          confirmButton: "px-4 py-2 text-sm font-medium rounded-lg"
                      }
                  });

              } catch (error: any) {
                  console.error("Delete mutation failed:", error);
                  // Safely access the error message
                  const errorMessage = error?.data?.message || 'An error occurred while deleting the admin.';
                  Swal.fire({
                      title: "Error",
                      text: errorMessage,
                      icon: "error"
                  });
              }
          } else {
              Swal.fire({
                  title: "Cancelled",
                  text: "The admin account was not deleted.",
                  icon: "error"
              });
          }
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3
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

  const cardVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  // Filter and sort customers
  const filteredCustomers = Array.isArray(users)
    ? users.filter((customer: any) => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
      return matchesSearch && matchesStatus;
    }).sort((a: any, b: any) => {
      switch (sortBy) {
        case 'orders':
          return b.orders - a.orders;
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'recent':
          return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    })
    : []; // Default to empty array if users is not an array

  // Get current customers for pagination
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  // const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8"
    >
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6"
        >
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500"
            >
              Customer Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-1 text-sm text-gray-500"
            >
              Track and manage your customer relationships
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
            {[
            { title: "Total Customers", value: Array.isArray(users) ? users.length : 0, change: "↑ 12%", isPositive: true },
            { title: "Active Customers", value: Array.isArray(users) ? users.filter((user: any) => user.status === 'active').length : 0, change: "↑ 8%", isPositive: true },
            { title: "Total Revenue", value: Array.isArray(users) ? `$${users.reduce((acc: number, user: any) => acc + (user.totalSpent || 0), 0).toLocaleString()}` : '$0', change: "↑ 15%", isPositive: true },
            { title: "Avg. Order Value", value: Array.isArray(users) && users.length > 0 ? `$${(users.reduce((acc: number, user: any) => acc + (user.totalSpent || 0), 0) / users.length).toFixed(2)}` : '$0', change: "↓ 3%", isPositive: false }
            ].map((stat: any, index: any) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white p-4 rounded-2xl shadow-md transform transition-all duration-200"
            >
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-2xl font-bold mt-2">{stat.value}</div>
              <div className={`text-xs ${stat.isPositive ? 'text-green-600' : 'text-red-600'} mt-1`}>
                {stat.change} from last month
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>

            <motion.select
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="orders">Sort by Orders</option>
              <option value="spent">Sort by Amount Spent</option>
              <option value="recent">Sort by Recent Order</option>
            </motion.select>

            <motion.select
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Customers</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <AnimatePresence>
                  {users?.data?.map((customer: any, index: any) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                      className="transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center shadow-inner"
                          >
                            <span className="text-sm font-semibold text-blue-800">{customer?.name?.charAt(0)}</span>
                          </motion.div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{customer?.name} * {customer?.userId}</div>
                            <div className="text-xs text-gray-500 md:hidden">{customer?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-600">{customer?.email}</div>
                        <div className="text-xs text-gray-500">Last order: {customer?.lastOrder}</div>
                      </td>
                     
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer?.role}</div>
                        </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${customer?.status === 'in-progress'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${customer.status === 'in-progress' ? 'bg-green-600' : 'bg-red-600'
                            } mr-1.5`}></span>
                          {customer.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/dashboard/customers/change-status/${customer?._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mr-2"
                          >
                            <FiChevronRight className="w-4 h-4 mr-1.5" />
                            Change Status
                          </motion.button>
                        </Link>
                    
                        <Link to={`/dashboard/customers/${customer?._id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors mr-2"
                          >
                            <FiEye className="w-4 h-4 mr-1.5" />
                            View
                          </motion.button>
                        </Link>
                        <>
                          <motion.button
                            onClick={() => handleDelete(customer)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        
                            className="inline-flex cursor-pointer items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4 mr-1.5" />
                            Delete
                          </motion.button>
                          

                        </>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstCustomer + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastCustomer, filteredCustomers.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredCustomers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Previous</span>
                    <FiChevronLeft className="h-5 w-5" />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">Next</span>
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Customers;
