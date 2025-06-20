import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../Redux/features/products/productsApi";
import Loader from "../../utils/Loader";

type Product = {
  title?: string;
  description?: string;
  price?: number;
  discount?: number;
  finalPrice?: number;
  type?: string;
  brand?: string;
  stock?: number;
  quantity?: number;
  images?: string[];
  tags?: string[];
  category?: string;
  ratings?: number;
  ratingsCount?: number;
  isFeatured?: boolean;
  status?: string;
  shipping?: number;
  seller?: string;
  isDeleted?: boolean;
};

const ViewProductFullDetails = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetProductByIdQuery(id) as {
    data: Product;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-red-600 bg-red-100 p-4 rounded border border-red-300">
          Error loading product details. Please check the console or try again
          later.
        </div>
      </div>
    );
  }

  if (!products) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Product not found.
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    price,
    discount,
    finalPrice,
    type,
    brand,
    stock,
    images,
    tags,
    category,
    ratings,
    ratingsCount,
    isFeatured,
    status,
    shipping,
    seller,
  } = products;

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800 border-b pb-4">
        Product Details
      </h1>
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image Section */}
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <img
                src={images?.[0]}
                alt={title || "Product Image"}
                className="w-full h-[200px] object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images?.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Product view ${index + 2}`}
                  className="w-full h-16 object-cover rounded-lg cursor-pointer"
                />
              ))}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Stock Status</h3>
              <div
                className={`text-lg font-bold ${
                  (stock ?? 0) > 10
                    ? "text-green-600"
                    : (stock ?? 0) > 0
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {(stock ?? 0) > 0 ? `${stock} units available` : "Out of Stock"}
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {title || "N/A"}
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    ৳{finalPrice?.toFixed(2) ?? "N/A"}
                  </span>
                  {discount && (
                    <span className="line-through text-gray-500">
                      ৳{price?.toFixed(2)}
                    </span>
                  )}
                  {discount && (
                    <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                      {discount}% OFF
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {category || "N/A"}
                </span>
                {tags?.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {description || "No description available."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-700">Brand</h4>
                  <p className="text-gray-900 font-semibold">
                    {brand || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Type</h4>
                  <p className="text-gray-900 font-semibold">{type || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Seller</h4>
                  <p className="text-gray-900 font-semibold">
                    {seller || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <p
                    className={`font-semibold ${
                      status === "active" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status || "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Rating</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{ratings}</span>
                      <span className="text-gray-500">
                        ({ratingsCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Shipping</h4>
                    <p className="font-semibold">৳ {shipping}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Featured</h4>
                    <p className="font-semibold">{isFeatured ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-6">
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => alert("Edit functionality not implemented yet.")}
              >
                Edit Product Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductFullDetails;
