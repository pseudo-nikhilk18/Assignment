const SubmissionResult = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-sm font-semibold text-gray-700 mb-2">
        Last Submission
      </h2>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">Email:</span> {data.email}
        </p>
        <p>
          <span className="font-medium">Amount:</span> {data.amount}
        </p>
        <p>
          <span className="font-medium">Status:</span> {data.status}
        </p>
      </div>
    </div>
  );
};

export default SubmissionResult;
