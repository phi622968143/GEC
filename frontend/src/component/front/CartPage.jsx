import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const BackendAPIURL = "http://127.0.0.1:8000/api/";
const BackendServerURL = "http://127.0.0.1:8000/";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [productImages, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const { usr_id } = useParams();
  // console.log(usr_id);

  //fetch and set data by usr_id
  //fetch pic using CartItem id
  useEffect(() => {
    const fetchCartItems = async () => {
      //可新增一次結帳全部的功能
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendAPIURL}cart/view/${usr_id}`);

          //   console.log(res.data);
          setCartItems(res.data);
          setLoading(false);
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

  const handleDeal = async (cartItem) => {
    //chose pay_method
    const pay_method = prompt(
      "請選擇付款方式:\n1: 信用卡\n2: 銀行轉帳\n3: LINE Pay\n請輸入數字(1-3)"
    );

    // chack if cancel
    if (!pay_method) {
      alert("請選擇付款方式!");
      return;
    }

    // check if avaliable
    if (!["1", "2", "3"].includes(pay_method)) {
      alert("請輸入有效的數字 1-3!");
      return;
    }

    // transform num to methods
    const paymentMethods = {
      1: "信用卡",
      2: "銀行轉帳",
      3: "LINE Pay",
    };
    try {
      const response = await axios.post(`${BackendAPIURL}order/post`, {
        customer_email: 1,
        pay_method: paymentMethods[pay_method],
        order_details: {
          product: cartItem.product,
          product_num: cartItem.quantity,
        },
      });
      await axios.delete(`${BackendAPIURL}cart/delete/${cartItem.id}`);
      if (response) {
        setOrderSubmitted(true);
        alert("order sent");
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

  return (
    <div>
      <h1>Cart for User {usr_id}</h1>
      <div>CartPage</div>

      {loading ? (
        <p>Loading...</p>
      ) : cartItems.cart_items.length > 0 ? (
        // using cart_items  product maps product id to use product info

        cartItems.cart_items.map((cartItem) => {
          const product = cartItems.product_info.find(
            (product) => product.id === cartItem.product
          );

          return (
            <div key={cartItem.id} className="mb-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {product ? product.name : "Unkown Product"}
                  </h3>

                  {productImages[product.id] &&
                  productImages[product.id].length > 0 ? (
                    <img
                      src={BackendServerURL + productImages[product.id][0].img}
                      alt={product ? product.name : "Image"}
                      style={{ width: "150px" }}
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                  <p>數量: {cartItem.quantity}</p>

                  <button
                    className="bg-green-500 text-blue px-4 py-2 rounded mt-4 hover:bg-green-600"
                    onClick={() => handleDeal(cartItem)}
                  >
                    Checkout
                  </button>

                  <button
                    className="bg-red-500 text-blue px-4 py-2 rounded mt-4 hover:bg-red-600"
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
