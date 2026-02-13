const express = require("express");
const router = express.Router();
const { submitForm, markFailed } = require("../controllers/submissionController");

router.post("/submit", submitForm);
router.patch("/submit/fail", markFailed);


module.exports = router;
