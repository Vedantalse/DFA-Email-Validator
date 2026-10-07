import {
  runDFA,
  createStepExecution,
  processNextStep,
  getExecutionSummary,
  getCurrentStateDetails,
} from "./dfaEngine";

import {
  DFA_STATES,
  CHARACTER_TYPES,
  classifyCharacter,
  getStateLabel,
  getStateDescription,
} from "./emailRules";

// ============================================================
// EMAIL STRUCTURE ANALYSIS
// ============================================================

/**
 * Breaks an email into the structural regions represented
 * by our DFA.
 *
 * This is an analytical representation for the UI.
 * Acceptance itself still comes from the DFA engine.
 *
 * @param {string} email
 * @returns {object}
 */
export function analyzeEmailStructure(email) {
  const value =
    typeof email === "string"
      ? email.trim()
      : "";

  const atIndex = value.indexOf("@");

  const lastDotIndex =
    value.lastIndexOf(".");

  const hasAt =
    atIndex > 0 &&
    atIndex < value.length - 1;

  const domainStart =
    hasAt
      ? atIndex + 1
      : -1;

  const dotAfterAt =
    hasAt &&
    lastDotIndex > domainStart;

  const localPart =
    hasAt
      ? value.slice(0, atIndex)
      : value;

  const domain =
    hasAt && dotAfterAt
      ? value.slice(
          domainStart,
          lastDotIndex,
        )
      : hasAt
        ? value.slice(domainStart)
        : "";

  const tld =
    dotAfterAt
      ? value.slice(lastDotIndex + 1)
      : "";

  return {
    email: value,

    localPart,

    domain,

    tld,

    atIndex,

    dotIndex:
      dotAfterAt
        ? lastDotIndex
        : -1,

    hasLocalPart:
      localPart.length > 0,

    hasAt,

    hasDomain:
      domain.length > 0,

    hasDot:
      dotAfterAt,

    hasTld:
      tld.length > 0,

    completeStructure:
      localPart.length > 0 &&
      hasAt &&
      domain.length > 0 &&
      dotAfterAt &&
      tld.length > 0,
  };
}

// ============================================================
// CHARACTER TRACE ANALYSIS
// ============================================================

/**
 * Adds positional and structural information to the DFA trace.
 *
 * @param {object} execution
 * @returns {Array}
 */
export function buildCharacterTrace(
  execution,
) {
  if (!execution?.trace) {
    return [];
  }

  return execution.trace.map(
    (entry) => {
      const character =
        entry.character;

      if (character === null) {
        return {
          ...entry,

          position: entry.index + 1,

          isEndOfInput: true,

          structure: "accept",

          displayCharacter: "END",
        };
      }

      return {
        ...entry,

        position:
          entry.index + 1,

        isEndOfInput: false,

        structure:
          getStructureFromState(
            entry.fromState,
          ),
      };
    },
  );
}

/**
 * Maps DFA state to the email section currently being processed.
 *
 * @param {string} state
 * @returns {string}
 */
function getStructureFromState(state) {
  switch (state) {
    case DFA_STATES.START:
    case DFA_STATES.LOCAL_PART:
      return "local-part";

    case DFA_STATES.AFTER_AT:
      return "separator";

    case DFA_STATES.DOMAIN:
      return "domain";

    case DFA_STATES.AFTER_DOT:
      return "separator";

    case DFA_STATES.TLD:
      return "tld";

    case DFA_STATES.ACCEPT:
      return "accepted";

    case DFA_STATES.TRAP:
      return "rejected";

    default:
      return "unknown";
  }
}

// ============================================================
// STATE TIMELINE
// ============================================================

/**
 * Builds a timeline of the states visited during execution.
 *
 * @param {object} execution
 * @returns {Array}
 */
export function buildStateTimeline(
  execution,
) {
  if (!execution?.stateHistory) {
    return [];
  }

  return execution.stateHistory.map(
    (state, index) => ({
      index,

      state,

      label:
        getStateLabel(state),

      description:
        getStateDescription(state),

      isInitial:
        index === 0,

      isFinal:
        index ===
        execution.stateHistory.length - 1,

      isAccept:
        state === DFA_STATES.ACCEPT,

      isTrap:
        state === DFA_STATES.TRAP,
    }),
  );
}

// ============================================================
// VALIDATION RESULT
// ============================================================

/**
 * Creates the UI-ready validation result.
 *
 * @param {object} execution
 * @returns {object}
 */
