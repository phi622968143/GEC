import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Category choices type definition
interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  img: Array<{ img: string }>; // Assuming 'img' is an array of objects with 'img' as a key
}

const CATEGORY_CHOICES: Category[] = [
  { id: 1, name: "Electric Guitar" },
  { id: 2, name: "Amplifier" },
  { id: 3, name: "Effects Pedal" },
  { id: 4, name: "Gig Bag" },
];

const BackendURL = "http://127.0.0.1:8000/api/";
const MediaURL = "http://127.0.0.1:8000/";

const ProductPage: React.FC = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${BackendURL}product_page/${selectedCategory}`
        );
        const products: Product[] = res.data;
        setProductData(products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
  };

  const handleAddCartClick = async (product_id: number) => {
    try {
      const res = await axios.post(`${BackendURL}cart/add`, {
        customer: 1, // Assuming customer ID is hardcoded to 1 for now
        product: product_id,
      });
      console.log(res);
      navigate("/cart/1");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto mt-4">
      <h1 className="mb-4 text-2xl font-bold">GEC</h1>

      {/* Category buttons */}
      <div className="mb-4">
        {CATEGORY_CHOICES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 mr-2 rounded ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "border border-blue-500 text-blue-500"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {productData.map((product) => (
          <div key={product.id} className="mb-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4">
                <h5 className="text-lg font-semibold mb-2">{product.name}</h5>
                <img
                  src={MediaURL + product.img[0].img}
                  alt={product.name}
                  className="w-24 h-auto max-w-xs max-h-xs object-cover"
                />
                <br />
                <a
                  href={BackendURL + product.description}
                  className="text-blue-500 underline"
                >
                  產品描述
                </a>
                <p className="mt-2 text-lg font-bold">
                  Price: ${product.price}
                </p>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                  onClick={() => handleAddCartClick(product.id)}
                >
                  Add Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
