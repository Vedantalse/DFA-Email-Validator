import {
  CHARACTER_TYPES,
  DFA_STATES,
  ACCEPTING_STATES,
  classifyCharacter,
  isValidLocalPartCharacter,
  isValidDomainCharacter,
  getStateLabel,
  getStateDescription,
  CHARACTER_TYPE_LABELS,
} from "./emailRules";

// ============================================================
// DFA TRANSITION DEFINITIONS
// ============================================================

/**
 * Transition table used by the DFA.
 *
 * The DFA does not directly understand individual characters.
 * Each character is first classified into a category, then the
 * transition function decides the next state.
 */
const TRANSITIONS = {
  [DFA_STATES.START]: {
    [CHARACTER_TYPES.LETTER]: DFA_STATES.LOCAL_PART,
    [CHARACTER_TYPES.DIGIT]: DFA_STATES.LOCAL_PART,
  },

  [DFA_STATES.LOCAL_PART]: {
    [CHARACTER_TYPES.LETTER]: DFA_STATES.LOCAL_PART,
    [CHARACTER_TYPES.DIGIT]: DFA_STATES.LOCAL_PART,
    [CHARACTER_TYPES.UNDERSCORE]: DFA_STATES.LOCAL_PART,
    [CHARACTER_TYPES.HYPHEN]: DFA_STATES.LOCAL_PART,
    [CHARACTER_TYPES.DOT]: DFA_STATES.LOCAL_PART,
    [CHARACTER_TYPES.AT]: DFA_STATES.AFTER_AT,
  },

  [DFA_STATES.AFTER_AT]: {
    [CHARACTER_TYPES.LETTER]: DFA_STATES.DOMAIN,
  },

  [DFA_STATES.DOMAIN]: {
    [CHARACTER_TYPES.LETTER]: DFA_STATES.DOMAIN,
    [CHARACTER_TYPES.DIGIT]: DFA_STATES.DOMAIN,
    [CHARACTER_TYPES.HYPHEN]: DFA_STATES.DOMAIN,
    [CHARACTER_TYPES.DOT]: DFA_STATES.AFTER_DOT,
  },

  [DFA_STATES.AFTER_DOT]: {
    [CHARACTER_TYPES.LETTER]: DFA_STATES.TLD,
  },

  [DFA_STATES.TLD]: {
    [CHARACTER_TYPES.LETTER]: DFA_STATES.TLD,
  },

  [DFA_STATES.ACCEPT]: {},

  [DFA_STATES.TRAP]: {},
};

// ============================================================
// STATE PHASES
// ============================================================

const STATE_PHASES = {
  [DFA_STATES.START]: "start",
  [DFA_STATES.LOCAL_PART]: "local-part",
  [DFA_STATES.AFTER_AT]: "separator",
  [DFA_STATES.DOMAIN]: "domain",
  [DFA_STATES.AFTER_DOT]: "separator",
  [DFA_STATES.TLD]: "tld",
  [DFA_STATES.ACCEPT]: "accept",
  [DFA_STATES.TRAP]: "reject",
};

// ============================================================
// TRANSITION REASONS
// ============================================================

const TRANSITION_REASONS = {
  START_LOCAL:
    "The first valid character starts the local part of the email.",

  LOCAL_CHARACTER:
    "The character is valid inside the local part.",

  LOCAL_AT:
    "The @ separator marks the end of the local part.",

  AFTER_AT_DOMAIN:
    "A valid domain character begins the domain.",

  DOMAIN_CHARACTER:
    "The character is valid inside the domain.",

  DOMAIN_DOT:
    "The dot separates the domain from the top-level domain.",

  DOT_TLD:
    "A letter begins the top-level domain.",

  TLD_CHARACTER:
    "The character is valid inside the top-level domain.",

  INVALID:
    "No valid DFA transition exists for this character.",
};

// ============================================================
// EXECUTION RESULT FACTORY
// ============================================================

function createInitialExecution(email) {
  return {
    email,
    accepted: false,
    rejected: false,

    finalState: DFA_STATES.START,

    currentState: DFA_STATES.START,

    currentIndex: -1,

    currentCharacter: null,

    currentCharacterType: null,

    charactersProcessed: 0,

    totalCharacters: email.length,

    trace: [],

    transitions: [],

    errors: [],

    stateHistory: [DFA_STATES.START],

    phase: STATE_PHASES[DFA_STATES.START],

    completed: false,

    startedAt: Date.now(),

    completedAt: null,
  };
}

