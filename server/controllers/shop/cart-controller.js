const Cart = require("../../models/cart");
const Product = require("../../models/product");

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const currentProd = await Product.findById(productId);
    if (!currentProd) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let currentCart = await Cart.findOne({ userId });
    if (!currentCart) {
      currentCart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = currentCart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      currentCart.items.push({ productId, quantity });
    } else {
      currentCart.items[findCurrentProductIndex].quantity += quantity;
    }

    await currentCart.save();

    return res.status(200).json({
      success: true,
      data: currentCart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User Id required",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const validItems = cart.items.filter((item) => item.productId);

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updetCartItemQnt = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const currentCart = await Cart.findOne({ userId });
    if (!currentCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const findCurrentProductIndex = currentCart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present",
      });
    }

    currentCart.items[findCurrentProductIndex].quantity = quantity;
    await currentCart.save();

    await currentCart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = currentCart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...currentCart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(404).json({
        success: false,
        message: "Invalid data provided",
      });
    }

    const currentCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!currentCart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    currentCart.items = currentCart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await currentCart.save();

    await currentCart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = currentCart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      data: {
        ...currentCart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updetCartItemQnt,
  deleteCartItem,
};
