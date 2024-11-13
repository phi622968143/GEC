import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import ProductUpload from "./component/back/ProductUpload";
import ProductList from "./component/back/ProductList";
import ProductUpdate from "./component/back/ProductUpdate";
import ProductPage from "./component/front/ProductPage";
import CartPage from "./component/front/CartPage";
import IndexPage from "./IndexPage";
import Order from "./component/back/Order";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="list" element={<ProductList />} />
        <Route path="upload" element={<ProductUpload />} />
        <Route path="update" element={<ProductUpdate />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="cart/:usr_id" element={<CartPage />} />
        <Route path="order" element={<Order />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
