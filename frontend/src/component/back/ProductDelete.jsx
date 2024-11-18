import React from "react";
import axios from "axios";
export const ProductDelete = ({ productId, onDelete }) => {
  const BackURL = "http://127.0.0.1:8000/api/product/delete/";
  const handleDelete = async () => {
    if (window.confirm("還是刪了吧")) {
      try {
        await axios.delete(BackURL + productId);
        onDelete(productId); //to clear frontend( NO render)
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600"
    >
      Delete
    </button>
  );
};


