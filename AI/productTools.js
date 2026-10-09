const { getDb } = require("../src/Configurations/db.config");

const searchProducts = async ({ search = "", maxPrice = null }) => {
  const db = getDb();

  let query = `
    SELECT
      id,
      name,
      description,
      price,
      stock_quantity,
      image,
      category_id,
      is_featured
    FROM products
    WHERE is_active = 1
      AND stock_quantity > 0
  `;
  const params = [];
  if (search.trim()) {
    query += `
      AND (
        name LIKE ?
        OR description LIKE ?
      )
    `;
    const keyword = `%${search.trim()}%`;

    params.push(keyword, keyword);
  }
  if (maxPrice !== null && maxPrice !== undefined) {
    const price = Number(maxPrice);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Invalid maximum price");
    }
    query += " AND price <= ?";
    params.push(price);
  }
  query += `
    ORDER BY is_featured DESC, created_at DESC
    LIMIT 10
  `;
  const [products] = await db.execute(query, params);
  return products;
};

module.exports = { searchProducts };
