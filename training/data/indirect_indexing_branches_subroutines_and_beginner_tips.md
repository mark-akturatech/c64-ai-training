# 6502/6510: Indirect addressing, branches, subroutines, examples, and development advice

**Summary:** Covers indirect-indexed addressing (LDA ($02,X)), notes on when to use (indirect,X) vs (indirect),Y, branch/testing instructions and flag usage (BEQ/BNE range -128..+127), index register inc/dec (INX/DEX/INY/DEY), comparisons (CPX/CPY), JSR/JMP and KERNAL CHROUT at $FFD2 with example programs (printing "Hi" and printing the alphabet). Contains a high-level checklist for approaching large machine-language tasks and study tips.

## Indirect-indexed addressing (LDA ($02,X)) and indirect modes

- (Indirect,X) — syntax LDA ($02,X):
  - Effective operation: add X to the zero-page base operand ($02) (wrap-around in zero page), use the resulting zero-page address to read a 16-bit little-endian pointer (low byte then high byte), then load A from the address pointed to.
  - Use case: selecting among pointer entries stored in zero page where the index (X) selects which pointer to use (common for small pointer tables or dynamic dispatch).
- (Indirect),Y — syntax LDA ($02),Y:
  - Effective operation: read 16-bit pointer from given zero-page address $02 (low, high), then add Y to that 16-bit pointer to form the effective address, then load A.
  - Use case: iterating through data blocks pointed to by a fixed table of pointers (pointer table stays fixed, Y offsets within the target block).
- NOTE on relative usefulness:
  - (Indirect,X) is convenient when the pointers themselves are laid out consecutively in zero page and you want to index into the pointer table.
  - (Indirect),Y is convenient when you have a table of pointers and you want to index within each pointed-to buffer (Y as offset into pointed buffer).
  - Both require the pointer table in zero page; choose based on which index (X or Y) should select pointer vs offset within pointed block.

## Branches and testing (flags, BEQ/BNE, BNE loop examples)

- Relevant flags used for branching:
  - Zero (Z): set if last operation result was zero (e.g., CMP, CPX, CPY, arithmetic results).
  - Negative (N): set from high bit of last operation result (signed tests).
  - Carry (C): set for unsigned compares/borrows and ADC/SBC results.
- Common branch instructions:
  - BEQ — branch if Z = 1 (equal)
  - BNE — branch if Z = 0 (not equal)
  - BPL/BMI — branch on N clear/set (positive/negative)
  - BCS/BCC — branch on C set/clear (carry set/clear)
- Branch offset/range:
  - Branch instructions encode a signed 8-bit relative offset applied to the program counter after the branch opcode; valid range is -128 to +127 bytes from the address following the branch.
  - Assemblers (including older monitor/assemblers like 64MON) will reject or must expand branches whose target lies outside that range; typical assembler workarounds insert a long-branch sequence (e.g., conditional-branch-to-skip; JMP far-target; skip:), but behavior varies by assembler.
- BNE loop example (concept):
  - Typical loop using X as counter:
    - LDX #$05
    - loop: ; do work
      INX or DEX as appropriate
      CPX #$00
      BNE loop
  - Or using CPX to test a value then BNE back until equal.

## Index register increment/decrement (INX/DEX/INY/DEY)

- INX / DEX:
  - Increment or decrement X register by 1.
  - Affects N and Z flags (Negative and Zero); does not affect C.
- INY / DEY:
  - Increment or decrement Y register by 1.
  - Affects N and Z flags.
- Use patterns:
  - Loop counters (DEX with BNE, INX with CPX/BNE), table indexing (INX/INY to step through data), pointer adjustments (with separate pointer logic).

## Comparisons (CPX/CPY) and branching

- CPX #imm / CPY #imm:
  - Compare register X or Y with immediate (or memory); internally subtracts operand from register (R - M) setting flags (C, Z, N) but does not change the register.
  - Use CPX/CPY followed by BNE/BEQ/BCS/BCC to branch by unsigned comparison semantics.
- Typical loop termination:
  - Set X to start value and CPX to limit then BNE/BEQ. Example used below.

