# NMOS 6510 — SBC (Subtract with Carry) opcode mappings and decimal-mode behavior

**Summary:** SBC opcodes $F5 (zp,X), $E5 (zp), $E9 (immediate), and undocumented immediate $EB on the NMOS 6510; describes binary vs BCD (decimal) subtraction behavior, internal half-carry use for lower-nibble fixup, high-nibble fixup conditions, wraparound examples ($00 - $01 => $FF binary, $99 BCD), and precise flag semantics (N, V, Z, C). Includes test program filenames.

## Operation and decimal-mode behavior
SBC performs A = A - {addr} (memory) or A = A - #{imm} (immediate) with the carry flag used as borrow-in. On the NMOS 6510 the difference between binary and decimal (BCD) modes for SBC is limited to a result-fixup step; the core subtraction is carried out in binary and flags computed from that binary result before any decimal correction.

Decimal-subtraction specifics:
- The processor uses an internal "half-carry" indicator for the lower nibble to decide whether a BCD fixup is required for the low nibble. The fixup is applied only when a nibble overflows (i.e., requires correction).
- For legal BCD inputs, once the lower-nibble fixup is applied it cannot overflow again during the fixup stage; the CPU does not perform additional overflow checks during fixup.
- The high-nibble BCD fixup is applied only if that nibble overflows — equivalently, when the final C flag would be cleared by the binary subtraction (indicating a borrow out).
- Binary wraparound example: $00 - $01 binary => $FF and C clear.
- Decimal wraparound example: $00 - $01 decimal (BCD) => $99 and C clear.

Flag semantics (as stated in source):
- N and V: not affected by decimal mode (their computation is the same whether decimal mode is set or not).
- Z: determined by the binary subtraction result (set if the binary operation yields zero), and is not affected by the decimal fixup.
- C: serves as the multi-byte borrow/carry as expected (i.e., it indicates borrow/borrow-out across multi-byte operations).

Undocumented opcode:
- $EB is an undocumented immediate form of SBC (SBC #imm) on NMOS 6502/6510 hardware; behavior matches the immediate-form subtraction with the same decimal-mode fixup rules.

## Source Code
```asm
; Opcode mappings and addressing modes (NMOS 6510)
; Format: bytes cycles flags/notes
$F5    SBC zp,X      ; 2 bytes, 4 cycles
$E5    SBC zp        ; 2 bytes, 3 cycles
$E9    SBC #imm      ; 2 bytes, 2 cycles
$EB    SBC #imm      ; 2 bytes, 2 cycles (undocumented immediate)
; Short mnemonics / examples:
; A = A - {addr}
; A = A - #{imm}
; Operation: subtract immediate value from accumulator with carry.
```

```text
; Test program filenames (CPU/decimalmode tests for SBC and undocumented immediate)
CPU/decimalmode/sbc00.prg
CPU/decimalmode/sbc01.prg
CPU/decimalmode/sbc02.prg
CPU/decimalmode/sbc10.prg
CPU/decimalmode/sbc11.prg
CPU/decimalmode/sbc12.prg
CPU/decimalmode/sbcEB00.prg
CPU/decimalmode/sbcEB01.prg
CPU/decimalmode/sbcEB02.prg
CPU/decimalmode/sbcEB10.prg
CPU/decimalmode/sbcEB11.prg
CPU/decimalmode/sbcEB12.prg
```

## References
- "sbc_pseudocode" — expands on pseudocode implementing the decimal-mode fixups and flag updates for SBC
- "arr_instruction_decimal_mode" — expands on related decimal-mode instruction (ARR) and how it does BCD fixups

## Mnemonics
- SBC
