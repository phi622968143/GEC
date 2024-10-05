import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const BackendAPIURL = "http://127.0.0.1:8000/api/";
const BackendServerURL="http://127.0.0.1:8000/"

const CartPage = () => {
    const [cartItems, setCartItems] = useState(
        {
            cart_items: [
              { id: 4, quantity: 0, date_added: '', customer: 0, product: 0 },
              
            ],
            product_info: [
              { id: 22, name: '', price: 0, brand: '', num: 0 },
            ],
            total_price: 0
          }
);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const [productImages,setProductImages]=useState({});
    const [loading, setLoading] = useState(true);
    const {usr_id}=useParams();
    // console.log(usr_id);

    //fetch and set data by usr_id
    //fetch pic using CartItem id 
    useEffect(() => {
    const fetchCartItems = async () => {
      if (usr_id) {
        try {
          const res = await axios.get(`${BackendAPIURL}cart/view/${usr_id}`);

        //   console.log(res.data);
          setCartItems(res.data);
          setLoading(false);
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
            // console.log(res.data)
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
   
        {loading ? (
            <p>Loading...</p>
        ) :cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item.product_info.id} className="cart-item">
                        <h3>{item.product_info.name}</h3>
                        

                        {productImages[item.product_info.id] && productImages[item.product_info.id].length > 0 ? (
                            <img 
                                src={BackendServerURL+productImages[item.product_info.id][0].img} 
                                alt={item.product_info.name} 
                                style={{ width: '150px' }} 
                            />
                        ) : (
                            <p>No images available</p>
                        )}
                        <p>Quantity: {item.product_info.num}</p>

                        <button onClick={() => handleDeal(item.cart_items.id)}>
                            Checkout
                        </button>
                        <button onClick={() => handleDelete(item.cart_items.id)}>
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