const { Router } = require("express");

const {
  getUserProducts,
  addProduct,
  deleteProduct,
  likeProduct,
  searchProduct,
  getAllProducts,
  getCategoryProducts,
  getOneProduct,
  getProductUser,
} = require("../controller/product.controller");

const productRouter = Router();

productRouter.get("/getUserProducts/:user_id", getUserProducts);
productRouter.post("/addProduct", addProduct);
productRouter.delete("/", deleteProduct);
productRouter.post("/like", likeProduct);
productRouter.get("/search/:key", searchProduct);
productRouter.get("/getAllProducts/:category?", getAllProducts);
productRouter.get("/getOneCategory/:category?", getCategoryProducts);
productRouter.get("/getOneProduct/:product_id", getOneProduct);
productRouter.get("/getProductUser/:user_id", getProductUser);
module.exports = productRouter;
