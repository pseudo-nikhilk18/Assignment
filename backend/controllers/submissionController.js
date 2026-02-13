const Submission = require("../models/submissionModel");
const simulateMockApi = require("../services/mockService");

const submitForm = async (req, res) => {
  try {
    const { email, amount, idempotencyKey } = req.body;

    if (!email || !amount || !idempotencyKey) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    let submission = await Submission.findOne({ idempotencyKey });

    // If submission already exists
    if (submission) {
      // Terminal states — never process again
      if (submission.status === "success") {
        return res.status(200).json({
          message: "Already processed successfully",
          data: submission,
        });
      }

      if (submission.status === "failed") {
        return res.status(400).json({
          message: "Submission already failed",
          data: submission,
        });
      }

      // If still pending → retry attempt
    } else {
      // Create new submission as pending
      submission = await Submission.create({
        email,
        amount,
        idempotencyKey,
        status: "pending",
      });
    }

    // Only reaches here if status is pending
    const mockResponse = await simulateMockApi();

    if (mockResponse.status === 503) {
      return res.status(503).json({
        message: "Temporary failure. Please retry.",
        data: submission,
      });
    }

    // Success case
    submission.status = "success";
    await submission.save();

    return res.status(200).json({
      message: mockResponse.message,
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const markFailed = async (req, res) => {
  try {
    const { idempotencyKey } = req.body;

    if (!idempotencyKey) {
      return res.status(400).json({ message: "Missing idempotencyKey" });
    }

    const submission = await Submission.findOne({ idempotencyKey });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.status === "success") {
      return res.status(400).json({
        message: "Cannot mark successful submission as failed",
      });
    }

    submission.status = "failed";
    await submission.save();

    return res.status(200).json({
      message: "Submission marked as failed",
      data: submission,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};



module.exports = { submitForm, markFailed };
