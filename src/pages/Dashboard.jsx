import {
  ShoppingBag,
  Clock3,
  ChefHat,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get real orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Calculate real statistics
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "Preparing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  ).length;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Pending",
      value: pendingOrders,
      icon: Clock3,
    },
    {
      title: "Preparing",
      value: preparingOrders,
      icon: ChefHat,
    },
    {
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle2,
    },
  ];

  // Show latest 4 orders
  const recentOrders = [...orders]
    .reverse()
    .slice(0, 4);

  return (
    <div className="page">

      {/* HEADER */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="eyebrow">OVERVIEW</p>

          <h1>Good morning, Admin 👋</h1>

          <p className="subtitle">
            Here's what's happening with your orders today.
          </p>
        </div>

        <button className="date-btn">
          Today
        </button>
      </motion.div>

      {/* STAT CARDS */}
      <div className="stats-grid">

        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              className="stat-card"
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.1,
              }}
            >
              <div className="stat-top">

                <div className="stat-icon">
                  <Icon size={21} />
                </div>

                <span className="growth">
                  Live
                  <ArrowUpRight size={14} />
                </span>

              </div>

              <p>{stat.title}</p>

              <h2>
                {loading ? "..." : stat.value}
              </h2>

            </motion.div>
          );
        })}

      </div>

      {/* RECENT ORDERS */}
      <motion.section
        className="orders-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <div className="section-header">

          <div>
            <h2>Recent Orders</h2>

            <p>
              Latest orders placed by customers
            </p>
          </div>

          <button
            className="view-all-btn"
            onClick={() => navigate("/orders")}
          >
            View all →
          </button>

        </div>

        {loading ? (
          <div className="empty-state">
            Loading orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="empty-state">
            No orders available.
          </div>
        ) : (

          <div className="order-table">

            <div className="table-header">
              <span>Order</span>
              <span>Customer</span>
              <span>Item</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {recentOrders.map((order) => (

              <div
                className="table-row"
                key={order.id}
              >

                <strong>
                  #{order.id}
                </strong>

                <span>
                  {order.customerName}
                </span>

                <span>
                  {order.foodItem}
                </span>

                <strong>
                  ₹{order.price}
                </strong>

                <span
                  className={`status ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>

              </div>

            ))}

          </div>

        )}

      </motion.section>

    </div>
  );
}

export default Dashboard;