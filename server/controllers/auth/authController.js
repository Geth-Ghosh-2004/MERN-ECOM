const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    console.log("User model:", User);
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exist!",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password!",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Detect production: check if request is HTTPS or from production domains
    // req.secure is set by proxy (Render/Netlify) when behind HTTPS
    const origin = req.get("origin") || req.get("referer") || "";
    const isProduction =
      req.secure ||
      req.protocol === "https" ||
      origin.startsWith("https://") ||
      origin.includes("netlify.app") ||
      origin.includes("onrender.com");

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProduction, // Required for HTTPS
        sameSite: isProduction ? "none" : "lax", // "none" required for cross-site (PayPal redirect)
        maxAge: 60 * 60 * 1000, // 60 minutes
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const logoutUser = async (req, res) => {
  // Detect production: check if request is HTTPS or from production domains
  // req.secure is set by proxy (Render/Netlify) when behind HTTPS
  const origin = req.get("origin") || req.get("referer") || "";
  const isProduction =
    req.secure ||
    req.protocol === "https" ||
    origin.startsWith("https://") ||
    origin.includes("netlify.app") ||
    origin.includes("onrender.com");

  res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    .json({
      success: true,
      message: "user logged out successfully",
    });
};
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      req.user = null;
      return next(); // 🔥 Important
    }

    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null;
    next(); // 🔥 Still continue
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
