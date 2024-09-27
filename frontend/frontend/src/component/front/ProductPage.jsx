import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//view onclick and pass id
//add :when usr click add to cart post payload to back
const CATEGORY_CHOICES = [
  { id: 1, name: 'Electric Guitar' },
  { id: 2, name: 'Amplifier' },
  { id: 3, name: 'Effects Pedal' },
  { id: 4, name: 'Gig Bag' },
];

const BackendURL = "http://127.0.0.1:8000/api/";
const MediaURL = "http://127.0.0.1:8000/";

const ProductPage = () => {
  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BackendURL}product_page/${selectedCategory}`);
        const products = res.data;
        setProductData(products);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  const handleAddCartClick=async (product_id)=>{
    const res = await axios.post(`${BackendURL}cart/add`, {
      customer: 1,
      product:product_id,
    }
   
    ) 
    .then(function (response) {
      console.log(response);
      navigate('/cart/1');
    })
    .catch(function (error) {
      console.log(error);
    });

  }
  return (
    
    <div className="container mt-4">
      
      {console.log(productData[0])}
      <h1 className="mb-4">GEC</h1>
      <div className="category-buttons mb-4">
        {/* loop hover */}
        {CATEGORY_CHOICES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'} me-2`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="row">
        {productData.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <img src={MediaURL+product.img[0].img} style={{ width: '30%', height: 'auto', maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}  /> <br />
               
                <a href={BackendURL+product.description}>產品描述</a>
                <p className="card-text"><strong>Price: ${product.price}</strong></p>
                <button className="btn btn-success"
                    onClick={() =>{
                      handleAddCartClick(product.id);
                    } }
               >Add Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;