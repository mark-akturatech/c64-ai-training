// KERNAL API Annotation (Priority 40)
// KERNAL JSR targets with calling conventions — banking-aware.

import type { AnnotationSource, AnnotationSourceInput } from "./types.js";

// KERNAL calling conventions (which registers are inputs/outputs)
const KERNAL_CONVENTIONS: Record<number, { name: string; inputs?: string; outputs?: string; notes?: string }> = {
  0xFFD2: { name: "CHROUT", inputs: "A=char", notes: "Output character to current channel" },
  0xFFCF: { name: "CHRIN", outputs: "A=char", notes: "Input character from current channel" },
  0xFFE4: { name: "GETIN", outputs: "A=char", notes: "Get character from keyboard buffer" },
  0xFFD5: { name: "LOAD", inputs: "A=0(load)/1(verify), X/Y=address", notes: "Load file to memory" },
  0xFFD8: { name: "SAVE", inputs: "A=ZP pointer, X/Y=end address", notes: "Save memory to file" },
  0xFFBA: { name: "SETLFS", inputs: "A=logical#, X=device#, Y=secondary", notes: "Set logical file parameters" },
  0xFFBD: { name: "SETNAM", inputs: "A=length, X/Y=filename pointer", notes: "Set filename" },
  0xFFC0: { name: "OPEN", notes: "Open logical file (SETLFS+SETNAM first)" },
  0xFFC3: { name: "CLOSE", inputs: "A=logical#", notes: "Close logical file" },
  0xFFC6: { name: "CHKIN", inputs: "X=logical#", notes: "Set input channel" },
  0xFFC9: { name: "CHKOUT", inputs: "X=logical#", notes: "Set output channel" },
  0xFFCC: { name: "CLRCHN", notes: "Restore default I/O channels" },
  0xFFE1: { name: "STOP", outputs: "Z=1 if STOP pressed", notes: "Check RUN/STOP key" },
  0xFFB7: { name: "READST", outputs: "A=status", notes: "Read I/O status word" },
  0xFF81: { name: "CINT", notes: "Initialize screen editor" },
  0xFF84: { name: "IOINIT", notes: "Initialize I/O devices" },
  0xFFF0: { name: "PLOT", inputs: "C=0: set X=row Y=col; C=1: get", outputs: "X=row Y=col", notes: "Set/read cursor" },
  0xFFED: { name: "SCREEN", outputs: "X=cols Y=rows", notes: "Get screen size" },
};

export class KernalApiAnnotation implements AnnotationSource {
  name = "kernal_api";
  priority = 40;

  annotate(input: AnnotationSourceInput): string | null {
    const mn = input.instruction.mnemonic.toLowerCase();
    if (mn !== "jsr") return null;

    const target = parseAbsoluteAddress(input.instruction.operand);
    if (target === null) return null;

    // Only annotate KERNAL jump table addresses
    if (target < 0xFF81 || target > 0xFFF3) return null;

    // Banking check: KERNAL must be mapped
    if (input.bankingState.kernalMapped === "no") return null;

    const conv = KERNAL_CONVENTIONS[target];
    if (!conv) return null;

    const parts: string[] = [conv.name];
    if (conv.inputs) parts.push(`in: ${conv.inputs}`);
    if (conv.outputs) parts.push(`out: ${conv.outputs}`);
    if (conv.notes) parts.push(conv.notes);

    return parts.join(" — ");
  }
}

function parseAbsoluteAddress(operand: string): number | null {
  const match = operand.match(/^\$([0-9a-fA-F]{4})$/);
  if (match) return parseInt(match[1], 16);
  return null;
}
