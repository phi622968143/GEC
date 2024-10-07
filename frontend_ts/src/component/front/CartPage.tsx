import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BackendAPIURL = "http://127.0.0.1:8000/api/";
const BackendServerURL = "http://127.0.0.1:8000/";

// 定義 CartItem 和 Product 的型別
type CartItem = {
  id: number;
  product: number; // product 是一個 product 的 id
  quantity: number;
};

type Product = {
  id: number;
  name: string;
};

type CartResponse = {
  cart_items: CartItem[];
  product_info: Product[];
  total_price: number;
};

type ImageResponse = {
  img: string;
};

const CartPage: React.FC = () => {
  // 預設為空物件，並指定型別
  const [cartItems, setCartItems] = useState<CartResponse>({
    cart_items: [],
    product_info: [],
    total_price: 0,
  });
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [productImages, setProductImages] = useState<
    Record<number, ImageResponse[]>
  >({});
  const [loading, setLoading] = useState(true);
  const { usr_id } = useParams<{ usr_id: string }>();

  //fetch and set data by usr_id
  //fetch pic using CartItem id
  useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get<CartResponse>(
            `${BackendAPIURL}cart/view/${usr_id}`
          );

          setLoading(false);
          setCartItems(res.data);

          // 迭代產品圖片
          res.data.product_info.forEach((product) => {
            fetchProductImgs(product.id);
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    const fetchProductImgs = async (product_id: number) => {
      try {
        const res = await axios.get<ImageResponse[]>(
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

  const handleDeal = async (product_id: number) => {
    try {
      const response = await axios.post(`${BackendAPIURL}order/post`, {
        customer_email: 1, // 假設為靜態客戶ID或郵箱
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
      ) : cartItems.cart_items.length > 0 ? (
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
                      alt={product ? product.name : "Image"}
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
