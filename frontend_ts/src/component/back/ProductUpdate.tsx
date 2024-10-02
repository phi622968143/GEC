import React from "react";
import axios from "axios";

interface ProductUpdateProps {
  productImg: {
    id: number;
    num?: number;
  };
  onClose: () => void;
}

const ProductUpdate: React.FC<ProductUpdateProps> = ({
  productImg,
  onClose,
}) => {
  const ProductURL = "http://127.0.0.1:8000/api/product/patch/";
  const ImgURL = "http://127.0.0.1:8000/api/img/patch/";
  const AudioURL = "http://127.0.0.1:8000/api/audio/patch/";

  const handleClose = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const ImgUpdateData = new FormData(e.currentTarget);

      if (!productImg.num) {
        const ImgPath = ImgURL + productImg.id;
        await axios.patch(ImgPath, ImgUpdateData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        onClose();
        alert("Update complete");
      } else {
        const imageData = new FormData();
        imageData.append("product", productImg.id.toString()); // Include the product ID
        imageData.append("img", ImgUpdateData.get("img") as File);
        imageData.append(
          "primary",
          ImgUpdateData.get("primary") ? "true" : "false"
        );

        try {
          await axios.post("http://127.0.0.1:8000/api/img/post", imageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          alert("Image upload complete");
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
      <p>Product Image Update</p>
      <form onSubmit={handleClose}>
        <label htmlFor="img">Image (File):</label>
        <input type="file" id="img" name="img" required />
        <br />

        <label htmlFor="primary">Primary Image:</label>
        <input type="checkbox" id="primary" name="primary" />
        <br />
        <button type="submit">Update Image</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProductUpdate;
