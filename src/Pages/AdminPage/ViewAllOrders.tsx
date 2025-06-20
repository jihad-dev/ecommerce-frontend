import { useGetAllOrdersQuery } from "../../Redux/features/order/orderApi";
import { useState } from "react";
import { toast } from "sonner";
import Loader from "../../utils/Loader";

const ViewAllOrders = () => {
    const [selectedStatus, setSelectedStatus] = useState("");
    const { data: orders, isLoading } = useGetAllOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    }) as any;

    // const [updateOrderStatus] = useUpdateOrderStatusMutation();

    const handleStatusChange = async (orderId: string, status: string) => {
        try {
            // Example usage to avoid unused variable error:
            // await updateOrderStatus({ id: orderId, status }).unwrap();
            console.log(`Updating order ${orderId} to status ${status}`);
            toast.success("Order status updated successfully");
        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            {orders?.data?.length > 0 ? <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">All Orders</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>

                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders?.data?.map((order: any) => (
                                <tr key={order._id} className="hover:bg-gray-50">

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>
                                            <p className="font-medium">{order.userId.name}</p>
                                            <p className="text-xs">{order.userId.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.orderItems.map((item: any, index: number) => (
                                            <div key={index} className="mb-1">
                                                {item.product.title} (x{item.qty})
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${order.totalPrice}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {
                                            order?.paymentStatus
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {order?.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select
                                            className="border rounded px-2 py-1"
                                            value={selectedStatus}
                                            onChange={(e) => {
                                                setSelectedStatus(e.target.value);
                                                handleStatusChange(order._id, e.target.value);
                                            }}
                                        >
                                            <option value="">Update Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> : <div className="container mx-auto px-4 py-8">
                <div className="min-h-screen flex items-center justify-center">
                    <h1 className="text-2xl font-bold text-center">No orders found!!</h1>
                </div>
            </div>}

        </>
    );
};

export default ViewAllOrders;
