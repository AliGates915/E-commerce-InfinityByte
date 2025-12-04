import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import PuffLoader from "react-spinners/PuffLoader";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // [{product, quantity}]
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [stepUpUrl, setStepUpUrl] = useState(null);


  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);

      if (!userId) {
        console.warn("No userId found, skipping cart fetch.");
        setLoading(false);
        return;
      }
      try {
        const cartRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/cart/${userId}`
        );
        console.log("cartRes", cartRes);
        const cart = cartRes.data;

        // If your backend returns { success: true, data: { items: [...] } }
        const items = cart.items || cart.data?.items || [];

        // Now map over items
        const cartWithDetails = items
          .map((cartItem) => {
            const product = cartItem.productId;
            if (!product) {
              console.warn(`❌ Product not found for cartItem:`, cartItem);
              return null;
            }
            return { ...product, quantity: cartItem.quantity };
          })
          .filter(Boolean);

        setCartItems(cartWithDetails);
      } catch (error) {
        console.error("❌ Error fetching cart:", error);
        toast.error("Failed to load cart.");
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);


  // Handle Checkout session
const handleCheckout = async (paymentMethod = "stripe") => {
  setCheckoutLoading(true);
  try {
    const metadata = {
      userId: user ? String(user.id || user._id) : "",
      products: JSON.stringify(cartItems),
    };

    // ✅ choose correct backend endpoint
    const endpoint =
      paymentMethod === "safepay"
        ? `${import.meta.env.VITE_API_BASE_URL}/transactions/safepay-checkout-session`
        : `${import.meta.env.VITE_API_BASE_URL}/transactions/create-checkout-session`;

    console.log("Payment Endpoint", endpoint);

    // ✅ Safepay requires device fingerprint before calling backend
    let deviceFingerprintId = null;
    if (paymentMethod === "safepay" && window.Safepay) {
      deviceFingerprintId = window.Safepay.deviceDataCollector();
      console.log("Safepay deviceFingerprintId:", deviceFingerprintId);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user ? String(user.id || user._id) : "",
        items: cartItems.map((item) => ({
          name: item.name,
          image: item.images?.[0]?.url,
          price: item.price,
          quantity: item.quantity,
        })),
        success_url: "https://e-commerce-infinity-byte.vercel.app/success",
        cancel_url: "https://e-commerce-infinity-byte.vercel.app/cancel",
        metadata,
        deviceFingerprintId, // ✅ send to backend only for safepay
      }),
    });

    const data = await response.json();
    console.log("Payment Data Response", data);

    if (data?.step_up_url) {
      // 🚀 3D Secure step required (international cards)
      setStepUpUrl(data.step_up_url);
      setCheckoutLoading(false);
    } else if (data?.url) {
      // Normal flow (Stripe or Safepay with local PK cards)
      window.location.href = data.url;
    } else {
      toast.error(`${paymentMethod} checkout failed`);
      setCheckoutLoading(false);
    }
  } catch (error) {
    console.error(`${paymentMethod} Checkout Error:`, error);
    toast.error("Something went wrong during checkout.");
    setCheckoutLoading(false);
  }
};



  const handleQuantityChange = (productId, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(item.quantity + delta, item.stock)
              ),
            }
          : item
      )
    );
    // Optionally: send update to backend here
  };

  const handleRemove = async (productId) => {
    try {
      const userId = user ? String(user.id || user._id) : "";
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/cart/remove`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
          },
          body: JSON.stringify({ userId, productId }),
        }
      );
      console.log("response", response);
      if (response.ok) {
        setCartItems((prev) => prev.filter((item) => item._id !== productId));
        toast.info("Item removed from cart");
      } else {
        toast.error("Failed to remove item from cart");
      }
    } catch (error) {
      toast.error("Error removing item from cart");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#00c7fc" />
      </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-newPrimary">
        Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500">
          Your cart is empty.
          <div className="mt-4">
            <Link
              to="/products"
              className="px-4 py-2 bg-newPrimary text-white rounded hover:bg-newPrimaryDark"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            <div className="bg-white rounded shadow p-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border-b py-4 last:border-b-0"
                >
                  <img
                    src={item.images[0].url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-newPrimary font-bold">${item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, -1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <span className="px-3">
                        {isNaN(item.quantity) ? 1 : item.quantity}
                      </span>

                      <button
                        onClick={() => handleQuantityChange(item._id, +1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>

                      <span
                        className={`ml-4 text-xs font-medium ${
                          item.stock ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {item.stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                    <div className="mt-2 font-semibold">
                      ${item.price * item.quantity || "0"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded shadow p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => handleCheckout("stripe")}
                className="block mt-6 w-full text-center bg-newPrimary text-white py-2 rounded hover:bg-newPrimaryDark font-semibold disabled:opacity-50"
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <PuffLoader color="#fff" size={24} className="mr-2" />
                    Processing...
                  </span>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔐 Step-Up 3D Secure Authentication Modal */}
      {stepUpUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4">
            <iframe
              src={stepUpUrl}
              width="400"
              height="400"
              title="3D Secure Authentication"
              className="rounded-lg"
            />
            <button
              onClick={() => setStepUpUrl(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
