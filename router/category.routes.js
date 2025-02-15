const { Router } = require("express");
const {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../controller/category.controller");

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.post("/:user_id", addCategory);
categoryRouter.delete("/:category_id", deleteCategory);
categoryRouter.put("/:category_id", updateCategory);
// categoryRouter.get("/search/:key", searchProduct);
// categoryRouter.get("/getAllProducts/:category?", getAllProducts);
// categoryRouter.get("/getOneCategory/:category?", getCategoryProducts);
// categoryRouter.get("/getOneProduct/:product_id", getOneProduct);
// categoryRouter.get("/getProductUser/:user_id", getProductUser);
module.exports = categoryRouter;
