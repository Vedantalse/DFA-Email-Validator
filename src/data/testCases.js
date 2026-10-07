/**
 * Finite Automata Email Lab
 * Test Case Dataset
 *
 * These test cases are used throughout the application for:
 * - Quick testing
 * - Demonstration
 * - Validation checks
 * - DFA execution
 * - Result explanations
 * - UI test-case cards
 */

// ============================================================
// TEST CASE CATEGORIES
// ============================================================

export const TEST_CASE_CATEGORIES = {
  VALID: "valid",
  INVALID: "invalid",
  EDGE: "edge",
};

// ============================================================
// TEST CASE DATA
// ============================================================

export const TEST_CASES = [
  // ----------------------------------------------------------
  // VALID EMAILS
  // ----------------------------------------------------------

  {
    id: "valid-001",
    email: "student@gmail.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Basic",
    title: "Standard Email",
    description:
      "A conventional email containing a local part, domain and TLD.",
    reason:
      "The input follows the complete local-part @ domain . TLD structure.",
  },

  {
    id: "valid-002",
    email: "john.doe@gmail.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Basic",
    title: "Dotted Local Part",
    description:
      "A valid local part containing a dot.",
    reason:
      "The dot is allowed inside the local part before the @ separator.",
  },

  {
    id: "valid-003",
    email: "student123@gmail.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Basic",
    title: "Alphanumeric Local Part",
    description:
      "A local part containing both letters and digits.",
    reason:
      "Letters and digits are accepted while processing the local part.",
  },

  {
    id: "valid-004",
    email: "user_name@gmail.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Intermediate",
    title: "Underscore Local Part",
    description:
      "A local part containing an underscore.",
    reason:
      "The simplified DFA permits underscores inside the local part.",
  },

  {
    id: "valid-005",
    email: "user-name@gmail.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Intermediate",
    title: "Hyphen Local Part",
    description:
      "A local part containing a hyphen.",
    reason:
      "The simplified DFA permits hyphens inside the local part.",
  },

  {
    id: "valid-006",
    email: "user123@yahoo.co.in",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Intermediate",
    title: "Multi-Level Domain",
    description:
      "A domain containing multiple dot-separated levels.",
    reason:
      "The DFA can process a domain followed by a TLD structure.",
  },

  {
    id: "valid-007",
    email: "dev.team@company.org",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Intermediate",
    title: "Organization Email",
    description:
      "A realistic organization-style email address.",
    reason:
      "The complete input reaches the accepting state.",
  },

  {
    id: "valid-008",
    email: "user123@domain123.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.VALID,
    difficulty: "Intermediate",
    title: "Numeric Domain",
    description:
      "A domain containing digits.",
    reason:
      "Digits are valid inside the domain according to the simplified DFA.",
  },

  // ----------------------------------------------------------
  // INVALID EMAILS
  // ----------------------------------------------------------

  {
    id: "invalid-001",
    email: "student@gmail",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Basic",
    title: "Missing TLD",
    description:
      "The domain does not contain a final dot and TLD.",
    reason:
      "The DFA finishes in the domain state instead of reaching acceptance.",
  },

  {
    id: "invalid-002",
    email: "@gmail.com",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Basic",
    title: "Missing Local Part",
    description:
      "The email begins directly with the @ separator.",
    reason:
      "The DFA cannot transition from the start state directly to @.",
  },

  {
    id: "invalid-003",
    email: "student@@gmail.com",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Basic",
    title: "Multiple @ Symbols",
    description:
      "The email contains more than one @ separator.",
    reason:
      "The second @ has no valid transition from the domain state.",
  },

  {
    id: "invalid-004",
    email: "student gmail.com",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Basic",
    title: "Missing @",
    description:
      "A space appears where the @ separator is required.",
    reason:
      "A space is not a valid local-part transition.",
  },

  {
    id: "invalid-005",
    email: "student@gmail.",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Basic",
    title: "Empty TLD",
    description:
      "The domain separator is present but no TLD follows it.",
    reason:
      "The input ends in the after-dot state rather than an accepting state.",
  },

  {
    id: "invalid-006",
    email: "student@.com",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Intermediate",
    title: "Empty Domain",
    description:
      "A dot appears immediately after the @ separator.",
    reason:
      "The DFA requires a valid domain character before the domain separator.",
  },

  {
    id: "invalid-007",
    email: "student@domain.",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Intermediate",
    title: "Incomplete Domain",
    description:
      "The domain exists but the TLD is missing.",
    reason:
      "The DFA reaches the after-dot state and the input ends.",
  },

  {
    id: "invalid-008",
    email: "student!@gmail.com",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Intermediate",
    title: "Unsupported Character",
    description:
      "An unsupported character appears in the local part.",
    reason:
      "The character has no valid DFA transition.",
  },

  {
    id: "invalid-009",
    email: "student@gmail_com",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Intermediate",
    title: "Invalid Domain Separator",
    description:
      "An underscore appears inside the domain.",
    reason:
      "The simplified DFA does not permit underscores in the domain.",
  },

  {
    id: "invalid-010",
    email: "student@-gmail.com",
    expected: false,
    category: TEST_CASE_CATEGORIES.INVALID,
    difficulty: "Intermediate",
    title: "Invalid Domain Start",
    description:
      "The domain begins with a hyphen.",
    reason:
      "The simplified domain model expects a letter after the @ separator.",
  },

  // ----------------------------------------------------------
  // EDGE CASES
  // ----------------------------------------------------------

  {
    id: "edge-001",
    email: "",
    expected: false,
    category: TEST_CASE_CATEGORIES.EDGE,
    difficulty: "Basic",
    title: "Empty Input",
    description:
      "No email address is provided.",
    reason:
      "The DFA cannot process an empty input as a valid email.",
  },

  {
    id: "edge-002",
    email: "a@b.co",
    expected: true,
    category: TEST_CASE_CATEGORIES.EDGE,
    difficulty: "Advanced",
    title: "Minimal Valid Structure",
    description:
      "A compact email satisfying the minimum structural pattern.",
    reason:
      "The DFA reaches the TLD state and accepts after end-of-input.",
  },

  {
    id: "edge-003",
    email: "123@gmail.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.EDGE,
    difficulty: "Intermediate",
    title: "Numeric Local Part",
    description:
      "The local part consists entirely of digits.",
    reason:
      "Digits are permitted in the local part by the simplified DFA.",
  },

  {
    id: "edge-004",
    email: "abc@123.com",
    expected: true,
    category: TEST_CASE_CATEGORIES.EDGE,
    difficulty: "Intermediate",
    title: "Numeric Domain",
    description:
      "The domain contains numeric characters.",
    reason:
      "Digits are accepted while the DFA is processing the domain.",
  },

  {
    id: "edge-005",
    email: "abc@@",
    expected: false,
    category: TEST_CASE_CATEGORIES.EDGE,
    difficulty: "Basic",
    title: "Repeated Separator",
    description:
      "Multiple structural errors occur in the same input.",
    reason:
      "The second @ cannot be processed from the after-at state.",
  },

  {
    id: "edge-006",
    email: "abc",
    expected: false,
    category: TEST_CASE_CATEGORIES.EDGE,
    difficulty: "Basic",
    title: "Local Part Only",
    description:
      "The input contains only a local part.",
    reason:
      "The required @ separator and domain are missing.",
  },
];

