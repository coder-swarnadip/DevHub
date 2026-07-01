const { body } = require("express-validator");

const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters"),

  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array"),

  body("socialLinks.github")
    .optional()
    .trim(),

  body("socialLinks.linkedin")
    .optional()
    .trim(),

  body("socialLinks.portfolio")
    .optional()
    .trim(),

  body("socialLinks.twitter")
    .optional()
    .trim(),
];

module.exports = {
  updateProfileValidator,
};