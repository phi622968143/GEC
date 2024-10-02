import React, { useState, useEffect } from "react";
import axios from "axios";

const BackendURL = "http://127.0.0.1:8000/api/";

// Define types for cart items and product info
interface ProductInfo {
  id: number;
  name: string;
}

interface CartData {
  product_info: ProductInfo[];
  total_price: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartData | null>(null); // Cart data can be null initially
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const { usr_id } = useParams<{ usr_id: string }>(); // usr_id is expected to be a string

  console.log(usr_id);

  // Fetch and set cart data based on usr_id
  useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendURL}cart/view/${usr_id}`);
          console.log(res.data);
          setCartItems(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchCartItems();
  }, [usr_id]);

  const handleDeal = async (product_id: number) => {
    try {
      const response = await axios.post(`${BackendURL}order/post`, {
        customer_email: 1, // Assuming customer_email is just a placeholder
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
      <div>CartPage</div>
      {cartItems &&
      cartItems.product_info &&
      cartItems.product_info.length > 0 ? (
        cartItems.product_info.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <button onClick={() => handleDeal(item.id)}>Checkout</button>
          </div>
        ))
      ) : (
        <p>No items in the cart.</p>
      )}
      {cartItems && <h3>Total Price: {cartItems.total_price}</h3>}
    </div>
  );
};

export default CartPage;
