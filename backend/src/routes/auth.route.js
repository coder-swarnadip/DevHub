const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} = require("../controllers/auth.controller");

const {
  registerValidator,
  loginValidator,
} = require("../validators/auth.validator");

const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const wrapAsync = require("../utils/wrapAsync");

const router = express.Router();

router.post("/register", registerValidator, validate, wrapAsync(registerUser));
router.post("/login", loginValidator, validate, wrapAsync(loginUser));
router.post("/logout", protect, wrapAsync(logoutUser));
router.get("/me", protect, wrapAsync(getCurrentUser));

module.exports = router;