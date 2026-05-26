const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");

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
