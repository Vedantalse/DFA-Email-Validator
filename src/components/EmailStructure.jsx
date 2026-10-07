import { AtSign, Globe, Hash, CircleDot } from "lucide-react";

function EmailStructure({ analysis }) {
  const structure = analysis?.structure || {};

  const email =
    analysis?.email ??
    analysis?.input ??
    "";

  const localPart =
    structure.localPart ??
    structure.local ??
    (email.includes("@") ? email.split("@")[0] : "");

  const afterAt =
    email.includes("@")
      ? email.split("@")[1]
      : "";

  const parts = afterAt.split(".");

  const domain =
    structure.domain ??
    (parts.length > 0 ? parts[0] : "");

  const tld =
    structure.tld ??
    (parts.length > 1 ? parts[parts.length - 1] : "");

  const hasAtSymbol =
    structure.hasAtSymbol ??
    email.includes("@");

  const hasDot =
    structure.hasDot ??
    email.includes(".");

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
          Structure
        </p>

        <h2 className="mt-2 text-2xl font-bold text-white">
          Email Components
        </h2>
      </div>

      <div className="grid gap-3">

        {/* Local part */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <AtSign size={18} className="text-zinc-500" />

            <span className="font-medium text-zinc-400">
              Local Part
            </span>
          </div>

          <span className="font-mono font-bold text-white">
            {localPart || "Missing"}
          </span>
        </div>

        {/* Domain */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <Globe size={18} className="text-zinc-500" />

            <span className="font-medium text-zinc-400">
              Domain
            </span>
          </div>

          <span className="font-mono font-bold text-white">
            {domain || "Missing"}
          </span>
        </div>

        {/* TLD */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <Hash size={18} className="text-zinc-500" />

            <span className="font-medium text-zinc-400">
              TLD
            </span>
          </div>

          <span className="font-mono font-bold text-white">
            {tld || "Missing"}
          </span>
        </div>

        {/* @ */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <AtSign size={18} className="text-zinc-500" />

            <span className="font-medium text-zinc-400">
              @ Symbol
            </span>
          </div>

          <span
            className={`font-bold ${
              hasAtSymbol
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {hasAtSymbol ? "Present" : "Missing"}
          </span>
        </div>

        {/* Dot */}
        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <CircleDot size={18} className="text-zinc-500" />

            <span className="font-medium text-zinc-400">
              Dot
            </span>
          </div>

          <span
            className={`font-bold ${
              hasDot
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {hasDot ? "Present" : "Missing"}
          </span>
        </div>

      </div>
    </section>
  );
}

export default EmailStructure;