export function buildValidationResult(
  execution,
) {
  const accepted =
    Boolean(execution?.accepted);

  const rejected =
    Boolean(execution?.rejected);

  if (accepted) {
    return {
      status: "VALID",

      accepted: true,

      rejected: false,

      title: "Email Accepted",

      shortMessage:
        "The DFA accepted the input.",

      message:
        "The email successfully followed the defined structure and reached the accepting state.",

      state:
        execution.finalState,

      stateLabel:
        getStateLabel(
          execution.finalState,
        ),

      reason:
        "The complete input was consumed and the DFA reached qA.",

      tone: "success",

      icon: "check",
    };
  }

  const error =
    execution?.errors?.length
      ? execution.errors[
          execution.errors.length - 1
        ].message
      : execution?.error ??
        "The input was rejected by the DFA.";

  return {
    status: "INVALID",

    accepted: false,

    rejected: true,

    title: "Email Rejected",

    shortMessage:
      "The DFA rejected the input.",

    message: error,

    state:
      execution?.finalState ??
      DFA_STATES.TRAP,

    stateLabel:
      getStateLabel(
        execution?.finalState ??
          DFA_STATES.TRAP,
      ),

    reason:
      buildRejectionReason(
        execution,
      ),

    tone: "error",

    icon: "x",
  };
}

// ============================================================
// REJECTION REASON
// ============================================================

function buildRejectionReason(
  execution,
) {
  if (!execution) {
    return "No DFA execution was performed.";
  }

  if (
    execution.errors?.length > 0
  ) {
    const latestError =
      execution.errors[
        execution.errors.length - 1
      ];

    if (
      latestError.type ===
      "EMPTY_INPUT"
    ) {
      return "The DFA received an empty input string.";
    }

    if (
      latestError.type ===
      "INVALID_TRANSITION"
    ) {
      return `The DFA entered the trap state because no valid transition exists for the encountered character.`;
    }

    if (
      latestError.type ===
      "INCOMPLETE_STRUCTURE"
    ) {
      return latestError.message;
    }
  }

  return "The input did not reach the accepting state.";
}

// ============================================================
// VERIFICATION ANALYSIS
// ============================================================

/**
 * Performs a lightweight structural/domain verification.
 *
 * Important:
 * This does NOT claim that the mailbox physically exists.
 * Actual mailbox verification requires an external service.
 *
 * @param {string} email
 * @param {object} structure
 * @param {object} execution
 * @returns {object}
 */
export function buildVerificationResult(
  email,
  structure,
  execution,
) {
  const normalizedEmail =
    typeof email === "string"
      ? email.trim()
      : "";

  if (!normalizedEmail) {
    return {
      status: "UNVERIFIED",

      verified: false,

      title: "Verification Pending",

      message:
        "Enter an email address to begin verification.",

      details: [],

      tone: "neutral",
    };
  }

  if (!execution?.accepted) {
    return {
      status: "NOT VERIFIED",

      verified: false,

      title: "Verification Blocked",

      message:
        "The address must pass DFA validation before verification can proceed.",

      details: [
        "Structural validation failed.",
        "No verification request was attempted.",
      ],

      tone: "error",
    };
  }

  const domain =
    structure?.domain ?? "";

  const tld =
    structure?.tld ?? "";

  const details = [];

  if (domain) {
    details.push(
      `Domain detected: ${domain}`,
    );
  }

  if (tld) {
    details.push(
      `Top-level domain detected: .${tld}`,
    );
  }

  details.push(
    "Email structure passed the DFA.",
  );

  details.push(
    "Mailbox existence requires an external verification service.",
  );

  return {
    status: "STRUCTURALLY VERIFIED",

    verified: true,

    title: "Structure Verified",

    message:
      "The email passed structural verification. Actual mailbox existence is not claimed by the DFA.",

    details,

    tone: "success",
  };
}

// ============================================================
// EMAIL PROCESSING
// ============================================================

/**
 * Runs the complete analysis pipeline.
 *
 * This is the main function that the UI will eventually call.
 *
 * @param {string} email
 * @returns {object}
 */
export function analyzeEmail(
  email,
) {
  const execution =
    runDFA(email);

  const structure =
    analyzeEmailStructure(email);

  const validation =
    buildValidationResult(
      execution,
    );

  const verification =
    buildVerificationResult(
      email,
      structure,
      execution,
    );

  const characterTrace =
    buildCharacterTrace(
      execution,
    );

  const stateTimeline =
    buildStateTimeline(
      execution,
    );

  const summary =
    getExecutionSummary(
      execution,
    );

  return {
    email:
      typeof email === "string"
        ? email.trim()
        : "",

    execution,

    summary,

    structure,

    validation,

    verification,

    characterTrace,

    stateTimeline,
  };
}

// ============================================================
// STEP MODE CONTROLLER
// ============================================================

/**
 * Creates a complete step-mode controller.
 *
 * The controller is intentionally framework-independent.
 * React components can store its returned state however they
 * choose.
 *
 * @param {string} email
 * @returns {object}
 */
export function createAnalyzerController(
  email,
) {
  let execution =
    createStepExecution(email);

  return {
    /**
     * Returns the current execution.
     */
    getExecution() {
      return execution;
    },

    /**
     * Processes one character or the final acceptance step.
     */
    next() {
      execution =
        processNextStep(
          execution,
        );

      return execution;
    },

    /**
     * Runs until completion.
     */
    runToCompletion() {
      while (!execution.completed) {
        execution =
          processNextStep(
            execution,
          );
      }

      return execution;
    },

    /**
     * Checks whether execution has finished.
     */
    isComplete() {
      return execution.completed;
    },

    /**
     * Resets the controller.
     */
    reset(nextEmail = email) {
      execution =
        createStepExecution(
          nextEmail,
        );

      return execution;
    },
  };
}

