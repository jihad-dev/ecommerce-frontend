import { useParams } from "react-router-dom";
import { User, Phone, Calendar, Mail, ArrowLeft } from "lucide-react";
import Loader from "../../utils/Loader";
import { useGetSingleAdminQuery } from "../../Redux/features/admin/adminApi";
import { Link } from "react-router-dom";

interface UserData {
    _id: string;
    name: string;
    email: string;
    image?: string;
    status: string;
    phone?: string;
    address?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

interface ApiResponse {
    data: UserData;
}

const ViewAdminInfo = () => {
    const { id } = useParams();
    const { data: response, isLoading } = useGetSingleAdminQuery(id) as { data: ApiResponse | undefined, isLoading: boolean };
    const user = response?.data;

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link
                    to="/dashboard/all-admin"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Admins
                </Link>

                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Profile Section */}
                        <div className="w-full md:w-1/3">
                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-lg p-1 mb-4">
                                    {user?.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center">
                                            <User className="w-16 h-16 text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                                <div className="flex items-center justify-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{user?.email}</span>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center gap-2">
                                    <span className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                                        {user?.role}
                                    </span>
                                    <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                                        user?.status === 'in-progress'
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-red-50 text-red-700'
                                    }`}>
                                        {user?.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="w-full md:w-2/3 space-y-6">
                            {/* Contact Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Phone className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="mt-1 font-medium">{user?.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="mt-1 font-medium">{user?.address || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-amber-50 rounded-lg">
                                        <Calendar className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Account Timeline</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500">Member since</p>
                                        <p className="mt-1 font-medium">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Last updated</p>
                                        <p className="mt-1 font-medium">
                                            {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewAdminInfo;
