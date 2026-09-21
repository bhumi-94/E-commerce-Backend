const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("../src/Configurations/db.config");

const authRoutes = require("../src/E-Commerce/Auth/auth.routes");
const profileRoutes = require("../src/E-Commerce/Profile/profile.routes");
const categoryRoutes = require("../src/E-Commerce/Category/category.routes");
const productRoutes = require("../src/E-Commerce/Product/product.routes");
const cartRoutes = require("../src/E-Commerce/Cart/cart.routes");
const wishlistRoutes = require("../src/E-Commerce/Wishlist/wishlist.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Nexora E-commerce API is running",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart" , cartRoutes)
app.use("/api/wishlist" , wishlistRoutes)

app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    await connectDatabase()
    app.listen(PORT, () => {
      console.log(
        `Nexora server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );
    process.exit(1);
  }
};
startServer();