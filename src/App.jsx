import { useCallback, useMemo, useState } from "react";
import { ArrowUp, Activity, ShieldCheck, Workflow } from "lucide-react";
import { motion } from "framer-motion";

import Header from "./components/Header";
import EmailInput from "./components/EmailInput";
import DFAStatus from "./components/DFAStatus";
import AutomataVisualizer from "./components/AutomataVisualizer";
import CharacterTrace from "./components/CharacterTrace";
import EmailStructure from "./components/EmailStructure";
import ValidationResult from "./components/ValidationResult";
import VerificationResult from "./components/VerificationResult";
import TransitionTable from "./components/TransitionTable";
import FormalDefinition from "./components/FormalDefinition";
import Explanation from "./components/Explanation";
import TestCases from "./components/TestCases";

import { analyzeEmail } from "./logic/emailAnalyzer";
import { DEMONSTRATION_CASES } from "./data/testCases";

const INITIAL_EMAIL = "student@gmail.com";

/* =========================================================
   Normalize Test Cases
   ========================================================= */

function normalizeTestCase(item, fallbackExpected = null) {
  if (!item) {
    return null;
  }

  if (typeof item === "string") {
    return {
      email: item,
      expected: fallbackExpected ?? "invalid",
      description: "",
    };
  }

  if (typeof item === "object") {
    const email =
      item.email ??
      item.input ??
      item.value ??
      "";

    if (!email && email !== "") {
      return null;
    }

    return {
      ...item,
      email,
      expected:
        item.expected ??
        item.result ??
        fallbackExpected ??
        "invalid",
      description:
        item.description ??
        item.reason ??
        "",
    };
  }

  return null;
}

function normalizeCollection(
  collection,
  fallbackExpected
) {
  if (!collection) {
    return [];
  }

  if (Array.isArray(collection)) {
    return collection
      .map((item) =>
        normalizeTestCase(
          item,
          fallbackExpected
        )
      )
      .filter(Boolean);
  }

  const normalized = normalizeTestCase(
    collection,
    fallbackExpected
  );

  return normalized ? [normalized] : [];
}

/* =========================================================
   Application
   ========================================================= */

