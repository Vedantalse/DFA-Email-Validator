/**
 * Email DFA - Rule Definitions
 *
 * This file contains the fundamental character categories and
 * structural rules used by the DFA engine.
 *
 * The DFA itself is implemented separately in dfaEngine.js.
 */

// ------------------------------------------------------------
// CHARACTER CATEGORIES
// ------------------------------------------------------------

export const CHARACTER_TYPES = {
  LETTER: "LETTER",
  DIGIT: "DIGIT",
  AT: "AT",
  DOT: "DOT",
  UNDERSCORE: "UNDERSCORE",
  HYPHEN: "HYPHEN",
  OTHER: "OTHER",
};

// ------------------------------------------------------------
// EMAIL STRUCTURE
// ------------------------------------------------------------

export const EMAIL_STRUCTURE = {
  LOCAL_PART: "local-part",
  DOMAIN: "domain",
  TLD: "tld",
};

// ------------------------------------------------------------
// DFA STATES
// ------------------------------------------------------------

export const DFA_STATES = {
  START: "q0",
  LOCAL_PART: "q1",
  AFTER_AT: "q2",
  DOMAIN: "q3",
  AFTER_DOT: "q4",
  TLD: "q5",
  ACCEPT: "qA",
  TRAP: "qT",
};

// ------------------------------------------------------------
// STATE METADATA
// ------------------------------------------------------------

export const STATE_INFO = {
  [DFA_STATES.START]: {
    label: "Start",
    description: "Waiting for the first character of the email.",
    phase: "start",
  },

  [DFA_STATES.LOCAL_PART]: {
    label: "Local Part",
    description: "Reading the username/local part of the email.",
    phase: EMAIL_STRUCTURE.LOCAL_PART,
  },

  [DFA_STATES.AFTER_AT]: {
    label: "After @",
    description: "The @ separator has been successfully processed.",
    phase: "separator",
  },

  [DFA_STATES.DOMAIN]: {
    label: "Domain",
    description: "Reading the domain name.",
    phase: EMAIL_STRUCTURE.DOMAIN,
  },

  [DFA_STATES.AFTER_DOT]: {
    label: "After Dot",
    description: "A domain separator has been detected.",
    phase: "separator",
  },

  [DFA_STATES.TLD]: {
    label: "TLD",
    description: "Reading the top-level domain.",
    phase: EMAIL_STRUCTURE.TLD,
  },

  [DFA_STATES.ACCEPT]: {
    label: "Accept",
    description: "The email satisfies the defined DFA structure.",
    phase: "accept",
  },

  [DFA_STATES.TRAP]: {
    label: "Trap",
    description: "An invalid transition has occurred.",
    phase: "reject",
  },
};

// ------------------------------------------------------------
// ACCEPTING / SPECIAL STATES
// ------------------------------------------------------------

export const ACCEPTING_STATES = [DFA_STATES.ACCEPT];

export const SPECIAL_STATES = {
  INITIAL: DFA_STATES.START,
  ACCEPT: DFA_STATES.ACCEPT,
  TRAP: DFA_STATES.TRAP,
};

// ------------------------------------------------------------
// VALID CHARACTERS
// ------------------------------------------------------------

/**
 * Letters accepted by the DFA.
 *
 * We explicitly use ASCII letters because the project is
 * designed around a conventional email-address model.
 */
export const LETTER_REGEX = /^[A-Za-z]$/;

/**
 * Digits accepted by the DFA.
 */
export const DIGIT_REGEX = /^[0-9]$/;

/**
 * Characters allowed inside the local part.
 *
 * The simplified project grammar permits:
 * letters, digits, underscore, hyphen and dot.
 */
export const LOCAL_PART_SPECIAL_CHARACTERS = new Set([
  ".",
  "_",
  "-",
]);

/**
 * Characters allowed inside the domain.
 *
 * The simplified grammar permits:
 * letters, digits and hyphen.
 */
export const DOMAIN_SPECIAL_CHARACTERS = new Set([
  "-",
]);

// ------------------------------------------------------------
// CHARACTER CLASSIFICATION
// ------------------------------------------------------------

/**
 * Classifies one input character into a DFA category.
 *
 * @param {string} character
 * @returns {string}
 */
export function classifyCharacter(character) {
  if (!character || character.length !== 1) {
    return CHARACTER_TYPES.OTHER;
  }

  if (LETTER_REGEX.test(character)) {
    return CHARACTER_TYPES.LETTER;
  }

  if (DIGIT_REGEX.test(character)) {
    return CHARACTER_TYPES.DIGIT;
  }

  if (character === "@") {
    return CHARACTER_TYPES.AT;
  }

  if (character === ".") {
    return CHARACTER_TYPES.DOT;
  }

  if (character === "_") {
    return CHARACTER_TYPES.UNDERSCORE;
  }

  if (character === "-") {
    return CHARACTER_TYPES.HYPHEN;
  }

  return CHARACTER_TYPES.OTHER;
}

