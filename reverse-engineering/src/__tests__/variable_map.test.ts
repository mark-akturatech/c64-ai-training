import { describe, it, expect } from "vitest";
import { VariableMap } from "../variable_map.js";

describe("VariableMap", () => {
  it("creates empty map", () => {
    const vm = new VariableMap();
    expect(vm.size).toBe(0);
    expect(vm.has("FB")).toBe(false);
  });

  it("set and get variable entry", () => {
    const vm = new VariableMap();
    vm.set("FB", {
      address: 0xFB,
      currentName: "sprite_index",
      nameHistory: [],
      usedBy: ["sub_C000"],
      usageContexts: [{
        blockId: "sub_C000",
        name: "sprite_index",
        usage: "read_write",
        confidence: 0.8,
        source: "stage2",
      }],
      scope: "local",
      type: "counter",
    });

    expect(vm.has("FB")).toBe(true);
    expect(vm.get("FB")?.currentName).toBe("sprite_index");
    expect(vm.size).toBe(1);
  });

  it("addUsageContext adds to existing variable", () => {
    const vm = new VariableMap();
    vm.set("FB", {
      address: 0xFB,
      currentName: "temp",
      nameHistory: [],
      usedBy: ["sub_C000"],
      usageContexts: [{
        blockId: "sub_C000",
        name: "temp",
        usage: "write",
        confidence: 0.5,
        source: "stage2",
      }],
      scope: "local",
    });

    vm.addUsageContext("FB", {
      blockId: "sub_D000",
      name: "frame_counter",
      usage: "read_write",
      confidence: 0.9,
      source: "stage2",
    });

    const entry = vm.get("FB")!;
    expect(entry.usageContexts.length).toBe(2);
    expect(entry.usedBy).toContain("sub_D000");
  });

  it("addUsageContext updates existing context if higher confidence", () => {
    const vm = new VariableMap();
    vm.set("FB", {
      address: 0xFB,
      currentName: "temp",
      nameHistory: [],
      usedBy: ["sub_C000"],
      usageContexts: [{
        blockId: "sub_C000",
        name: "temp",
        usage: "write",
        confidence: 0.5,
        source: "stage2",
      }],
      scope: "local",
    });

    vm.addUsageContext("FB", {
      blockId: "sub_C000",
      name: "sprite_index",
      usage: "read_write",
      confidence: 0.9,
      source: "stage3",
    });

    const entry = vm.get("FB")!;
    expect(entry.usageContexts.length).toBe(1); // same block, updated
    expect(entry.usageContexts[0].name).toBe("sprite_index");
    expect(entry.usageContexts[0].confidence).toBe(0.9);
  });

  it("recordNameChange updates name and history", () => {
    const vm = new VariableMap();
    vm.set("FB", {
      address: 0xFB,
      currentName: "temp",
      nameHistory: [],
      usedBy: [],
      usageContexts: [],
      scope: "local",
    });

    vm.recordNameChange("FB", {
      from: "temp",
      to: "sprite_index",
      reason: "identified as loop counter 0-7",
      source: "sub_C000",
      timestamp: new Date().toISOString(),
    });

    const entry = vm.get("FB")!;
    expect(entry.currentName).toBe("sprite_index");
    expect(entry.nameHistory.length).toBe(1);
    expect(entry.nameHistory[0].from).toBe("temp");
    expect(entry.nameHistory[0].to).toBe("sprite_index");
  });

  it("mergeStage3 adds context and updates name for high confidence", () => {
    const vm = new VariableMap();
    vm.set("FC", {
      address: 0xFC,
      currentName: "temp_zp_1",
      nameHistory: [],
      usedBy: [],
      usageContexts: [],
      scope: "local",
    });

    vm.mergeStage3("FC", "table_ptr_lo", "sub_C000", 0.95);

    const entry = vm.get("FC")!;
    expect(entry.currentName).toBe("table_ptr_lo");
    expect(entry.usageContexts.length).toBe(1);
    expect(entry.usageContexts[0].source).toBe("stage3");
  });

  it("toJSON and fromJSON round-trip", () => {
    const vm = new VariableMap("test");
    vm.set("FB", {
      address: 0xFB,
      currentName: "sprite_index",
      nameHistory: [],
      usedBy: ["sub_C000"],
      usageContexts: [{
        blockId: "sub_C000",
        name: "sprite_index",
        usage: "read_write",
        confidence: 0.8,
        source: "stage2",
      }],
      scope: "local",
      type: "counter",
    });

    const json = vm.toJSON();
    const restored = VariableMap.fromJSON(json);

    expect(restored.get("FB")?.currentName).toBe("sprite_index");
    expect(restored.size).toBe(1);
  });

  it("entries returns all entries", () => {
    const vm = new VariableMap();
    vm.set("FB", {
      address: 0xFB,
      currentName: "a",
      nameHistory: [],
      usedBy: [],
      usageContexts: [],
      scope: "local",
    });
    vm.set("FC", {
      address: 0xFC,
      currentName: "b",
      nameHistory: [],
      usedBy: [],
      usageContexts: [],
      scope: "local",
    });

    const entries = vm.entries();
    expect(entries.length).toBe(2);
  });
});