// ============================================================
// TRANSITION REASON GENERATOR
// ============================================================

function getTransitionReason(
  currentState,
  characterType,
  nextState,
) {
  if (
    currentState === DFA_STATES.START &&
    nextState === DFA_STATES.LOCAL_PART
  ) {
    return TRANSITION_REASONS.START_LOCAL;
  }

  if (
    currentState === DFA_STATES.LOCAL_PART &&
    nextState === DFA_STATES.LOCAL_PART
  ) {
    return TRANSITION_REASONS.LOCAL_CHARACTER;
  }

  if (
    currentState === DFA_STATES.LOCAL_PART &&
    characterType === CHARACTER_TYPES.AT &&
    nextState === DFA_STATES.AFTER_AT
  ) {
    return TRANSITION_REASONS.LOCAL_AT;
  }

  if (
    currentState === DFA_STATES.AFTER_AT &&
    nextState === DFA_STATES.DOMAIN
  ) {
    return TRANSITION_REASONS.AFTER_AT_DOMAIN;
  }

  if (
    currentState === DFA_STATES.DOMAIN &&
    nextState === DFA_STATES.DOMAIN
  ) {
    return TRANSITION_REASONS.DOMAIN_CHARACTER;
  }

  if (
    currentState === DFA_STATES.DOMAIN &&
    characterType === CHARACTER_TYPES.DOT &&
    nextState === DFA_STATES.AFTER_DOT
  ) {
    return TRANSITION_REASONS.DOMAIN_DOT;
  }

  if (
    currentState === DFA_STATES.AFTER_DOT &&
    nextState === DFA_STATES.TLD
  ) {
    return TRANSITION_REASONS.DOT_TLD;
  }

  if (
    currentState === DFA_STATES.TLD &&
    nextState === DFA_STATES.TLD
  ) {
    return TRANSITION_REASONS.TLD_CHARACTER;
  }

  return TRANSITION_REASONS.INVALID;
}

// ============================================================
// SINGLE CHARACTER TRANSITION
// ============================================================

/**
 * Processes one character through the DFA.
 *
 * @param {string} currentState
 * @param {string} character
 * @returns {object}
 */
export function transition(currentState, character) {
  const characterType = classifyCharacter(character);

  const stateTransitions = TRANSITIONS[currentState] ?? {};

  let nextState = stateTransitions[characterType];

  /**
   * Additional structural checks.
   *
   * These prevent transitions that are technically character-valid
   * but structurally invalid for an email address.
   */

  if (
    currentState === DFA_STATES.LOCAL_PART &&
    !isValidLocalPartCharacter(character) &&
    character !== "@"
  ) {
    nextState = undefined;
  }

  if (
    currentState === DFA_STATES.DOMAIN &&
    !isValidDomainCharacter(character) &&
    character !== "."
  ) {
    nextState = undefined;
  }

  if (!nextState) {
    nextState = DFA_STATES.TRAP;
  }

  const reason = getTransitionReason(
    currentState,
    characterType,
    nextState,
  );

  return {
    currentState,
    nextState,
    character,
    characterType,
    characterTypeLabel:
      CHARACTER_TYPE_LABELS[characterType] ?? "Unknown",
    reason,
    valid: nextState !== DFA_STATES.TRAP,
  };
}

// ============================================================
// COMPLETE DFA EXECUTION
// ============================================================

/**
 * Runs the DFA against an entire email.
 *
 * @param {string} email
 * @returns {object}
 */
