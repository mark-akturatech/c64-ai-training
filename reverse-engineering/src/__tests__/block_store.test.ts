import { describe, it, expect } from "vitest";
import { BlockStore } from "../block_store.js";
import type { Block } from "@c64/shared";

function makeBlock(address: number, endAddress: number, type: string = "subroutine"): Block {
  return {
    id: `${type}_${address.toString(16).toUpperCase()}`,
    address,
    endAddress,
    type: type as Block["type"],
    reachability: "proven",
    instructions: [
      {
        address,
        rawBytes: "A9 00",
        mnemonic: "lda",
        operand: "#$00",
        addressingMode: "immediate",
        label: null,
      },
    ],
  };
}

describe("BlockStore", () => {
  it("creates with initial blocks", () => {
    const store = new BlockStore([
      makeBlock(0x0800, 0x0850),
      makeBlock(0x0850, 0x0900),
    ]);
    expect(store.size).toBe(2);
    expect(store.getVersion()).toBe(0);
  });

  it("getBlock finds block by address", () => {
    const store = new BlockStore([makeBlock(0x0800, 0x0850)]);
    expect(store.getBlock(0x0800)).not.toBeNull();
    expect(store.getBlock(0x0900)).toBeNull();
  });

  it("findBlockContaining finds block by any address within range", () => {
    const store = new BlockStore([
      makeBlock(0x0800, 0x0850),
      makeBlock(0x0850, 0x0900),
    ]);
    expect(store.findBlockContaining(0x0820)?.address).toBe(0x0800);
    expect(store.findBlockContaining(0x0850)?.address).toBe(0x0850);
    expect(store.findBlockContaining(0x0900)).toBeNull();
  });

  it("reclassify changes block type and bumps version", () => {
    const store = new BlockStore([makeBlock(0x0800, 0x0850, "unknown")]);
    const v0 = store.getVersion();
    store.reclassify(0x0800, "data", "detected as sprite data");
    expect(store.getBlock(0x0800)?.type).toBe("data");
    expect(store.getVersion()).toBe(v0 + 1);
    expect(store.hasChangedSince(v0)).toBe(true);
    expect(store.getChanges().length).toBe(1);
    expect(store.getChanges()[0].action).toBe("reclassify");
  });

  it("reclassify throws for non-existent block", () => {
    const store = new BlockStore([]);
    expect(() => store.reclassify(0x9999, "data", "test")).toThrow();
  });

  it("split creates two blocks and bumps version", () => {
    const store = new BlockStore([makeBlock(0x0800, 0x0900)]);
    const v0 = store.getVersion();
    store.split(0x0800, 0x0850, "code/data boundary");
    expect(store.size).toBe(2);
    expect(store.getVersion()).toBe(v0 + 1);

    const blocks = store.getAllBlocks();
    expect(blocks[0].address).toBe(0x0800);
    expect(blocks[0].endAddress).toBe(0x0850);
    expect(blocks[1].address).toBe(0x0850);
    expect(blocks[1].endAddress).toBe(0x0900);
  });

  it("split throws for invalid split address", () => {
    const store = new BlockStore([makeBlock(0x0800, 0x0900)]);
    expect(() => store.split(0x0800, 0x0800, "at start")).toThrow();
    expect(() => store.split(0x0800, 0x0900, "at end")).toThrow();
    expect(() => store.split(0x0800, 0x0700, "before start")).toThrow();
  });

  it("merge combines two adjacent blocks", () => {
    const store = new BlockStore([
      makeBlock(0x0800, 0x0850),
      makeBlock(0x0850, 0x0900),
    ]);
    const v0 = store.getVersion();
    store.merge(0x0800, 0x0850, "same subroutine");
    expect(store.size).toBe(1);
    expect(store.getVersion()).toBe(v0 + 1);

    const merged = store.getAllBlocks()[0];
    expect(merged.address).toBe(0x0800);
    expect(merged.endAddress).toBe(0x0900);
  });

  it("merge throws for non-adjacent blocks", () => {
    const store = new BlockStore([
      makeBlock(0x0800, 0x0850),
      makeBlock(0x0900, 0x0950),
    ]);
    expect(() => store.merge(0x0800, 0x0900, "gap between")).toThrow();
  });

  it("hasChangedSince tracks version changes", () => {
    const store = new BlockStore([makeBlock(0x0800, 0x0850)]);
    const v = store.getVersion();
    expect(store.hasChangedSince(v)).toBe(false);
    store.reclassify(0x0800, "data", "test");
    expect(store.hasChangedSince(v)).toBe(true);
  });

  it("does not mutate original blocks array", () => {
    const original = [makeBlock(0x0800, 0x0850)];
    const store = new BlockStore(original);
    store.reclassify(0x0800, "data", "test");
    // Original should still be "subroutine"
    expect(original[0].type).toBe("subroutine");
  });
});
