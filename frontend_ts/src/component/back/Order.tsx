import React, { useEffect, useState } from "react";
import axios from "axios";

const BackendAPIURL = "http://127.0.0.1:8000/api/";

interface Order {
  id: number;
  customer_email: string;
  pay_method: string;
  order_date: string;
  city?: string;
  is_paid: boolean;
  is_send: boolean;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 取得所有訂單資料
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>(`${BackendAPIURL}order/get`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 刪除指定訂單
  const handleDeleteOrder = async (orderId: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${BackendAPIURL}order/delete/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        alert("Order deleted successfully");
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  return (
    <div className="p-3 flex flex-col">
      <div className="text-center min-w-full p-1">
        <p className="text-4xl">Orders Admin Page</p>
      </div>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer Email</th>
              <th className="py-2 px-4 border-b">Payment Method</th>
              <th className="py-2 px-4 border-b">Order Date</th>
              <th className="py-2 px-4 border-b">City</th>
              <th className="py-2 px-4 border-b">Is Paid</th>
              <th className="py-2 px-4 border-b">Is Sent</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border-b text-center">{order.id}</td>
                <td className="py-2 px-4 border-b text-center">
                  {order.customer_email}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {order.pay_method}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {new Date(order.order_date).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {order.city || "N/A"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {order.is_paid ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {order.is_send ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderPage;
