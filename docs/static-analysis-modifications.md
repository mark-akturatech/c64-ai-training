# Static Analysis Modifications — Dependency Graph Preservation

## Context

The static analysis pipeline builds a rich `DependencyTree` during code discovery (step 3, tree_walker), but **discards most of this information** during block assembly (step 6). The tree's typed edges, confidence scores, and discovery provenance are flattened into simple address arrays (`callsOut[]`, `dataRefs[]`, etc.) in `blocks.json`. When block enrichers split or merge blocks (step 7), the tree is not updated — enrichers treat it as read-only.

The reverse engineering pipeline ([reverse-engineering-pipeline.md](docs/reverse-engineering-pipeline.md)) requires the full dependency graph as a **first-class artifact** for:
- SCC-aware inter-procedural register state propagation (banking state through the call graph)
- Graph-driven analysis ordering (SCC condensation DAG for the Stage 3 outer loop)
- Discovery tracking (new code/data targets grow the graph during RE)
- Dead code identification (unreachable nodes = candidates for removal)
- Dependency tree documentation output (builder renders graph as human-readable call chains)

This plan describes the modifications needed to the existing static analysis pipeline.

---

## Current State (What Gets Lost)

### Tree Walker Output (step 3)

The `DependencyTree` class in [dependency_tree.ts](static-analysis/src/dependency_tree.ts) maintains:

```typescript
class DependencyTree {
  nodes: Map<number, TreeNode>;         // keyed by start address
  edgeIndex: Map<number, TreeEdge[]>;   // edges indexed by target
  visited: Set<number>;                 // bytes claimed by any node
}
```

Each `TreeNode` has:
- `id`, `type` ("code" | "data"), `start`, `end`, `endConfidence`
- `discoveredBy` (which plugin found it)
- `instructions[]` (for code nodes)
- `edges: TreeEdge[]` — **the critical data**
- `subroutineId` (set by subroutine_grouper)
- `metadata` (isEntryPoint, isIrqHandler, etc.)

Each `TreeEdge` has:
- `target` address, `type` (EdgeType), `sourceInstruction`
- `category` ("control_flow" | "data") — **NEW**, derived from `type` (see §8 below)
- `confidence` (0-100), `discoveredBy`, `metadata`

### Block Assembly (step 6) — Where Information Is Lost

In [block_assembler.ts](static-analysis/src/block_assembler.ts), the `buildCodeBlock()` function converts tree nodes to blocks. Edges are **flattened**:

| TreeEdge field | Kept in Block? | How |
|---|---|---|
| `edge.type` (11 edge types) | Partially | Collapsed into `callsOut`, `dataRefs`, `hardwareRefs`, `smcTargets` arrays |
| `edge.category` | Lost | Implicit in which flat array the target lands in, but not explicit |
| `edge.confidence` | Lost | Discarded entirely |
| `edge.discoveredBy` | Lost | Discarded entirely |
| `edge.metadata` | Mostly lost | Only IRQ flags survive |
| `edge.sourceInstruction` | Lost | Only kept for `loopBackEdges` |
| Full graph structure | Lost | Only flat address arrays remain (cycles, SCCs invisible) |

### Block Enrichers (step 7) — Tree Not Updated

In [block_enrichers/index.ts](static-analysis/src/block_enrichers/index.ts):

```typescript
interface EnricherContext {
  tree: DependencyTree;    // ← READ-ONLY access
  loadedRegions: LoadedRegion[];
  memory: Uint8Array;
  bankingState: BankingState;
}
```

The `sub_splitter_enricher` splits large code blocks into parts but does NOT update tree nodes/edges. The `string_merge_enricher` merges adjacent string blocks but does NOT update the tree. After enrichers run, the tree's edges still point to the original unsplit/unmerged node addresses.

---

## Required Changes

### 1. Serialize Full Tree to `dependency_tree.json`

**File:** `block_assembler.ts` (or new `tree_serializer.ts`)

After block assembly and enrichment, serialize the complete tree alongside `blocks.json`.

**Output format:**

