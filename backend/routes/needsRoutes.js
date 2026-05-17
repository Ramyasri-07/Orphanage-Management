const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");

// POST NEED (SAVE TO ORPHANAGE COLLECTION)
router.post("/create", async (req, res) => {

  const { login, title, description, category, targetAmount, deadline } = req.body;

  const organization = await Organization.findOne({
    $or: [{ email: login }, { phone: login }]
  });

  if (!organization) {
    return res.json({
      success: false,
      message: "Orphanage not available"
    });
  }

  organization.needs.push({
    title,
    description,
    category,
    targetAmount,
    deadline
  });

  await organization.save();

  res.json({
    success: true,
    message: "Need posted successfully"
  });
});
module.exports = router;