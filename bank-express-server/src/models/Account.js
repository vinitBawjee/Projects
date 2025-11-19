const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    balance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

module.exports = mongoose.model("Account", accountSchema);
