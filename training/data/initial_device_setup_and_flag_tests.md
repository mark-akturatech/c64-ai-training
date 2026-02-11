# KERNAL: Setup and early checks before writing directory entries ($FA60-$FA8A)

**Summary:** 6502/KERNAL code that initializes state before directory-write operations: calls $FB97, prepares buffers via $F8E2, tests/updates zero-page counters $BE,$B5 and flag byte $AA, calls device I/O routine $FE1C, and exits via JMP $FEBC. Key zero-page addresses: $9C, $A7, $AA, $BE, $B5.

## Description
This snippet (entry $FA60) performs early setup and conditional checks used when preparing to write directory entries or similar device write operations in the C64 KERNAL.

Control flow and effects (step-by-step):
- JSR $FB97 — call an initialization subroutine; returned accumulator is stored to zero page $9C.
- LDX #$DA and JSR $F8E2 — set X and call $F8E2 to prepare buffers (buffer setup routine).
- LDA $BE; BEQ $FA70 — if $BE is zero, skip storing it to $A7; otherwise STA $A7 (save $BE to $A7).
- Load A with #$0F and BIT $AA; BPL $FA8D — test $AA's bit 7 (negative flag). If N=0 (bit7 clear), branch to the alternate path at $FA8D (not shown here).
- If branch not taken (bit7 set), continue:
  - LDA $B5; BNE $FA86 — if $B5 non-zero, branch to $FA86 (skip device call).
  - LDX $BE; DEX; BNE $FA8A — decrement a copy of $BE and if result non-zero, jump to $FA8A (set $AA=0 and exit).
  - LDA #$08; JSR $FE1C — otherwise load #$08 and call $FE1C (device communication routine). If that routine returns with non-zero (BNE), branch to $FA8A.
  - If JSR $FE1C returns zero, fall through to A9 #$00; STA $AA — clear $AA.
- $FA8A: JMP $FEBC — central exit/jump to common cleanup and finalization.

Notes on flags and behavior:
- BIT $AA sets N and V based on $AA (BIT uses bit7 for N). BPL branches when N=0 (bit7 clear). (BIT sets N/V from operand)
- The JSR'd routines ($FB97, $F8E2, $FE1C) implement initialization, buffer preparation, and device I/O respectively; their side effects (flags/zero) influence the branches here.
- The sequence effectively decides whether to call the device routine and whether to clear the control/status byte $AA before jumping to the common exit at $FEBC.

## Source Code
```asm
.,FA60 20 97 FB JSR $FB97
.,FA63 85 9C    STA $9C
.,FA65 A2 DA    LDX #$DA
.,FA67 20 E2 F8 JSR $F8E2
.,FA6A A5 BE    LDA $BE
.,FA6C F0 02    BEQ $FA70
.,FA6E 85 A7    STA $A7
.,FA70 A9 0F    LDA #$0F
.,FA72 24 AA    BIT $AA
.,FA74 10 17    BPL $FA8D
.,FA76 A5 B5    LDA $B5
.,FA78 D0 0C    BNE $FA86
.,FA7A A6 BE    LDX $BE
.,FA7C CA       DEX
.,FA7D D0 0B    BNE $FA8A
.,FA7F A9 08    LDA #$08
.,FA81 20 1C FE JSR $FE1C
.,FA84 D0 04    BNE $FA8A
.,FA86 A9 00    LDA #$00
.,FA88 85 AA    STA $AA
.,FA8A 4C BC FE JMP $FEBC
```

## Key Registers
- $009C - Zero Page - stores return/result from $FB97 initialization
- $00A7 - Zero Page - temporary save of $BE (buffer/count)
- $00AA - Zero Page - control/status byte tested/cleared (BIT $AA used)
- $00BE - Zero Page - buffer/counter examined and used for logic
- $00B5 - Zero Page - counter checked to skip device call
- $FA60-$FA8A - KERNAL ROM - this code snippet (entry and internal flow)
- $FB97 - KERNAL ROM - initialization subroutine (called)
- $F8E2 - KERNAL ROM - buffer preparation routine (called with X=#$DA)
- $FE1C - KERNAL ROM - device communication routine (called with A=#$08)
- $FEBC - KERNAL ROM - common exit/finalization (JMP target)

## References
- "determine_write_parameters_and_call_device_routine" — continues with branch when BIT $AA indicates negative/overflow
- "finalize_write_compute_xor_and_cleanup" — covers overall flow that eventually jumps to $FEBC for central exit handling