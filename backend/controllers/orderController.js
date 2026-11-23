import db from "../config/db.js";

// GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        id,
        customer_name AS customerName,
        order_type AS orderType,
        status,
        created_at AS createdAt
      FROM orders
      ORDER BY id DESC
    `);

    for (const order of orders) {
      const [items] = await db.query(
        `
        SELECT
          id,
          food_item AS foodItem,
          category,
          quantity,
          price
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
        `,
        [order.id]
      );

      order.items = items;

      order.totalAmount = items.reduce(
        (total, item) =>
          total + Number(item.price) * Number(item.quantity),
        0
      );
    }

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error.message);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};


// GET SINGLE ORDER
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const [orders] = await db.query(
      `
      SELECT
        id,
        customer_name AS customerName,
        order_type AS orderType,
        status,
        created_at AS createdAt
      FROM orders
      WHERE id = ?
      `,
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orders[0];

    const [items] = await db.query(
      `
      SELECT
        id,
        food_item AS foodItem,
        category,
        quantity,
        price
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
      `,
      [id]
    );

    order.items = items;

    order.totalAmount = items.reduce(
      (total, item) =>
        total + Number(item.price) * Number(item.quantity),
      0
    );

    res.json(order);
  } catch (error) {
    console.error("Get order error:", error.message);

    res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};


// CREATE ORDER
export const createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const {
      customerName,
      orderType,
      status,
      items,
    } = req.body;

    if (
      !customerName ||
      !orderType ||
      !status ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide customer details and at least one item",
      });
    }

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders
      (customer_name, order_type, status)
      VALUES (?, ?, ?)
      `,
      [customerName, orderType, status]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        `
        INSERT INTO order_items
        (order_id, food_item, category, quantity, price)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.foodItem,
          item.category,
          item.quantity,
          item.price,
        ]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: "Order created successfully",
      orderId,
    });
  } catch (error) {
    await connection.rollback();

    console.error("Create order error:", error.message);

    res.status(500).json({
      message: "Failed to create order",
    });
  } finally {
    connection.release();
  }
};


// UPDATE ORDER
export const updateOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;

    const {
      customerName,
      orderType,
      status,
      items,
    } = req.body;

    if (
      !customerName ||
      !orderType ||
      !status ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        message: "Please provide all order details",
      });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      `
      UPDATE orders
      SET customer_name = ?,
          order_type = ?,
          status = ?
      WHERE id = ?
      `,
      [
        customerName,
        orderType,
        status,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();

      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Remove old items
    await connection.query(
      `DELETE FROM order_items WHERE order_id = ?`,
      [id]
    );

    // Add updated items
    for (const item of items) {
      await connection.query(
        `
        INSERT INTO order_items
        (order_id, food_item, category, quantity, price)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          id,
          item.foodItem,
          item.category,
          item.quantity,
          item.price,
        ]
      );
    }

    await connection.commit();

    res.json({
      message: "Order updated successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.error("Update order error:", error.message);

    res.status(500).json({
      message: "Failed to update order",
    });
  } finally {
    connection.release();
  }
};


// DELETE ORDER
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `DELETE FROM orders WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error.message);

    res.status(500).json({
      message: "Failed to delete order",
    });
  }
};