// ------------------------------------------------------------
// CATEGORY LABELS
// ------------------------------------------------------------

export const CHARACTER_TYPE_LABELS = {
  [CHARACTER_TYPES.LETTER]: "Letter",
  [CHARACTER_TYPES.DIGIT]: "Digit",
  [CHARACTER_TYPES.AT]: "@ Separator",
  [CHARACTER_TYPES.DOT]: "Dot",
  [CHARACTER_TYPES.UNDERSCORE]: "Underscore",
  [CHARACTER_TYPES.HYPHEN]: "Hyphen",
  [CHARACTER_TYPES.OTHER]: "Invalid Character",
};

// ------------------------------------------------------------
// EMAIL STRUCTURE DESCRIPTIONS
// ------------------------------------------------------------

export const STRUCTURE_DESCRIPTIONS = {
  [EMAIL_STRUCTURE.LOCAL_PART]:
    "The part before @ identifying the mailbox or user.",

  [EMAIL_STRUCTURE.DOMAIN]:
    "The domain identifying the mail service or organization.",

  [EMAIL_STRUCTURE.TLD]:
    "The final domain suffix such as com, org or in.",
};

// ------------------------------------------------------------
// DFA DESIGN NOTES
// ------------------------------------------------------------

export const DFA_DESCRIPTION =
  "A deterministic finite automaton that processes an email address character-by-character and accepts strings matching the defined email structure.";

export const EMAIL_GRAMMAR_DESCRIPTION =
  "local-part @ domain . tld";

// ------------------------------------------------------------
// VALIDATION LIMITS
// ------------------------------------------------------------

/**
 * These limits keep the application responsive and prevent
 * unreasonable input from entering the visualizer.
 */
export const VALIDATION_LIMITS = {
  MIN_LENGTH: 5,
  MAX_LENGTH: 254,

  MIN_LOCAL_LENGTH: 1,
  MAX_LOCAL_LENGTH: 64,

  MIN_DOMAIN_LENGTH: 1,
  MAX_DOMAIN_LENGTH: 253,

  MIN_TLD_LENGTH: 2,
  MAX_TLD_LENGTH: 63,
};

// ------------------------------------------------------------
// EXAMPLE EMAILS
// ------------------------------------------------------------

export const EXAMPLE_EMAILS = [
  {
    email: "student@gmail.com",
    expected: true,
    description: "Standard valid email",
  },

  {
    email: "john.doe@gmail.com",
    expected: true,
    description: "Valid email with a dot in local part",
  },

  {
    email: "user123@yahoo.co.in",
    expected: true,
    description: "Valid email with multi-level domain",
  },

  {
    email: "student@gmail",
    expected: false,
    description: "Missing top-level domain",
  },

  {
    email: "@gmail.com",
    expected: false,
    description: "Missing local part",
  },

  {
    email: "student@@gmail.com",
    expected: false,
    description: "Multiple @ symbols",
  },

  {
    email: "student gmail.com",
    expected: false,
    description: "Missing @ separator",
  },

  {
    email: "student@gmail.",
    expected: false,
    description: "Missing top-level domain",
  },
];

// ------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------

/**
 * Checks whether a character is a letter.
 *
 * @param {string} character
 * @returns {boolean}
 */
export function isLetter(character) {
  return LETTER_REGEX.test(character);
}

/**
 * Checks whether a character is a digit.
 *
 * @param {string} character
 * @returns {boolean}
 */
export function isDigit(character) {
  return DIGIT_REGEX.test(character);
}

/**
 * Checks whether a character can appear in the local part.
 *
 * @param {string} character
 * @returns {boolean}
 */
export function isValidLocalPartCharacter(character) {
  const type = classifyCharacter(character);

  return (
    type === CHARACTER_TYPES.LETTER ||
    type === CHARACTER_TYPES.DIGIT ||
    type === CHARACTER_TYPES.UNDERSCORE ||
    type === CHARACTER_TYPES.HYPHEN ||
    type === CHARACTER_TYPES.DOT
  );
}

/**
 * Checks whether a character can appear in the domain.
 *
 * @param {string} character
 * @returns {boolean}
 */
export function isValidDomainCharacter(character) {
  const type = classifyCharacter(character);

  return (
    type === CHARACTER_TYPES.LETTER ||
    type === CHARACTER_TYPES.DIGIT ||
    type === CHARACTER_TYPES.HYPHEN
  );
}

/**
 * Returns a human-readable name for a DFA state.
 *
 * @param {string} state
 * @returns {string}
 */
export function getStateLabel(state) {
  return STATE_INFO[state]?.label ?? "Unknown State";
}

/**
 * Returns a human-readable explanation for a DFA state.
 *
 * @param {string} state
 * @returns {string}
 */
export function getStateDescription(state) {
  return (
    STATE_INFO[state]?.description ??
    "The DFA is currently in an undefined state."
  );
}