import { motion } from "framer-motion";
import { CircleCheck, Cpu } from "lucide-react";

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mb-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Cpu size={17} className="text-white" />

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#999]">
              Finite Automata Laboratory
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Email Address
            <span className="text-[#777]"> Validation</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#999] sm:text-base">
            An interactive DFA-based system that processes an email
            address character by character and visualizes its execution.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-[#303030] bg-[#151515] px-4 py-2.5">
          <CircleCheck size={16} className="text-[#72e0a0]" />

          <span className="text-sm font-semibold text-white">
            System Ready
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          "DFA ENGINE",
          "STATE TRACKING",
          "CHARACTER EXECUTION",
          "STRUCTURAL VALIDATION",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#292929] bg-[#111] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-[#aaa]"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.header>
  );
}

export default Header;