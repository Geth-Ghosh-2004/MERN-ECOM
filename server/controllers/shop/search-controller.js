const Product = require("../../models/product");

const searchProducts = async (req, res) => {
  try {
    let { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "keyword is required and must be a string",
      });
    }

    keyword = keyword.trim().toLowerCase();

    if (keyword === "men") keyword = "men|mens|men's";
    if (keyword === "women") keyword = "women|womens|women's";
    if (keyword === "kids") keyword = "kids|children|child";

    const regex = new RegExp(keyword, "i");

    const searchResults = await Product.find({
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
        { brand: regex },
      ],
    });

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error searching products",
    });
  }
};

module.exports = { searchProducts };
