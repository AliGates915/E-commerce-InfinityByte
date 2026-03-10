import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProductsAndCategories, addToCart } from "../../services/productApi";

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [disabledButtons, setDisabledButtons] = useState({});
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  // ✅ Fetch products with React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products-enabled"],
    queryFn: fetchProductsAndCategories,
    staleTime: 1000 * 60 * 5,
  });

  const productList = data?.products || [];
  const categories = data?.categories || [];

  // ✅ Mutation for Add To Cart
  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    },
  });

  // Filter products
  const filteredProducts =
    selectedCategory === "All"
      ? productList
      : productList.filter((p) =>
        Array.isArray(p.category)
          ? p.category.some((c) => c.name === selectedCategory)
          : p.category?.name === selectedCategory
      );

  // Animation
  useEffect(() => {
    const elements = cardsRef.current.filter(Boolean);
    if (!elements.length) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, [filteredProducts, selectedCategory]);

  useEffect(() => {
    cardsRef.current = [];
  }, [filteredProducts]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const userId = user?.id;

    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    setDisabledButtons((prev) => ({ ...prev, [product._id]: true }));

    addToCartMutation.mutate(
      { userId, productId: product._id },
      {
        onSettled: () => {
          setDisabledButtons((prev) => ({ ...prev, [product._id]: false }));
        },
      }
    );
  };

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <PuffLoader color="#00809D" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load products
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-newPrimary">
        All Products
      </h1>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => handleCategoryChange("All")}
          className={`px-4 py-2 rounded-full border ${selectedCategory === "All"
              ? "bg-newPrimary text-white"
              : "bg-white text-newPrimary"
            }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handleCategoryChange(cat.name)}
            className={`px-4 py-2 rounded-full border ${selectedCategory === cat.name
                ? "bg-newPrimary text-white"
                : "bg-white text-newPrimary"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product, idx) => (
          <div
            key={product._id}
            onClick={() => navigate(`/products/${product._id}`)}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="bg-white rounded-lg cursor-pointer shadow hover:shadow-lg transition flex flex-col"
          >
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              loading={idx === 0 ? "eager" : "lazy"}
              fetchPriority={idx === 0 ? "high" : "auto"}
              className="w-full h-48 object-cover rounded-t"
            />

            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-lg font-semibold">{product.name}</h2>

              <p className="text-newPrimary font-bold text-xl mb-2">
                ${product.price}
              </p>

              <div className="flex flex-wrap gap-2">
                {Array.isArray(product.category) &&
                  product.category.map((cat, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: getRandomColor() }}
                      className="text-xs px-3 py-1 rounded-full"
                    >
                      {cat.name}
                    </span>
                  ))}
              </div>

              <div className="mt-auto flex justify-between items-center pt-4">
                <span
                  className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"
                    }`}
                >
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={
                    product.stock <= 0 || disabledButtons[product._id]
                  }
                  className="px-3 py-1 rounded bg-newPrimary text-white text-sm"
                >
                  {disabledButtons[product._id] ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No products found.
        </div>
      )}
    </div>
  );
};

export default Products;