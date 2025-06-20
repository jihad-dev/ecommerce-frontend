import React, { useState } from "react";
import { useAddProductMutation } from "../../Redux/features/products/productsApi";
import { toast } from "sonner";
import { useGetAllCategoriesQuery } from "../../Redux/features/categories/categoryApi";

// Define an interface for the product state
interface ProductState {
  title: string;
  description: string;
  price: number;
  discount: number;
  type: string;
  brand: string;
  stock: number;
  quantity: number;
  images: string[]; // Explicitly type as string array
  tags: string[]; // Explicitly type as string array
  category: string;
  ratings: number;
  ratingsCount: number;
  isFeatured: boolean;
  status: string;
  shipping: number;
  seller: string;
  isDeleted: boolean;
}

const AddProductForm = () => {
  // Use the interface with useState
  const [product, setProduct] = useState<ProductState>({
    title: "",
    description: "",
    price: 0,
    discount: 0,
    type: "",
    brand: "",
    stock: 0,
    quantity: 1,
    images: [""],
    tags: [], // Now correctly typed as string[]
    category: "",
    ratings: 0,
    ratingsCount: 0,
    isFeatured: false,
    status: "active",
    shipping: 0,
    seller: "",
    isDeleted: false,
  });


  const [isUploading, setIsUploading] = useState(false);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { data: categories } = useGetAllCategoriesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as {
    data?: any[];
    isLoading: boolean;
    isError: boolean;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setProduct((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...product.images];
    newImages[index] = value;
    const updatedImages = newImages.filter((img, i) => i !== index || img !== "");
    setProduct((prev) => ({
      ...prev,
      images: updatedImages.length > 0 ? updatedImages : [""],
    }));
  };

  const removeImageField = (index: number) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct((prev) => ({
      ...prev,
      images: newImages.length > 0 ? newImages : [""],
    }));
  };

  const addMoreImageField = () => {
    if (product.images[product.images.length - 1] !== "") {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ""],
      }));
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validImages = product.images.filter(img => img && img.trim() !== '');
    if (validImages.length === 0) {
      alert("Please upload at least one product image.");
      return;
    }

    const data = {
      title: product.title,
      description: product.description,
      price: Number(product.price),
      discount: Number(product.discount),
      type: product.type,
      brand: product.brand,
      stock: Number(product.stock),
      quantity: Number(product.quantity),
      images: validImages,
      tags: product.tags.map((tag) => tag.trim()).filter(tag => tag),
      category: product.category,
      ratings: Number(product.ratings),
      ratingsCount: Number(product.ratingsCount),
      isFeatured: product.isFeatured,
      status: product.status,
      shipping: Number(product.shipping),
      seller: product.seller,
      isDeleted: product.isDeleted,
    };

    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Adding product...");
      await addProduct(data).unwrap();
      toast.success("Product added successfully!", { id: toastId });
      // Reset the form
      setProduct({
        title: "",
        description: "",
        price: 0,
        discount: 0,
        type: "",
        brand: "",
        stock: 0,
        quantity: 1,
        images: [""],
        tags: [], // Now correctly typed as string[]
        category: "",
        ratings: 0,
        ratingsCount: 0,
        isFeatured: false,
        status: "active",
        shipping: 0,
        seller: "",
        isDeleted: false,
      })

    } catch (err: any) {
      console.log(err);
      toast.error("Failed to add product!", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded shadow-lg space-y-6 border border-gray-200 mb-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Product</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Title</label>
            <input required name="title" value={product.title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Brand</label>
            <input name="brand" value={product.brand} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Category</label>
            <select
              name="category"
              id="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {
                categories && categories?.map((category: any) => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))
              }
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Type (e.g., Electronics, Clothing)</label>
            <input name="type" value={product.type} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Seller Name</label>
            <input name="seller" value={product.seller} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Price (৳)</label>
            <input required type="number" min="0" step="0.01" name="price" value={product.price || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Discount (%)</label>
            <input type="number" min="0" max="100" name="discount" value={product.discount || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Stock Quantity</label>
            <input required type="number" min="0" name="stock" value={product.stock || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Shipping Cost (৳)</label>
            <input type="number" min="0" name="shipping" value={product.shipping || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Description</label>
        <textarea name="description" value={product.description} onChange={handleChange} rows={4} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-700">Product Images</label>
        <div className="flex flex-wrap gap-4">
          {product.images.map((url: string, index: number) => (
            <div key={index} className="relative group">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                {url ? (
                  <img
                    src={url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    {isUploading ? (
                      <div className="text-sm text-blue-600">Uploading...</div>
                    ) : (
                      <>
                        <div className="text-blue-500 text-2xl mb-1">+</div>
                        <div className="text-xs text-gray-500">Add Image</div>
                      </>
                    )}
                  </div>
                )}
                {!isUploading && (
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    disabled={isUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("File is too large. Max size is 5MB.");
                          e.target.value = '';
                          return;
                        }
                        try {
                          const imageUrl = await uploadImage(file);
                          if (imageUrl) {
                            handleImageChange(index, imageUrl);
                            console.log("Image uploaded and URL saved:", imageUrl);
                          }
                        } catch (uploadError) {
                          e.target.value = '';
                        }
                      }
                      if (!file && e.target) e.target.value = '';
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    title="Click to upload an image"
                  />
                )}
              </div>
              {url && (product.images.length > 1 || product.images[0] !== "") && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {product.images[product.images.length - 1] !== "" && (
            <button
              type="button"
              onClick={addMoreImageField}
              disabled={isUploading}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add More
            </button>
          )}
        </div>
        {isUploading && <div className="mt-2 text-sm text-blue-600">Uploading image, please wait...</div>}
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Tags (comma separated)</label>
        <input
          name="tags"
          value={product.tags.join(", ")}
          onChange={(e) => setProduct({ ...product, tags: e.target.value.split(",").map(tag => tag.trim()) })}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., electronics, smartphone, new"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Ratings*</label>
          <input type="number" min="0" max="5" step="0.1" name="ratings" value={product.ratings || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Ratings Count</label>
          <input type="number" min="0" name="ratingsCount" value={product.ratingsCount || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Status</label>
          <select name="status" value={product.status} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          id="isFeatured"
          name="isFeatured"
          checked={product.isFeatured}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isFeatured" className="font-medium text-gray-700">Mark as Featured Product</label>
      </div>

      <div className="pt-4 text-center">
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Product...' : isUploading ? 'Uploading Image...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