export function runDFA(email) {
  const normalizedEmail =
    typeof email === "string" ? email.trim() : "";

  const execution = createInitialExecution(normalizedEmail);

  if (!normalizedEmail) {
    execution.rejected = true;
    execution.completed = true;
    execution.finalState = DFA_STATES.TRAP;
    execution.currentState = DFA_STATES.TRAP;
    execution.phase = STATE_PHASES[DFA_STATES.TRAP];
    execution.completedAt = Date.now();

    execution.errors.push({
      type: "EMPTY_INPUT",
      message: "Email address cannot be empty.",
    });

    return execution;
  }

  let currentState = DFA_STATES.START;

  for (let index = 0; index < normalizedEmail.length; index += 1) {
    const character = normalizedEmail[index];

    const result = transition(currentState, character);

    const traceEntry = {
      step: index + 1,

      index,

      character,

      displayCharacter:
        character === " "
          ? "␠"
          : character,

      characterType: result.characterType,

      characterTypeLabel: result.characterTypeLabel,

      fromState: currentState,

      toState: result.nextState,

      fromStateLabel: getStateLabel(currentState),

      toStateLabel: getStateLabel(result.nextState),

      reason: result.reason,

      valid: result.valid,

      phase: STATE_PHASES[result.nextState],
    };

    execution.trace.push(traceEntry);

    execution.transitions.push({
      step: index + 1,
      from: currentState,
      to: result.nextState,
      character,
      characterType: result.characterType,
      valid: result.valid,
    });

    execution.stateHistory.push(result.nextState);

    execution.currentIndex = index;

    execution.currentCharacter = character;

    execution.currentCharacterType = result.characterType;

    execution.charactersProcessed = index + 1;

    currentState = result.nextState;

    execution.currentState = currentState;

    execution.phase = STATE_PHASES[currentState];

    if (currentState === DFA_STATES.TRAP) {
      execution.rejected = true;

      execution.errors.push({
        type: "INVALID_TRANSITION",
        index,
        character,
        characterType: result.characterType,
        fromState: result.currentState,
        toState: DFA_STATES.TRAP,
        message: buildRejectionMessage(
          result.currentState,
          character,
          result.characterType,
        ),
      });

      break;
    }
  }

  execution.finalState = currentState;

  /**
   * The DFA only accepts if:
   *
   * 1. The entire input was consumed.
   * 2. The final structural state is TLD.
   *
   * We then move conceptually to qA.
   */
  if (
    execution.charactersProcessed === normalizedEmail.length &&
    currentState === DFA_STATES.TLD
  ) {
    currentState = DFA_STATES.ACCEPT;

    execution.currentState = DFA_STATES.ACCEPT;

    execution.finalState = DFA_STATES.ACCEPT;

    execution.phase = STATE_PHASES[DFA_STATES.ACCEPT];

    execution.stateHistory.push(DFA_STATES.ACCEPT);

    execution.accepted = true;

    execution.rejected = false;

    execution.trace.push({
      step: normalizedEmail.length + 1,

      index: normalizedEmail.length,

      character: null,

      displayCharacter: "END",

      characterType: "END",

      characterTypeLabel: "End of Input",

      fromState: DFA_STATES.TLD,

      toState: DFA_STATES.ACCEPT,

      fromStateLabel: getStateLabel(DFA_STATES.TLD),

      toStateLabel: getStateLabel(DFA_STATES.ACCEPT),

      reason:
        "The complete input was consumed and the TLD was successfully processed.",

      valid: true,

      phase: "accept",
    });
  } else if (!execution.rejected) {
    execution.rejected = true;

    execution.finalState = currentState;

    execution.errors.push({
      type: "INCOMPLETE_STRUCTURE",
      message: buildIncompleteStructureMessage(currentState),
    });
  }

  execution.completed = true;

  execution.completedAt = Date.now();

  return execution;
}

// ============================================================
// STEP-BY-STEP EXECUTION
// ============================================================

/**
 * Creates an empty step execution object.
 *
 * This is used by the UI's STEP MODE.
 *
 * @param {string} email
 * @returns {object}
 */
export function createStepExecution(email) {
  const normalizedEmail =
    typeof email === "string" ? email.trim() : "";

  return {
    email: normalizedEmail,

    currentState: DFA_STATES.START,

    finalState: DFA_STATES.START,

    currentIndex: -1,

    currentCharacter: null,

    currentCharacterType: null,

    charactersProcessed: 0,

    totalCharacters: normalizedEmail.length,

    trace: [],

    transitions: [],

    stateHistory: [DFA_STATES.START],

    accepted: false,

    rejected: false,

    completed: false,

    error: null,

    phase: STATE_PHASES[DFA_STATES.START],
  };
}

/**
 * Processes exactly one character.
 *
 * @param {object} execution
 * @returns {object}
 */
