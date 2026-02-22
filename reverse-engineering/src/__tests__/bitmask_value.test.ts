import { describe, it, expect } from "vitest";
import {
  bitmaskFromImm,
  bitmaskUnknown,
  isFullyKnown,
  concreteValue,
  transferAND,
  transferORA,
  transferEOR,
  transferLDA_IMM,
  transferLDA_MEM,
  meetBitmask,
  collapseToMask,
  registerFromImm,
  registerUnknown,
  registerFromValues,
  registerAND,
  registerORA,
  registerEOR,
  meetRegister,
  bitmaskEquals,
  registerEquals,
} from "../bitmask_value.js";

describe("BitmaskValue", () => {
  describe("constructors", () => {
    it("bitmaskFromImm creates fully known value", () => {
      const bm = bitmaskFromImm(0x37);
      expect(bm.knownMask).toBe(0xFF);
      expect(bm.knownValue).toBe(0x37);
      expect(isFullyKnown(bm)).toBe(true);
      expect(concreteValue(bm)).toBe(0x37);
    });

    it("bitmaskUnknown creates fully unknown value", () => {
      const bm = bitmaskUnknown();
      expect(bm.knownMask).toBe(0x00);
      expect(bm.knownValue).toBe(0x00);
      expect(isFullyKnown(bm)).toBe(false);
      expect(concreteValue(bm)).toBeNull();
    });
  });

  describe("transfer functions", () => {
    it("AND #$F8 on unknown → lower 3 bits known zero", () => {
      const input = bitmaskUnknown(); // ????????
      const result = transferAND(input, 0xF8); // AND #$F8
      // imm=0 bits (0-2) become known-zero, bits 3-7 stay unknown
      expect(result.knownMask).toBe(0x07);
      expect(result.knownValue).toBe(0x00);
    });

    it("ORA #$05 on partially known → sets bits 0,2 known", () => {
      // Start: ?????000 (after AND #$F8)
      const input = { knownMask: 0x07, knownValue: 0x00 };
      const result = transferORA(input, 0x05); // ORA #$05 = %00000101
      // Bits 0,2 forced to 1; bit 1 was known-zero, stays known-zero
      expect(result.knownMask).toBe(0x07);
      expect(result.knownValue).toBe(0x05);
    });

    it("spec example: LDA $01 / AND #$F8 / ORA #$05", () => {
      // LDA $01 → fully unknown
      let state = transferLDA_MEM();
      expect(state.knownMask).toBe(0x00);

      // AND #$F8 → bits 0-2 known zero
      state = transferAND(state, 0xF8);
      expect(state.knownMask).toBe(0x07);
      expect(state.knownValue).toBe(0x00);

      // ORA #$05 → bits 0-2 known as 101
      state = transferORA(state, 0x05);
      expect(state.knownMask).toBe(0x07);
      expect(state.knownValue).toBe(0x05);
    });

    it("LDA #imm creates fully known value", () => {
      const result = transferLDA_IMM(0x35);
      expect(isFullyKnown(result)).toBe(true);
      expect(concreteValue(result)).toBe(0x35);
    });

    it("EOR preserves knowledge and flips bits", () => {
      const input = bitmaskFromImm(0x37); // fully known: 00110111
      const result = transferEOR(input, 0x02); // EOR #$02 = flip bit 1
      expect(isFullyKnown(result)).toBe(true);
      expect(concreteValue(result)).toBe(0x35);
    });

    it("EOR on unknown stays unknown", () => {
      const input = bitmaskUnknown();
      const result = transferEOR(input, 0xFF);
      expect(result.knownMask).toBe(0x00);
    });

    it("AND on fully known value works correctly", () => {
      const input = bitmaskFromImm(0xFF);
      const result = transferAND(input, 0x0F);
      expect(isFullyKnown(result)).toBe(true);
      expect(concreteValue(result)).toBe(0x0F);
    });

    it("ORA on fully known value works correctly", () => {
      const input = bitmaskFromImm(0x30);
      const result = transferORA(input, 0x07);
      expect(isFullyKnown(result)).toBe(true);
      expect(concreteValue(result)).toBe(0x37);
    });
  });

  describe("meet", () => {
    it("meet of identical values is the same value", () => {
      const a = bitmaskFromImm(0x37);
      const b = bitmaskFromImm(0x37);
      const result = meetBitmask(a, b);
      expect(isFullyKnown(result)).toBe(true);
      expect(concreteValue(result)).toBe(0x37);
    });

    it("meet of {$35, $37} → bit 1 unknown, all others known", () => {
      // $35 = 00110101, $37 = 00110111 → differ only in bit 1
      const a = bitmaskFromImm(0x35);
      const b = bitmaskFromImm(0x37);
      const result = meetBitmask(a, b);
      expect(result.knownMask).toBe(0xFD); // all known except bit 1
      expect(result.knownValue).toBe(0x35); // known bits match $35
    });

    it("meet of fully known and fully unknown is fully unknown", () => {
      const a = bitmaskFromImm(0x37);
      const b = bitmaskUnknown();
      const result = meetBitmask(a, b);
      expect(result.knownMask).toBe(0x00);
    });

    it("meet of partially known values keeps agreed bits", () => {
      // ?????101 and ?????111 → ????_?1?1 (bits 0,2 agree, bit 1 disagrees)
      const a = { knownMask: 0x07, knownValue: 0x05 };
      const b = { knownMask: 0x07, knownValue: 0x07 };
      const result = meetBitmask(a, b);
      expect(result.knownMask).toBe(0x05); // bits 0 and 2 are agreed
      expect(result.knownValue).toBe(0x05); // both have bit 0=1, bit 2=1
    });
  });

  describe("collapseToMask", () => {
    it("empty set → fully unknown", () => {
      const result = collapseToMask(new Set());
      expect(result.knownMask).toBe(0x00);
    });

    it("single value → fully known", () => {
      const result = collapseToMask(new Set([0x37]));
      expect(result.knownMask).toBe(0xFF);
      expect(result.knownValue).toBe(0x37);
    });

    it("{$35, $37} → knownMask=0xFD, knownValue=0x35", () => {
      const result = collapseToMask(new Set([0x35, 0x37]));
      expect(result.knownMask).toBe(0xFD);
      expect(result.knownValue).toBe(0x35);
    });

    it("{$30, $37} → preserves common bits", () => {
      // $30 = 00110000, $37 = 00110111 → bits 4-5 always 1, bits 6-7 always 0
      const result = collapseToMask(new Set([0x30, 0x37]));
      // allOnes: 0x30 & 0x37 = 0x30 → bits that are 1 in both
      // allZeros: (~0x30 & 0xFF) & (~0x37 & 0xFF) = 0xCF & 0xC8 = 0xC8
      expect(result.knownMask).toBe(0x30 | 0xC8); // 0xF8
      expect(result.knownValue).toBe(0x30);
    });
  });

  describe("RegisterValue", () => {
    it("registerFromImm creates known register", () => {
      const reg = registerFromImm(0x37);
      expect(isFullyKnown(reg.bitmask)).toBe(true);
      expect(reg.possibleValues).toEqual(new Set([0x37]));
      expect(reg.isDynamic).toBe(false);
    });

    it("registerUnknown creates unknown register", () => {
      const reg = registerUnknown();
      expect(reg.possibleValues).toBeNull();
      expect(reg.isDynamic).toBe(true);
    });

    it("registerFromValues with small set preserves values", () => {
      const reg = registerFromValues(new Set([0x35, 0x37]));
      expect(reg.possibleValues).toEqual(new Set([0x35, 0x37]));
      expect(reg.bitmask.knownMask).toBe(0xFD);
    });

    it("registerFromValues with large set collapses to bitmask", () => {
      const values = new Set(Array.from({ length: 20 }, (_, i) => i));
      const reg = registerFromValues(values);
      expect(reg.possibleValues).toBeNull(); // collapsed
    });

    it("registerAND applies to both bitmask and value set", () => {
      const reg = registerFromValues(new Set([0x37, 0x35]));
      const result = registerAND(reg, 0xF8);
      expect(result.possibleValues).toEqual(new Set([0x30])); // both AND to 0x30
      expect(result.bitmask.knownMask & 0x07).toBe(0x07); // lower 3 bits known
    });

    it("registerORA applies to both bitmask and value set", () => {
      const reg = registerFromValues(new Set([0x30]));
      const result = registerORA(reg, 0x07);
      expect(result.possibleValues).toEqual(new Set([0x37]));
    });

    it("registerEOR applies to both bitmask and value set", () => {
      const reg = registerFromImm(0x37);
      const result = registerEOR(reg, 0x02);
      expect(result.possibleValues).toEqual(new Set([0x35]));
    });

    it("meetRegister unions value sets", () => {
      const a = registerFromImm(0x35);
      const b = registerFromImm(0x37);
      const result = meetRegister(a, b);
      expect(result.possibleValues).toEqual(new Set([0x35, 0x37]));
      expect(result.bitmask.knownMask).toBe(0xFD);
    });
  });

  describe("equality", () => {
    it("bitmaskEquals detects equal bitmasks", () => {
      expect(bitmaskEquals(bitmaskFromImm(0x37), bitmaskFromImm(0x37))).toBe(true);
      expect(bitmaskEquals(bitmaskFromImm(0x37), bitmaskFromImm(0x35))).toBe(false);
    });

    it("registerEquals detects equal registers", () => {
      const a = registerFromImm(0x37);
      const b = registerFromImm(0x37);
      expect(registerEquals(a, b)).toBe(true);
    });

    it("registerEquals detects different registers", () => {
      const a = registerFromImm(0x37);
      const b = registerUnknown();
      expect(registerEquals(a, b)).toBe(false);
    });
  });
});
