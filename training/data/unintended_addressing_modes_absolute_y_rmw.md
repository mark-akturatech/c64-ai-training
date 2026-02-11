# NMOS 6510 — Unintended Absolute,Y Indexed (R-M-W) Addressing-mode Behavior

**Summary:** Documentation of undocumented NMOS 6510 opcodes ($DB, $FB, $7B, $3B, $1B, $5B) that perform Absolute,Y (abs,Y) addressing as read-modify-write (R-M-W) instructions. Specifies instruction length (3 bytes), reported timing (7 cycles), opcode encodings, mnemonics (DCP/ISC/RRA/RLA/SLO/SRE abs,Y), and a per-cycle bus activity trace showing an extra read that uses the not-yet-corrected high byte.

**Description**

These undocumented opcodes implement an Absolute,Y indexed addressing variant that behaves as a read-modify-write (R-M-W) instruction. Characteristics include:

- **Instruction length:** 3 bytes (opcode, low byte, high byte).
- **Total cycles:** 7 cycles.
- **Opcode byte encodings:** Single-byte opcodes followed by 16-bit absolute address low/high.
- **Mnemonics:**
  - DCP abs,Y
  - ISC abs,Y
  - RRA abs,Y
  - RLA abs,Y
  - SLO abs,Y
  - SRE abs,Y

**Per-cycle bus activity:**

1. **Cycle 1:** Opcode fetch from PC.
2. **Cycle 2:** Read absolute address low (AAL) from the next PC byte.
3. **Cycle 3:** Read absolute address high (AAH) from the following PC byte.
4. **Cycle 4:** Read from address formed by (AAH, AAL+Y) before high byte correction.
5. **Cycle 5:** Read old data at effective address AA+Y.
6. **Cycle 6:** Write old data back to AA+Y (part of the R-M-W sequence).
7. **Cycle 7:** Write modified data to AA+Y.

**High-byte correction:**

- The CPU performs a read using the uncorrected high byte during cycle 4. If the addition of AAL and Y results in a carry, the high byte is corrected in subsequent cycles to account for the page crossing. This correction ensures that cycles 5 through 7 access the correct memory location.

**Example trace with page boundary crossing:**

Assume:
- AAL = $FF
- AAH = $10
- Y = $01

**Address calculation:**
- AAL + Y = $FF + $01 = $100 (carry = 1)
- Effective address = $11:00

**Cycle breakdown:**

1. **Cycle 1:** Fetch opcode.
2. **Cycle 2:** Fetch AAL ($FF).
3. **Cycle 3:** Fetch AAH ($10).
4. **Cycle 4:** Read from $10:00 (before high byte correction).
5. **Cycle 5:** Read from $11:00 (corrected address).
6. **Cycle 6:** Write old data to $11:00.
7. **Cycle 7:** Write modified data to $11:00.

**Practical implication:**

- The timing and ordering mean the CPU will perform a pre-correction read from the (AAH, AAL+Y) address before any high-byte correction for page crossing is applied, which is an unusual side-effect of these undocumented opcodes. This can affect the observable bus activity and any memory-mapped side effects that depend on the order of reads.

## Source Code

```asm
; Opcode encodings (opcode then absolute low, absolute high)
; DB lo hi  - DCP abs,Y
; FB lo hi  - ISC abs,Y
; 7B lo hi  - RRA abs,Y
; 3B lo hi  - RLA abs,Y
; 1B lo hi  - SLO abs,Y
; 5B lo hi  - SRE abs,Y
```

```text
Per-cycle bus activity:

Cycle  Address-Bus         Data-Bus                             Read/Write
1      PC                  Opcode fetch                         R
2      PC+1                Absolute Address Low                 R
3      PC+2                Absolute Address High                R
4      <AAH, AAL + Y>      Byte at target address before        R
                           high byte was corrected
5      AA + Y              Old Data                             R
6      AA + Y              Old Data                             W
7      AA + Y              New Data                             W
```

## References

- "lax_safe_usage_examples_and_magic_constant_detection" — expands on related undocumented opcode behaviors and practical testing.

## Mnemonics
- DCP
- ISC
- RRA
- RLA
- SLO
- SRE
