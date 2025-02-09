const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoDB = require("./lib/config");
const authRouter = require("./router/auth.routes");
const productRouter = require("./router/product.routes");
require("dotenv").config();

const app = express();

// STATIC IMPORTS

app.use(express.json());
app.use(cookieParser());
app.use(cors());
mongoDB();

// ROUTERS

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on the " + PORT);
});
