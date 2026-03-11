import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Signup from "./pages/user/Signup";
import Products from "./pages/user/Products";
import Order from './pages/user/Orders'
import SingleProduct from "./pages/user/SingleProduct";
import Cart from "./pages/user/Cart";
import Profile from "./pages/user/Profile";
import About from './pages/user/About';
import Footer from './pages/user/Footer';
import ReturnPolicy from './pages/user/Return_Policy';
import Contact from './pages/user/Contact'
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersTable from "./pages/admin/UsersTable";
import ProductsPage from "./pages/admin/ProductsPage";
import AddProduct from "./pages/admin/AddProduct";
import TransactionsPage from "./pages/admin/TransactionsPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Disclaimer from "./pages/user/Disclaimer";
import MobileApps from "./pages/user/MobileApps";
import Promotion from "./pages/admin/Promotion";
import Category from "./pages/admin/Category";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Success from "./pages/Success";
import ForgotPassword from "./pages/user/ForgotPassword";
import Cancel from "./pages/user/Cancel";
import ProductCategories from "./pages/user/ProductPromotions";
import ResetPassword from "./pages/user/ResetPassword";
import ShippingAndCancellation from './pages/user/ShippingAndCancellation'
import Complaints from "./pages/user/Complaints";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import RefundReturn from "./pages/user/RefundReturn";
import TermsConditions from "./pages/user/TermsConditions";
import PaymentSuccess from "./pages/user/PaymentSuccess ";

import AIChatbot from "./components/AIChatbot";


function AppContent() {
  const location = useLocation();
  const hideFooterRoutes = [
    "/login",
    "/signup",
    "/forgot-password"
  ];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isHideFooterRoute = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="max-h-screen flex flex-col bg-gray-50">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
           <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path='/orders' element={<Order />} />
          <Route path='/success' element={<Success />} />
          <Route path='/cancel' element={<Cancel />} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product-categories/:promotionName" element={<ProductCategories />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/apps" element={<MobileApps />} />

          {/* Static Pages */}

          <Route path="/ship-cancel" element={<ShippingAndCancellation />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-return-exchange" element={<RefundReturn />} />
          <Route path="/terms-conditions" element={<TermsConditions/>} />

          

          {/* Admin Layout Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersTable />} />
            <Route path="products">
              <Route index element={<ProductsPage />} />
              <Route path="add-product" element={<AddProduct />} />
            </Route>
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="promotion" element={<Promotion />} />
            <Route path="category" element={<Category />} />
          </Route>
        </Routes>
      </main>
      {!isAdminRoute && !isHideFooterRoute &&  <Footer /> && <AIChatbot />}
      <ToastContainer position="top-right" autoClose={2000} />

      
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
