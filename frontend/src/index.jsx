import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // 引入 Bootstrap JS（必要時）
import './index.css'; // 自定義樣式檔案（如果需要）

import IndexPage from './IndexPage';
import NoPage from './component/NoPage';
import { 
  ProductUpload, 
  ProductList, 
  ProductUpdate, 
  Order 
} from './component/back';
import { 
  ProductPage, 
  CartPage 
} from './component/front';
import AdminLayout from './component/back/AdminLayout'; // 後台母版頁面

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 主頁 */}
        <Route path="/" element={<IndexPage />} />

        {/* 後台路由 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products/upload" element={<ProductUpload />} />
          <Route path="products/list" element={<ProductList />} />
          <Route path="products/update/:id" element={<ProductUpdate />} />
          <Route path="orders" element={<Order />} />
        </Route>

        {/* 前台路由 */}
        <Route path="/products" element={<ProductPage />} />
        <Route path="/cart/:usr_id" element={<CartPage />} />

        {/* 404 頁面 */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// 渲染應用程式
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