// ============================================================
// FILTER HELPERS
// ============================================================

/**
 * Returns every test case.
 *
 * @returns {Array}
 */
export function getAllTestCases() {
  return [...TEST_CASES];
}

/**
 * Returns only valid test cases.
 *
 * @returns {Array}
 */
export function getValidTestCases() {
  return TEST_CASES.filter(
    (testCase) =>
      testCase.expected === true,
  );
}

/**
 * Returns only invalid test cases.
 *
 * @returns {Array}
 */
export function getInvalidTestCases() {
  return TEST_CASES.filter(
    (testCase) =>
      testCase.expected === false,
  );
}

/**
 * Returns only edge cases.
 *
 * @returns {Array}
 */
export function getEdgeTestCases() {
  return TEST_CASES.filter(
    (testCase) =>
      testCase.category ===
      TEST_CASE_CATEGORIES.EDGE,
  );
}

/**
 * Finds a test case by ID.
 *
 * @param {string} id
 * @returns {object|undefined}
 */
export function getTestCaseById(id) {
  return TEST_CASES.find(
    (testCase) =>
      testCase.id === id,
  );
}

/**
 * Finds a test case by email.
 *
 * @param {string} email
 * @returns {object|undefined}
 */
export function getTestCaseByEmail(email) {
  return TEST_CASES.find(
    (testCase) =>
      testCase.email === email,
  );
}

/**
 * Returns test cases from a specific category.
 *
 * @param {string} category
 * @returns {Array}
 */
export function getTestCasesByCategory(category) {
  return TEST_CASES.filter(
    (testCase) =>
      testCase.category === category,
  );
}

/**
 * Returns test cases from a specific difficulty.
 *
 * @param {string} difficulty
 * @returns {Array}
 */
export function getTestCasesByDifficulty(
  difficulty,
) {
  return TEST_CASES.filter(
    (testCase) =>
      testCase.difficulty === difficulty,
  );
}

// ============================================================
// TEST CASE STATISTICS
// ============================================================

/**
 * Calculates dataset statistics.
 *
 * @returns {object}
 */
export function getTestCaseStatistics() {
  const total = TEST_CASES.length;

  const valid = TEST_CASES.filter(
    (testCase) =>
      testCase.expected === true,
  ).length;

  const invalid = TEST_CASES.filter(
    (testCase) =>
      testCase.expected === false,
  ).length;

  const edge = TEST_CASES.filter(
    (testCase) =>
      testCase.category ===
      TEST_CASE_CATEGORIES.EDGE,
  ).length;

  return {
    total,
    valid,
    invalid,
    edge,

    expectedAcceptanceRate:
      total === 0
        ? 0
        : Math.round(
            (valid / total) * 100,
          ),
  };
}

// ============================================================
// DEMONSTRATION CASES
// ============================================================

/**
 * These are the two primary cases we will use later
 * for the notebook/presentation explanation.
 */
export const DEMONSTRATION_CASES = {
  valid: {
    id: "valid-001",
    email: "student@gmail.com",
  },

  invalid: {
    id: "invalid-001",
    email: "student@gmail",
  },
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default TEST_CASES;