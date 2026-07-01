const { registerUser, loginUser,logoutUser,getCurrentUser } = require('../controllers/auth.controller');
const {registerValidator,loginValidator} = require('../validators/auth.validator');
const { protect}= require("../middlewares/auth.middleware");
const express = require('express');
const router = express.Router();

router.post('/register',registerValidator, registerUser);
router.post('/login',loginValidator, loginUser);
router.post("/logout", protect, logoutUser);


router.get("/me", getCurrentUser);

module.exports = router;
