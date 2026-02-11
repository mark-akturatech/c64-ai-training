# Branches and testing (Zero flag Z, BEQ/BNE, INX/DEX/INY/DEY, CPX/CPY, branch offsets)

**Summary:** Describes 6502/C64 status register Zero flag (Z), instructions that set/test flags (e.g. LDA #$00 sets Z), branch instructions BEQ/BNE that examine the status register, index register increment/decrement behavior with wrap-around (INX/DEX, INY/DEY), compare instructions (CPX/CPY) for testing registers/memory, and signed one-byte branch offset limits (-128..+127). Mentions assembler 64MON behavior for computing/validating branch offsets.

## Status flag and testing
- The Zero flag (Z) in the 6502 processor status is set when an instruction yields a zero result and cleared when the result is non-zero (e.g., LDA #$00 sets Z).  
- Branch instructions do not test the previous instruction directly; they examine the processor status flags. BEQ branches when Z is set (branch if equal/zero). BNE branches when Z is clear (branch if not equal/not zero).  
- Every conditional branch has an opposite branch (BEQ ↔ BNE for the zero condition).

## Index registers: increment/decrement and wrap-around
- INX increments the X index register; if X == $FF before INX, it wraps to $00 after INX.  
- DEX decrements the X index register; if X == $00 before DEX, it wraps to $FF after DEX.  
- INY/DEY behave identically for the Y index register.  
- These wrap-around properties are commonly used to loop until a particular wrap condition (e.g., loop while X != $00 using BNE after INX).

## Compare instructions (CPX/CPY) and usage
- CPX and CPY compare the X or Y index register against an immediate value or memory operand; they set processor flags (including Z) so branches can test the comparison result.  
- Example pattern: CPX #$40 followed by BEQ <label> will branch when X == $40.

## Branch instructions and offset limitations
- 6502 branch instructions use a signed one-byte relative offset (two's complement), so the branch displacement range is -128..+127 bytes relative to the address following the branch opcode.  
- Assemblers (e.g., 64MON) will accept an absolute target address and compute the correct signed offset, and will refuse/flag a branch that is out of range.  
- BE CAREFUL: branches are "quick" because they encode a relative offset rather than a full absolute address.

**[Note: Source may contain an error — the original text states "total range of 255 bytes"; a one-byte signed offset actually encodes 256 distinct values (from -128 to +127).]**

## Source Code
```asm
; examples extracted from source text
LDA #$00        ; sets Zero flag (Z)
CPX #$40
BEQ target      ; branch if X == $40 (Z set)

; index wrap example (conceptual)
INX
BNE loop        ; continue looping until X becomes zero
```

```text
Branch offset range (signed one-byte):
-128 .. +127    ; relative to the next instruction
```

## References
- "machine_code_and_registers_overview" — expands on Status register and flags among internal registers
- "subroutines_and_kernal_print" — covers branches used for control flow, subroutines and loops
- "alphabet_program_example" — example loop using CPX/INX/BNE to produce ordered output

## Mnemonics
- LDA
- BEQ
- BNE
- INX
- DEX
- INY
- DEY
- CPX
- CPY
