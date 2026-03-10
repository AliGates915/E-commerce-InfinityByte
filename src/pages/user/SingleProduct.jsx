import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PuffLoader from "react-spinners/PuffLoader";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { fetchSingleProduct, fetchCategories } from "../../services/productApi";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);

  // Product query
  const {
    data: product,
    isLoading: productLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchSingleProduct(id),
    staleTime: 1000 * 60 * 5,
  });

  // Categories query
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const userId = user?.id;

      if (!userId) {
        throw new Error("User not logged in");
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
        {
          userId,
          productId: product._id,
          quantity: 1,
        }
      );

      return res.data;
    },
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add to cart");
    },
  });

  if (productLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#00c7fc" />
      </div>
    );
  }

  if (isError || !product) {
    navigate("/not-found");
    return null;
  }

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue},70%,85%)`;
  };

  return (
    <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      
      {/* Image Section */}
      <div className="flex-1 flex flex-col items-center">
        <img
          src={product.images?.[imageIndex]?.url || "https://via.placeholder.com/400"}
          alt={product.name}
          loading="eager"
          fetchPriority="high"
          className="w-full max-w-md h-[750px] object-cover rounded-lg shadow"
        />

        {product.images?.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                loading="lazy"
                onClick={() => setImageIndex(idx)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                  idx === imageIndex
                    ? "border-newPrimary"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

        <p className="text-newPrimary text-2xl font-semibold mb-2">
          ${product.price}
        </p>

        {/* Categories */}
        <div className="mb-4 flex flex-wrap gap-2">
          {product.category?.map((catId, idx) => {
            const matchedCategory = categories.find((c) => c._id === catId);

            return (
              <span
                key={idx}
                style={{ backgroundColor: getRandomColor() }}
                className="text-sm px-3 py-1 rounded-full"
              >
                {matchedCategory?.name || "Unknown"}
              </span>
            );
          })}
        </div>

        {/* Colors
        <div className="mb-4 flex flex-wrap gap-2">
          {product.color?.map((color, idx) => (
            <span
              key={idx}
              style={{ backgroundColor: getRandomColor() }}
              className="text-sm px-3 py-1 rounded-full"
            >
              {color.trim()}
            </span>
          ))}
        </div> */}

        {/* Description */}
        <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
          {product.description
            ?.split(".")
            .filter(Boolean)
            .map((line, i) => (
              <li key={i}>{line.trim()}</li>
            ))}
        </ul>

        <span
          className={`inline-block mb-4 text-sm font-medium ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? "In Stock" : "Out of Stock"}
        </span>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => addToCartMutation.mutate()}
            disabled={product.stock === 0 || addToCartMutation.isPending}
            className="px-6 py-2 rounded bg-newPrimary text-white"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </button>

          <Link
            to="/products"
            className="px-6 py-2 rounded border border-newPrimary text-newPrimary"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;