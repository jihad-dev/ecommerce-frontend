import  { useState } from 'react';
import { Edit, Eye, Trash2, ArrowUpDown, Badge } from 'lucide-react';

import Button from '../../components/ui/Button';
import { useDeleteProductMutation, useGetAllProductsQuery } from '../../Redux/features/products/productsApi';
import Loader from '../../utils/Loader';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const AllProducts = () => {
    const { data: products = [], isLoading } = useGetAllProductsQuery(undefined) as { data: Product[]; isLoading: boolean };
    const [deleteProduct] = useDeleteProductMutation();
    const [sortField, setSortField] = useState<keyof Product | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    if (isLoading) {
        return <Loader />
    }
    //delete product
    const handleDelete = async (product: Product) => {

        Swal.fire({
            title: "Delete Product",
            text: `Are you sure you want to delete ${product.title}'s product? This action cannot be undone.`,
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
                    await deleteProduct(product._id).unwrap();

                    // Success notification
                    Swal.fire({
                        title: "Product Deleted",
                        text: `${product.title}'s product has been successfully deleted.`,
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
    const handleSort = (field: keyof Product) => {
        if (!products) return;

        const isAsc = sortField === field && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const getInventoryStatus = (stock: number) => {
        if (stock === 0) {
            return <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">Out of Stock</Badge>;
        } else if (stock <= 5) {
            return <Badge className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">Low Stock</Badge>;
        } else {
            return <Badge className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">In Stock</Badge>;
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Search and Filter Section */}
                <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <div className="w-full sm:w-64">
                            <input
                                type="search"
                                placeholder="Search products..."
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                Filter
                            </Button>
                            <Link to="/dashboard/products/add-product">
                                <Button className='cursor-pointer' variant="primary" size="sm">
                                    Add Product
                                </Button></Link>
                        </div>
                    </div>
                </div>

                {/* Table/Card View */}
                <div className="overflow-x-auto">
                    {/* Desktop Table View */}
                    <table className="min-w-full hidden lg:table">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    <button
                                        onClick={() => handleSort('title')}
                                        className="group inline-flex items-center space-x-1 hover:text-gray-900"
                                    >
                                        <span>Product</span>
                                        <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    <button
                                        onClick={() => handleSort('category')}
                                        className="group inline-flex items-center space-x-1 hover:text-gray-900"
                                    >
                                        <span>Category</span>
                                        <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    <button
                                        onClick={() => handleSort('price')}
                                        className="group inline-flex items-center space-x-1 hover:text-gray-900"
                                    >
                                        <span>Price</span>
                                        <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    <button
                                        onClick={() => handleSort('stock')}
                                        className="group inline-flex items-center space-x-1 hover:text-gray-900"
                                    >
                                        <span>Stock</span>
                                        <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    <button
                                        onClick={() => handleSort('createdAt')}
                                        className="group inline-flex items-center space-x-1 hover:text-gray-900"
                                    >
                                        <span>Created</span>
                                        <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {products &&
                                products?.map((product: Product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-gray-100 rounded-full">{product.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {formatPrice(product.price)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex flex-col gap-1">
                                                <span>{product.stock} units</span>
                                                {getInventoryStatus(product.stock)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {formatDate(product.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-2">

                                                <Link to={`/dashboard/products/view-product/${product._id}`}>
                                                    <Button variant="ghost" size="sm" className="cursor-pointer text-blue-600 hover:text-blue-900 hover:bg-blue-50">
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">View</span>
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50">
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                <Button onClick={() => handleDelete(product)} variant="ghost" size="sm" className="cursor-pointer text-red-600 hover:text-red-900 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                    {/* Mobile/Tablet Card View */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 lg:hidden">
                        {
                            products &&
                            products?.map((product: Product) => (
                                <div key={product._id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="sm" className="text-blue-600">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-yellow-600">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button onClick={() => handleDelete(product)} variant="ghost" size="sm" className="text-red-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Category</span>
                                            <p className="font-medium text-gray-900">{product.category}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Price</span>
                                            <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Stock</span>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <span className="font-medium text-gray-900">{product.stock} units</span>
                                                {getInventoryStatus(product.stock)}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Created</span>
                                            <p className="font-medium text-gray-900">{formatDate(product.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Pagination */}
                <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <Button variant="outline" size="sm">Previous</Button>
                            <Button variant="outline" size="sm">Next</Button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">1</span> to
                                    <span className="font-medium">{products?.length || 0}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <Button variant="outline" size="sm">Previous</Button>
                                    <Button variant="outline" size="sm">Next</Button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;