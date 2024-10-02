import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import ProductUpload from "./component/back/ProductUpload";
import ProductList from "./component/back/ProductList";
import ProductUpdate from "./component/back/ProductUpdate";
import ProductPage from "./component/front/ProductPage";
import CartPage from "./component/front/CartPage";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="" element={<ProductList />} />
        <Route path="upload" element={<ProductUpload />} />
        <Route path="update" element={<ProductUpdate />} />
        <Route path="product" element={<ProductPage />} />
        <Route path="cart/:usr_id" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}
