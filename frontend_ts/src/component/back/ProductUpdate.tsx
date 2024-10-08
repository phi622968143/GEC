import axios from "axios";
import React, { FormEvent } from "react";

interface ProductImg {
  id: number;
  num?: number;
}

interface ProductUpdateProps {
  productImg: ProductImg;
  onClose: () => void;
}

const ProductUpdate: React.FC<ProductUpdateProps> = ({
  productImg,
  onClose,
}) => {
  const ProductURL = "http://127.0.0.1:8000/api/product/patch/";
  const ImgURL = "http://127.0.0.1:8000/api/img/patch/";
  const AudioURL = "http://127.0.0.1:8000/api/audio/patch/";

  const handleClose = async (e: FormEvent<HTMLFormElement>) => {
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
        alert("Update Complete");
      } else {
        const imageData = new FormData();
        imageData.append("product", productImg.id.toString()); // Include the product ID
        imageData.append("img", ImgUpdateData.get("img") as Blob);
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
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-14 bg-zinc-200">
      <div>
        <form onSubmit={handleClose} className="border-solid p-3">
          <div className="bg-white shadow-zinc-300 shadow-lg p-5 m-1 rounded border border-zinc-700">
            <h1 className=" text-2xl ">Product Image Update</h1>
          </div>
          <div className="bg-white shadow-zinc-300 shadow-lg p-5 m-1 rounded border border-zinc-700">
            <label htmlFor="img">Image (File):</label>
            <input
              type="file"
              id="img"
              name="img"
              className="hover:file:cursor-pointer block w-1/2 text-sm file:bg-green-500 file:text-white file:px-4 file:py-2 file:rounded file:mt-4 hover:file:bg-green-600"
              required
            />
          </div>
          <br />

          <label htmlFor="primary">Primary Image:</label>
          <input type="checkbox" id="primary" name="primary" />
          <br />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            Update Image
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdate;
