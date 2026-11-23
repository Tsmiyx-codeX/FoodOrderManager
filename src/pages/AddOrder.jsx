import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import menuItems from "../data/menuData";

function AddOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);

  const [formData, setFormData] = useState({
    customerName: "",
    orderType: "Dine-in",
    status: "Pending",
  });

  const [items, setItems] = useState([
    {
      foodItem: "",
      category: "",
      quantity: 1,
      price: 0,
    },
  ]);

  const [loading, setLoading] = useState(false);

  // LOAD ORDER WHEN EDITING
  useEffect(() => {
    if (!isEditing) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/orders/${editId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }

        const data = await response.json();

        setFormData({
          customerName: data.customerName,
          orderType: data.orderType,
          status: data.status,
        });

        setItems(
          data.items.map((item) => ({
            foodItem: item.foodItem,
            category: item.category,
            quantity: item.quantity,
            price: Number(item.price),
          }))
        );
      } catch (error) {
        console.error("Fetch order error:", error);
        alert("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [editId, isEditing]);

  // CHANGE CUSTOMER / ORDER DETAILS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // CHANGE SELECTED FOOD ITEM
  const handleItemChange = (index, value) => {
    const selectedItem = menuItems.find(
      (item) => item.name === value
    );

    const updatedItems = [...items];

    if (selectedItem) {
      updatedItems[index] = {
        foodItem: selectedItem.name,
        category: selectedItem.category,
        quantity: 1,
        price: selectedItem.price,
      };
    }

    setItems(updatedItems);
  };

  // CHANGE QUANTITY
  const changeQuantity = (index, amount) => {
    const updatedItems = [...items];

    const newQuantity =
      Number(updatedItems[index].quantity) + amount;

    if (newQuantity < 1) return;

    updatedItems[index].quantity = newQuantity;

    setItems(updatedItems);
  };

  // ADD ANOTHER FOOD ITEM
  const addItem = () => {
    setItems([
      ...items,
      {
        foodItem: "",
        category: "",
        quantity: 1,
        price: 0,
      },
    ]);
  };

  // REMOVE FOOD ITEM
  const removeItem = (index) => {
    if (items.length === 1) return;

    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  // TOTAL
  const totalAmount = items.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  // SAVE / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmptyItem = items.some(
      (item) => !item.foodItem
    );

    if (hasEmptyItem) {
      alert("Please select a food item for every row.");
      return;
    }

    try {
      setLoading(true);

      const url = isEditing
        ? `http://localhost:5000/api/orders/${editId}`
        : "http://localhost:5000/api/orders";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save order"
        );
      }

      alert(
        isEditing
          ? "Order updated successfully!"
          : "Order added successfully!"
      );

      navigate("/orders");
    } catch (error) {
      console.error("Save order error:", error);
      alert("Failed to save order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      {/* HEADER */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="eyebrow">
            ORDER MANAGEMENT
          </p>

          <h1>
            {isEditing ? "Edit Order" : "Add New Order"}
          </h1>

          <p className="subtitle">
            {isEditing
              ? "Update the details of this food order."
              : "Create a new customer food order."}
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>
      </motion.div>


      {/* FORM */}
      <motion.form
        className="order-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* CUSTOMER DETAILS */}
        <div className="form-section">

          <h2>Customer Details</h2>

          <div className="form-grid">

            <div className="input-group">
              <label>Customer Name</label>

              <input
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                required
              />
            </div>


            <div className="input-group">
              <label>Order Type</label>

              <select
                name="orderType"
                value={formData.orderType}
                onChange={handleChange}
              >
                <option>Dine-in</option>
                <option>Takeaway</option>
                <option>Delivery</option>
              </select>
            </div>


            <div className="input-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Preparing</option>
                <option>Completed</option>
              </select>
            </div>

          </div>
        </div>


        {/* ORDER ITEMS */}
        <div className="form-section">

          <div className="order-items-header">

            <div>
              <h2>Order Items</h2>

              <p className="section-description">
                Select food items from the menu.
              </p>
            </div>

            <button
              type="button"
              className="add-item-btn"
              onClick={addItem}
            >
              <Plus size={16} />
              Add Item
            </button>

          </div>


          <div className="order-items-list">

            {items.map((item, index) => (

              <div
                className="order-item-row"
                key={index}
              >

                {/* CATEGORY */}
                <div className="input-group">
                  <label>Category</label>

                  <select
                    value={item.category}
                    onChange={(e) => {

                      const category = e.target.value;

                      const updatedItems = [...items];

                      updatedItems[index] = {
                        ...updatedItems[index],
                        category,
                        foodItem: "",
                        price: 0,
                      };

                      setItems(updatedItems);
                    }}
                  >

                    <option value="">
                      Select category
                    </option>

                    <option value="Main Course">
                      Main Course
                    </option>

                    <option value="Starters">
                      Starters
                    </option>

                    <option value="Beverages">
                      Beverages
                    </option>

                    <option value="Desserts">
                      Desserts
                    </option>

                  </select>
                </div>


                {/* FOOD ITEM */}
                <div className="input-group">
                  <label>Food Item</label>

                  <select
                    value={item.foodItem}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        e.target.value
                      )
                    }
                    disabled={!item.category}
                    required
                  >

                    <option value="">
                      {item.category
                        ? "Select food item"
                        : "Select category first"}
                    </option>

                    {menuItems
                      .filter(
                        (menuItem) =>
                          menuItem.category ===
                          item.category
                      )
                      .map((menuItem) => (

                        <option
                          key={menuItem.id}
                          value={menuItem.name}
                        >
                          {menuItem.name} — ₹
                          {menuItem.price}
                        </option>

                      ))}

                  </select>
                </div>


                {/* QUANTITY */}
                <div className="input-group">
                  <label>Quantity</label>

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(index, -1)
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(index, 1)
                      }
                    >
                      +
                    </button>

                  </div>
                </div>


                {/* PRICE */}
                <div className="input-group">
                  <label>Price</label>

                  <div className="item-price">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(0)}
                  </div>
                </div>


                {/* DELETE */}
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() =>
                    removeItem(index)
                  }
                  disabled={items.length === 1}
                  title="Remove item"
                >
                  <Trash2 size={17} />
                </button>

              </div>

            ))}

          </div>


          {/* TOTAL */}
          <div className="order-total">

            <span>Total Amount</span>

            <strong>
              ₹{totalAmount.toFixed(0)}
            </strong>

          </div>

        </div>


        {/* BUTTONS */}
        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/orders")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            <Save size={18} />

            {loading
              ? "Saving..."
              : isEditing
              ? "Update Order"
              : "Save Order"}
          </button>

        </div>

      </motion.form>

    </div>
  );
}

export default AddOrder;