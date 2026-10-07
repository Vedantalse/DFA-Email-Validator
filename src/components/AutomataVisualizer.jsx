import { useEffect, useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
} from "@xyflow/react";
import { motion } from "framer-motion";

import "@xyflow/react/dist/style.css";

import {
  createGraphData,
} from "../logic/dfaTransitions";

function DFANode({ data }) {
  const {
    state,
    label,
    description,
    isAccept,
    isTrap,
    active,
  } = data;

  return (
    <div
      className={`relative flex h-[82px] min-w-[150px] flex-col justify-center rounded-xl border-2 px-4 transition-all duration-200 ${
        active
          ? "border-white bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.12)]"
          : isTrap
            ? "border-[#703838] bg-[#241414] text-white"
            : isAccept
              ? "border-[#467458] bg-[#132018] text-white"
              : "border-[#383838] bg-[#181818] text-white"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-white"
      />

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-white"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-lg font-bold">
          {state}
        </span>

        {isAccept && (
          <span className="text-xs font-bold">
            FINAL
          </span>
        )}

        {isTrap && (
          <span className="text-xs font-bold">
            TRAP
          </span>
        )}
      </div>

      <span
        className={`mt-1 text-xs font-semibold ${
          active ? "text-black/70" : "text-[#aaa]"
        }`}
      >
        {label}
      </span>

      {description && (
        <span
          className={`mt-0.5 text-[10px] ${
            active ? "text-black/60" : "text-[#666]"
          }`}
        >
          {description}
        </span>
      )}
    </div>
  );
}

const nodeTypes = {
  dfa: DFANode,
};

function AutomataVisualizer({
  analysis,
  isProcessing = false,
}) {
  const initialGraph = useMemo(
    () => createGraphData(),
    []
  );

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialGraph.nodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialGraph.edges);

  const currentState =
    analysis?.execution?.currentState;

  const activeTransition =
    analysis?.execution?.activeTransition;

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          active:
            node.id === currentState,
        },
      }))
    );

    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        animated:
          Boolean(activeTransition) &&
          edge.source ===
            activeTransition?.from &&
          edge.target ===
            activeTransition?.to,
        style: {
          stroke:
            Boolean(activeTransition) &&
            edge.source ===
              activeTransition?.from &&
            edge.target ===
              activeTransition?.to
              ? "#ffffff"
              : "#555555",
          strokeWidth:
            Boolean(activeTransition) &&
            edge.source ===
              activeTransition?.from &&
            edge.target ===
              activeTransition?.to
              ? 3
              : 1.5,
        },
      }))
    );
  }, [
    currentState,
    activeTransition,
    setNodes,
    setEdges,
  ]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="lab-surface overflow-hidden"
    >
      <div className="flex flex-col gap-2 border-b border-[#292929] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="lab-label">
            Automaton
          </p>

          <h2 className="mt-1 text-xl font-bold">
            DFA Visualizer
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#777]">
            Current state
          </span>

          <span className="rounded-lg border border-[#363636] bg-[#181818] px-3 py-1.5 font-mono text-sm font-bold text-white">
            {currentState ?? "q0"}
          </span>

          {isProcessing && (
            <span className="text-xs font-semibold text-white">
              EXECUTING
            </span>
          )}
        </div>
      </div>

      <div className="h-[540px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
          minZoom={0.5}
          maxZoom={1.5}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background
            gap={24}
            size={1}
            color="#252525"
          />

          <Controls />

          <MiniMap
            nodeColor={(node) =>
              node.data?.active
                ? "#ffffff"
                : "#444444"
            }
          />
        </ReactFlow>
      </div>

      <div className="grid border-t border-[#292929] sm:grid-cols-4">
        <LegendItem
          title="Start"
          value="q0"
        />

        <LegendItem
          title="Working"
          value="q1 → q5"
        />

        <LegendItem
          title="Accept"
          value="qA"
        />

        <LegendItem
          title="Trap"
          value="qT"
        />
      </div>
    </motion.section>
  );
}

function LegendItem({ title, value }) {
  return (
    <div className="border-b border-[#292929] p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#666]">
        {title}
      </p>

      <p className="mt-1 font-mono text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

export default AutomataVisualizer;