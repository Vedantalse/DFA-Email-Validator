import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

function ValidationResult({ analysis }) {
  const execution = analysis?.execution ?? {};

  const accepted = Boolean(
    execution.accepted ?? analysis?.accepted
  );

  const rejected = Boolean(
    execution.rejected ?? analysis?.rejected
  );

  const isValid = accepted && !rejected;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface p-5"
    >
      <div className="mb-4">
        <p className="lab-label">Validation</p>
        <h2 className="mt-1 text-xl font-bold">
          DFA Result
        </h2>
      </div>

      <div
        className={`flex items-center gap-4 rounded-xl border p-4 ${
          isValid
            ? "border-[#2c5940] bg-[#122019]"
            : "border-[#593030] bg-[#201313]"
        }`}
      >
        {isValid ? (
          <CheckCircle2
            size={30}
            className="text-[#72e0a0]"
          />
        ) : (
          <XCircle
            size={30}
            className="text-[#ff7777]"
          />
        )}

        <div>
          <p className="text-lg font-bold text-white">
            {isValid ? "VALID" : "INVALID"}
          </p>

          <p className="text-sm text-[#aaa]">
            {isValid
              ? "Input reached the accepting state."
              : "Input was rejected by the DFA."}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Data label="Final State" value={execution.currentState ?? "—"} />
        <Data
          label="Characters"
          value={`${execution.processedCharacters ?? 0} / ${execution.totalCharacters ?? 0}`}
        />
      </div>
    </motion.section>
  );
}

function Data({ label, value }) {
  return (
    <div className="rounded-xl border border-[#292929] bg-[#161616] p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#777]">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

export default ValidationResult;