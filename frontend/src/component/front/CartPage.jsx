import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const BackendAPIURL = "http://127.0.0.1:8000/api/";
const BackendServerURL="http://127.0.0.1:8000/"

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [productImages,setProductImages]=useState({});
    const {usr_id}=useParams();
    // console.log(usr_id);

    //fetch and set data by usr_id
    //fetch pic using CartItem id 
    useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendAPIURL}cart/view/${usr_id}`);

          console.log(res.data);
          setCartItems(res.data);
          res.data.product_info.forEach((product)=>{
            fetchProductImgs(product.id)
          })
        } catch (error) {
          console.log(error);
        }
      }
    };
    const fetchProductImgs=async (product_id)=>{
        try{
            const res=await axios.get(`${BackendAPIURL}img?product_id=${product_id}`);
            setProductImages((prevState) => ({
                ...prevState,
                [product_id]: res.data 
            }));
            console.log(res.data)
        }catch(e){
            console.log(e)
        }
    }
        fetchCartItems();
    }, []);
    
    const handleDeal = async (product_id) => {
        try {
            const response = await axios.post(`${BackendAPIURL}order/post`, {
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
    const handleDelete = async (item_id) => {
        if (window.confirm('del it...')) {
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
       
        {cartItems.product_info && cartItems.product_info.length > 0 ? (
                cartItems.product_info.map((item) => (
                    <div key={item.id} className="cart-item">
                        <h3>{item.name}</h3>
                        

                        {productImages[item.id] && productImages[item.id].length > 0 ? (
                            <img 
                                src={BackendServerURL+productImages[item.id][0].img} 
                                alt={item.name} 
                                style={{ width: '150px' }} 
                            />
                        ) : (
                            <p>No images available</p>
                        )}
                        <p>Quantity: {item.num}</p>

                        <button onClick={() => handleDeal(item.id)}>
                            Checkout
                        </button>
                        <button onClick={() => handleDelete(item.id)}>
                            Delete
                        </button>
                    </div>
                ))
            ) : (
                <p>No items in the cart.</p>
            )} <h3>{cartItems.total_price}</h3>
        
    </div>
    )
       
};

export default CartPage;