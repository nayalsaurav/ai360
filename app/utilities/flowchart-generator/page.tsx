"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  Connection,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import "@xyflow/react/dist/style.css";

export default function FlowchartGenerator() {
  const [prompt, setPrompt] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((ns) => applyNodeChanges(changes, ns)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((es) => applyEdgeChanges(changes, es)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((es) => addEdge(params, es)),
    []
  );

  async function generateFlowchart() {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/utilities/flowchart-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Failed to generate flowchart");

      const data = await res.json();

      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-[90vh] flex flex-col bg-gray-100 dark:bg-neutral-900">
      {/* Header */}
      <div className="w-full p-4 border-b bg-white dark:bg-black flex gap-3 items-center shadow-sm">
        <h1 className="text-lg font-semibold dark:text-white">
          Flowchart Builder
        </h1>

        <Input
          placeholder="Describe your process…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          className="max-w-md"
        />

        <Button onClick={generateFlowchart} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
            </>
          ) : (
            "Generate"
          )}
        </Button>

        <div className="ml-auto flex gap-2">
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setNodes([]);
              setEdges([]);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Error UI */}
      {error && (
        <div className="bg-red-500/10 text-red-600 text-center py-2">
          {error}
        </div>
      )}

      {/* Canvas */}
      <div className="flex-1 relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
              <p className="text-white text-sm">Generating Flowchart…</p>
            </div>
          </div>
        )}

        {/* Flowchart */}
        <div
          className={`h-full transition-opacity duration-300 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
