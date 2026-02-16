// ============================================================================
// String Detector
// Detects PETSCII and screen-code text strings with multiple encoding subtypes:
//   - petscii_null:    null-terminated ($00 at end)
//   - petscii_highbit: last char has bit 7 set (OR $80)
//   - petscii_length:  first byte is length prefix
//   - screen_codes:    values $00-$3F (VIC screen code encoding)
// PETSCII printable range: $20-$5F (upper case + symbols), $C0-$DF (graphics)
// ============================================================================

import type { DataCandidate } from "../types.js";
import type { DetectorContext, DataDetector } from "./types.js";

const ROLE_OPCODE = 1;
const ROLE_OPERAND = 2;

const MIN_STRING_LENGTH = 4;

export class StringDetector implements DataDetector {
  name = "string";
  description = "Detects PETSCII and screen-code text strings with encoding subtype detection";

  detect(
    memory: Uint8Array,
    region: { start: number; end: number },
    context: DetectorContext
  ): DataCandidate[] {
    const candidates: DataCandidate[] = [];
    const regionSize = region.end - region.start;

    if (regionSize < MIN_STRING_LENGTH) return candidates;

    // Check for proven code
    if (this.hasCode(region.start, region.end, context)) return candidates;

    // Check if any code references point to this region
    const isCodeReferenced = this.isReferenced(region, context);

    // Try each string encoding type
    const petsciiResult = this.detectPetsciiString(memory, region);
    const screenCodeResult = this.detectScreenCodes(memory, region);

    // Emit the best match(es)
    if (petsciiResult) {
      const baseConfidence = isCodeReferenced ? 90 : petsciiResult.cleanRatio > 0.8 ? 60 : 30;
      const confidence = petsciiResult.length >= 8 ? baseConfidence : Math.max(baseConfidence - 15, 20);

      candidates.push({
        start: petsciiResult.start,
        end: petsciiResult.end,
        detector: this.name,
        type: "string",
        subtype: petsciiResult.subtype,
        confidence: Math.min(confidence, 95),
        evidence: this.buildEvidence(
          petsciiResult.subtype,
          petsciiResult.length,
          petsciiResult.cleanRatio,
          isCodeReferenced
        ),
        label: this.makeLabel(memory, petsciiResult.start, petsciiResult.end),
        comment: `PETSCII string (${petsciiResult.subtype}), ${petsciiResult.length} chars`,
      });
    }

    if (screenCodeResult && (!petsciiResult || screenCodeResult.confidence > 50)) {
      // Only emit screen codes if it's a better or additional match
      const baseConfidence = isCodeReferenced ? 85 : screenCodeResult.cleanRatio > 0.8 ? 55 : 30;
      const confidence = screenCodeResult.length >= 8 ? baseConfidence : Math.max(baseConfidence - 15, 20);

      // Avoid duplicate if PETSCII already covers same range
      if (
        !petsciiResult ||
        petsciiResult.start !== screenCodeResult.start ||
        petsciiResult.end !== screenCodeResult.end
      ) {
        candidates.push({
          start: screenCodeResult.start,
          end: screenCodeResult.end,
          detector: this.name,
          type: "string",
          subtype: "screen_codes",
          confidence: Math.min(confidence, 90),
          evidence: [
            `Screen code string: ${screenCodeResult.length} characters`,
            `Values in range $00-$3F (VIC screen codes)`,
            isCodeReferenced ? "Referenced by code" : "No direct code reference",
          ],
          label: this.makeScreenCodeLabel(memory, screenCodeResult.start, screenCodeResult.end),
          comment: `Screen code string, ${screenCodeResult.length} chars`,
        });
      }
    }

    return candidates;
  }

  private hasCode(start: number, end: number, context: DetectorContext): boolean {
    for (let i = start; i < end; i++) {
      if (context.byteRole[i] === ROLE_OPCODE || context.byteRole[i] === ROLE_OPERAND) {
        return true;
      }
    }
    return false;
  }

