const User = require("../models/User");
const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  phone: z.string().optional(),
});

exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfileSchema = updateProfileSchema;