function App() {
  const [email, setEmail] = useState(INITIAL_EMAIL);

  const [analysis, setAnalysis] = useState(() =>
    analyzeEmail(INITIAL_EMAIL)
  );

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [hasProcessed, setHasProcessed] =
    useState(false);

  /* -------------------------------------------------------
     Test Cases
     ------------------------------------------------------- */

  const testCases = useMemo(() => {
    if (Array.isArray(DEMONSTRATION_CASES)) {
      return DEMONSTRATION_CASES
        .map((item) =>
          normalizeTestCase(item)
        )
        .filter(Boolean);
    }

    if (
      typeof DEMONSTRATION_CASES ===
      "string"
    ) {
      return [
        normalizeTestCase(
          DEMONSTRATION_CASES
        ),
      ].filter(Boolean);
    }

    if (
      !DEMONSTRATION_CASES ||
      typeof DEMONSTRATION_CASES !==
        "object"
    ) {
      return [];
    }

    return [
      ...normalizeCollection(
        DEMONSTRATION_CASES.valid,
        "valid"
      ),

      ...normalizeCollection(
        DEMONSTRATION_CASES.invalid,
        "invalid"
      ),

      ...normalizeCollection(
        DEMONSTRATION_CASES.edge,
        null
      ),
    ];
  }, []);

  /* -------------------------------------------------------
     Process Email
     ------------------------------------------------------- */

  const processEmail = useCallback(
    (value) => {
      const input =
        typeof value === "string"
          ? value
          : email;

      setIsProcessing(true);

      const result =
        analyzeEmail(input);

      setAnalysis(result);
      setEmail(input);
      setHasProcessed(true);
      setIsProcessing(false);
    },
    [email]
  );

  /* -------------------------------------------------------
     Input Change
     ------------------------------------------------------- */

  const handleEmailChange =
    useCallback((value) => {
      setEmail(value);
    }, []);

  /* -------------------------------------------------------
     Process
     ------------------------------------------------------- */

  const handleProcess =
    useCallback(() => {
      processEmail(email);
    }, [email, processEmail]);

  /* -------------------------------------------------------
     Load Test Case
     ------------------------------------------------------- */

  const handleLoadTestCase =
    useCallback((testCase) => {
      const value =
        typeof testCase === "string"
          ? testCase
          : testCase?.email ??
            testCase?.input ??
            testCase?.value ??
            "";

      setEmail(value);
    }, []);

  /* -------------------------------------------------------
     Run Test Case
     ------------------------------------------------------- */

  const handleRunTestCase =
    useCallback(
      (value) => {
        const input =
          typeof value === "string"
            ? value
            : value?.email ??
              value?.input ??
              value?.value ??
              "";

        setEmail(input);
        processEmail(input);
      },
      [processEmail]
    );

  /* -------------------------------------------------------
     Reset
     ------------------------------------------------------- */

  const handleReset =
    useCallback(() => {
      setEmail("");
      setAnalysis(analyzeEmail(""));
      setHasProcessed(false);
      setIsProcessing(false);
    }, []);

  /* -------------------------------------------------------
     Status
     ------------------------------------------------------- */

  const status = isProcessing
    ? "EXECUTING"
    : hasProcessed
      ? "COMPLETE"
      : "READY";

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <main className="mx-auto w-full max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <Header />

        {/* System Status */}
        <div className="mb-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-[#292929] py-3">
          <StatusItem
            icon={Workflow}
            label="DFA ENGINE"
            value="ONLINE"
          />

          <StatusItem
            icon={Activity}
            label="EXECUTION"
            value={status}
          />

          <StatusItem
            icon={ShieldCheck}
            label="VALIDATION"
            value="STRUCTURAL"
          />
        </div>

        {/* Input + Status */}
        <section className="mb-6 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
          <EmailInput
            email={email}
            onEmailChange={
              handleEmailChange
            }
            onProcess={handleProcess}
            onReset={handleReset}
            onLoadTestCase={
              handleLoadTestCase
            }
            isProcessing={
              isProcessing
            }
            testCases={testCases}
          />

          <DFAStatus
            analysis={analysis}
          />
        </section>

        {/* DFA Visualizer */}
        <section className="mb-6">
          <AutomataVisualizer
            analysis={analysis}
            isProcessing={
              isProcessing
            }
          />
        </section>

        {/* Character Trace */}
        <section className="mb-6">
          <CharacterTrace
            analysis={analysis}
          />
        </section>

        {/* Results */}
        <section className="mb-6 grid gap-4 xl:grid-cols-3">
          <EmailStructure
            analysis={analysis}
          />

          <ValidationResult
            analysis={analysis}
          />

          <VerificationResult
            analysis={analysis}
          />
        </section>

        {/* Transition + Explanation */}
        <section className="mb-6 grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
          <TransitionTable
            analysis={analysis}
          />

          <Explanation
            analysis={analysis}
          />
        </section>

        {/* Formal Definition */}
        <section className="mb-6">
          <FormalDefinition />
        </section>

        {/* Test Cases */}
        <section className="mb-10">
          <TestCases
            testCases={testCases}
            onLoadTestCase={
              handleLoadTestCase
            }
            onProcess={
              handleRunTestCase
            }
          />
        </section>

        {/* Footer */}
        <footer className="border-t border-[#292929] py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Finite Automata Laboratory
              </p>

              <p className="text-xs text-[#777]">
                Email Address Validation and
                Verification System
              </p>
            </div>

            <p className="text-xs text-[#666]">
              React · DFA · Client-side execution
            </p>
          </div>
        </footer>
      </main>

      {/* Back To Top */}
      <button
        type="button"
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="fixed bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-[#363636] bg-[#161616] text-white transition hover:bg-[#242424]"
        aria-label="Back to top"
      >
        <ArrowUp size={17} />
      </button>
    </div>
  );
}

/* =========================================================
   Status Item
   ========================================================= */

function StatusItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon
        size={15}
        className="text-[#aaa]"
      />

      <span className="text-xs font-semibold uppercase tracking-wider text-[#777]">
        {label}
      </span>

      <span className="text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

export default App;