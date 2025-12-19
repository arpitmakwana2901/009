const mongoose = require("mongoose");

const ensureCheckoutPaymentIdIndex = async () => {
  // NOTE: this runs after connection is established.
  // It fixes old DB state where `paymentId` had a unique index that treated null as a value,
  // causing E11000 duplicate key errors for unpaid bookings.
  try {
    const CheckoutModel = require("../models/checkoutModel");

    const indexes = await CheckoutModel.collection.indexes();
    const paymentIdx = indexes.find((i) => i.name === "paymentId_1");

    const desiredPartial = { paymentId: { $type: "string" } };

    // If index already exists in the desired form, do nothing.
    if (
      paymentIdx &&
      paymentIdx.unique &&
      paymentIdx.partialFilterExpression &&
      JSON.stringify(paymentIdx.partialFilterExpression) === JSON.stringify(desiredPartial)
    ) {
      return;
    }

    // Otherwise drop any existing index with the same name (including sparse unique ones).
    // sparse+unique can still cause issues if old docs store `paymentId: null`.
    if (paymentIdx) {
      await CheckoutModel.collection.dropIndex("paymentId_1");
    }

    // Create as partial unique (only for real strings)
    await CheckoutModel.collection.createIndex(
      { paymentId: 1 },
      {
        name: "paymentId_1",
        unique: true,
        partialFilterExpression: desiredPartial,
      }
    );
  } catch (err) {
    // Don't crash server if index ops fail; just log.
    console.error("Index ensure error (checkout.paymentId):", err?.message || err);
  }
};

const connection = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database Connected");
  await ensureCheckoutPaymentIdIndex();
};

module.exports = connection;
