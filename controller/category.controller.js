const authSchema = require("../schema/auth.schema");
const categorySchema = require("../schema/category.schema");
const { cloudinary } = require("../utils/cloudinary");

const addCategory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { category_name, image } = req.body;

    const user = await authSchema.findOne({ _id: user_id });

    if (user?.role === "admin") {
      const foundedCategory = await categorySchema.findOne({ category_name });

      if (foundedCategory) {
        return res.json({
          message:
            "Bu category nomi allaqachon mavjud iltimos boshqa nom tanlang",
        });
      }

      let cloudinary_response = null;
      if (image) {
        cloudinary_response = await cloudinary.uploader.upload(image, {
          folder: "category",
        });
      }

      const category = await categorySchema.create({
        category_name,
        image: cloudinary_response.secure_url || "",
      });

      res.json({ category });
    } else {
      return res.json({
        message: "Siz admin emassiz faqat admin category qo'sha oladi",
      });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find();
    return res.json({ categories });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    const category = await categorySchema.findByIdAndDelete({
      _id: category_id,
    });
    return res.json({ category });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { ...data } = req.body;
    const t = await categorySchema.findOne({ _id: category_id.toString() });

    console.log(t);
    const category = await categorySchema.findOneAndUpdate(
      {
        _id: category_id,
      },
      data
    );
    return res.json({ category_id });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

module.exports = { addCategory, getCategories, deleteCategory, updateCategory };
