import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes, FaSignInAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../context/authSlice";
import axios from "axios";

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // string label for currently opened nav-dropdown
  const [userDropdownOpen, setUserDropdownOpen] = useState(false); // profile dropdown
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const desktopUserRef = useRef(null); // profile dropdown ref
  const mobileMenuRef = useRef(null); // mobile menu ref
  const closeTimeoutRef = useRef(null); // delay timer to prevent flicker

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const [cartCount, setCartCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // --- Click outside to close any open menus ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideDropdown = Boolean(event.target.closest("[data-dropdown-root]"));
      const clickedInsideProfile = desktopUserRef.current && desktopUserRef.current.contains(event.target);
      const clickedInsideMobile = mobileMenuRef.current && mobileMenuRef.current.contains(event.target);
      const clickedMobileButton = event.target.closest(".mobile-menu-button");

      if (!clickedInsideDropdown && !clickedInsideProfile && !clickedInsideMobile && !clickedMobileButton) {
        setOpenDropdown(null);
        setUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  // --- Fetch cart count (kept as your original logic) ---
  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const userId = user?.id;
      if (!userId) return;

      try {
        const response = await axios.get(`${API_URL}/cart/${userId}`);
        const cart = response.data;
        const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (error) {
        setCartCount(0);
      }
    };

    fetchCart();
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    const interval = setInterval(fetchCart, 20000);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  // --- Logout ---
  const handleLogout = () => {
    try {
      dispatch(logout());
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      setCartCount(0);
      setOpenDropdown(null);
      setUserDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { path: "/products", text: "Products" },
    { path: "/apps", text: "Apps" },
    {
      label: "Help & Support",
      children: [
        { to: "/terms-conditions", label: "Terms and Conditions" },
        { to: "/privacy-policy", label: "Privacy Policy" },
        { to: "/complaints", label: "Complaints Handling Mechanism" },
        { to: "/ship-cancel", label: "Shipping and Cancellation" },
        { to: "/refund-return-exchange", label: "Refund, Returns and Exchange" },
      ],
    },
    { path: "/disclaimer", text: "Disclaimer" },
    { path: "/about", text: "About" },
    { path: "/contact", text: "Contact" },
  ];

  // helpers for delayed close to avoid flicker when moving pointer
  const scheduleCloseDropdown = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150); // 150ms delay
  };
  const cancelScheduledClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  return (
    <nav className="bg-gray-100 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-5 md:px-20 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/images/infinitybyte.png" alt="Infinity Logo" className="h-14 w-auto" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden 900:flex items-center space-x-8">
          {navLinks.map((link) => {
            const hasChildren = Array.isArray(link.children) && link.children.length > 0;
            const key = link.label ?? link.text ?? link.path;

            if (hasChildren) {
              const label = link.label;
              return (
                <div
                  key={key}
                  className="relative"
                  data-dropdown-root
                  onMouseEnter={() => {
                    cancelScheduledClose();
                    setOpenDropdown(label);
                  }}
                  onMouseLeave={() => {
                    scheduleCloseDropdown();
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown((prev) => (prev === label ? null : label))}
                    className="text-black hover:text-newPrimary font-medium transition-colors duration-300"
                  >
                    {label}
                  </button>

                  {/* Dropdown */}
                  {openDropdown === label && (
                    <div
                      className="absolute left-0 mt-2 w-56 bg-white shadow-lg rounded z-50"
                      onMouseEnter={cancelScheduledClose}
                      onMouseLeave={scheduleCloseDropdown}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block px-4 py-2 hover:bg-newPrimary hover:text-white text-sm text-gray-700"
                          onClick={() => setOpenDropdown(null)} // close on click
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // normal link (no children)
            return (
              <Link
                key={key}
                to={link.path}
                className="text-black hover:text-newPrimary font-medium transition-colors duration-300"
              >
                {link.text}
              </Link>
            );
          })}

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl text-newPrimary" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-newPrimary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Profile */}
          {!userInfo ? (
            <Link to="/login" className="flex items-center text-newPrimary gap-1">
              <FaSignInAlt className="text-xl" />
              <span>Sign In</span>
            </Link>
          ) : (
            <div className="relative" ref={desktopUserRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2"
              >
                <FaUserCircle className="text-xl text-newPrimary" />
                <span className="text-newPrimary font-medium">
                  {userInfo.username || userInfo.name || userInfo.email}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-newPrimary hover:bg-newPrimary hover:text-white"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-newPrimary hover:bg-newPrimary hover:text-white"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-newPrimary hover:bg-newPrimary hover:text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Section */}
        <div className="900:hidden flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl text-newPrimary" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-newPrimary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="mobile-menu-button text-newPrimary"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            type="button"
          >
            {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="900:hidden bg-white shadow-lg py-4 px-5 z-40">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => {
              const hasChildren = Array.isArray(link.children) && link.children.length > 0;
              const key = link.label ?? link.text ?? link.path;

              if (hasChildren) {
                const label = link.label;
                return (
                  <div key={key} className="w-full">
                    <button
                      onClick={() => setOpenDropdown((prev) => (prev === label ? null : label))}
                      className="w-full text-left text-newPrimary font-medium py-2 px-2 rounded flex justify-between items-center hover:bg-newPrimary hover:text-white"
                    >
                      {label}
                      <span>{openDropdown === label ? "▲" : "▼"}</span>
                    </button>

                    {openDropdown === label && (
                      <div className="ml-4 mt-2 space-y-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            className="block text-gray-700 hover:bg-newPrimary hover:text-white rounded px-2 py-1"
                            onClick={() => {
                              setOpenDropdown(null);
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={key}
                  to={link.path}
                  className="text-newPrimary hover:bg-newPrimary hover:text-white font-medium py-2 px-2 w-full text-left rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.text}
                </Link>
              );
            })}

            <div className="border-t border-gray-200 pt-4">
              {userInfo ? (
                <>
                  <Link
                    to="/profile"
                    className="block text-newPrimary hover:bg-newPrimary hover:text-white py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block text-newPrimary hover:bg-newPrimary hover:text-white py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    type="button"
                    className="w-full text-newPrimary hover:bg-newPrimary hover:text-white py-2 text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-newPrimary hover:bg-newPrimary hover:text-white py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
