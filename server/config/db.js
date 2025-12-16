const mongoose = require("mongoose");

const ensureCheckoutPaymentIdIndex = async () => {
  // NOTE: this runs after connection is established.
  // It fixes old DB state where `paymentId` had a unique index that treated null as a value,
  // causing E11000 duplicate key errors for unpaid bookings.
  try {
    const CheckoutModel = require("../models/checkoutModel");

    const indexes = await CheckoutModel.collection.indexes();
    const paymentIdx = indexes.find((i) => i.name === "paymentId_1");

    // If an old unique index exists WITHOUT partial/sparse filter, it will block multiple null/undefined values.
    if (paymentIdx && paymentIdx.unique && !paymentIdx.partialFilterExpression && !paymentIdx.sparse) {
      await CheckoutModel.collection.dropIndex("paymentId_1");
    }

    // Recreate as partial unique (only for real strings)
    await CheckoutModel.collection.createIndex(
      { paymentId: 1 },
      { unique: true, partialFilterExpression: { paymentId: { $type: "string" } } }
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