```json
{
  "metadata": {
    "source": "game.prg",
    "generatedBy": "static-analysis",
    "totalNodes": 62,
    "totalEdges": 156,
    "edgeCategoryCounts": {
      "control_flow": 103,
      "data": 53
    },
    "edgeTypeCounts": {
      "call": 42, "jump": 8, "branch": 31, "fallthrough": 22,
      "data_read": 28, "data_write": 5, "hardware_read": 4,
      "hardware_write": 12, "pointer_ref": 3, "smc_write": 1
    }
  },
  "entryPoints": ["code_0810"],
  "irqHandlers": ["code_C200"],
  "nodes": {
    "code_C000": {
      "type": "code",
      "start": "0xC000",
      "end": "0xC03F",
      "blockId": "sub_C000",
      "discoveredBy": "jump_resolver",
      "endConfidence": 100,
      "subroutineId": "sub_C000",
      "isEntryPoint": false,
      "isIrqHandler": false
    },
    "data_C800": {
      "type": "data",
      "start": "0xC800",
      "end": "0xC808",
      "blockId": "dat_C800",
      "discoveredBy": "data_ref_resolver",
      "endConfidence": 80
    }
  },
  "edges": [
    {
      "source": "code_C000",
      "sourceInstruction": "0xC010",
      "target": "0xC100",
      "targetNodeId": "code_C100",
      "type": "call",
      "category": "control_flow",
      "confidence": 100,
      "discoveredBy": "jump_resolver"
    },
    {
      "source": "code_C000",
      "sourceInstruction": "0xC005",
      "target": "0xC800",
      "targetNodeId": "data_C800",
      "type": "data_read",
      "category": "data",
      "confidence": 100,
      "discoveredBy": "data_ref_resolver"
    }
  ]
}
```

**Implementation:**
- Add `toJSON()` method to `DependencyTree` class
- Call it from the pipeline's final output step, after enrichers complete
- Write `dependency_tree.json` alongside `blocks.json`
- Keep the existing `blocks.json` format unchanged (backwards compatible) — the flattened arrays remain for tools that don't need the full tree

### 2. Make Tree Mutable During Block Enrichment

**File:** `block_enrichers/index.ts`

Change `EnricherContext.tree` from read-only to mutable. Add methods for enrichers to update the tree when they split or merge blocks.

**Current:**
```typescript
interface EnricherContext {
  tree: DependencyTree;           // read-only by convention
  loadedRegions: LoadedRegion[];
  memory: Uint8Array;
  bankingState: BankingState;
}
```

**New:**
```typescript
interface EnricherContext {
  tree: DependencyTree;           // now explicitly mutable
  loadedRegions: LoadedRegion[];
  memory: Uint8Array;
  bankingState: BankingState;
}
```

Add mutation methods to `DependencyTree`:

