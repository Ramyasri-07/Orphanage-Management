const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");

// GET ALL NEEDS FOR DONORS
router.get("/all", async (req, res) => {
  const organizations = await Organization.find({ "needs.0": { $exists: true } });

  const needs = organizations.flatMap((org) =>
    org.needs.map((need) => ({
      _id: need._id,
      title: need.title,
      description: need.description,
      category: need.category,
      targetAmount: need.targetAmount,
      deadline: need.deadline,
      orphanageName: org.orphanageName,
      email: org.email,
      phone: org.phone
    }))
  );

  res.json(needs);
});

// GET NEEDS FOR A SPECIFIC ORPHANAGE
router.get("/orphanage", async (req, res) => {
  const { login } = req.query;

  if (!login) {
    return res.json({
      success: false,
      message: "Login is required"
    });
  }

  const organization = await Organization.findOne({
    $or: [{ email: login }, { phone: login }]
  });

  if (!organization) {
    return res.json({
      success: false,
      message: "Orphanage not found",
      needs: []
    });
  }

  res.json(organization.needs);
});

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

// DONATE TO A NEED
router.post("/donate", async (req, res) => {
  const { needId, amount } = req.body;

  const organization = await Organization.findOne({ "needs._id": needId });

  if (!organization) {
    return res.json({
      success: false,
      message: "Need not found"
    });
  }

  if (!amount || Number(amount) <= 0) {
    return res.json({
      success: false,
      message: "Donation amount must be greater than zero"
    });
  }

  res.json({
    success: true,
    message: `Donation of ₹${amount} received. Thank you!`
  });
});

module.exports = router;