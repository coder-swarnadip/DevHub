const express = require("express");

const {
  getUserProfile,
  updateProfile,
  searchUsers,
} = require("../controllers/user.controller");

const { protect } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const wrapAsync = require("../utils/wrapAsync");

const {
  updateProfileValidator,
} = require("../validators/user.validator");

const router = express.Router();

router.get("/search", protect, wrapAsync(searchUsers));

router.patch(
  "/profile",
  protect,
  updateProfileValidator,
  validate,
  wrapAsync(updateProfile)
);

router.get("/:username", wrapAsync(getUserProfile));

module.exports = router;