const mongoose = require("mongoose");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils.js");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin.js");
const adminController = {};

adminController.getCurrentAdmin = catchAsync(async (req, res, next) => {
  const currentAdminId = req.adminId;
  const admin = await Admin.findById(currentAdminId);
  if (!admin) throw new AppError(400, "admin not found", "Get Current admin Error");
  return sendResponse(res, 200, true, admin, null, "Get Current admin successful");
});

adminController.updatePorfile = catchAsync(async (req, res, next) => {
  const currentAdminId = req.adminId;
  const adminId = req.params.id;

  if (currentAdminId === adminId) throw new AppError(400, "Permission required", "Update admin Error");

  let admin = await Admin.findById(adminId);
  if (!admin) throw new AppError(400, "admin not found", "Update admin Error");

  const allows = [
    "name",
    "avatarUrl",
    "coverUrl",
    "aboutMe",
    "city",
    "country",
    "company",
    "jobTitle",
    "facebookLink",
    "instagramLink",
    "linkedinLink",
    "twitterLink",
  ];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      admin[field] = req.body[field];
    }
  });
  await Admin.save();

  return sendResponse(res, 200, true, admin, null, "update admin successful");
});

adminController.changePassword = catchAsync(async (req, res, next) => {
  const adminId = req.params.id;
  const { currentPassword, newPassword } = req.body;
  if (!adminId || !currentPassword || !newPassword) throw new AppError(400, "Missing required fields", "Change Password");

  let admin = await Admin.findById(adminId);
  if (!admin) throw new AppError(400, "User not found", "Change Password");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new AppError(400, "Incorrect current password", "Change Password");

  admin.password = newPassword;
  await Admin.save();
  return sendResponse(res, 200, true, admin, null, "Password changed successfully");
});
module.exports = adminController;