```typescript
class DependencyTree {
  // ... existing methods ...

  /** Split a node at a given address. Creates two new nodes, redistributes edges. */
  splitNode(nodeStart: number, splitAt: number): { node1: TreeNode; node2: TreeNode } {
    const original = this.nodes.get(nodeStart);
    if (!original) throw new Error(`Node not found at ${nodeStart}`);

    // Create two new nodes
    const node1: TreeNode = {
      ...original,
      end: splitAt,
      id: `${original.type}_${hex(nodeStart)}`,
    };
    const node2: TreeNode = {
      ...original,
      start: splitAt,
      id: `${original.type}_${hex(splitAt)}`,
      // Instructions: split based on address ranges
      instructions: original.instructions?.filter(i => i.address >= splitAt),
    };
    node1.instructions = original.instructions?.filter(i => i.address < splitAt);

    // Redistribute edges:
    // - Edges FROM original: assign to node1 or node2 based on sourceInstruction address
    // - Edges TO original: keep pointing to node1 (the start of the original range)
    //   unless the target address is in node2's range
    for (const edge of original.edges) {
      if (edge.sourceInstruction >= splitAt) {
        node2.edges.push(edge);
      } else {
        node1.edges.push(edge);
      }
    }

    // Add fallthrough edge from node1 to node2 (split blocks are contiguous)
    node1.edges.push({
      target: splitAt,
      type: "fallthrough",
      category: "control_flow",
      sourceInstruction: node1.end - 1,  // approximate
      confidence: 100,
      discoveredBy: "sub_splitter",
    });

    // Replace original node
    this.nodes.delete(nodeStart);
    this.nodes.set(node1.start, node1);
    this.nodes.set(node2.start, node2);

    // Update edgeIndex for edges targeting the original
    this.rebuildEdgeIndex();

    return { node1, node2 };
  }

  /** Merge two adjacent nodes into one. Combines edges. */
  mergeNodes(startAddr1: number, startAddr2: number): TreeNode {
    const node1 = this.nodes.get(startAddr1);
    const node2 = this.nodes.get(startAddr2);
    if (!node1 || !node2) throw new Error("Node not found for merge");

    const merged: TreeNode = {
      ...node1,
      end: Math.max(node1.end, node2.end),
      // Combine edges, removing the fallthrough between them
      edges: [
        ...node1.edges.filter(e => e.target !== startAddr2 || e.type !== "fallthrough"),
        ...node2.edges,
      ],
      instructions: [
        ...(node1.instructions ?? []),
        ...(node2.instructions ?? []),
      ],
    };

    this.nodes.delete(startAddr1);
    this.nodes.delete(startAddr2);
    this.nodes.set(merged.start, merged);
    this.rebuildEdgeIndex();

    return merged;
  }

  /** Add a new edge (used when enrichment discovers new relationships) */
  addEdge(sourceNodeStart: number, edge: TreeEdge): void {
    const node = this.nodes.get(sourceNodeStart);
    if (node) {
      node.edges.push(edge);
      // Update edgeIndex
      if (!this.edgeIndex.has(edge.target)) {
        this.edgeIndex.set(edge.target, []);
      }
      this.edgeIndex.get(edge.target)!.push(edge);
    }
  }

  /** Rebuild the target→edges index (after bulk modifications) */
  private rebuildEdgeIndex(): void {
    this.edgeIndex.clear();
    for (const node of this.nodes.values()) {
      for (const edge of node.edges) {
        if (!this.edgeIndex.has(edge.target)) {
          this.edgeIndex.set(edge.target, []);
        }
        this.edgeIndex.get(edge.target)!.push(edge);
      }
    }
  }
}
```

### 3. Update Sub-Splitter Enricher to Maintain Tree

**File:** `block_enrichers/sub_splitter_enricher.ts`

Currently splits blocks without updating the tree. Add tree mutations:

```typescript
// Before (current):
const newBlocks = splitBlock(block, boundaries);
result.push(...newBlocks);

// After (modified):
const newBlocks = splitBlock(block, boundaries);
result.push(...newBlocks);
// Update tree to match the split
for (const boundary of boundaries) {
  context.tree.splitNode(block.address, boundary);
}
```

### 4. Update String Merge Enricher to Maintain Tree

**File:** `block_enrichers/string_merge_enricher.ts`

Currently merges blocks without updating the tree. Add tree mutations:

```typescript
// Before (current):
mergedBlock = mergeStringBlocks(block1, block2);

// After (modified):
mergedBlock = mergeStringBlocks(block1, block2);
context.tree.mergeNodes(block1.address, block2.address);
```

### 5. Update Block Assembler to Preserve Node-Block Mapping

**File:** `block_assembler.ts`

When converting tree nodes to blocks, maintain a mapping from block IDs to tree node IDs. This is needed by the RE pipeline to correlate blocks with their tree nodes.

```typescript
// Add to block output:
interface Block {
  // ... existing fields ...
  treeNodeIds?: string[];  // NEW: which tree nodes this block was assembled from
}
```

In `buildCodeBlock()`:
```typescript
function buildCodeBlock(subNodes: TreeNode[], tree: DependencyTree, memory: Uint8Array): Block {
  const block = /* existing logic */;
  // NEW: record which tree nodes contributed to this block
  block.treeNodeIds = subNodes.map(n => n.id);
  return block;
}
```

### 6. Add Tree Node ↔ Block ID Cross-Reference to Tree JSON

After block assembly, annotate tree nodes with their corresponding block IDs:

