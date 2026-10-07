import { motion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";

function EmailInput({
  email,
  onEmailChange,
  onProcess,
  onReset,
  onLoadTestCase,
  isProcessing = false,
  testCases = [],
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface p-5 sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="lab-label">Input</p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Enter email address
          </h2>
        </div>

        <span className="text-xs text-[#666]">
          DFA input string
        </span>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <input
          type="text"
          value={email}
          onChange={(event) =>
            onEmailChange(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onProcess();
            }
          }}
          placeholder="example@gmail.com"
          className="h-14 min-w-0 flex-1 rounded-xl border border-[#363636] bg-[#181818] px-4 font-mono text-base text-white outline-none transition placeholder:text-[#555] focus:border-white"
        />

        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-black transition hover:bg-[#ddd] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play size={16} fill="currentColor" />
          {isProcessing ? "Processing..." : "Process"}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="flex h-14 items-center justify-center gap-2 rounded-xl border border-[#363636] bg-[#171717] px-5 text-sm font-semibold text-white transition hover:bg-[#222]"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {testCases.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs font-semibold text-[#777]">
            QUICK TEST
          </span>

          <select
            value=""
            onChange={(event) => {
              const selected = testCases.find(
                (testCase) =>
                  (testCase.email ??
                    testCase.input ??
                    testCase.value) === event.target.value
              );

              if (selected) {
                onLoadTestCase(selected);
              }
            }}
            className="h-10 flex-1 rounded-lg border border-[#292929] bg-[#151515] px-3 text-sm text-[#ccc] outline-none focus:border-white"
          >
            <option value="">
              Select a predefined test case
            </option>

            {testCases.map((testCase, index) => {
              const value =
                testCase.email ??
                testCase.input ??
                testCase.value ??
                "";

              return (
                <option key={`${value}-${index}`} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      )}
    </motion.section>
  );
}

export default EmailInput;