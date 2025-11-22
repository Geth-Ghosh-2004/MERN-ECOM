const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
} = require("../../controllers/auth/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  if (!req.user) {
    return res.json({
      success: false,
      message: "Not authenticated",
      user: null,
    });
  }

  res.json({
    success: true,
    message: "Authenticated User",
    user: req.user,
  });
});

module.exports = router;
