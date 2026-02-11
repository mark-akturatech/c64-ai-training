# MACHINE - NOP (opcode $EA)

**Summary:** NOP (opcode $EA) is a single-byte 6502 instruction that performs no operation (implied addressing). Common uses: fill or reserve bytes, replace removed instructions to preserve code alignment, and replace BRK ($00) markers after debugging.

## Description
NOP does nothing to registers or processor flags and consumes one byte of memory (implied addressing — no operand). Typical uses described in the source:

- Removing an instruction without shifting all following code: overwrite the removed instruction's bytes with NOP ($EA) so code alignment and absolute addresses remain valid.
- Reserving space for future instructions: pre-fill areas of code with NOPs so extra instructions can later be inserted without relocating everything.
- Debugging with BRK: place BRK ($00) between modules to break into the monitor during testing; after verification, replace BRKs with NOPs ($EA) so execution proceeds normally.

Behavioral note from the source is quoted and critiqued: the source text questions calling NOP "implied address." Standard 6502 documentation treats NOP as an implied (accumulator/implicit) addressing instruction (no operand).  
**[Note: Source may contain an error — NOP uses the implied addressing mode (no operand).]**

## Source Code
```asm
; Example showing removing a 3-byte STA and replacing with NOPs
; (addresses shown as example)
0350  LDA #$00
0352  STA $1234
0355  ORA $3456

; If STA $1234 at 0352 is removed, replace its three bytes with NOP ($EA):
; 0352: $EA
; 0353: $EA
; 0354: $EA
```

## References
- "implied_address_mode" — expands on NOP as a no-op implied instruction

## Mnemonics
- NOP
