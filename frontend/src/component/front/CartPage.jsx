import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const BackendURL = "http://127.0.0.1:8000/api/";
const MediaURL = "http://127.0.0.1:8000/";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const { usr_id } = useParams();
  console.log(usr_id);

  //fetch and set data by usr_id

  useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendURL}cart/view/${usr_id}`);
          console.log("購物車數據: ", res.data);
          setCartItems(res.data);
        } catch (error) {
          console.log("獲取購物車數據失敗: ", error);
        }
      }
    };
    fetchCartItems();
  }, [usr_id]); // 在 usr_id 變化時重新執行

  const handleDeal = async (product_id) => {
    try {
      const response = await axios.post(`${BackendURL}order/post`, {
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

  return (
    <div>
      <h1>Cart for User {usr_id}</h1>
      <h3>Total price is ${cartItems.total_price}</h3>
      <div>CartPage</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cartItems.product_info && cartItems.product_info.length > 0 ? (
          cartItems.product_info.map((item) => (
            <div key={item.id} className="mb-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2" key={item.name}>
                    {item.name}
                  </h3>
                  {/* <img
                    src={MediaURL + item.img[0].img}
                    alt={item.name}
                    className="w-24 h-auto max-w-xs max-h-xs object-cover"
                  /> */}
                  <p className="mt-2 text-lg font-bold">Price: ${item.price}</p>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                    onClick={() => {
                      handleDeal(item.id);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items in the cart.</p>
        )}{" "}
      </div>
    </div>
  );
};

export default CartPage;
