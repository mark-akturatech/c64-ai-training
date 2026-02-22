// ============================================================================
// Variable Map — global variable naming registry
//
// Created in Stage 2, refined in Stage 3. Tracks variable names, usage, and
// refinement history across all blocks. Supports scoped naming (same address
// → different names in different subroutines).
// ============================================================================

import type {
  VariableMapData,
  VariableEntry,
  UsageContext,
  NameChange,
} from "./types.js";

export class VariableMap {
  private data: VariableMapData;

  constructor(source = "re_pipeline") {
    this.data = {
      metadata: {
        source,
        timestamp: new Date().toISOString(),
        totalVariables: 0,
      },
      variables: {},
    };
  }

  /** Load from persisted JSON */
  static fromJSON(json: VariableMapData): VariableMap {
    const vm = new VariableMap(json.metadata.source);
    vm.data = json;
    return vm;
  }

  /** Get a variable entry by hex address key (e.g. "FB") */
  get(addressKey: string): VariableEntry | undefined {
    return this.data.variables[addressKey];
  }

  /** Set or update a variable entry */
  set(addressKey: string, entry: VariableEntry): void {
    this.data.variables[addressKey] = entry;
    this.data.metadata.totalVariables = Object.keys(this.data.variables).length;
    this.data.metadata.timestamp = new Date().toISOString();
  }

  /** Add a usage context to an existing variable */
  addUsageContext(addressKey: string, context: UsageContext): void {
    const entry = this.data.variables[addressKey];
    if (!entry) return;

    // Check for existing context from same block
    const existing = entry.usageContexts.find(c => c.blockId === context.blockId);
    if (existing) {
      // Update if higher confidence
      if (context.confidence > existing.confidence) {
        existing.name = context.name;
        existing.usage = context.usage;
        existing.confidence = context.confidence;
        existing.source = context.source;
      }
    } else {
      entry.usageContexts.push(context);
    }

    // Update usedBy
    if (!entry.usedBy.includes(context.blockId)) {
      entry.usedBy.push(context.blockId);
    }
  }

  /** Record a name change in the history */
  recordNameChange(addressKey: string, change: NameChange): void {
    const entry = this.data.variables[addressKey];
    if (!entry) return;
    entry.nameHistory.push(change);
    entry.currentName = change.to;
  }

  /** Merge Stage 3 refinements into the variable map */
  mergeStage3(addressKey: string, name: string, blockId: string, confidence: number): void {
    const entry = this.data.variables[addressKey];
    if (!entry) return;

    // Add/update usage context
    this.addUsageContext(addressKey, {
      blockId,
      name,
      usage: "read_write",
      confidence,
      source: "stage3",
    });

    // If higher confidence than current name, update it
    if (confidence > 0.7 && name !== entry.currentName) {
      this.recordNameChange(addressKey, {
        from: entry.currentName,
        to: name,
        reason: `Stage 3 refinement from block ${blockId}`,
        source: blockId,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /** Check if an address has a variable entry */
  has(addressKey: string): boolean {
    return addressKey in this.data.variables;
  }

  /** Get all variable entries */
  entries(): [string, VariableEntry][] {
    return Object.entries(this.data.variables);
  }

  /** Get the total number of variables */
  get size(): number {
    return Object.keys(this.data.variables).length;
  }

  /** Export to JSON for persistence */
  toJSON(): VariableMapData {
    return {
      ...this.data,
      metadata: {
        ...this.data.metadata,
        totalVariables: Object.keys(this.data.variables).length,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
