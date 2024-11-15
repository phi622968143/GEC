import React, { useEffect, useState } from "react";
import axios from "axios";

const BackendAPIURL = "http://127.0.0.1:8000/api/";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Tracks which order is expanded

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BackendAPIURL}order/get`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch order details for each order, only if not already fetched
  const fetchOrderDetails = async (orderId) => {
    if (orderDetails.some((detail) => detail.order === orderId)) {
      return; // Don't fetch if details for this order are already present
    }

    try {
      const response = await axios.get(
        `${BackendAPIURL}orderdetail/${orderId}`
      );
      setOrderDetails((prevDetails) => [
        ...prevDetails,
        ...(Array.isArray(response.data) ? response.data : [response.data]),
      ]);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  // Fetch product details for each product referenced in orderDetails, only if not already fetched
  const fetchProductDetail = async (productId) => {
    if (productDetails.some((product) => product.id === productId)) {
      return; // Don't fetch if product details are already present
    }

    try {
      const response = await axios.get(
        `${BackendAPIURL}product?product_id=${productId}`
      );
      setProductDetails((prevDetails) => [
        ...prevDetails,
        ...(Array.isArray(response.data) ? response.data : [response.data]),
      ]);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  // Toggle order detail visibility
  const handleShowMoreClick = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // Collapse the order if it's already expanded
    } else {
      setExpandedOrderId(orderId); // Expand the order and fetch details
      fetchOrderDetails(orderId); // Fetch order details only when clicked
    }
  };

  // Load product details when the specific order's details are expanded
  useEffect(() => {
    if (expandedOrderId) {
      const detailsForExpandedOrder = orderDetails.filter(
        (detail) => detail.order === expandedOrderId
      );
      detailsForExpandedOrder.forEach((detail) => {
        // Fetch product details for each product in the order
        fetchProductDetail(detail.product);
      });
    }
  }, [expandedOrderId, orderDetails]);

  // Display loading state or fetched data
  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="p-3 flex flex-col">
      <div className="text-center min-w-full p-1">
        <p className="text-4xl">Orders Admin Page</p>
      </div>
      {orders.length > 0 ? (
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
              <th className="py-2 px-4 border-b">Order Details</th>
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
                    onClick={() => handleShowMoreClick(order.id)}
                    className="text-blue-500 underline"
                  >
                    {expandedOrderId === order.id
                      ? "Hide Details"
                      : "Show More"}
                  </button>

                  {/* Show order details only if the order is expanded */}
                  {expandedOrderId === order.id && (
                    <ul>
                      {orderDetails
                        .filter((detail) => detail.order === order.id)
                        .map((detail) => {
                          const product = productDetails.find(
                            (p) => p.id === detail.product
                          );
                          const totalPrice = product
                            ? product.price * detail.product_num
                            : 0;
                          console.log(
                            "Detail for order",
                            order.id,
                            ":",
                            detail
                          );

                          return (
                            product && (
                              <li key={detail.id}>
                                <p>Product Quantity: {detail.product_num}</p>
                                <p>Product Name: {product.name}</p>
                                <p>Total Price: {totalPrice}</p>
                              </li>
                            )
                          );
                        })}
                    </ul>
                  )}
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

export default Order;