```typescript
// In tree serialization:
for (const [blockId, block] of blocks) {
  if (block.treeNodeIds) {
    for (const nodeId of block.treeNodeIds) {
      const node = tree.nodes.get(nodeIdToAddr(nodeId));
      if (node) node.blockId = blockId;
    }
  }
}
```

This allows the RE pipeline to look up any block's tree node(s) and vice versa.

### 7. Preserve Edge Type in Blocks (Backwards Compatible Enhancement)

Currently `blocks.json` has flat arrays (`callsOut`, `dataRefs`, etc.). Optionally enhance these to include edge type for consumers that want more detail without parsing `dependency_tree.json`:

```typescript
// Enhanced cross-reference format (additive, backwards compatible)
interface Block {
  // Existing (kept for backwards compatibility):
  callsOut?: number[];
  calledBy?: number[];
  dataRefs?: number[];
  hardwareRefs?: number[];
  smcTargets?: number[];

  // NEW: detailed edges (optional, richer view)
  edges?: Array<{
    target: number;
    type: EdgeType;
    category: "control_flow" | "data";
    sourceInstruction: number;
    confidence: number;
    discoveredBy: string;
  }>;
}
```

This is additive — existing tools continue to use the flat arrays. The RE pipeline uses `dependency_tree.json` as the primary source but `block.edges` as a convenience.

### 8. Edge Category Classification

Every edge in `dependency_tree.json` carries a `category` field: `"control_flow"` or `"data"`. This classification is critical for the RE pipeline's SCC decomposition and analysis scheduling — only control-flow edges participate in scheduling and cycle detection.

**Shared constants** (in `shared/src/edge_categories.ts`):

```typescript
import { EdgeType } from "./types";

/** Edges that affect control flow — used for SCC decomposition and analysis scheduling */
export const CONTROL_FLOW_EDGES: EdgeType[] = [
  "branch", "fallthrough", "jump", "indirect_jump", "call", "rts_dispatch"
];

/** Edges that represent data dependencies — do NOT block analysis scheduling */
export const DATA_EDGES: EdgeType[] = [
  "data_read", "data_write", "pointer_ref", "hardware_read", "hardware_write",
  "smc_write", "vector_write"
];

export function edgeCategory(type: EdgeType): "control_flow" | "data" {
  if (CONTROL_FLOW_EDGES.includes(type)) return "control_flow";
  return "data";
}
```

**Why this matters:**
- **SCC decomposition** operates only on control-flow edges. A cycle in the call graph (main loop → update → check → main loop) creates an SCC. A data read does not.
- **Analysis scheduling** uses the condensation DAG of control-flow SCCs. A block can be analyzed without its data sources being resolved.
- **Reachability** for dead code detection uses control-flow edges. A data block referenced only by `data_read` edges IS reachable (its reader is reachable), but the data block itself doesn't propagate reachability to other blocks.

**Applied during tree walking:** The `tree_walker` already knows the edge type when it creates each edge. The category is computed from the type at edge creation time:

```typescript
// In tree_walker, when creating edges:
const edge: TreeEdge = {
  target: targetAddr,
  type: edgeType,            // "call", "data_read", etc.
  category: edgeCategory(edgeType),  // "control_flow" or "data"
  sourceInstruction: currentAddr,
  confidence: 100,
  discoveredBy: "tree_walker",
};
```

**Applied to synthesized edges:** When `splitNode()` creates a fallthrough edge, or `addEdge()` adds a new edge during enrichment, the category is computed from the type:

```typescript
// In splitNode() fallthrough:
node1.edges.push({
  target: splitAt,
  type: "fallthrough",
  category: "control_flow",    // fallthrough is always control_flow
  sourceInstruction: node1.end - 1,
  confidence: 100,
  discoveredBy: "sub_splitter",
});
```

---

## Pipeline Flow (Modified)

