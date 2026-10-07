import {
  Activity,
  CheckCircle2,
  XCircle,
  LoaderCircle,
} from "lucide-react";

function DFAStatus({ analysis }) {
  const execution = analysis?.execution || {};

  const email =
    analysis?.email ??
    analysis?.input ??
    "";

  const trace =
    analysis?.trace ||
    analysis?.characterTrace ||
    [];

  const totalCharacters =
    execution.totalCharacters ??
    email.length ??
    0;

  const processedCharacters =
    execution.processedCharacters ??
    (analysis?.accepted || analysis?.rejected
      ? totalCharacters
      : trace.length);

  const currentState =
    execution.currentState ??
    analysis?.currentState ??
    "q0";

  const progress =
    totalCharacters > 0
      ? Math.min(
          100,
          Math.round(
            (processedCharacters / totalCharacters) * 100
          )
        )
      : 0;

  const accepted =
    analysis?.accepted === true ||
    analysis?.validation?.accepted === true;

  const rejected =
    analysis?.rejected === true ||
    analysis?.validation?.rejected === true;

  const processing =
    execution.processing === true ||
    execution.phase === "processing";

  const phase =
    execution.phase ??
    (processing ? "PROCESSING" : "COMPLETE");

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Execution
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            DFA Status
          </h2>
        </div>

        <Activity className="text-zinc-500" size={25} />
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Current State
          </p>

          <p className="mt-4 font-mono text-2xl font-bold text-white">
            {currentState}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Characters
          </p>

          <p className="mt-4 text-2xl font-bold text-white">
            {processedCharacters}{" "}
            <span className="text-zinc-500">
              / {totalCharacters}
            </span>
          </p>
        </div>

      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">

        <div className="mb-3 flex items-center justify-between">
          <span className="font-semibold text-zinc-400">
            Execution progress
          </span>

          <span className="font-mono font-bold text-white">
            {progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">

        {processing ? (
          <LoaderCircle
            className="animate-spin text-white"
            size={27}
          />
        ) : accepted ? (
          <CheckCircle2
            className="text-emerald-400"
            size={27}
          />
        ) : rejected ? (
          <XCircle
            className="text-red-400"
            size={27}
          />
        ) : (
          <Activity
            className="text-zinc-500"
            size={27}
          />
        )}

        <div>
          <p className="font-bold text-white">
            {processing
              ? "Processing input"
              : accepted
              ? "Input Accepted"
              : rejected
              ? "Input Rejected"
              : "Ready"}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            {phase}
          </p>
        </div>

      </div>
    </section>
  );
}

export default DFAStatus;