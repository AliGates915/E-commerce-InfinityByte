import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/transactions", label: "Transactions" },
  { to: "/admin/promotion", label: "Promotion" },
  { to: "/admin/category", label: "Category" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage or token
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };

  return (
    <aside className="bg-white shadow h-full min-h-screen w-56 flex flex-col py-8 px-4 justify-between">
      <div>
        <div className="text-2xl font-bold text-primary mb-10 text-center">Infinity Bytes</div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-primary/10"
                }`
              }
              end={link.to === "/admin"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