```
Input (.prg, .sid, .vsf, .asm)
    │
    ▼
[1. binary_loader] ──────────── 64KB memory image + loaded regions
    │
    ▼
[2. entry_point_detector] ───── entry points + banking state
    │
    ▼
[3. tree_walker] ────────────── DependencyTree (nodes + categorized edges)
    │                            Each edge has type + category (control_flow|data)
    ▼
[4. code_discoverer] ────────── DependencyTree grows (new code islands)
    │
    ▼
[5. data_classifier] ────────── data candidates attached to tree nodes
    │
    ▼
[6. block_assembler] ────────── blocks + node↔block mapping
    │                            Edges PRESERVED (not flattened)
    ▼
[7. block_enrichers] ────────── blocks modified, TREE UPDATED IN SYNC
    │                            split → tree.splitNode() (with category)
    │                            merge → tree.mergeNodes()
    ▼
blocks.json + dependency_tree.json    ← BOTH outputs
```

> **Note on naming:** The class is called `DependencyTree` and the output file is `dependency_tree.json` for historical reasons, but the data structure is a **directed graph** — it supports cycles (main loops, IRQ chains, state machines, tail calls). The RE pipeline performs SCC decomposition on this graph to handle cycles. The "tree" name is retained for backwards compatibility with the existing codebase.

---

## ID Stability During Split/Merge Operations

When `splitNode()` or `mergeNodes()` executes, the original node ID is destroyed and replaced by new IDs. Any external system holding a reference to the old ID will have a stale reference. This includes:
- `resolutionHistory` entries referencing the old node
- Analysis caches (Stage 2/3 results indexed by node ID)
- Scheduling state in the Stage 3 outer loop
- Cross-reference data in `enrichment.annotations`

### Solution: ID Change Events

The `DependencyTree` class emits **ID change events** that downstream systems subscribe to:

```typescript
interface IDChangeEvent {
  type: "split" | "merge" | "remove";
  oldIds: string[];          // IDs that no longer exist
  newIds: string[];          // replacement IDs
  mapping: Map<string, string>;  // old → new (best-effort mapping)
}

class DependencyTree {
  private changeListeners: Array<(event: IDChangeEvent) => void> = [];

  onIDChange(listener: (event: IDChangeEvent) => void): void {
    this.changeListeners.push(listener);
  }

  splitNode(nodeStart: number, splitAt: number): { node1: TreeNode; node2: TreeNode } {
    // ... existing split logic ...

    // Emit event AFTER split
    const event: IDChangeEvent = {
      type: "split",
      oldIds: [original.id],
      newIds: [node1.id, node2.id],
      mapping: new Map([[original.id, node1.id]]),  // original maps to first part
    };
    for (const listener of this.changeListeners) listener(event);

    return { node1, node2 };
  }

  mergeNodes(startAddr1: number, startAddr2: number): TreeNode {
    // ... existing merge logic ...

    const event: IDChangeEvent = {
      type: "merge",
      oldIds: [node1.id, node2.id],
      newIds: [merged.id],
      mapping: new Map([
        [node1.id, merged.id],
        [node2.id, merged.id],
      ]),
    };
    for (const listener of this.changeListeners) listener(event);

    return merged;
  }
}
```

**The RE pipeline's `MutableGraph` subscribes to these events** and updates:
- Internal node/edge maps
- SCC decomposition cache (invalidated)
- Resolution history (old node IDs remapped to new)
- Worklist entries (stale entries removed or remapped)

**Design principle:** The `DependencyTree` is the source of truth for node identity. All other systems follow.

---

## Overlapping Block Resolution

An incorrect indirect jump resolution could discover "code" that overlaps with an existing data block, or vice versa. This is especially common when AI speculatively resolves jump tables or when data contains byte sequences that look like valid instructions.

### Detection

Before adding any new node, check for overlap with existing nodes:

```typescript
addNode(node: TreeNode): { status: "added" | "conflict"; conflict?: OverlapConflict } {
  // Check all existing nodes for address range overlap
  for (const existing of this.nodes.values()) {
    if (node.start < existing.end && node.end > existing.start) {
      // Overlap detected
      return {
        status: "conflict",
        conflict: {
          existingNode: existing,
          newNode: node,
          overlapStart: Math.max(node.start, existing.start),
          overlapEnd: Math.min(node.end, existing.end),
        },
      };
    }
  }
  // No overlap — add normally
  this.nodes.set(node.start, node);
  return { status: "added" };
}
```

### Resolution Strategy

When an overlap is detected:

