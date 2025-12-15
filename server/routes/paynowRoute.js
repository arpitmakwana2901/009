const express = require("express");
const CheckoutModel = require("../models/checkoutModel");
const authenticate = require("../middlewere/auth");
const paynowRoute = express.Router();

// ✅ Demo Payment Process
paynowRoute.post("/process-payment", authenticate, async (req, res) => {
  try {
    const { bookingId } = req.body;

    // ✅ Pehle booking find karein
    const booking = await CheckoutModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ Demo payment successful - Directly update booking
    const updatedBooking = await CheckoutModel.findByIdAndUpdate(
      bookingId,
      {
        isPaid: true,
        paymentDate: new Date(),
        paymentId: `demo_pay_${Date.now()}`,
        orderId: `demo_order_${Date.now()}`,
        paymentStatus: "completed",
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Payment successful! 🎉",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
});

// ✅ Get Payment Details
paynowRoute.get(
  "/payment-details/:bookingId",
  authenticate,
  async (req, res) => {
    try {
      const booking = await CheckoutModel.findById(req.params.bookingId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      res.json({
        success: true,
        data: {
          isPaid: booking.isPaid,
          paymentDate: booking.paymentDate,
          paymentId: booking.paymentId,
          paymentStatus: booking.paymentStatus,
        },
      });
    } catch (error) {
      console.error("Payment details error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch payment details",
      });
    }
  }
);

module.exports = paynowRoute;
