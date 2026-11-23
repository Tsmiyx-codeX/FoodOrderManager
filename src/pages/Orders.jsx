import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";// use of use state and effct
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Get orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Fetch orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Delete order
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete order"
        );
      }

      alert("Order deleted successfully!");

      fetchOrders();
    } catch (error) {
      console.error("Delete order error:", error);
      alert("Failed to delete order");
    }
  };

  // Search + filter
  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      filter === "All" || order.status === filter;

    const customerMatch =
      order.customerName
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const itemMatch = order.items?.some((item) =>
      item.foodItem
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

    return (
      matchesFilter &&
      (customerMatch || itemMatch)
    );
  });

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="eyebrow">
            ORDER MANAGEMENT
          </p>

          <h1>Orders</h1>

          <p className="subtitle">
            Manage and track all customer orders.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/add-order")}
        >
          <Plus size={18} />
          Add Order
        </button>
      </motion.div>


      {/* SEARCH + FILTER */}
      <div className="order-controls">

        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search customer or food item..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>


        <div className="filter-tabs">

          {[
            "All",
            "Pending",
            "Preparing",
            "Completed",
          ].map((item) => (

            <button
              key={item}
              className={
                filter === item
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}
            </button>

          ))}

        </div>

      </div>


      {/* ORDERS */}
      {loading ? (

        <div className="empty-state">
          Loading orders...
        </div>

      ) : filteredOrders.length === 0 ? (

        <div className="empty-state">
          No orders found.
        </div>

      ) : (

        <div className="orders-list">

          {filteredOrders.map(
            (order, index) => (

              <motion.div
                className="order-card"
                key={order.id}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.07,
                }}
              >

                {/* ORDER NUMBER */}
                <div className="order-number">

                  <span>ORDER</span>

                  <strong>
                    #{order.id}
                  </strong>

                </div>


                {/* CUSTOMER */}
                <div className="order-info">

                  <span className="card-label">
                    Customer
                  </span>

                  <strong>
                    {order.customerName}
                  </strong>

                </div>


                {/* FOOD ITEMS */}
                <div className="order-info">

                  <span className="card-label">
                    Items
                  </span>

                  <div className="order-items-preview">

                    {order.items?.map(
                      (item) => (

                        <span
                          key={item.id}
                          className="order-item-name"
                        >
                          {item.foodItem}
                          <small>
                            × {item.quantity}
                          </small>
                        </span>

                      )
                    )}

                  </div>

                </div>


                {/* ORDER TYPE */}
                <div className="order-info">

                  <span className="card-label">
                    Type
                  </span>

                  <strong>
                    {order.orderType}
                  </strong>

                </div>


                {/* TOTAL */}
                <div className="order-info">

                  <span className="card-label">
                    Amount
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toFixed(0)}
                  </strong>

                </div>


                {/* STATUS */}
                <span
                  className={`status ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>


                {/* ACTION BUTTONS */}
                <div className="order-actions">

                  <button
                    className="update-btn"
                    onClick={() =>
                      navigate(
                        `/add-order?edit=${order.id}`
                      )
                    }
                    title="Update order"
                  >
                    <Edit3 size={15} />
                    <span>Update</span>
                  </button>


                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(order.id)
                    }
                    title="Delete order"
                  >
                    <Trash2 size={15} />
                    <span>Delete</span>
                  </button>

                </div>

              </motion.div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Orders;