import axios from "axios";

export const fetchProductsAndCategories = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/products/enabled`
  );

  return res.data.data;
};

export const addToCart = async ({ userId, productId }) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/cart/add`,
    {
      userId,
      productId,
      quantity: 1,
    }
  );
  return res.data;
};

export const fetchSingleProduct = async (id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
  );
  return res.data.data;
};

export const fetchCategories = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/categories`
  );
  return res.data?.data ?? res.data;
};