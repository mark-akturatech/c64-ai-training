# NMOS 6510 — DCP in multi-byte (16-bit) decrement + compare sequences

**Summary:** Shows using the undocumented NMOS 6510 illegal opcode DCP (DEC memory then CMP A,mem) with (zp),Y addressing to both decrement memory and set CMP flags (N, Z, C). Useful in 16-bit decrement loops where low byte is decremented and high byte conditionally decremented; saves bytes and cycles versus separate DEC/CMP sequences.

## Explanation
DCP is an undocumented NMOS 6502/6510 instruction that performs DEC (memory) followed immediately by CMP A,(memory), leaving the processor flags (N, Z, C) as if a CMP had just executed against the decremented memory value. Because it combines a decrement and a compare into one opcode, it can replace separate DEC and CMP instructions when both actions are needed.

Common use-case shown here: decrement a low byte (zero-page indexed, e.g. (zp),Y) as part of a 16-bit decrement; you also need to react to the compare result (N, Z, C). Instead of doing a DEC followed by CMP (or doing a CMP of the original value), use DCP (zp),Y to both decrement the memory and set the compare flags in one shot.

Benefits (from example):
- Replaces a separate CMP (zp),Y with DCP (zp),Y when you also need the decrement.
- Saves code size and cycles: the example claims 7 bytes smaller and 12 cycles faster.
- You can load A (LDA #imm) at any earlier point before the DCP; the compare performed by DCP uses the current A when DCP executes.

Flags behavior: N, Z, and C are affected exactly as CMP would be (compare A with the decremented memory). That is, C is set if A >= M (after decrement), Z if A == M (after decrement), and N is the sign bit of A - M.

Caveat (brief): DCP is an illegal/undocumented opcode — behaviour guaranteed on NMOS 6502/6510 but not on all variants (use only where the undocumented opcode is known to be present).

## Source Code
```asm
; Original (compare only)
; value to compare with in A
CMP (zp),Y
; react on N, Z, C

; Using DCP (decrement+compare)
LDA #$42        ; value to compare with in A (may be loaded earlier)
LDY #$00
DCP (zp),Y       ; DEC (zp),Y then CMP A,(zp),Y — sets N,Z,C for the decremented byte
; react on N, Z, C

; Notes:
; - Example claims this sequence is 7 bytes smaller and 12 cycles faster than separate DEC/CMP variants.
; - A can be loaded any time before the DCP instruction.
```

## References
- "dcp_operation_and_equivalents" — expands on flags and compare behavior that makes this trick work

## Mnemonics
- DCP
- DCM
