const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

const getUserProfile = async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({
    username: username.toLowerCase(),
    isBlocked: false,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json({
    success: true,
    user,
  });
};

const updateProfile = async (req, res) => {
  const userId = req.user._id;

  const allowedFields = [
    "name",
    "bio",
    "location",
    "skills",
    "education",
    "experience",
    "socialLinks",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

const searchUsers = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required");
  }

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
      { skills: { $regex: query, $options: "i" } },
    ],
    isBlocked: false,
  })
    .select("name username avatar bio skills location followersCount")
    .limit(20);

  return res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
};

module.exports = {
  getUserProfile,
  updateProfile,
  searchUsers,
};