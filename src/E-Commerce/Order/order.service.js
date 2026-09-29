const { getDb } = require("../../Configurations/db.config");
const { createNotification } = require("../Notifications/notification.service");

const createOrderService = async (
  userId,
  addressId,
  paymentMethodId,
  shippingAmount = 0,
) => {
  const db = getDb();

  const [cartItems] = await db.execute(
    `
    SELECT
      ci.product_id,
      ci.quantity,
      p.name,
      p.price,
      p.stock_quantity,
      p.is_active
    FROM cart_items ci
    INNER JOIN products p
      ON ci.product_id = p.id
    WHERE ci.user_id = ?
    `,
    [userId],
  );

  if (cartItems.length === 0) {
    const error = new Error("Your cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const [addresses] = await db.execute(
    `
    SELECT id
    FROM addresses
    WHERE id = ?
      AND user_id = ?
    LIMIT 1
    `,
    [addressId, userId],
  );

  if (addresses.length === 0) {
    const error = new Error("Invalid delivery address");
    error.statusCode = 400;
    throw error;
  }

  if (paymentMethodId) {
    const [paymentMethods] = await db.execute(
      `
      SELECT id
      FROM payment_methods
      WHERE id = ?
        AND user_id = ?
      LIMIT 1
      `,
      [paymentMethodId, userId],
    );

    if (paymentMethods.length === 0) {
      const error = new Error("Invalid payment method");
      error.statusCode = 400;
      throw error;
    }
  }

  let subtotal = 0;

  for (const item of cartItems) {
    if (!item.is_active) {
      const error = new Error(`${item.name} is no longer available`);
      error.statusCode = 400;
      throw error;
    }

    if (item.quantity > item.stock_quantity) {
      const error = new Error(
        `Only ${item.stock_quantity} items of ${item.name} are available`,
      );
      error.statusCode = 400;
      throw error;
    }

    subtotal += Number(item.price) * Number(item.quantity);
  }

  const totalAmount = subtotal + Number(shippingAmount);

  await db.beginTransaction();

  try {
    const [orderResult] = await db.execute(
      `INSERT INTO orders
            (
            user_id,
            address_id,
            payment_method_id,
            subtotal,
            total_amount,
            shipping_amount,
            order_status,
            payment_status
            )
            VALUES (?, ?, ?, ?, ?, ?, 'Pending', 'Pending')
      `,

      [
        userId,
        addressId,
        paymentMethodId || null,
        subtotal,
        totalAmount,
        shippingAmount,
      ],
    );

    const orderId = orderResult.insertId;

    for (const item of cartItems) {
      const itemSubtotal = Number(item.price) * Number(item.quantity);

      await db.execute(
        `
  INSERT INTO order_items
  (
    order_id,
    product_id,
    product_name,
    quantity,
    price,
    total_price
  )
  VALUES (?, ?, ?, ?, ?, ?)
  `,
        [
          orderId,
          item.product_id,
          item.name,
          item.quantity,
          item.price,
          itemSubtotal,
        ],
      );

      await db.execute(
        `
        UPDATE products
        SET stock_quantity = stock_quantity - ?
        WHERE id = ?
        `,
        [item.quantity, item.product_id],
      );
    }

    await db.execute(
      `
      DELETE FROM cart_items
      WHERE user_id = ?
      `,
      [userId],
    );

    await db.commit();
    await createNotification({
      userId,
      title: "Order Placed Successfully",
      message: `Your order #${orderId} has been placed successfully.`,
      type: "order",
      referenceId: orderId,
    });

    return {
      orderId,
      subtotal,
      shippingAmount: Number(shippingAmount),
      totalAmount,
    };
  } catch (error) {
    await db.rollback();
    throw error;
  }
};

const getOrdersService = async (userId) => {
  const db = getDb();

  const [orders] = await db.execute(
    `
    SELECT
      o.id,
      o.user_id,
      o.address_id,
      o.payment_method_id,
      o.subtotal,
      o.total_amount,
      o.shipping_amount,
      o.order_status,
      o.payment_status,
      o.created_at,
      o.updated_at
    FROM orders o
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
    `,
    [userId],
  );

  for (const order of orders) {
    const [items] = await db.execute(
      `
      SELECT
        oi.id,
        oi.product_id,
        oi.product_name,
        oi.quantity,
        oi.price,
        oi.total_price,
        p.image
      FROM order_items oi
      LEFT JOIN products p
        ON oi.product_id = p.id
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC
      `,
      [order.id],
    );

    order.items = items;
  }

  return orders;
};
module.exports = {
  createOrderService,
  getOrdersService,
};
