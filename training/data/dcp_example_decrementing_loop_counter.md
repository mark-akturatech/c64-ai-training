# NMOS 6510 — DCP (DEC + CMP) usage examples

**Summary:** Undocumented NMOS 6502/6510 opcode DCP performs DEC (memory) followed by CMP (memory with A) — it decrements memory, sets N/Z/C as CMP would, and leaves A unchanged. Useful for saving cycles/bytes in decrement loops, 16-bit pointer decrements, and for implementing DEC (zp),Y behavior (addressing (zp),Y).

## Description
DCP is an undocumented (illegal) opcode that combines DEC mem and CMP mem into a single memory operation: the memory is decremented, then compared against the accumulator, producing the same N, Z and C flags as a separate DEC followed by CMP would. Crucially, A is not modified.

Common uses shown here:
- Replace DEC + LDA + CMP + BNE with a single DCP + BNE to save bytes and cycles while keeping A usable.
- Decrement a 16-bit pointer (low byte then high byte) where DCP on the low byte can be followed by BNE to skip the high-byte DEC; the compare result (flags) is available for branching and the carry/borrow behavior can be used for flow control as shown.
- Implement DEC (zp),Y (which the 6502 lacks) by using DCP (zp),Y: this is smaller and faster than load/modify/store sequences and leaves A unchanged while providing a compare result.

Performance note from the example: using DCP (zp),Y over the legal LDA/SEC/SBC/STA sequence is 5 bytes smaller and 7 cycles faster (and also leaves A untouched, while updating N/Z/C).

Behavior summary:
- Operation: memory := memory - 1 ; then set flags as if A - memory was compared
- Affected flags: N, Z, C (as from CMP). A is unchanged.
- Typical replacement pattern: DEC mem; LDA mem; CMP A ; BNE ...  ->  DCP mem; BNE ...
- Addressing: works on the same memory addressing modes as DEC/CMP (zp, absolute, indexed, indirect indexed, etc.), enabling e.g. DCP (zp),Y.

See Source Code for concise assembly examples.

## Source Code
```asm
; Example: decrementing a 16-bit pointer (low byte then high byte).
; Uses DCP on low byte; if result != 0 branch, otherwise DEC high byte.
    LDA #$FF
    DCP ptr       ; decrement low byte and compare with A (A left as $FF)
    BNE skip_high ; if low byte != 0 after decrement, skip decrement of high byte
    DEC ptr+1     ; decrement high byte
skip_high:
    ; carry is set always for free (from the compare)
```

```asm
; Example: decrement indirect indexed memory.
; Legal (standard) sequence — 6502 has no DEC (zp),Y
    LDY #$00
    LDA (zp),Y
    SEC
    SBC #$01
    STA (zp),Y

; Replacement using undocumented DCP (smaller, faster, leaves A unchanged)
    LDY #$00
    DCP (zp),Y    ; DEC (zp),Y + CMP A,(zp),Y in one instruction
```

```asm
; Illustrative transformation: DEC + CMP loop replacement
; (original, verbose)
    DEC count
    LDA count
    CMP #$01
    BNE continue

; (using DCP)
    DCP count
    BNE continue   ; leaves A usable and saves cycles/bytes
```

## References
- "dcp_operation_and_equivalents" — expands on behavior and equivalence of DCP to DEC + CMP

## Mnemonics
- DCP
- DCM
