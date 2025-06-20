import { useState, useEffect } from "react";
import { FiSearch, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Loader from "../../utils/Loader";
import Swal from "sweetalert2";
import { useDeleteAdminMutation, useGetAllAdminsQuery } from "../../Redux/features/admin/adminApi";
interface Admin {
    _id: string;
    avatar?: string;
    name: string;
    email: string;
    role?: string;
    status?: string;
}

const AllAdmin = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    const { data: adminsData, isLoading } = useGetAllAdminsQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [deleteAdmin] = useDeleteAdminMutation();

    const admins = (adminsData as Admin[]) || [];
    const filteredAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(searchTerm) ||
        admin.email.toLowerCase().includes(searchTerm)
    );


    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isLoading) return <Loader />;

    // delete admin
    const handleDelete = async (admin: Admin) => {
        Swal.fire({
            title: "Delete Admin Account",
            text: `Are you sure you want to delete ${admin.name}'s account? This action cannot be undone.`,
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
                    await deleteAdmin(admin._id).unwrap();
                    // Success notification
                    Swal.fire({
                        title: "Account Deleted",
                        text: `${admin.name}'s account has been successfully deleted.`,
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

    // Mobile Layout
    const MobileLayout = () => (
        <div className="space-y-4 bg-gray-50 min-h-screen">
            <div className="sticky top-0 bg-white z-10 p-4 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900">All Administrators</h1>
                    <button className="p-2 rounded-full bg-blue-50 text-blue-600">
                        <FiEdit2 className="h-5 w-5" />
                    </button>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                    />
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="px-4 pb-4 space-y-3"
            >
                {filteredAdmins && filteredAdmins.map((admin: Admin) => (
                    <motion.div
                        key={admin._id}
                        variants={itemVariants}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-center space-x-4">
                                <img
                                    className="h-14 w-14 rounded-full border-2 border-gray-200"
                                    src={admin.avatar || "https://via.placeholder.com/40"}
                                    alt={admin.name}
                                />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base font-semibold text-gray-900 truncate">{admin.name}</h2>
                                    <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                            {admin.role || 'Admin'}
                                        </span>
                                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                            {admin.status || 'Active'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-end space-x-3 border-t pt-4">
                                <Link
                                    to={`/dashboard/admin/${admin._id}`}
                                    className="flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <FiEye className="h-5 w-5" />
                                    <span className="ml-2 text-sm font-medium">View</span>
                                </Link>
                                <button
                                    className="flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <FiEdit2 className="h-5 w-5" />
                                    <span className="ml-2 text-sm font-medium">Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(admin)}
                                    className="flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                    <span className="ml-2 text-sm font-medium">Delete</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );

    // Desktop Layout
    const DesktopLayout = () => (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">All Administrators</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage and monitor admin accounts</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-80">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>

                            <input
                                type="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                placeholder="Search by name or email..."
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />

                        </div>
                    </div>

                    <Link to="/dashboard/admin/create-admin">
                        <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            <span className="mr-2 cursor-pointer">Add New Admin</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200"
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin Info</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                            {filteredAdmins && filteredAdmins?.map((admin: Admin) => (
                                <motion.tr
                                    key={admin._id}
                                    variants={itemVariants}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <svg
                                                className="h-12 w-12 rounded-full bg-gray-200 p-2 text-gray-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{admin.name}</div>
                                                <div className="text-sm text-gray-500">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                            {admin.role || 'Admin'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-sm font-medium rounded-full bg-green-50 text-green-700 border border-green-200">
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <Link
                                                to={`/dashboard/admin/admin-info/${admin._id}`}
                                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye className="h-5 w-5" />
                                            </Link>
                                            <button
                                                className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                                title="Edit Admin"
                                            >
                                                <FiEdit2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(admin)}
                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                title="Delete Admin"
                                            >
                                                <FiTrash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </motion.div>
        </div>
    );

    return isMobile ? <MobileLayout /> : <DesktopLayout />;
};

export default AllAdmin;
