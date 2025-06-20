import { useState, useCallback } from 'react';
import { useAddCategoryMutation } from '../../Redux/features/categories/categoryApi';
import { motion } from 'framer-motion';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

import Loader from '../../utils/Loader';

interface CategoryState {
    name: string;
    image: string;
}

const AddCategories = () => {
    const [category, setCategory] = useState<CategoryState>({
        name: '',
        image: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [addCategory, { isLoading }] = useAddCategoryMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCategory(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const uploadImage = async (file: File): Promise<string> => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const uploadPreset = "image_upload";
        formData.append("upload_preset", uploadPreset);
        const cloudName = "drvenvkge";
        const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        try {
            const response = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Cloudinary upload failed");
            }
            return data.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            alert(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        try {
            const imageUrl = await uploadImage(file);
            setCategory(prev => ({
                ...prev,
                image: imageUrl
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category.name.trim() || !category.image) {

            return;
        }

        let toastId: string | number | undefined = undefined;

        try {
            toastId = toast.loading('Adding category...');
            await addCategory(category).unwrap();
            toast.success('Category added successfully!', { id: toastId });
            setCategory({
                name: '',
                image: ''
            });
        } catch (error) {
            let errorMessage = 'An unknown error occurred while adding the category';
            if (error && typeof error === 'object' && 'data' in error && (error as any).data?.message) {
                errorMessage = (error as any).data.message;
            }
            toast.error(errorMessage, {
                id: toastId,
                duration: 3000
            });
           
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gray-50 py-12"
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-8 border-b border-gray-200">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Add New Category
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Create a new product category to organize your inventory
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-8 space-y-8">
                        <div className="grid grid-cols-1 gap-y-8">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                    Category Name *
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={category.name}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all duration-200 ease-in-out shadow-sm"
                                        required
                                        placeholder="Enter category name"
                                        autoComplete="off"
                                        spellCheck="false"
                                        maxLength={50}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Category Image *
                                </label>
                                <div
                                    className={`mt-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors
                                        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                                        ${category.image ? 'bg-gray-50' : 'bg-white'}`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    {!category.image ? (
                                        <div className="text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4 flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                                                    <span>Upload a file</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept="image/*"
                                                        onChange={handleFileInput}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={category.image}
                                                alt="Category preview"
                                                className="h-64 w-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCategory(prev => ({ ...prev, image: '' }))}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}
                                    {isUploading && (
                                        <div className="absolute inset-0 ">
                                            <Loader />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading || isUploading}
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent 
                                    rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 
                                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                    focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed
                                    transition duration-150 ease-in-out"
                            >
                                {isLoading || isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    'Add Category'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default AddCategories;
