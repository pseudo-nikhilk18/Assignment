const StatusDisplay = ({ status, attempt, error }) => {
  if (status === "idle") return null;

  let message = "";

  if (status === "submitting") {
    message = `Pending... (Attempt ${attempt}/3)`;
  }

  if (status === "retrying") {
    message = `Retrying... (Attempt ${attempt}/3)`;
  }

  if (status === "success") {
    message = "Submission successful.";
  }

  if (status === "failed") {
    message = error || "Submission failed.";
  }

  const color =
    status === "success"
      ? "text-green-600"
      : status === "failed"
      ? "text-red-600"
      : "text-yellow-600";

  return (
    <div className={`mt-4 text-sm font-medium ${color}`}>
      {message}
    </div>
  );
};

export default StatusDisplay;
