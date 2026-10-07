import { Check, X, Activity } from "lucide-react";

function CharacterTrace({ analysis }) {
  const trace =
    analysis?.trace ||
    analysis?.characterTrace ||
    analysis?.execution?.trace ||
    [];

  const processed =
    analysis?.execution?.processedCharacters ??
    trace.length;

  const total =
    analysis?.execution?.totalCharacters ??
    analysis?.email?.length ??
    0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between px-7 py-6 border-b border-zinc-800">
        <div>
          <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
            Execution Trace
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Character-by-character processing
          </h2>
        </div>

        <div className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300">
          {processed} processed
        </div>
      </div>

      {trace.length === 0 ? (
        <div className="px-7 py-12 text-center">
          <Activity className="mx-auto mb-4 h-8 w-8 text-zinc-600" />

          <p className="text-base font-semibold text-zinc-400">
            No character trace available.
          </p>

          <p className="mt-2 text-sm text-zinc-600">
            Process an email to display DFA execution steps.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    #
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Character
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    From
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    To
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Result
                  </th>
                </tr>
              </thead>

              <tbody>
                {trace.map((step, index) => {
                  const from =
                    step.fromState ??
                    step.state ??
                    step.currentState ??
                    "-";

                  const to =
                    step.toState ??
                    step.nextState ??
                    "-";

                  const valid =
                    step.valid ??
                    step.accepted ??
                    to !== "qT";

                  return (
                    <tr
                      key={`${index}-${step.character ?? ""}`}
                      className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/70"
                    >
                      <td className="px-6 py-4 font-mono text-sm text-zinc-600">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex min-w-9 items-center justify-center rounded-lg bg-white px-3 py-2 font-mono text-base font-bold text-black">
                          {step.character === " " ? "SPACE" : step.character}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-zinc-300">
                        {step.type ?? step.characterType ?? "-"}
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-zinc-300">
                        {from}
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-zinc-300">
                        {to}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold ${
                            valid
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {valid ? (
                            <Check size={15} />
                          ) : (
                            <X size={15} />
                          )}

                          {valid ? "Valid" : "Rejected"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-3 p-5 md:hidden">
            {trace.map((step, index) => {
              const from =
                step.fromState ??
                step.state ??
                step.currentState ??
                "-";

              const to =
                step.toState ??
                step.nextState ??
                "-";

              const valid =
                step.valid ??
                step.accepted ??
                to !== "qT";

              return (
                <div
                  key={`${index}-${step.character ?? ""}`}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-zinc-500">
                      #{index + 1}
                    </span>

                    <span
                      className={
                        valid
                          ? "font-semibold text-emerald-400"
                          : "font-semibold text-red-400"
                      }
                    >
                      {valid ? "VALID" : "REJECTED"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <span className="rounded-lg bg-white px-3 py-2 font-mono font-bold text-black">
                      {step.character}
                    </span>

                    <span className="font-mono text-sm text-zinc-400">
                      {from} → {to}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/50 px-7 py-4">
            <span className="text-sm text-zinc-500">
              DFA execution
            </span>

            <span className="font-mono text-sm font-bold text-white">
              {processed} / {total}
            </span>
          </div>
        </>
      )}
    </section>
  );
}

export default CharacterTrace;