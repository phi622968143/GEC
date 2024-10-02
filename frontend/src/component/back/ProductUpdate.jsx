import axios from "axios";
const ProductUpdate = ({ productImg, onClose }) => {
  const ProductURL = "http://127.0.0.1:8000/api/product/patch/";
  const ImgURL = "http://127.0.0.1:8000/api/img/patch/";
  const AudioURL = "http://127.0.0.1:8000/api/audio/patch/";

  const handleClose = async (e) => {
    // e.preventDefault();
    try {
      const ImgUpdateData = new FormData(e.target);
      if (!productImg.num) {
        const ImgPath = ImgURL + productImg.id;
        await axios.patch(ImgPath, ImgUpdateData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        onClose();
        alert("完畢");
      } else {
        const imageData = new FormData();
        imageData.append("product", productImg.id); // Include the product ID
        imageData.append("img", ImgUpdateData.get("img"));
        imageData.append(
          "primary",
          ImgUpdateData.get("primary") ? true : false
        );
        try {
          await axios.post("http://127.0.0.1:8000/api/img/post", imageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>ProductImgUpdate</p>
      <form onSubmit={handleClose}>
        <label htmlFor="img">Image (File):</label>
        <input type="file" id="img" name="img" required />
        <br />

        <label htmlFor="primary">Primary Image:</label>
        <input type="checkbox" id="primary" name="primary" />
        <br />
        <button type="submit">更新圖片</button>
        <button onClick={onClose}>取消</button>
      </form>
    </div>
  );
};

export default ProductUpdate;
