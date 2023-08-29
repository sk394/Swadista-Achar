import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import data from "./data.json";
import WebFont from "webfontloader";
import React, { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import Orders from "./component/Order/Orders.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import OrderDetails from "./component/Order/OrderDetails.js";
import NotFound from "./component/layout/NotFound/NotFound.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UserList from "./component/Admin/UserList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ReviewsList from "./component/Admin/ReviewsList.js";
import About from "./component/layout/About/About.js";
import Contact from "./component/layout/Contact/Contact.js";



function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  window.addEventListener("contextmenu", (e) => e.preventDefault()); // disable right click

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home start={data.banner.newstart} />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/about" element={<About />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />}/>
        <Route exact path="/login" element={<LoginSignUp />} />
        <Route exact path="/cart" element={<Cart />} />


        {/* stripe */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            {stripeApiKey && (
            <Route
              path="/payment"
              element={
               <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                </Elements> 
              }
            />
            )}
        </Route>
         
         {/* user protected routes */}
         <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/login/shipping" element={<Shipping />} />
            <Route path="/account" element={<Profile />}/>
            <Route path="/me/update" element={<UpdateProfile />} />
            <Route path="/password/update" element={<UpdatePassword />} />
            <Route path="/order/confirm" element={<ConfirmOrder />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
          </Route>

       {/* Admin protected routes */}
       <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} adminRoute={true} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
           
              <Route path="/admin/products" element={<ProductList />} />
              <Route path="/admin/product/:id" element={<UpdateProduct />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/order/:id" element={<ProcessOrder />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/user/:id" element={<UpdateUser />} />
              <Route path="/admin/reviews" element={<ReviewsList />} />
            
       </Route>
       <Route path="/admin/product" element={<NewProduct />} />

      <Route path="*" element={window.location.pathname === "/payment"? null: <NotFound />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
