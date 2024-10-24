import React, { useState, useEffect } from "react";
import SearchPage from "../back/SearchPage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CATEGORY_CHOICES = [
  { id: 1, name: "Electric Guitar" },
  { id: 2, name: "Amplifier" },
  { id: 3, name: "Effects Pedal" },
  { id: 4, name: "Gig Bag" },
];

const BackendURL = "http://127.0.0.1:8000/api/";
const MediaURL = "http://127.0.0.1:8000/";

const ProductPage = () => {
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BackendURL}product_page/${selectedCategory}`
        );
        const products = res.data;
        setProductData(products);
        setFilteredProducts(products);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddCartClick = async (product_id) => {
    try {
      const response = await axios.post(`${BackendURL}cart/add`, {
        customer: 1, // 如果需要，可以替換1為動態的顧客ID
        product: product_id,
      });
      console.log("加入購物車API返回數據: ", response.data);
      toast.success("商品成功加入購物車!", {
        position: "top-right",
        autoClose: 1500, // 1.5秒後自動關閉
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => navigate("/cart/1"),
      });
    } catch (error) {
      console.error("加入購物車API出錯: ", error);
      toast.error("商品加入購物車失敗!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log(error.response ? error.response.data : error.message);
    }
  };

  const handleToCartClick = () => {
    window.location.href = "/cart/1";
  };
  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      // filter product if conform to search condition
      const filtered = productData.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      // Show all if no search condition
      setFilteredProducts(productData);
    }
  };
  return (
    <div className="container mx-auto mt-4">
      <ToastContainer />
      <h1 className="mb-4">GEC</h1>
      <SearchPage onSearch={handleSearch} />
      <button
        onClick={handleToCartClick}
        className="ml-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 flex flex-row"
      >
        <span>Cart</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
          />
        </svg>
      </button>
      <div className="category-buttons mb-4">
        {/* loop hover */}
        {CATEGORY_CHOICES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 mr-2 rounded ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "border border-blue-500 text-blue-500"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div>No result</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="mb-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2">{product.name}</h5>
                  <img
                    src={MediaURL + product.img[0].img}
                    alt={product.name}
                    className="w-24 h-auto max-w-xs max-h-xs object-cover"
                  />
                  <br />
                  <a
                    href={BackendURL + product.description}
                    className="text-blue-500 underline"
                  >
                    產品描述
                  </a>
                  <p className="mt-2 text-lg font-bold">
                    Price: ${product.price}
                  </p>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                    onClick={() => handleAddCartClick(product.id)}
                  >
                    Add Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
