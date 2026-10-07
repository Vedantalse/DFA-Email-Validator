import { motion } from "framer-motion";

function Explanation({ analysis }) {
  const execution = analysis?.execution ?? {};

  const email =
    analysis?.email ??
    analysis?.input ??
    "";

  const trace =
    analysis?.trace ??
    analysis?.characterTrace ??
    [];

  /*
    Use the actual trace length first.
    This avoids showing "0 characters" when the
    DFA has already processed the complete input.
  */
  const processedCharacters =
    trace.length > 0
      ? trace.length
      : execution.processedCharacters ??
        email.length ??
        0;

  const totalCharacters =
    execution.totalCharacters ??
    email.length ??
    processedCharacters;

  const currentState =
    execution.currentState ??
    analysis?.currentState ??
    "q0";

  const accepted = Boolean(
    execution.accepted ??
      analysis?.accepted ??
      currentState === "qA"
  );

  const rejected = Boolean(
    execution.rejected ??
      analysis?.rejected ??
      currentState === "qT"
  );

  const finalDecision = accepted
    ? "ACCEPTED"
    : rejected
      ? "REJECTED"
      : "NOT PROCESSED";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface p-5"
    >
      {/* Header */}
      <div className="mb-5">
        <p className="lab-label">
          Explanation
        </p>

        <h2 className="mt-1 text-xl font-bold text-white">
          How the DFA processed it
        </h2>
      </div>

      {/* Steps */}
      <div className="space-y-3">

        {/* 01 */}
        <Step
          number="01"
          title="Input received"
          value={email || "Empty input"}
          mono
        />

        {/* 02 */}
        <Step
          number="02"
          title="Characters processed"
          value={`${processedCharacters} / ${totalCharacters} characters`}
        />

        {/* 03 */}
        <Step
          number="03"
          title="Current state"
          value={currentState}
          mono
        />

        {/* 04 */}
        <Step
          number="04"
          title="Final decision"
          value={finalDecision}
          result
        />

      </div>

      {/* Rule */}
      <div className="mt-5 rounded-xl bg-white p-4 text-black">
        <p className="text-xs font-bold uppercase tracking-wider text-[#555]">
          Acceptance Rule
        </p>

        <p className="mt-1 text-sm font-semibold leading-5">
          The complete input must finish in the
          accepting state qA for the email to be
          accepted.
        </p>
      </div>
    </motion.section>
  );
}

/* =========================================================
   Explanation Step
   ========================================================= */

function Step({
  number,
  title,
  value,
  mono = false,
  result = false,
}) {
  return (
    <div className="flex gap-3 border-b border-[#252525] pb-3 last:border-b-0">
      
      {/* Number */}
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1b1b1b] font-mono text-xs font-bold text-[#888]">
        {number}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-[#777]">
          {title}
        </p>

        <p
          className={`mt-1 break-all text-sm font-semibold ${
            mono ? "font-mono" : ""
          } ${
            result
              ? value === "ACCEPTED"
                ? "text-[#72e0a0]"
                : value === "REJECTED"
                  ? "text-[#ff7777]"
                  : "text-white"
              : "text-white"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default Explanation;