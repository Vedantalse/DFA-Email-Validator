import { motion } from "framer-motion";
import { Check, Play, X } from "lucide-react";
import { useMemo, useState } from "react";

function TestCases({
  testCases = [],
  onLoadTestCase,
  onProcess,
}) {
  const [filter, setFilter] = useState("all");

  const filteredCases = useMemo(() => {
    if (filter === "all") return testCases;

    return testCases.filter(
      (testCase) => testCase.expected === filter
    );
  }, [testCases, filter]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface overflow-hidden"
    >
      <div className="flex flex-col gap-4 border-b border-[#292929] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="lab-label">Testing</p>

          <h2 className="mt-1 text-xl font-bold">
            Test Cases
          </h2>
        </div>

        <div className="flex gap-2">
          {["all", "valid", "invalid"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-lg border px-4 py-2 text-xs font-bold capitalize transition ${
                filter === item
                  ? "border-white bg-white text-black"
                  : "border-[#303030] bg-[#151515] text-[#aaa] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="bg-[#151515]">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#777]">
                #
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#777]">
                Input
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#777]">
                Expected
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#777]">
                Description
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#777]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCases.map((testCase, index) => {
              const email =
                testCase.email ??
                testCase.input ??
                testCase.value ??
                "";

              const valid =
                testCase.expected === "valid";

              return (
                <tr
                  key={`${email}-${index}`}
                  className="border-t border-[#242424] hover:bg-[#151515]"
                >
                  <td className="px-5 py-4 font-mono text-sm text-[#666]">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="px-5 py-4 font-mono text-sm font-semibold text-white">
                    {email}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-bold ${
                        valid
                          ? "text-[#72e0a0]"
                          : "text-[#ff7777]"
                      }`}
                    >
                      {valid ? (
                        <Check size={15} />
                      ) : (
                        <X size={15} />
                      )}

                      {valid ? "ACCEPT" : "REJECT"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-[#888]">
                    {testCase.description ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onLoadTestCase?.(testCase)
                        }
                        className="rounded-lg border border-[#303030] bg-[#171717] px-3 py-2 text-xs font-semibold text-[#aaa] hover:text-white"
                      >
                        Load
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onProcess?.(email)
                        }
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-black hover:bg-[#ddd]"
                      >
                        <Play size={12} fill="currentColor" />
                        Run
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCases.length === 0 && (
        <div className="p-8 text-center text-sm text-[#777]">
          No test cases found.
        </div>
      )}
    </motion.section>
  );
}

export default TestCases;