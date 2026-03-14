import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Store, Heart } from 'lucide-react';
import axios from "axios"; // If not already imported

const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/subscribe`,
        { email }
      );
      setSuccess("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setError("Failed to subscribe. Please try again later.");
    }
  };

  return (

   <footer className="bg-newPrimaryFooter border-t-2 py-12 md:py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
      {/* Brand */}
      <div className="space-y-6">
        <Link
          to="/"
          className="flex items-center gap-3 font-bold text-3xl text-black hover:text-newPrimary transition-colors duration-300"
        >
          <Store className="w-10 h-10 text-black hover:text-newPrimary transition-colors duration-300" />
          <span>Infinity Bytes </span>
        </Link>
        <p className="text-black text-base leading-relaxed">
          Your premier destination for quality products and an exceptional shopping experience.
        </p>
      </div>


          {/* Quick Links */}
          <div>

            <h3 className="font-semibold mb-4 text-xl text-black">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>

            </ul>
          </div>

          {/* Customer Service */}
          <div>

            <h3 className="font-semibold mb-4 text-xl text-black">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shipping"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-black hover:text-newPrimary transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-xl text-black">Stay Updated</h3>
            <p className="text-black text-sm mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-md border bg-white text-black px-4 py-2 focus:outline-none focus:ring-2 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}

              />
              <button 
                type="submit"

                className="bg-newPrimary hover:bg-newPrimaryDark text-white font-semibold rounded-md py-2 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"

              >
                Subscribe
              </button>
              {error && <span className="text-red-500">{error}</span>}
              {success && <span className="text-green-500">{success}</span>}
            </form>
          </div>
        </div>


        <div className="border-t border-black/50 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black text-sm">
            © 2025 Infinity Bytes All rights reserved.
          </p>
          <p className="text-black text-sm flex items-center gap-2">
            Made with{' '}
            <Heart className="w-5 h-5 text-black animate-pulse" /> by Infinity Bytes Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
