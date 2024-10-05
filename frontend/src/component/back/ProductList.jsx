import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductDelete from "./ProductDelete";
import ProductUpdate from "./ProductUpdate";
import ProductUpload from "./ProductUpload";
function ProductList() {
  const BackendURL = "http://127.0.0.1:8000/";
  const [productData, setProductData] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [productAudios, setProductAudios] = useState({});
  const [Order, setOrder] = useState({});
  const [error, setError] = useState(null);
  const [updateSelected, setUpdateSelected] = useState(null);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  const pageChange = () => {
    window.location.href = "http://localhost:1140/upload";
  };
  const handleClick = (img) => {
    setUpdateSelected(img);
  };
  const handleClose = () => {
    setUpdateSelected(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await axios.get(`${BackendURL}api/product`);
        const products = productResponse.data; //body
        setProductData(products);

        // // Fetch product images
        const imgResponse = await axios.get(`${BackendURL}api/img`);
        const images = imgResponse.data;
        const imagesByProduct = {};
        images.forEach((img) => {
          if (!imagesByProduct[img.product]) {
            imagesByProduct[img.product] = [];
          }
          imagesByProduct[img.product].push(img);
        });
        setProductImages(imagesByProduct);

        // // Fetch product audios
        const audioResponse = await axios.get(`${BackendURL}api/audio`);
        const audios = audioResponse.data;
        const audiosByProduct = {};
        audios.forEach((audio) => {
          if (!audiosByProduct[audio.product]) {
            audiosByProduct[audio.product] = [];
          }
          audiosByProduct[audio.product].push(audio);
        });
        setProductAudios(audiosByProduct);

        // const orderResponse = axios.get(`${BackendURL}api/order/get`);
        // console.log(orderResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);
  if (error) {
    return <div>{error}</div>;
  }

  if (!productData.length) {
    navigate("/upload");
    return null;
  }

  const CATEGORY_CHOICES = [
    [1, "Electric Guitar"],
    [2, "Amplifier"],
    [3, "Effects Pedal"],
    [4, "Gig Bag"],
  ];

  const skillLevels = {
    beginner: "初學者",
    intermediate: "中級",
    advanced: "高級",
  };

  const getCategoryName = (categoryValue) => {
    const matchingChoice = CATEGORY_CHOICES.find(
      (choice) => choice[0] === categoryValue
    );
    return matchingChoice ? matchingChoice[1] : categoryValue;
  };

  const getSkillLevelName = (skillLevelValue) => {
    return skillLevels[skillLevelValue] || skillLevelValue;
  };

  return (
    <div className="container mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">產品列表</h1>
      <p className="mb-6">點擊照片可以更新, 刪除是將整個產品刪除ㄛ！</p>

      <table className="table-auto w-full hover:shadow-lg rounded-lg text-left border-collapse">
        <thead>
          <tr className="bg-purple-400">
            <th className="p-3 border">名稱</th>
            <th className="p-3 border">價格</th>
            <th className="p-3 border">品牌</th>
            <th className="p-3 border">數量</th>
            <th className="p-3 border">適用技能等級</th>
            <th className="p-3 border">類別</th>
            <th className="p-3 border">商品文件</th>
            <th className="p-3 border">首圖</th>
            <th className="p-3 border">音訊</th>
            <th className="p-3 border">刪除產品</th>
          </tr>
        </thead>
        <tbody>
          {/* Pass product obj use its id to print img and audio */}
          {productData.map((product) => (
            <tr key={product.id} className="bg-purple-100 hover:bg-purple-200">
              <td className="p-3 border">{product.name}</td>
              <td className="p-3 border">{product.price}</td>
              <td className="p-3 border">{product.brand}</td>
              <td className="p-3 border">{product.num}</td>
              <td className="p-3 border">
                {getSkillLevelName(product.skill_lv)}
              </td>
              <td className="p-3 border">
                {getCategoryName(product.category)}
              </td>
              <td className="p-3 border">
                {product.description && (
                  <a
                    href={BackendURL + product.description}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    查看文件
                  </a>
                )}
              </td>
              <td className="p-3 border">
                {/* Display images */}
                {productImages[product.id] ? (
                  productImages[product.id].map((img) =>
                    img.primary ? (
                      <div key={img.id}>
                        <img
                          src={BackendURL + img.img}
                          onClick={() => handleClick(img)}
                          alt={`Product ${product.name}`}
                          className="w-12 h-12 object-cover cursor-pointer"
                        />
                        {updateSelected && updateSelected.id === img.id && (
                          <ProductUpdate
                            productImg={updateSelected}
                            onClose={handleClose}
                          />
                        )}
                      </div>
                    ) : null
                  )
                ) : (
                  <div>
                    <button
                      onClick={() => {
                        setClicked(!clicked);
                        handleClick(product);
                      }}
                      className="text-blue-500 underline"
                    >
                      設定圖片
                    </button>
                    {clicked && (
                      <ProductUpdate
                        productImg={updateSelected}
                        onClose={handleClose}
                      />
                    )}
                  </div>
                )}
              </td>
              <td className="p-3 border">
                {/* Display audios */}
                {productAudios[product.id] &&
                  productAudios[product.id].map((audio) => (
                    <div key={audio.id}>
                      <p>{audio.equipment}</p>
                      <audio controls className="w-full">
                        <source
                          src={BackendURL + audio.audio}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
              </td>
              <td className="p-3 border">
                <ProductDelete
                  productId={product.id}
                  onDelete={(id) => {
                    setProductData(productData.filter((p) => p.id !== id)); // filter out deleted product
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        className="mt-6 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        onClick={pageChange}
      >
        上傳頁
      </button>
    </div>
  );
}

export default ProductList;