export function processNextStep(execution) {
  if (!execution) {
    throw new Error(
      "A valid DFA execution object is required.",
    );
  }

  if (execution.completed) {
    return execution;
  }

  if (!execution.email) {
    return {
      ...execution,

      completed: true,

      rejected: true,

      currentState: DFA_STATES.TRAP,

      finalState: DFA_STATES.TRAP,

      phase: STATE_PHASES[DFA_STATES.TRAP],

      error: "Email address cannot be empty.",
    };
  }

  const nextIndex = execution.currentIndex + 1;

  /**
   * All actual characters have already been processed.
   * Now determine whether the current state can accept.
   */
  if (nextIndex >= execution.email.length) {
    if (execution.currentState === DFA_STATES.TLD) {
      return {
        ...execution,

        currentState: DFA_STATES.ACCEPT,

        finalState: DFA_STATES.ACCEPT,

        accepted: true,

        rejected: false,

        completed: true,

        phase: STATE_PHASES[DFA_STATES.ACCEPT],

        stateHistory: [
          ...execution.stateHistory,
          DFA_STATES.ACCEPT,
        ],

        trace: [
          ...execution.trace,
          {
            step: execution.trace.length + 1,

            index: execution.email.length,

            character: null,

            displayCharacter: "END",

            characterType: "END",

            characterTypeLabel: "End of Input",

            fromState: DFA_STATES.TLD,

            toState: DFA_STATES.ACCEPT,

            fromStateLabel: getStateLabel(DFA_STATES.TLD),

            toStateLabel: getStateLabel(DFA_STATES.ACCEPT),

            reason:
              "The complete input was consumed and the TLD was successfully processed.",

            valid: true,

            phase: "accept",
          },
        ],
      };
    }

    return {
      ...execution,

      completed: true,

      rejected: true,

      finalState: execution.currentState,

      error: buildIncompleteStructureMessage(
        execution.currentState,
      ),
    };
  }

  const character = execution.email[nextIndex];

  const result = transition(
    execution.currentState,
    character,
  );

  const traceEntry = {
    step: nextIndex + 1,

    index: nextIndex,

    character,

    displayCharacter:
      character === " "
        ? "␠"
        : character,

    characterType: result.characterType,

    characterTypeLabel: result.characterTypeLabel,

    fromState: result.currentState,

    toState: result.nextState,

    fromStateLabel: getStateLabel(result.currentState),

    toStateLabel: getStateLabel(result.nextState),

    reason: result.reason,

    valid: result.valid,

    phase: STATE_PHASES[result.nextState],
  };

  const updatedTrace = [
    ...execution.trace,
    traceEntry,
  ];

  const updatedTransitions = [
    ...execution.transitions,
    {
      step: nextIndex + 1,
      from: result.currentState,
      to: result.nextState,
      character,
      characterType: result.characterType,
      valid: result.valid,
    },
  ];

  const updatedStateHistory = [
    ...execution.stateHistory,
    result.nextState,
  ];

  if (result.nextState === DFA_STATES.TRAP) {
    return {
      ...execution,

      currentState: DFA_STATES.TRAP,

      finalState: DFA_STATES.TRAP,

      currentIndex: nextIndex,

      currentCharacter: character,

      currentCharacterType: result.characterType,

      charactersProcessed: nextIndex + 1,

      trace: updatedTrace,

      transitions: updatedTransitions,

      stateHistory: updatedStateHistory,

      rejected: true,

      accepted: false,

      completed: true,

      phase: STATE_PHASES[DFA_STATES.TRAP],

      error: buildRejectionMessage(
        result.currentState,
        character,
        result.characterType,
      ),
    };
  }

  return {
    ...execution,

    currentState: result.nextState,

    finalState: result.nextState,

    currentIndex: nextIndex,

    currentCharacter: character,

    currentCharacterType: result.characterType,

    charactersProcessed: nextIndex + 1,

    trace: updatedTrace,

    transitions: updatedTransitions,

    stateHistory: updatedStateHistory,

    phase: STATE_PHASES[result.nextState],

    rejected: false,

    accepted: false,

    completed: false,

    error: null,
  };
}

// ============================================================
// ERROR MESSAGE GENERATORS
// ============================================================