  private isReferenced(
    region: { start: number; end: number },
    context: DetectorContext
  ): boolean {
    for (const edge of context.codeRefs) {
      if (
        (edge.type === "data_read" ||
          edge.type === "pointer_ref" ||
          edge.type === "data_write") &&
        edge.target >= region.start &&
        edge.target < region.end
      ) {
        return true;
      }
    }
    return false;
  }

  private isPetsciiPrintable(b: number): boolean {
    // PETSCII printable: $20-$5F (upper case letters, digits, symbols)
    // and $C0-$DF (shifted graphics characters, also commonly used)
    return (b >= 0x20 && b <= 0x5f) || (b >= 0xc0 && b <= 0xdf);
  }

  private isPetsciiPrintableOrHighbit(b: number): boolean {
    // Same as printable, but also allow bit 7 set on last char
    return this.isPetsciiPrintable(b) || this.isPetsciiPrintable(b & 0x7f);
  }

  private detectPetsciiString(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): {
    start: number;
    end: number;
    subtype: string;
    length: number;
    cleanRatio: number;
    confidence: number;
  } | null {
    const regionSize = region.end - region.start;

    // Try null-terminated detection
    const nullResult = this.tryNullTerminated(memory, region);
    if (nullResult) return nullResult;

    // Try high-bit terminated detection
    const highbitResult = this.tryHighbitTerminated(memory, region);
    if (highbitResult) return highbitResult;

    // Try length-prefixed detection
    const lengthResult = this.tryLengthPrefixed(memory, region);
    if (lengthResult) return lengthResult;

    // Try plain PETSCII (no terminator, entire region is text)
    const plainResult = this.tryPlainPetscii(memory, region);
    if (plainResult) return plainResult;

    return null;
  }

  private tryNullTerminated(
    memory: Uint8Array,
    region: { start: number; end: number }
  ) {
    // Last byte must be $00
    if (memory[region.end - 1] !== 0x00) return null;

    // All bytes before terminator must be printable PETSCII
    const textEnd = region.end - 1;
    const textLen = textEnd - region.start;
    if (textLen < MIN_STRING_LENGTH) return null;

    let printable = 0;
    for (let i = region.start; i < textEnd; i++) {
      if (this.isPetsciiPrintable(memory[i])) printable++;
    }

    const ratio = printable / textLen;
    if (ratio < 0.7) return null;

    return {
      start: region.start,
      end: region.end,
      subtype: "petscii_null",
      length: textLen,
      cleanRatio: ratio,
      confidence: ratio > 0.9 ? 70 : 50,
    };
  }

  private tryHighbitTerminated(
    memory: Uint8Array,
    region: { start: number; end: number }
  ) {
    const lastByte = memory[region.end - 1];
    // Last byte must have bit 7 set, and stripping it yields a printable char
    if ((lastByte & 0x80) === 0) return null;
    if (!this.isPetsciiPrintable(lastByte & 0x7f)) return null;

    const textLen = region.end - region.start;
    if (textLen < MIN_STRING_LENGTH) return null;

    // All bytes except the last must be printable PETSCII (without high bit)
    let printable = 0;
    for (let i = region.start; i < region.end - 1; i++) {
      if (this.isPetsciiPrintable(memory[i])) printable++;
    }

    const ratio = printable / (textLen - 1);
    if (ratio < 0.7) return null;

    return {
      start: region.start,
      end: region.end,
      subtype: "petscii_highbit",
      length: textLen,
      cleanRatio: ratio,
      confidence: ratio > 0.9 ? 65 : 45,
    };
  }

