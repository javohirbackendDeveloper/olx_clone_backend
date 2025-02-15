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
  getVipAdvert,
} = require("../controller/product.controller");

const productRouter = Router();

productRouter.get("/getUserProducts/:user_id", getUserProducts);
productRouter.post("/addProduct", addProduct);
productRouter.delete("/", deleteProduct);
productRouter.post("/like", likeProduct);
productRouter.post("/search", searchProduct);
productRouter.get("/getAllProducts/:category?", getAllProducts);
productRouter.get("/getOneCategory/:category?", getCategoryProducts);
productRouter.get("/getOneProduct/:product_id", getOneProduct);
productRouter.get("/getProductUser/:product_id", getProductUser);
productRouter.get("/getVipAdvert", getVipAdvert);
module.exports = productRouter;