function buildRejectionMessage(
  currentState,
  character,
  characterType,
) {
  const stateLabel = getStateLabel(currentState);

  const characterDisplay =
    character === " "
      ? "space"
      : `"${character}"`;

  return `Invalid transition from ${currentState} (${stateLabel}) with ${characterDisplay} [${characterType}].`;
}

function buildIncompleteStructureMessage(state) {
  switch (state) {
    case DFA_STATES.START:
      return "No local part was provided.";

    case DFA_STATES.LOCAL_PART:
      return "The local part must be followed by an @ separator.";

    case DFA_STATES.AFTER_AT:
      return "A domain must follow the @ separator.";

    case DFA_STATES.DOMAIN:
      return "The domain must contain a dot followed by a top-level domain.";

    case DFA_STATES.AFTER_DOT:
      return "A top-level domain must follow the domain separator.";

    case DFA_STATES.TLD:
      return "The input ended after a valid top-level domain.";

    default:
      return "The email structure is incomplete.";
  }
}

// ============================================================
// DFA INFORMATION HELPERS
// ============================================================

/**
 * Returns the complete transition table.
 */
export function getTransitionTable() {
  return TRANSITIONS;
}

/**
 * Returns transitions for one state.
 *
 * @param {string} state
 * @returns {object}
 */
export function getStateTransitions(state) {
  return TRANSITIONS[state] ?? {};
}

/**
 * Returns all DFA states.
 *
 * @returns {string[]}
 */
export function getAllStates() {
  return Object.values(DFA_STATES);
}

/**
 * Returns all accepting states.
 *
 * @returns {string[]}
 */
export function getAcceptingStates() {
  return [...ACCEPTING_STATES];
}

/**
 * Checks whether a state is accepting.
 *
 * @param {string} state
 * @returns {boolean}
 */
export function isAcceptingState(state) {
  return ACCEPTING_STATES.includes(state);
}

/**
 * Checks whether a state is the trap state.
 *
 * @param {string} state
 * @returns {boolean}
 */
export function isTrapState(state) {
  return state === DFA_STATES.TRAP;
}

/**
 * Returns the phase associated with a state.
 *
 * @param {string} state
 * @returns {string}
 */
export function getStatePhase(state) {
  return STATE_PHASES[state] ?? "unknown";
}

/**
 * Returns a readable description of the current DFA state.
 *
 * @param {string} state
 * @returns {string}
 */
export function getCurrentStateDetails(state) {
  return {
    state,

    label: getStateLabel(state),

    description: getStateDescription(state),

    phase: getStatePhase(state),

    accepting: isAcceptingState(state),

    trap: isTrapState(state),
  };
}

// ============================================================
// EXECUTION SUMMARY
// ============================================================

/**
 * Converts a complete DFA execution into a compact summary
 * for cards, dashboards and result components.
 *
 * @param {object} execution
 * @returns {object}
 */
export function getExecutionSummary(execution) {
  if (!execution) {
    return {
      status: "UNKNOWN",
      accepted: false,
      rejected: false,
      message: "No DFA execution available.",
    };
  }

  let status = "PROCESSING";

  if (execution.accepted) {
    status = "ACCEPTED";
  } else if (execution.rejected) {
    status = "REJECTED";
  } else if (execution.completed) {
    status = "REJECTED";
  }

  return {
    status,

    accepted: execution.accepted,

    rejected: execution.rejected,

    completed: execution.completed,

    email: execution.email,

    currentState: execution.currentState,

    finalState: execution.finalState,

    currentStateLabel:
      getStateLabel(execution.currentState),

    finalStateLabel:
      getStateLabel(execution.finalState),

    charactersProcessed:
      execution.charactersProcessed,

    totalCharacters:
      execution.totalCharacters,

    progress:
      execution.totalCharacters === 0
        ? 0
        : Math.round(
            (execution.charactersProcessed /
              execution.totalCharacters) *
              100,
          ),

    phase: execution.phase,

    error:
      execution.errors?.length > 0
        ? execution.errors[
            execution.errors.length - 1
          ].message
        : execution.error ?? null,
  };
}

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {
  runDFA,
  transition,
  createStepExecution,
  processNextStep,
  getTransitionTable,
  getStateTransitions,
  getAllStates,
  getAcceptingStates,
  isAcceptingState,
  isTrapState,
  getStatePhase,
  getCurrentStateDetails,
  getExecutionSummary,
};