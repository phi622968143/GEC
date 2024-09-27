import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const BackendURL = "http://127.0.0.1:8000/api/";

const CartPage = () => {
    const [cartItems, setCartItems] =useState([]);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const {usr_id}=useParams();
    console.log(usr_id);

    //fetch and set data by usr_id

    useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendURL}cart/view/${usr_id}`);
          console.log(res.data);
          setCartItems(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    };
        fetchCartItems();
    }, []);
    
    const handleDeal = async (product_id) => {
        try {
            const response = await axios.post(`${BackendURL}order/post`, {
                "customer_email": 1,  
                "pay_method": "信用卡", 
                "send_day": "2024-09-25",  
            });

            if (response) {
                
                setOrderSubmitted(true);
                console.log(orderSubmitted)
            } else {
                console.error('Failed to submit order');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
        <h1>Cart for User {usr_id}</h1>
        <div>CartPage</div>

        {cartItems.product_info && cartItems.product_info.length > 0 ? (
            cartItems.product_info.map((item) => (
                <div><h3 key={item.name}>{item.name}</h3>
                <button onClick={
                    ()=>{handleDeal(item.id)}
                }>
                    Checkout
                </button></div>

            ))
        ) : (
            <p>No items in the cart.</p>
        )}  <h3>{cartItems.total_price}</h3>
        
    </div>
    )
       
};

export default CartPage;