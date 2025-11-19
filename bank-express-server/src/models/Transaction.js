const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ["deposit", "withdraw", "transfer"], required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
