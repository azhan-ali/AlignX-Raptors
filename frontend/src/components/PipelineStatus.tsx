"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PipelineStep {
  step: number;
  name: string;
  method: string;
  latency_ms: number;
  success: boolean;
  output_preview: string;
}

interface PipelineData {
  steps: PipelineStep[];
  total_latency_ms: number;
  llm_calls: number;
  model: string;
  tier: string;
  cost_usd: number;
  inference_location: string;
}

interface PipelineStatusProps {
  pipeline: PipelineData;
}

const STEP_ICONS = ["🧠", "🔍", "📡", "⚡", "🪞", "🤝"];

function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function PipelineStatus({ pipeline }: PipelineStatusProps) {
  return (
    <motion.section
      id="pipeline-section"
      className="max-w-4xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">⚙️</span>
        <h2 className="text-2xl md:text-3xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
          How Qwen 0.5B Worked for You
        </h2>
      </div>

      <div className="sketch-card">
        {/* Pipeline Summary Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 p-3 mb-5 rounded-lg"
          style={{ background: "var(--highlight-blue)", border: "1.5px dashed var(--marker-blue)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" style={{ fontFamily: "var(--font-handwritten)", color: "var(--marker-blue)" }}>
              🤖 {pipeline.model}
            </span>
            <span
              className="sketch-tag !text-xs !py-0.5 !px-2"
              style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}
            >
              {pipeline.tier}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>
            <span>⏱ Total: <strong style={{ color: "var(--ink-dark)" }}>{formatLatency(pipeline.total_latency_ms)}</strong></span>
            <span>🔁 LLM calls: <strong style={{ color: "var(--marker-blue)" }}>{pipeline.llm_calls}</strong></span>
            <span>💰 Cost: <strong style={{ color: "var(--marker-green)" }}>₹0.00</strong></span>
            <span>🏠 {pipeline.inference_location}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {pipeline.steps.map((step, idx) => (
            <motion.div
              key={step.step}
              className="flex items-start gap-4 p-3 rounded-lg"
              style={{ background: idx % 2 === 0 ? "rgba(255,255,255,0.4)" : "transparent" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              {/* Step icon + number */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                style={{
                  border: `2px ${step.success ? "solid" : "dashed"} ${step.success ? "var(--marker-green)" : "var(--marker-red)"}`,
                  background: step.success ? "rgba(119,181,160,0.1)" : "rgba(216,90,90,0.1)",
                }}
              >
                {STEP_ICONS[idx] ?? "⚡"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--ink-dark)" }}>
                    Step {step.step}: {step.name}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: step.success ? "rgba(119,181,160,0.2)" : "rgba(216,90,90,0.2)",
                      color: step.success ? "var(--marker-green)" : "var(--marker-red)",
                      fontFamily: "var(--font-alt)",
                    }}
                  >
                    {step.success ? "✓ OK" : "✗ Fallback"}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  🔧 {step.method}
                </p>
                <p className="text-xs mt-0.5 italic" style={{ fontFamily: "var(--font-alt)", color: "var(--ink-light)" }}>
                  → {step.output_preview}
                </p>
              </div>

              {/* Latency */}
              <div className="text-right flex-shrink-0">
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-handwritten)",
                    color: step.latency_ms < 500 ? "var(--marker-green)" : step.latency_ms < 3000 ? "var(--marker-orange)" : "var(--marker-red)",
                  }}
                >
                  {formatLatency(step.latency_ms)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note for judges */}
        <div className="mt-4 pt-3 text-center" style={{ borderTop: "1.5px dashed var(--paper-lines)" }}>
          <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            💡 All LLM inference runs locally on your machine via Ollama — no cloud, no cost, no rate limits.
            Qwen 2.5 0.5B is a <strong>500M parameter model</strong> running {pipeline.llm_calls} times per request.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
