import { motion } from "framer-motion";
import {
  Braces,
  CircleDot,
  Sigma,
  Workflow,
} from "lucide-react";

import {
  CHARACTER_TYPES,
  DFA_STATES,
  STATE_INFO,
} from "../logic/emailRules";

function FormalDefinition() {
  const states = Object.values(DFA_STATES);
  const alphabet = Object.values(CHARACTER_TYPES);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface p-5 sm:p-6"
    >
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Braces size={18} />

          <p className="lab-label">
            Formal Definition
          </p>
        </div>

        <h2 className="mt-1 text-xl font-bold">
          Mathematical DFA Representation
        </h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Block title="5-Tuple" icon={Workflow}>
          <div className="rounded-xl bg-white p-5 text-center text-black">
            <p className="font-mono text-xl font-bold">
              M = (Q, Σ, δ, q₀, F)
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Data label="Q" value={`${states.length} states`} />
            <Data label="Σ" value={`${alphabet.length} symbols`} />
            <Data label="q₀" value={DFA_STATES.START} />
            <Data label="F" value={DFA_STATES.ACCEPT} />
          </div>
        </Block>

        <Block title="Recognized Language" icon={Sigma}>
          <div className="rounded-xl border border-[#363636] bg-[#171717] p-5 text-center">
            <p className="font-mono text-base font-bold text-white">
              LOCAL-PART @ DOMAIN . TLD
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#999]">
            The DFA recognizes strings that follow the simplified
            email structure implemented by the project.
          </p>
        </Block>

        <Block title="States" icon={CircleDot}>
          <div className="grid grid-cols-2 gap-2">
            {states.map((state) => (
              <div
                key={state}
                className="flex items-center gap-3 rounded-lg border border-[#292929] bg-[#161616] p-3"
              >
                <span className="font-mono text-sm font-bold text-white">
                  {state}
                </span>

                <span className="text-xs text-[#888]">
                  {STATE_INFO[state]?.label ?? state}
                </span>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Alphabet" icon={Braces}>
          <div className="flex flex-wrap gap-2">
            {alphabet.map((symbol) => (
              <span
                key={symbol}
                className="rounded-lg border border-[#303030] bg-[#171717] px-3 py-2 font-mono text-xs font-semibold text-white"
              >
                {symbol}
              </span>
            ))}
          </div>
        </Block>
      </div>
    </motion.section>
  );
}

function Block({ title, icon: Icon, children }) {
  return (
    <div className="rounded-xl border border-[#292929] bg-[#111] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-[#aaa]" />

        <h3 className="text-sm font-bold text-white">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}

function Data({ label, value }) {
  return (
    <div className="rounded-lg border border-[#292929] bg-[#161616] p-3">
      <p className="text-xs font-bold text-[#666]">{label}</p>
      <p className="mt-1 font-mono text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

export default FormalDefinition;