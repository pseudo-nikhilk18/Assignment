const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true, // prevents duplicates at DB level
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
