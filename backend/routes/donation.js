const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const Organization = require("../models/Organization");

router.post("/", async (req, res) => {
   try {
      console.log(req.body);
      const { amount, paymentMethod, transactionId, needId, donorLogin } = req.body;

      const newDonation = new Donation({
         amount,
         paymentMethod,
         transactionId,
         needId,
         donorLogin
      });

    await newDonation.save();

// Find the organization containing this need
const organization = await Organization.findOne({
   "needs._id": needId
});

if (organization) {
   const need = organization.needs.id(needId);

   if (need) {
      need.donatedAmount =
         (need.donatedAmount || 0) + Number(amount);

      // Remove need if target reached
      if (need.donatedAmount >= need.targetAmount) {
         organization.needs.pull(needId);
      }

      await organization.save();
      const updatedOrg = await Organization.findOne({
  "needs._id": needId
});

console.log("UPDATED ORG:", updatedOrg);
   }
}

res.json({
   success: true,
   message: "Donation Stored"
});
   } catch (error) {
      console.error("Error storing donation:", error);
      res.status(500).json({
         success: false,
         message: error.message || "Failed to store donation"
      });
   }
});

module.exports = router;
