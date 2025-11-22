const product = require("../../models/product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filter = {};

    if (category.length) {
      filter.category = { $in: category.split(",") };
    }

    if (brand.length) {
      filter.brand = { $in: brand.split(",") };
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;
      case "price-hightolow":
        sort.price = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort.price = 1;
    }

    const products = await product.find(filter).sort(sort);

    res.status(200).json({ success: true, message: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "some error occured" });
  }
};

const getProductsDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const productDetails = await product.findById(id);

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: productDetails,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

module.exports = { getFilteredProducts, getProductsDetails };
