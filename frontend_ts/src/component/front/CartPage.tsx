import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BackendAPIURL = "http://127.0.0.1:8000/api/";
const BackendServerURL = "http://127.0.0.1:8000/";

interface CartItem {
  id: number;
  product: number;
  quantity: number;
}

interface ProductInfo {
  id: number;
  name: string;
}

interface CartData {
  cart_items: CartItem[];
  product_info: ProductInfo[];
  total_price: number;
}

interface ProductImages {
  [key: number]: { img: string }[];
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartData | null>(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [productImages, setProductImages] = useState<ProductImages>({});
  const [loading, setLoading] = useState(true);
  const { usr_id } = useParams<{ usr_id: string }>();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendAPIURL}cart/view/${usr_id}`);
          setCartItems(res.data);
          setLoading(false);
          res.data.product_info.forEach((product: ProductInfo) => {
            fetchProductImgs(product.id);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchProductImgs = async (product_id: number) => {
      try {
        const res = await axios.get(
          `${BackendAPIURL}img?product_id=${product_id}`
        );
        setProductImages((prevState) => ({
          ...prevState,
          [product_id]: res.data,
        }));
      } catch (e) {
        console.log(e);
      }
    };

    fetchCartItems();
  }, [usr_id]);

  const handleDeal = async (cartItem: CartItem) => {
    const pay_method = prompt(
      "請選擇付款方式:\n1: 信用卡\n2: 銀行轉帳\n3: LINE Pay\n請輸入數字(1-3)"
    );
    if (!pay_method) {
      alert("請選擇付款方式!");
      return;
    }
    if (!["1", "2", "3"].includes(pay_method)) {
      alert("請輸入有效的數字 1-3!");
      return;
    }

    const paymentMethods = {
      1: "信用卡",
      2: "銀行轉帳",
      3: "LINE Pay",
    };

    try {
      const response = await axios.post(`${BackendAPIURL}order/post`, {
        customer_email: 1,
        pay_method: paymentMethods[pay_method as keyof typeof paymentMethods],
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

  const handleDelete = async (item_id: number) => {
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
      ) : cartItems && cartItems.cart_items.length > 0 ? (
        cartItems.cart_items.map((cartItem) => {
          const product = cartItems.product_info.find(
            (product) => product.id === cartItem.product
          );

          return (
            <div key={cartItem.id} className="mb-4">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {product ? product.name : "Unknown Product"}
                  </h3>

                  {product &&
                  productImages[product.id] &&
                  productImages[product.id].length > 0 ? (
                    <img
                      src={BackendServerURL + productImages[product.id][0].img}
                      alt={product.name}
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
      <h3>Total price is ${cartItems?.total_price}</h3>
    </div>
  );
};

export default CartPage;