  private tryLengthPrefixed(
    memory: Uint8Array,
    region: { start: number; end: number }
  ) {
    const firstByte = memory[region.start];
    const regionSize = region.end - region.start;

    // First byte is the string length; the rest is the string content
    if (firstByte === 0 || firstByte + 1 !== regionSize) return null;
    if (firstByte < MIN_STRING_LENGTH) return null;

    let printable = 0;
    for (let i = region.start + 1; i < region.end; i++) {
      if (this.isPetsciiPrintable(memory[i])) printable++;
    }

    const ratio = printable / firstByte;
    if (ratio < 0.7) return null;

    return {
      start: region.start,
      end: region.end,
      subtype: "petscii_length",
      length: firstByte,
      cleanRatio: ratio,
      confidence: ratio > 0.9 ? 65 : 45,
    };
  }

  private tryPlainPetscii(
    memory: Uint8Array,
    region: { start: number; end: number }
  ) {
    const textLen = region.end - region.start;
    if (textLen < MIN_STRING_LENGTH) return null;

    let printable = 0;
    for (let i = region.start; i < region.end; i++) {
      if (this.isPetsciiPrintable(memory[i])) printable++;
    }

    const ratio = printable / textLen;
    if (ratio < 0.75) return null;

    return {
      start: region.start,
      end: region.end,
      subtype: "petscii",
      length: textLen,
      cleanRatio: ratio,
      confidence: ratio > 0.9 ? 55 : 35,
    };
  }

  private detectScreenCodes(
    memory: Uint8Array,
    region: { start: number; end: number }
  ): {
    start: number;
    end: number;
    length: number;
    cleanRatio: number;
    confidence: number;
  } | null {
    const textLen = region.end - region.start;
    if (textLen < MIN_STRING_LENGTH) return null;

    // Screen codes: $00-$3F covers @, A-Z, digits, common punctuation
    let inRange = 0;
    for (let i = region.start; i < region.end; i++) {
      if (memory[i] <= 0x3f) inRange++;
    }

    const ratio = inRange / textLen;
    if (ratio < 0.8) return null;

    return {
      start: region.start,
      end: region.end,
      length: textLen,
      cleanRatio: ratio,
      confidence: ratio > 0.9 ? 60 : 40,
    };
  }

  private buildEvidence(
    subtype: string,
    length: number,
    cleanRatio: number,
    isCodeReferenced: boolean
  ): string[] {
    const evidence: string[] = [];
    evidence.push(`PETSCII string (${subtype}), ${length} characters`);
    evidence.push(`Clean ratio: ${(cleanRatio * 100).toFixed(0)}% printable`);
    if (isCodeReferenced) evidence.push("Referenced by code");
    return evidence;
  }

  /** Convert PETSCII bytes to a readable label (ASCII approximation) */
  private makeLabel(memory: Uint8Array, start: number, end: number): string {
    const chars: string[] = [];
    const limit = Math.min(end, start + 20); // cap label length
    for (let i = start; i < limit; i++) {
      let b = memory[i];
      if (b === 0x00) break; // null terminator
      b = b & 0x7f; // strip high bit
      if (b >= 0x41 && b <= 0x5a) {
        // PETSCII upper case letters map to lower case ASCII
        chars.push(String.fromCharCode(b + 0x20));
      } else if (b >= 0x20 && b <= 0x40) {
        chars.push(String.fromCharCode(b));
      } else {
        chars.push("?");
      }
    }
    const text = chars.join("");
    return `str_${text.replace(/[^a-z0-9]/gi, "_").substring(0, 16)}`;
  }

  /** Convert screen codes to a readable label */
  private makeScreenCodeLabel(memory: Uint8Array, start: number, end: number): string {
    const chars: string[] = [];
    const limit = Math.min(end, start + 20);
    for (let i = start; i < limit; i++) {
      const b = memory[i];
      if (b >= 0x01 && b <= 0x1a) {
        // Screen code A-Z
        chars.push(String.fromCharCode(b + 0x40));
      } else if (b === 0x20) {
        chars.push(" ");
      } else if (b >= 0x30 && b <= 0x39) {
        chars.push(String.fromCharCode(b));
      } else {
        chars.push("?");
      }
    }
    const text = chars.join("");
    return `scrstr_${text.replace(/[^a-z0-9]/gi, "_").substring(0, 16)}`;
  }
}
