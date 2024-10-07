import axios from "axios";

// 定義 props 的型別
interface ProductDeleteProps {
  productId: number;
  onDelete: (id: number) => void;
}

const ProductDelete: React.FC<ProductDeleteProps> = ({
  productId,
  onDelete,
}) => {
  const BackURL = "http://127.0.0.1:8000/api/product/delete/";

  const handleDelete = async () => {
    if (window.confirm("還是刪了吧")) {
      try {
        await axios.delete(BackURL + productId);
        onDelete(productId); // 通知父層組件清除前端顯示
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

export default ProductDelete;
