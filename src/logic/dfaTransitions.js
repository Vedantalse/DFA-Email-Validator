import { Position } from "@xyflow/react";

import {
  DFA_STATES,
  STATE_INFO,
} from "./emailRules";

/* =========================================================
   Node Configuration
   ========================================================= */

const NODE_WIDTH = 150;
const NODE_HEIGHT = 72;

const NODE_STYLE = {
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
};

/* =========================================================
   State Nodes
   ========================================================= */

const STATE_POSITIONS = {
  [DFA_STATES.START]: {
    x: 0,
    y: 180,
  },

  [DFA_STATES.LOCAL_PART]: {
    x: 220,
    y: 180,
  },

  [DFA_STATES.AFTER_AT]: {
    x: 440,
    y: 180,
  },

  [DFA_STATES.DOMAIN]: {
    x: 660,
    y: 180,
  },

  [DFA_STATES.AFTER_DOT]: {
    x: 880,
    y: 180,
  },

  [DFA_STATES.TLD]: {
    x: 1100,
    y: 180,
  },

  [DFA_STATES.ACCEPT]: {
    x: 1320,
    y: 180,
  },

  [DFA_STATES.TRAP]: {
    x: 660,
    y: 400,
  },
};

/* =========================================================
   Create State Node
   ========================================================= */

function createStateNode(state) {
  const info = STATE_INFO[state];

  const isAccept =
    state === DFA_STATES.ACCEPT;

  const isTrap =
    state === DFA_STATES.TRAP;

  const isStart =
    state === DFA_STATES.START;

  return {
    id: state,

    type: "dfa",

    position:
      STATE_POSITIONS[state] ?? {
        x: 0,
        y: 0,
      },

    sourcePosition: Position.Right,

    targetPosition: Position.Left,

    data: {
      state,
      label: info?.label ?? state,
      description:
        info?.description ?? "",

      isAccept,
      isTrap,
      isStart,

      active: false,
    },

    style: NODE_STYLE,
  };
}

/* =========================================================
   Edge Configuration
   ========================================================= */

function createEdge({
  id,
  source,
  target,
  label,
  transitionType = "normal",
}) {
  return {
    id,

    source,

    target,

    type: "dfa",

    label,

    data: {
      source,
      target,
      label,
      transitionType,
      active: false,
    },

    animated: false,

    sourceHandle: null,
    targetHandle: null,
  };
}

/* =========================================================
   Graph Data
   ========================================================= */

export function createGraphData() {
  const nodes = [
    createStateNode(DFA_STATES.START),

    createStateNode(
      DFA_STATES.LOCAL_PART
    ),

    createStateNode(
      DFA_STATES.AFTER_AT
    ),

    createStateNode(
      DFA_STATES.DOMAIN
    ),

    createStateNode(
      DFA_STATES.AFTER_DOT
    ),

    createStateNode(
      DFA_STATES.TLD
    ),

    createStateNode(
      DFA_STATES.ACCEPT
    ),

    createStateNode(
      DFA_STATES.TRAP
    ),
  ];

  const edges = [
    /* -----------------------------------------
       q0 → q1
       ----------------------------------------- */

    createEdge({
      id: "q0-q1",
      source: DFA_STATES.START,
      target: DFA_STATES.LOCAL_PART,
      label: "letter / digit",
    }),

    /* -----------------------------------------
       q1 → q1
       ----------------------------------------- */

    createEdge({
      id: "q1-q1",
      source: DFA_STATES.LOCAL_PART,
      target: DFA_STATES.LOCAL_PART,
      label: "letter / digit / _ / - / .",
      transitionType: "self",
    }),

    /* -----------------------------------------
       q1 → q2
       ----------------------------------------- */

    createEdge({
      id: "q1-q2",
      source: DFA_STATES.LOCAL_PART,
      target: DFA_STATES.AFTER_AT,
      label: "@",
    }),

    /* -----------------------------------------
       q2 → q3
       ----------------------------------------- */

    createEdge({
      id: "q2-q3",
      source: DFA_STATES.AFTER_AT,
      target: DFA_STATES.DOMAIN,
      label: "letter",
    }),

    /* -----------------------------------------
       q3 → q3
       ----------------------------------------- */

    createEdge({
      id: "q3-q3",
      source: DFA_STATES.DOMAIN,
      target: DFA_STATES.DOMAIN,
      label: "letter / digit / -",
      transitionType: "self",
    }),

    /* -----------------------------------------
       q3 → q4
       ----------------------------------------- */

    createEdge({
      id: "q3-q4",
      source: DFA_STATES.DOMAIN,
      target: DFA_STATES.AFTER_DOT,
      label: ".",
    }),

    /* -----------------------------------------
       q4 → q5
       ----------------------------------------- */

    createEdge({
      id: "q4-q5",
      source: DFA_STATES.AFTER_DOT,
      target: DFA_STATES.TLD,
      label: "letter",
    }),

    /* -----------------------------------------
       q5 → q5
       ----------------------------------------- */

    createEdge({
      id: "q5-q5",
      source: DFA_STATES.TLD,
      target: DFA_STATES.TLD,
      label: "letter",
      transitionType: "self",
    }),

    /* -----------------------------------------
       q5 → qA
       ----------------------------------------- */

    createEdge({
      id: "q5-qA",
      source: DFA_STATES.TLD,
      target: DFA_STATES.ACCEPT,
      label: "END",
      transitionType: "accept",
    }),

    /* -----------------------------------------
       qT → qT
       ----------------------------------------- */

    createEdge({
      id: "qT-qT",
      source: DFA_STATES.TRAP,
      target: DFA_STATES.TRAP,
      label: "INVALID",
      transitionType: "trap",
    }),
  ];

  return {
    nodes,
    edges,
  };
}

/* =========================================================
   Edge Helpers
   ========================================================= */

export function getEdgeId(
  source,
  target
) {
  return `${source}-${target}`;
}

export function findGraphEdge(
  edges,
  source,
  target
) {
  return edges.find(
    (edge) =>
      edge.source === source &&
      edge.target === target
  );
}

/* =========================================================
   Active Graph State
   ========================================================= */

export function updateGraphState(
  graph,
  currentState,
  activeTransition = null
) {
  const nodes = graph.nodes.map(
    (node) => ({
      ...node,

      data: {
        ...node.data,

        active:
          node.id === currentState,
      },
    })
  );

  const edges = graph.edges.map(
    (edge) => {
      const isActive =
        activeTransition &&
        edge.source ===
          activeTransition.from &&
        edge.target ===
          activeTransition.to;

      return {
        ...edge,

        animated: Boolean(isActive),

        data: {
          ...edge.data,

          active: Boolean(isActive),
        },
      };
    }
  );

  return {
    nodes,
    edges,
  };
}

/* =========================================================
   Default Export
   ========================================================= */

export default {
  createGraphData,
  getEdgeId,
  findGraphEdge,
  updateGraphState,
};