import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
const ProductDelete = ({ productId, onDelete }) => {
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
    <button onClick={handleDelete} className="btn btn-danger btn-sm">
      Delete
    </button>
  );
};

export default ProductDelete;