| Scenario | Resolution |
|----------|------------|
| New code overlaps existing data (high confidence new, low confidence existing) | Replace existing data with new code. Reclassify remaining bytes. |
| New code overlaps existing code | **Do not add.** Flag as "conflicting disassembly" for human review. Both interpretations are valid on 6502 (see: overlapping instruction trick). |
| New data overlaps existing data | Merge or split at overlap boundary. Keep higher-confidence classification. |
| New node from speculative discovery (AI) | **Quarantine** the new node. Do not modify existing graph. Promote only after corroboration. |
| Same address, different classification (code vs data) | Keep existing. Add new classification as `alternateType` metadata. Let Stage 2/3 AI resolve. |

**The 6502 overlap trick:** On the 6502, it's possible for two different code paths to execute overlapping byte sequences with different instruction boundaries. This is rare but intentional (copy protection, code size optimization). The analysis should detect this pattern and annotate it rather than treating it as an error.

### Implementation in MutableGraph

```typescript
interface OverlapConflict {
  existingNode: TreeNode;
  newNode: TreeNode;
  overlapStart: number;
  overlapEnd: number;
  resolution?: "replace" | "split" | "quarantine" | "annotate";
}

// MutableGraph maintains an overlap log for diagnostics
private overlapLog: OverlapConflict[] = [];
```

---

## Testing

1. **Graph preservation**: Run static analysis on `spriteintro.prg`, verify `dependency_tree.json` contains all edges from the tree walker (compare edge count before/after serialization)
2. **Split consistency**: Run on a program with >120 instruction subroutines (triggers sub_splitter), verify tree nodes are split correctly with redistributed edges and a fallthrough edge between the parts
3. **Merge consistency**: Run on a program with adjacent strings (triggers string_merge), verify tree nodes are merged with combined edges
4. **Node↔Block mapping**: Verify every block in `blocks.json` has `treeNodeIds` pointing to valid nodes in `dependency_tree.json`, and every tree node has a `blockId` pointing to a valid block
5. **Backwards compatibility**: Run the existing builder on the new `blocks.json` — should produce identical output (flat arrays unchanged)
6. **Round-trip**: Load `dependency_tree.json` into the RE pipeline's `MutableGraph`, verify node/edge counts match, verify SCC decomposition and topological sort produce valid ordering
7. **ID stability**: Split a node, verify that an ID change event is emitted. Subscribe a listener, verify it receives the old→new ID mapping. Verify that looking up the old ID fails and the new ID works.
8. **Overlap detection**: Attempt to add a code node overlapping an existing data node. Verify conflict is returned. Test all resolution strategies (replace, split, quarantine, annotate).
9. **Edge category classification**: Verify all edges in `dependency_tree.json` have a `category` field ("control_flow" or "data"). Verify that `call`, `jump`, `branch`, `rts_dispatch` are "control_flow" and `data_read`, `hardware_write`, etc. are "data".

---

## File Inventory (Changes)

| File | Change |
|------|--------|
| `dependency_tree.ts` | Add `splitNode()`, `mergeNodes()`, `addEdge()`, `rebuildEdgeIndex()`, `toJSON()` methods. Add ID change event system (`onIDChange()`, `IDChangeEvent`). Add overlap detection in `addNode()`. Compute `category` on all new edges. |
| `block_assembler.ts` | Add `treeNodeIds` to blocks, annotate tree nodes with `blockId` |
| `block_enrichers/index.ts` | Document tree as mutable in `EnricherContext` |
| `block_enrichers/sub_splitter_enricher.ts` | Call `tree.splitNode()` when splitting blocks |
| `block_enrichers/string_merge_enricher.ts` | Call `tree.mergeNodes()` when merging blocks |
| `index.ts` (pipeline entry) | Serialize `dependency_tree.json` alongside `blocks.json` |
| `types.ts` | Add `treeNodeIds?: string[]` to Block, add `edges?` detailed edge array, add `category` to `TreeEdge`, add `IDChangeEvent` interface |
| **`shared/src/edge_categories.ts`** | **NEW** — `CONTROL_FLOW_EDGES`, `DATA_EDGES` constants and `edgeCategory()` helper. Shared by both static analysis and RE pipeline. |

**1 new file** (shared constants), rest are modifications to existing files.
