const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/authRoutes.js");
const adminProductsRouter = require("./routes/admin/products-routes.js");
const shopProductsRouter = require("./routes/shop/products-routes.js");
mongoose
  .connect(
    "mongodb+srv://JEETGHOSH:Jeet%401234@mern-ecom.tn78j8a.mongodb.net/MERN_ECOM?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => console.log("❌ DB connection error:", error));

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Proper CORS config
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Middleware order
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);

// ✅ Server start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
