import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductDelete from "./ProductDelete";
import ProductUpdate from "./ProductUpdate";
import ProductUpload from "./ProductUpload";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
function ProductList() {
  const BackendURL = "http://127.0.0.1:8000/";
  const [productData, setProductData] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [productAudios, setProductAudios] = useState({});
  const [Order, setOrder] = useState({});
  const [error, setError] = useState(null);
  const [updateSelected,setUpdateSelected]=useState(null);
  const [clicked, setClicked] = useState(false);
  const pageChange=()=>{window.location.href="http://localhost:3000/upload"};
  const handleClick=(img)=>{setUpdateSelected(img)} ;
  const handleClose=()=>{setUpdateSelected(null)};

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await axios.get(
          `${BackendURL}api/product`
        );
        const products = productResponse.data; //body
        setProductData(products);

        // // Fetch product images
        const imgResponse = await axios.get( `${BackendURL}api/img`);
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
        const audioResponse = await axios.get(
          `${BackendURL}api/audio`
        );
        const audios = audioResponse.data;
        const audiosByProduct = {};
        audios.forEach((audio) => {
          if (!audiosByProduct[audio.product]) {
            audiosByProduct[audio.product] = [];
          }
          audiosByProduct[audio.product].push(audio);
        });
        setProductAudios(audiosByProduct);

        const orderResponse=axios.get(
          `${BackendURL}api/order/get`
        )
        console.log(orderResponse.data)


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
    return <div>Loading...</div>;
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
    <div className="container mt-5">
      <h1>產品列表</h1><p>點擊照片可以更新,刪除是將整個產品刪除ㄛ！</p>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>名稱</th>
            <th>價格</th>
            <th>品牌</th>
            <th>數量</th>
            <th>適用技能等級</th>
            <th>類別</th>
            <th>商品文件</th>
            <th>首圖</th>
            <th>音訊</th>
            <th>刪除產品</th>
          </tr>
        </thead>
        <tbody>
          {/* pass product obj use its id to print img and audio */}
          {productData.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.brand}</td>
              <td>{product.num}</td>
              <td>{getSkillLevelName(product.skill_lv)}</td>
              <td>{getCategoryName(product.category)}</td>
              <td>
                {product.description && (
                  <a
                    href={BackendURL + product.description}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看文件
                  </a>
                )}
              </td>
              <td>
                {/* Display images */}
                { 
                  productImages[product.id]?(
                  productImages[product.id].map((img) =>
                  img.primary ? (
                    <div key={img.id}>
                      <img
                        src={BackendURL + img.img}
                        onClick={() => handleClick(img)}
                        alt={`Product ${product.name}`}
                        width="50"
                        height="50"
                        style={{ cursor: 'pointer' }} 
                      />
                      {/* Ensure that ProductUpdate is displayed conditionally */}
                      {updateSelected && updateSelected.id === img.id && (
                        <ProductUpdate
                          productImg={updateSelected}
                          onClose={handleClose}
                        />
                      )}
                    </div>
                  ) : null
                  )
                  ) :(
                  <div>
                    <button onClick={() => {setClicked(!clicked);
                      handleClick(product)}}>設定圖片</button>
                    {clicked && (
                      <ProductUpdate
                        productImg={updateSelected}
                        onClose={handleClose}
                      />
                    )}
                  </div>
                  ) 
                }

              </td>
              <td>
                {/* Display audios */}
                {productAudios[product.id] &&
                  productAudios[product.id].map((audio) => (
                    <div key={audio.id}>
                      <p>{audio.equipment}</p>
                      <audio controls>
                        <source
                          src={BackendURL + audio.audio}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
              </td>
              <td>
              <ProductDelete productId={product.id} onDelete={(id) => {
                setProductData(productData.filter(p => p.id !== id));//wanted not eq to del id(exist)
              }} />
            </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="btn btn-secondary" onClick={pageChange}>上傳頁</button>
    </div>
  );
}

export default ProductList;
