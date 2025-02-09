const authSchema = require("../schema/auth.schema");
const productSchema = require("../schema/product.schema");
const { cloudinary } = require("../utils/cloudinary");

const getUserProducts = async (req, res) => {
  try {
    const { user_id } = req.params;

    const products = await productSchema.find({ user_id });
    res.json({ products });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getCategoryProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await productSchema.find({ category });
    return res.json({ products });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      user_id,
      product_name,
      quantity,
      product_image,
      description,
      product_price,
      type_price,
      category,
    } = req.body;

    const user = await authSchema.findOne({ _id: user_id });
    if (user) {
      let cloudinary_response = [];

      if (product_image) {
        cloudinary_response = await cloudinary.uploader.upload(product_image, {
          folder: "product",
        });
      }

      const product = await productSchema.create({
        quantity,
        product_name,
        description,
        product_price,
        type_price,
        category,
        user_id,
        location: user?.location,
        product_image: cloudinary_response.secure_url
          ? cloudinary_response.secure_url
          : "",
      });

      user.user_products.push(product._id.toString());
      await user.save();

      return res.json({ product });
    } else {
      return res.json({ message: "Iltimos, user_id bo'lishi shart" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { product_id, user_id } = req.body;
    const product = await productSchema.findOne({ _id: product_id });
    if (product && product.user_id === user_id) {
      await productSchema.findByIdAndDelete({ _id: product_id });
      return res.json({ product });
    } else {
      return res.json({
        message: "Bu mahsulot mavjud emas yoki bu sizniki emas",
      });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const likeProduct = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const user = await authSchema.findOne({ _id: user_id });
    if (!user) {
      return res.json({ message: "Bu user mavjud emas" });
    } else {
      const product = await productSchema.findOne({ _id: product_id });
      if (product) {
        const likedUser = product.product_likes.findIndex(
          (id) => id.toString() === user_id.toString()
        );
        const likedProduct = user.liked_products.findIndex(
          (id) => id.toString() === product_id.toString()
        );

        if (likedUser !== -1) {
          product.product_likes.splice(likedUser, 1);
          user.liked_products.splice(likedProduct, 1);
          await product.save();
          await user.save();
          return res.json({ message: "Like qaytarib olindi" });
        } else {
          product.product_likes.push(user_id);
          user.liked_products.push(product_id);

          await product.save();
          await user.save();
          return res.json({ message: "Like muvaffaqiyatli qo'shildi" });
        }
      } else {
        return res.json({ message: "Bu mahsulot topilmadi" });
      }
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const searchProduct = async (req, res) => {
  try {
    const { key } = req.params;
    const data = await productSchema.find({
      $or: [
        { product_name: { $regex: key } },
        { description: { $regex: key } },
      ],
    });
    return res.json({ data });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { category } = req.params;

    if (category) {
      const products = await productSchema.find({ category });
      return res.json({ products });
    } else {
      const allProducts = await productSchema.find();
      const products = allProducts.sort(
        (a, b) => a.product_likes.length + b.product_likes.length
      );
      return res.json({ products });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getOneProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    if (product_id) {
      const product = await productSchema.findOne({ _id: product_id });
      return res.json({ product });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getProductUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await authSchema.findOne({ _id: user_id });
    return res.json({ user });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// const getUserProducts = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//     res.json(error);
//   }
// };

module.exports = {
  getUserProducts,
  addProduct,
  deleteProduct,
  likeProduct,
  searchProduct,
  getAllProducts,
  getCategoryProducts,
  getOneProduct,
  getProductUser,
};
