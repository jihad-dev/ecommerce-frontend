import { useParams } from "react-router-dom";
import { useState } from "react";
import { useChangeStatusMutation } from "../../Redux/features/admin/adminApi";
import { toast } from "sonner";
import Loader from "../../utils/Loader";
const ChangeStatus = () => {
    const { id } = useParams();
    const [status, setStatus] = useState<string>('');
    const [changeStatus, { isLoading }] = useChangeStatusMutation();
    console.log(id);
    if (isLoading) {
        return <Loader />
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id) {
            toast.error("User ID is missing");
            return;
        }

        if (!status) {
            toast.error("Please select a status");
            return;
        }

        const toastId = toast.loading("Updating status...");

        try {
            const data = {
                id: id,
                status
            };

            const response: any = await changeStatus(data);

            if ('error' in response) {
                throw new Error(response.error?.data?.message || 'Failed to update status');
            }

            toast.success("Status updated successfully", { id: toastId });

        } catch (error: any) {
            toast.error(error.message || "Failed to update status", { id: toastId });
            console.error("Error updating status:", error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Change Customer Status</h1>

                <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col items-center">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Select Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            required
                            className="mt-1 block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md text-center"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select a status</option>
                            <option value="in-progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    <div className="flex justify-center mt-4 sm:mt-6">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangeStatus;
