import { FaEye } from "react-icons/fa";
import { useState } from "react";
import { useCreateAdminMutation } from "../../Redux/features/admin/adminApi";
import Loader from "../../utils/Loader";
import { toast } from "sonner";
import { FaEyeSlash } from "react-icons/fa";

const CreateAdmin = () => {
    const [createAdmin, { isLoading }] = useCreateAdminMutation();
    const [showPassword, setShowPassword] = useState(false);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">
            <Loader />
        </div>
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            role: "admin",
            status: "in-progress",
            isDeleted: false
        };

        const toastId = toast.loading("Creating admin...");
        try {

             await createAdmin(data).unwrap();
            toast.success("Admin created successfully!", { id: toastId });
            // Reset form
            (e.target as HTMLFormElement).reset();
            toast.dismiss();
        } catch (err: any) {
           
            const errorMessage = err?.data?.message || "Failed to create admin";
            toast.error(errorMessage, { id: toastId });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Create Admin</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? (
                                <FaEyeSlash className="h-5 w-5 text-gray-400 cursor-pointer" />
                            ) : (
                                <FaEye className="h-5 w-5 text-gray-400 cursor-pointer" />
                            )}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className=" cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create Admin
                </button>
            </form>
        </div>
    );
};

export default CreateAdmin;
