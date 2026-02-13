import SubmissionForm from "./components/SubmissionForm";
import StatusDisplay from "./components/StatusDisplay";
import SubmissionResult from "./components/SubmissionResult";
import { useSubmission } from "./hooks/useSubmission";

function App() {
  const { status, attempt, error, data, submit } = useSubmission();

  const isDisabled =
    status === "submitting" || status === "retrying";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Eventually Consistent Form
        </h1>

        <SubmissionForm
          onSubmit={submit}
          disabled={isDisabled}
          status={status}
        />

        <StatusDisplay
          status={status}
          attempt={attempt}
          error={error}
        />

        <SubmissionResult data={data} />
      </div>
    </div>
  );
}

export default App;
