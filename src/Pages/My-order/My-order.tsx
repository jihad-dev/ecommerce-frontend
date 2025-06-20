import { useGetUserOrdersQuery } from "../../Redux/features/order/orderApi";
import { useAppSelector } from "../../Redux/hooks";
import Loader from "../../utils/Loader";
import { Link } from "react-router-dom";

interface OrderItem {
  product: {
    title: string;
    images: string[];
  };
  size: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  paymentInfo: {
    transactionId: string;
  };
  createdAt: string;
  orderItems: OrderItem[];
  status: 'In Transit' | 'Delivered' | string;
  expectedDelivery: string;
  totalPrice: number;
  paymentStatus: 'Paid' | 'Pending' | string;
}

interface OrdersResponse {
  data: Order[];
}

const MyOrder = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { data: orders, isLoading } = useGetUserOrdersQuery(user?.id) as { data: OrdersResponse | undefined, isLoading: boolean };

    if (isLoading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-between mb-4">
                    <input 
                        type="search"
                        placeholder="Search by seller name, order ID or product name"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <Link 
                        to="/"
                        className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        Home
                    </Link>
                </div>

                {orders?.data && orders.data.length > 0 ? (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium mr-2">Order From:</span>
                                        <span className="text-sm text-gray-600">{order?.paymentInfo?.transactionId}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`text-sm ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {order.paymentStatus}
                                        </div>
                                       {order.paymentStatus !== 'Paid' && <div className="text-sm text-red-500">Cancelled</div>}
                                    </div>
                                </div>
                                
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 py-3 border-t">
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.title}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm">{item.product.title}</h3>
                                            <div className="text-xs text-gray-500 mt-1">
                                                <p>Size: {item.size}</p>
                                                <p>Qty: {item.qty}</p>
                                                <p>Rs. {item.price}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Order Date: {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h2 className="mt-4 text-lg font-medium text-gray-900">No Orders Yet</h2>
                        <p className="mt-2 text-sm text-gray-500">When you place an order, it will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrder;
