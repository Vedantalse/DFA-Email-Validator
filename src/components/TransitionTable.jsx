import { motion } from "framer-motion";
import { getTransitionTable } from "../logic/dfaEngine";

function TransitionTable({ analysis }) {
  const table = getTransitionTable();

  const currentState =
    analysis?.execution?.currentState;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface overflow-hidden"
    >
      <div className="border-b border-[#292929] p-5">
        <p className="lab-label">Transition Function</p>

        <h2 className="mt-1 text-xl font-bold">
          DFA Transition Table
        </h2>

        <p className="mt-1 text-sm text-[#777]">
          δ(q, input) → next state
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="border-b border-[#292929] bg-[#151515]">
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#777]">
                State
              </th>

              {Object.keys(table[Object.keys(table)[0]] ?? {}).map(
                (input) => (
                  <th
                    key={input}
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#777]"
                  >
                    {input}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {Object.entries(table).map(
              ([state, transitions]) => (
                <tr
                  key={state}
                  className={`border-b border-[#202020] ${
                    state === currentState
                      ? "bg-[#1c1c1c]"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-sm font-bold text-white">
                    {state}
                  </td>

                  {Object.entries(transitions).map(
                    ([input, nextState]) => (
                      <td
                        key={input}
                        className="px-4 py-3 font-mono text-sm text-[#aaa]"
                      >
                        {nextState ?? "—"}
                      </td>
                    )
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

export default TransitionTable;