// ============================================================================
// End-to-End Pipeline Test — run CLI on spriteintro, verify all outputs
// ============================================================================

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const fixtureDir = resolve(projectRoot, "../test/spriteintro-output");
const outputDir = resolve(projectRoot, "../test/re-output");

describe("End-to-End Pipeline — spriteintro", () => {
  beforeAll(() => {
    // Clean output directory
    if (existsSync(outputDir)) rmSync(outputDir, { recursive: true });
    mkdirSync(outputDir, { recursive: true });

    // Run the full pipeline (strip OPENAI_API_KEY to use heuristic mode in tests)
    const env = { ...process.env };
    delete env.OPENAI_API_KEY;
    execSync(
      `npx tsx src/index.ts ${resolve(fixtureDir, "blocks.json")} -o ${outputDir}`,
      { cwd: projectRoot, timeout: 30000, stdio: "pipe", env },
    );
  });

  afterAll(() => {
    // Clean up
    if (existsSync(outputDir)) rmSync(outputDir, { recursive: true });
  });

  it("should produce blocks.json with pipelineState", () => {
    const path = resolve(outputDir, "blocks.json");
    expect(existsSync(path)).toBe(true);
    const data = JSON.parse(readFileSync(path, "utf8"));
    expect(data.blocks.length).toBeGreaterThan(0);
    // Every block should have pipelineState
    for (const block of data.blocks) {
      expect(block.pipelineState).toBeDefined();
      expect(block.pipelineState.reverseEngineered).toBe(true);
    }
  });

  it("should produce dependency_tree.json", () => {
    const path = resolve(outputDir, "dependency_tree.json");
    expect(existsSync(path)).toBe(true);
    const data = JSON.parse(readFileSync(path, "utf8"));
    expect(data.nodes).toBeDefined();
    expect(data.edges).toBeDefined();
  });

  it("should produce variable_map.json", () => {
    const path = resolve(outputDir, "variable_map.json");
    expect(existsSync(path)).toBe(true);
    const data = JSON.parse(readFileSync(path, "utf8"));
    expect(data.metadata).toBeDefined();
    expect(data.metadata.source).toBe("stage2");
  });

  it("should produce integration.json", () => {
    const path = resolve(outputDir, "integration.json");
    expect(existsSync(path)).toBe(true);
    const data = JSON.parse(readFileSync(path, "utf8"));
    expect(data.program).toBeDefined();
    expect(data.files).toBeDefined();
    expect(data.deadCode).toBeDefined();
  });

  it("should produce pipeline_state.json with all stages completed", () => {
    const path = resolve(outputDir, "pipeline_state.json");
    expect(existsSync(path)).toBe(true);
    const data = JSON.parse(readFileSync(path, "utf8"));
    expect(data.stages.stage1_enrichment.status).toBe("completed");
    expect(data.stages.stage2_ai_enrichment.status).toBe("completed");
    expect(data.stages.stage3_reverse_engineering.status).toBe("completed");
    expect(data.stages.stage4_integration.status).toBe("completed");
  });

  it("should support --from/--to stage filtering", () => {
    // Run only Stage 1
    const stage1Output = resolve(outputDir, "stage1-only");
    mkdirSync(stage1Output, { recursive: true });
    execSync(
      `npx tsx src/index.ts ${resolve(fixtureDir, "blocks.json")} -o ${stage1Output} --to stage1`,
      { cwd: projectRoot, timeout: 30000, stdio: "pipe" },
    );
    const state = JSON.parse(readFileSync(resolve(stage1Output, "pipeline_state.json"), "utf8"));
    expect(state.stages.stage1_enrichment.status).toBe("completed");
    expect(state.stages.stage2_ai_enrichment).toBeUndefined();
    rmSync(stage1Output, { recursive: true });
  });
});
