import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const BackendAPIURL = "http://127.0.0.1:8000/api/";
const BackendServerURL = "http://127.0.0.1:8000/";

const CartPage = () => {
  const [cartItems, setCartItems] = useState({});
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [productImages, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const { usr_id } = useParams();
  // console.log(usr_id);

  //fetch and set data by usr_id
  //fetch pic using CartItem id
  useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendAPIURL}cart/view/${usr_id}`);

          //   console.log(res.data);
          setLoading(false);
          setCartItems(res.data);

          res.data.product_info.forEach((product) => {
            fetchProductImgs(product.id);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };
    const fetchProductImgs = async (product_id) => {
      try {
        const res = await axios.get(
          `${BackendAPIURL}img?product_id=${product_id}`
        );
        setProductImages((prevState) => ({
          ...prevState,
          [product_id]: res.data,
        }));
        // console.log(res.data)
      } catch (e) {
        console.log(e);
      }
    };
    fetchCartItems();
  }, []);

  const handleDeal = async (product_id) => {
    try {
      const response = await axios.post(`${BackendAPIURL}order/post`, {
        customer_email: 1,
        pay_method: "信用卡",
        send_day: "2024-09-25",
      });

      if (response) {
        setOrderSubmitted(true);
        console.log(orderSubmitted);
      } else {
        console.error("Failed to submit order");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleDelete = async (item_id) => {
    if (window.confirm("del it...")) {
      try {
        await axios.delete(`${BackendAPIURL}cart/delete/${item_id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };
  console.log(cartItems);
  return (
    <div>
      <h1>Cart for User {usr_id}</h1>
      <div>CartPage</div>

      {loading ? (
        <p>加載中...</p>
      ) : cartItems.cart_items.length > 0 ? (
        // 對 cartItems.cart_items 進行 map，而不是 cartItems
        cartItems.cart_items.map((cartItem) => {
          // 使用 cartItem.id 找到對應的 product_info
          const product = cartItems.product_info.find(
            (product) => product.id === cartItem.product // 假設 cartItem.id 對應 product_info.id
          );

          return (
            <div key={cartItem.id} className="mb-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {product ? product.name : "未知產品"}
                  </h3>

                  {productImages[product.id] &&
                  productImages[product.id].length > 0 ? (
                    <img
                      src={BackendServerURL + productImages[product.id][0].img}
                      alt={product ? product.name : "產品圖片"}
                      style={{ width: "150px" }}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                  <p>數量: {cartItem.quantity}</p>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                    onClick={() => handleDeal(cartItem.id)}
                  >
                    Checkout
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
                    onClick={() => handleDelete(cartItem.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No items in the cart.</p>
      )}
      <h3>Total price is ${cartItems.total_price}</h3>
    </div>
  );
};

export default CartPage;