// ============================================================
// CHARACTER INFORMATION
// ============================================================

/**
 * Provides detailed information about one character.
 *
 * @param {string} character
 * @returns {object}
 */
export function analyzeCharacter(
  character,
) {
  const type =
    classifyCharacter(character);

  return {
    character,

    type,

    label:
      getCharacterTypeLabel(type),

    isLetter:
      type === CHARACTER_TYPES.LETTER,

    isDigit:
      type === CHARACTER_TYPES.DIGIT,

    isSeparator:
      type === CHARACTER_TYPES.AT ||
      type === CHARACTER_TYPES.DOT,

    isSpecial:
      type === CHARACTER_TYPES.UNDERSCORE ||
      type === CHARACTER_TYPES.HYPHEN,

    isValidCharacter:
      type !== CHARACTER_TYPES.OTHER,
  };
}

/**
 * Returns a readable character category.
 *
 * @param {string} type
 * @returns {string}
 */
function getCharacterTypeLabel(
  type,
) {
  switch (type) {
    case CHARACTER_TYPES.LETTER:
      return "Letter";

    case CHARACTER_TYPES.DIGIT:
      return "Digit";

    case CHARACTER_TYPES.AT:
      return "@ Separator";

    case CHARACTER_TYPES.DOT:
      return "Dot Separator";

    case CHARACTER_TYPES.UNDERSCORE:
      return "Underscore";

    case CHARACTER_TYPES.HYPHEN:
      return "Hyphen";

    default:
      return "Invalid Character";
  }
}

// ============================================================
// STRUCTURE STATUS
// ============================================================

/**
 * Converts the structural analysis into UI-friendly statuses.
 *
 * @param {object} structure
 * @returns {Array}
 */
export function getStructureStatus(
  structure,
) {
  if (!structure) {
    return [];
  }

  return [
    {
      id: "local-part",

      label: "Local Part",

      value:
        structure.localPart || "—",

      valid:
        structure.hasLocalPart,

      status:
        structure.hasLocalPart
          ? "complete"
          : "missing",
    },

    {
      id: "separator",

      label: "@ Separator",

      value:
        structure.hasAt
          ? "@"
          : "—",

      valid:
        structure.hasAt,

      status:
        structure.hasAt
          ? "complete"
          : "missing",
    },

    {
      id: "domain",

      label: "Domain",

      value:
        structure.domain || "—",

      valid:
        structure.hasDomain,

      status:
        structure.hasDomain
          ? "complete"
          : "missing",
    },

    {
      id: "dot",

      label: "Dot",

      value:
        structure.hasDot
          ? "."
          : "—",

      valid:
        structure.hasDot,

      status:
        structure.hasDot
          ? "complete"
          : "missing",
    },

    {
      id: "tld",

      label: "TLD",

      value:
        structure.tld || "—",

      valid:
        structure.hasTld,

      status:
        structure.hasTld
          ? "complete"
          : "missing",
    },
  ];
}

// ============================================================
// EXECUTION PROGRESS
// ============================================================

/**
 * Creates progress information for the processing UI.
 *
 * @param {object} execution
 * @returns {object}
 */
export function getExecutionProgress(
  execution,
) {
  if (!execution) {
    return {
      processed: 0,
      total: 0,
      percentage: 0,
      completed: false,
    };
  }

  const total =
    execution.totalCharacters;

  const processed =
    execution.charactersProcessed;

  const percentage =
    total === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (processed / total) *
              100,
          ),
        );

  return {
    processed,

    total,

    percentage,

    completed:
      execution.completed,

    currentIndex:
      execution.currentIndex,

    currentCharacter:
      execution.currentCharacter,

    remaining:
      Math.max(
        0,
        total - processed,
      ),
  };
}

// ============================================================
// FULL APPLICATION PAYLOAD
// ============================================================

/**
 * Produces the complete data object expected by the UI.
 *
 * @param {string} email
 * @returns {object}
 */
export function createApplicationPayload(
  email,
) {
  const analysis =
    analyzeEmail(email);

  const structureStatus =
    getStructureStatus(
      analysis.structure,
    );

  const progress =
    getExecutionProgress(
      analysis.execution,
    );

  const currentState =
    getCurrentStateDetails(
      analysis.execution
        .currentState,
    );

  return {
    ...analysis,

    structureStatus,

    progress,

    currentState,
  };
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  analyzeEmail,

  analyzeEmailStructure,

  buildCharacterTrace,

  buildStateTimeline,

  buildValidationResult,

  buildVerificationResult,

  createAnalyzerController,

  analyzeCharacter,

  getStructureStatus,

  getExecutionProgress,

  createApplicationPayload,
};