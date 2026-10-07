import { Check, Info } from "lucide-react";
import { motion } from "framer-motion";

function VerificationResult({ analysis }) {
  const accepted = Boolean(
    analysis?.execution?.accepted ??
      analysis?.accepted
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface p-5"
    >
      <div className="mb-4">
        <p className="lab-label">Verification</p>
        <h2 className="mt-1 text-xl font-bold">
          What Was Verified?
        </h2>
      </div>

      <div className="rounded-xl border border-[#292929] bg-[#161616] p-4">
        <div className="flex items-center gap-3">
          <Check
            size={20}
            className="text-white"
          />

          <div>
            <p className="text-sm font-bold text-white">
              Structural conformity
            </p>

            <p className="text-xs text-[#777]">
              DFA execution completed
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-3 rounded-xl border border-[#292929] bg-[#111] p-4">
        <Info
          size={18}
          className="mt-0.5 shrink-0 text-[#aaa]"
        />

        <p className="text-sm leading-5 text-[#aaa]">
          The system verifies whether the email follows the
          language recognized by the DFA. It does not verify
          whether the mailbox actually exists.
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#292929] pt-3">
        <span className="text-sm text-[#777]">
          DFA outcome
        </span>

        <span className="text-sm font-bold text-white">
          {accepted ? "ACCEPTED" : "REJECTED"}
        </span>
      </div>
    </motion.section>
  );
}

export default VerificationResult;