import { useState, useEffect } from "react";

const SubmissionForm = ({ onSubmit, disabled, status }) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (status === "success") {
      setEmail("");
      setAmount("");
    }
  }, [status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !amount) return;

    onSubmit(email, Number(amount));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className={`w-full py-2 rounded-lg text-white font-medium transition ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Submit
      </button>
    </form>
  );
};

export default SubmissionForm;
