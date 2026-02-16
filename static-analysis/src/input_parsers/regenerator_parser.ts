import type { ParsedRegion } from "../types.js";
import type { InputParser } from "./types.js";

export class RegeneratorParser implements InputParser {
  name = "regenerator";
  extensions = [".asm"];
  priority = 20;

  detect(data: Uint8Array, filename: string): number {
    const text = new TextDecoder().decode(data.slice(0, 4096));
    const lines = text.split("\n");

    let hasOrgDirective = false;
    let hasAutoLabels = false;
    let hasSemicolonComments = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (/^\*=\s*\$[0-9a-fA-F]{4}/.test(trimmed)) hasOrgDirective = true;
      if (/^(sub_|loc_|dat_)[0-9a-fA-F]{4}/.test(trimmed)) hasAutoLabels = true;
      if (trimmed.includes(";")) hasSemicolonComments = true;
    }

    if (hasOrgDirective && hasAutoLabels) return 90;
    if (hasOrgDirective) return 65;
    return 0;
  }

  parse(data: Uint8Array): ParsedRegion[] {
    const text = new TextDecoder().decode(data);
    const lines = text.split("\n");

    const labels = new Map<number, string>();
    const comments = new Map<number, string>();
    const byteData: number[] = [];
    let orgAddress = -1;
    let currentAddress = -1;

    const regions: ParsedRegion[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Org directive: *= $xxxx
      const orgMatch = /^\*=\s*\$([0-9a-fA-F]{4})/.exec(trimmed);
      if (orgMatch) {
        // Flush previous region
        if (orgAddress >= 0 && byteData.length > 0) {
          regions.push({
            address: orgAddress,
            bytes: new Uint8Array(byteData),
            metadata: { labels: new Map(labels), comments: new Map(comments) },
          });
          byteData.length = 0;
          labels.clear();
          comments.clear();
        }
        orgAddress = parseInt(orgMatch[1], 16);
        currentAddress = orgAddress;
        continue;
      }

      if (orgAddress < 0) continue;

      // Label on its own line
      const labelMatch = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*:?\s*$/.exec(trimmed);
      if (labelMatch && currentAddress >= 0) {
        labels.set(currentAddress, labelMatch[1]);
        continue;
      }

      // Label followed by instruction
      const labelInstrMatch =
        /^([a-zA-Z_][a-zA-Z0-9_]*)\s*:?\s+([A-Za-z]{3})\s*(.*)/.exec(trimmed);

      // Plain instruction
      const instrMatch = /^\s*([A-Za-z]{3})\s*(.*)/.exec(trimmed);

      // .byte directive
      const byteMatch = /^\s*\.byte\s+(.+)/i.exec(trimmed);

      if (labelInstrMatch) {
        labels.set(currentAddress, labelInstrMatch[1]);
        // Parse the instruction bytes — we just need the length
        const instrLen = estimateInstructionLength(labelInstrMatch[2], labelInstrMatch[3]);
        // Store placeholder bytes (actual bytes come from binary, not asm text)
        for (let i = 0; i < instrLen; i++) byteData.push(0);
        // Extract comment
        const commentPart = labelInstrMatch[3].split(";")[1];
        if (commentPart) comments.set(currentAddress, commentPart.trim());
        currentAddress += instrLen;
      } else if (byteMatch) {
        const values = byteMatch[1]
          .split(";")[0]
          .split(",")
          .map((v) => {
            const t = v.trim();
            if (t.startsWith("$")) return parseInt(t.slice(1), 16);
            return parseInt(t, 10);
          })
          .filter((v) => !isNaN(v));
        byteData.push(...values);
        currentAddress += values.length;
      } else if (instrMatch && /^[A-Za-z]{3}$/.test(instrMatch[1])) {
        const instrLen = estimateInstructionLength(instrMatch[1], instrMatch[2] || "");
        for (let i = 0; i < instrLen; i++) byteData.push(0);
        const commentPart = (instrMatch[2] || "").split(";")[1];
        if (commentPart) comments.set(currentAddress, commentPart.trim());
        currentAddress += instrLen;
      }
    }

    // Flush last region
    if (orgAddress >= 0 && byteData.length > 0) {
      regions.push({
        address: orgAddress,
        bytes: new Uint8Array(byteData),
        metadata: { labels: new Map(labels), comments: new Map(comments) },
      });
    }

    return regions;
  }
}

function estimateInstructionLength(mnemonic: string, operand: string): number {
  const op = operand.split(";")[0].trim();
  if (!op) return 1; // implied
  if (op === "A" || op === "a") return 1; // accumulator
  if (op.startsWith("#")) return 2; // immediate
  if (/^\(\$[0-9a-fA-F]{2}\),/.test(op)) return 2; // (zp),Y
  if (/^\(\$[0-9a-fA-F]{2},/.test(op)) return 2; // (zp,X)
  if (/^\$[0-9a-fA-F]{4}/.test(op)) return 3; // absolute
  if (/^\(\$[0-9a-fA-F]{4}\)/.test(op)) return 3; // indirect
  if (/^\$[0-9a-fA-F]{2}/.test(op)) return 2; // zero page
  // Branch instructions
  const upper = mnemonic.toUpperCase();
  if (["BNE", "BEQ", "BCC", "BCS", "BPL", "BMI", "BVC", "BVS"].includes(upper)) return 2;
  // Label reference — assume absolute
  return 3;
}
