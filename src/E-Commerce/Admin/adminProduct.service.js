const { getDb } = require("../../Configurations/db.config");

const getAllAdminProductsService = async () => {
  const db = getDb();

  const [products] = await db.execute(`
    SELECT
      p.id,
      p.category_id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity AS stock,
      p.image,
      p.is_active,
      p.is_featured,
      p.created_at,
      p.updated_at,
      c.name AS category_name
    FROM products AS p
    LEFT JOIN categories AS c
      ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);

  return products;
};

const addAdminProductService = async ({
  name,
  category_id,
  description,
  price,
  stock_quantity,
  image,
  is_featured,
}) => {
  const db = getDb();

  const [result] = await db.execute(
    `
    INSERT INTO products (
      category_id,
      name,
      description,
      price,
      stock_quantity,
      image,
      is_active,
      is_featured
    )
    VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    `,
    [
      category_id,
      name,
      description || null,
      price,
      stock_quantity || 0,
      image || null,
      is_featured ? 1 : 0,
    ],
  );

  const [rows] = await db.execute(
    `
    SELECT
      p.id,
      p.category_id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity AS stock,
      p.image,
      p.is_active,
      p.is_featured,
      p.created_at,
      p.updated_at,
      c.name AS category_name
    FROM products AS p
    LEFT JOIN categories AS c
      ON p.category_id = c.id
    WHERE p.id = ?
    LIMIT 1
    `,
    [result.insertId],
  );

  return rows[0];
};

module.exports = {
  getAllAdminProductsService,
  addAdminProductService,
};
