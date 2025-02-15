const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoDB = require("./lib/config");
const authRouter = require("./router/auth.routes");
const productRouter = require("./router/product.routes");
const categoryRouter = require("./router/category.routes");
const messageRouter = require("./router/message.routes");
const { app, server } = require("./lib/socket");
require("dotenv").config();
const serverless = require("serverless-http");
// STATIC IMPORTS

app.use(express.json());
app.use(cookieParser());
app.use(cors());
mongoDB();

// ROUTERS

app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is running on the " + PORT);
});

module.exports.handler = serverless(app);
