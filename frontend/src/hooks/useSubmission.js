import { useState } from "react";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey";
import {
  submitFormRequest,
  markSubmissionFailed,
} from "../api/submissionApi";

const MAX_ATTEMPTS = 3;

export const useSubmission = () => {
  const [status, setStatus] = useState("idle");
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const submit = async (email, amount) => {
    const idempotencyKey = generateIdempotencyKey();

    setStatus("submitting");
    setAttempt(1);
    setError(null);

    for (let i = 1; i <= MAX_ATTEMPTS; i++) {
      try {
        if (i > 1) {
          setStatus("retrying");
          setAttempt(i);

          const delay = Math.pow(2, i - 2) * 1000;
          await sleep(delay);
        }

        const response = await submitFormRequest({
          email,
          amount,
          idempotencyKey,
        });

        setStatus("success");
        setData(response.data.data);
        return;
      } catch (err) {
        const statusCode = err?.response?.status;

        if (statusCode === 503 && i < MAX_ATTEMPTS) {
          continue;
        }

        try {
          await markSubmissionFailed(idempotencyKey);
        } catch (_) {}

        setStatus("failed");
        setError("Submission failed after 3 attempts.");
        return;
      }
    }
  };

  const reset = () => {
    setStatus("idle");
    setAttempt(0);
    setError(null);
    setData(null);
  };

  return {
    status,
    attempt,
    error,
    data,
    submit,
    reset,
  };
};