## Subroutines: JSR, RTS, JMP and KERNAL CHROUT ($FFD2)

- JSR addr:
  - Pushes a 16-bit return address onto the stack (6502 convention), then sets PC to addr (enter subroutine).
  - RTS pops the 16-bit return address and resumes at the instruction after the original JSR.
- JMP addr and JMP (addr):
  - JMP absolute transfers control unconditionally and does not push a return address.
  - JMP (addr) performs an indirect jump by fetching a 16-bit pointer from the given memory address (6502 indirect JMP bug: if addr low byte is $FF, the high byte is read from the same page's start — be aware).
- KERNAL CHROUT ($FFD2):
  - Standard KERNAL routine to output a character in A to the current output device (typically screen).
  - A is expected to contain a PETSCII character code (C64 character encoding).
  - Call with JSR $FFD2. Does not destroy all registers (consult KERNAL documentation for preserved registers when precise behavior matters).

## Example programs and snippets

(See Source Code section for assembly listings; these examples demonstrate CHROUT use, JSR, TXA, INX, CPX, BNE, and indirect addressing.)

- Printing "Hi" using KERNAL CHROUT ($FFD2):
  - Load A with PETSCII for 'H', JSR $FFD2; load A with PETSCII for 'i', JSR $FFD2.
- Alphabet printer using X and TXA:
  - Initialize X to PETSCII for 'A' ($41), loop: TXA; JSR $FFD2; INX; CPX #$5B ; BNE loop
  - CPX compares X with $5B which is one past 'Z' ($5A), branch back until X == $5B.
- Indirect,X example outline:
  - Place pointer table in zero page (consecutive low/high bytes), index into table with X, then LDA ($02,X) will load data using the pointer fetched from zero page+X.

## Approaching large machine-language tasks (development advice)

- Study existing 6502/6510 machine-language programs from magazines and other computers using the same CPU; read and understand code carefully.
- Use available utilities and the KERNAL for services such as keyboard input, text output, and device control.
- Advantages of machine language: speed and tighter control over allowed user actions.
- Decompose big problems: draw block diagrams, map memory usage, break into functional modules (example roulette game flow):
  - Display title
  - Ask for instructions -> display if requested
  - START: initialize
  - MAIN: display table, take bets, spin wheel, slow wheel to stop, check bets, inform player
  - Loop MAIN while player has money; else inform and return to START
- Keep working through small pieces and test incrementally.

## Source Code
```asm
; Example: print "Hi" using KERNAL CHROUT ($FFD2)
        SEP ; assembler directive example (not required by all assemblers)
        LDA #$48        ; 'H' in PETSCII
        JSR $FFD2       ; CHROUT
        LDA #$69        ; 'i' in PETSCII
        JSR $FFD2       ; CHROUT
        RTS

; Example: print alphabet A..Z using X, TXA, JSR $FFD2, INX, CPX, BNE
        LDX #$41        ; ASCII/PETSCII 'A' = $41
loop:   TXA
        JSR $FFD2
        INX
        CPX #$5B        ; one past 'Z' ($5A)
        BNE loop
        RTS

; Indirect,X example (concept)
; Zero page pointer table at $02: pointers to data blocks
; Table: .byte lo1, hi1, lo2, hi2, ...
; To load a byte from pointer selected by X:
        LDX #$00        ; choose first pointer entry
        LDA ($02,X)     ; load A from address pointed to by zero page bytes at ($02 + X)
        ; (wrap-around in zero page applies)
```

## Key Registers
- $FFD2 - KERNAL - CHROUT (print character routine; A = PETSCII character)

## References
- "mcs6510_instruction_set_part1" — expands on instructions and opcodes for branching and register operations
- "kernal_routines_overview_and_list" — KERNAL subroutine table and descriptions (CALL addresses like $FFD2)

## Labels
- CHROUT

## Mnemonics
- LDA
- LDX
- TXA
- JSR
- RTS
- JMP
- BEQ
- BNE
- BPL
- BMI
- BCS
- BCC
- INX
- DEX
- INY
- DEY
- CPX
- CPY
- CMP
