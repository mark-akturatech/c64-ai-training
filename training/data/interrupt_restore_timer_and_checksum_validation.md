# ROM: Finalize STOP / checksum loop (.$FB48 - .$FB8B)

**Summary:** Disables interrupts (SEI), manipulates CIA 1 ICR ($DC0D), updates copy/receiver counters ($BE, $A7), optionally restores CPU state for STOP (JSR $FC93), copies I/O start address into the buffer (JSR $FB8E), computes a block checksum by iterating LDA ($AC),Y / EOR $AB while advancing the read/write pointer (JSR $FCDB / $FCD1), compares with stored checksum ($BD), sets serial-status checksum-error bit (JSR $FE1C) on mismatch, then jumps to the common register-restore/exit at $FEBC.

## Description
- Entry stores #$80 into zero page $AA and disables IRQ/NMI with SEI.
- Timer A interrupt is disabled and the CIA 1 Interrupt Control Register is written/read:
  - `LDX #$01` ; `STX $DC0D` — write 1 to CIA1 ICR to disable Timer A interrupt.
  - `LDX $DC0D` — read back CIA1 ICR into X.
- Copy-count handling:
  - Load X from zero page $BE, decrement X, and conditionally store it back to $BE. If the decremented X sets the negative flag, execution continues without storing (code branches to the decrement/receiver handling).
- Receiver-bit and STOP handling:
  - Decrement zero page $A7 (receiver input bit temporary). If result is zero, jump to the STOP restore routine (`JSR $FC93`) at $FB68.
  - If $A7 did not reach zero, load $9E and branch to the common register-restore/exit at $FB8B if $9E != 0. If $9E == 0, save X back to $BE and fall through to the restore/exit branch.
- STOP path:
  - `JSR $FC93` — restore everything for STOP.
- Checksum path:
  - `JSR $FB8E` — copy I/O start address into the buffer address.
  - Clear Y and zero $AB (checksum accumulator).
  - Loop: `LDA ($AC),Y` ; `EOR $AB` ; `STA $AB` — accumulate XOR checksum over the buffer bytes.
  - `JSR $FCDB` — increment read/write pointer (increments buffer pointer) (short parenthetical: increments pointer).
  - `JSR $FCD1` — check read/write pointer, sets/clears carry when pointer >= end (short parenthetical: sets carry on end).
  - `BCC` back to loop while not at end.
  - After loop, `LDA $AB` ; `EOR $BD` ; `BEQ` — if XOR with stored checksum ($BD) yields zero, checksums match and execution jumps to common restore/exit.
  - On mismatch, `LDA #$20` ; `JSR $FE1C` — set the serial-status checksum-error bit (OR-in $20) via the serial-status update routine.
- Final exit:
  - `JMP $FEBC` — common register-restore and return-from-interrupt sequence used by short-block and early-exit paths.

Notes on flow control flags:
- The loop relies on `JSR $FCD1` to indicate buffer end via the carry flag; the `BCC` loops while not at end.
- Some conditional branches depend on zero/negative flags set by prior operations; the sequence is intentionally compact and uses previous flag state for subsequent BEQ/BNE checks.

## Source Code
```asm
.,FB48 A9 80    LDA #$80
.,FB4A 85 AA    STA $AA
.,FB4C 78       SEI
.,FB4D A2 01    LDX #$01
.,FB4F 8E 0D DC STX $DC0D
.,FB52 AE 0D DC LDX $DC0D
.,FB55 A6 BE    LDX $BE
.,FB57 CA       DEX
.,FB58 30 02    BMI $FB5C
.,FB5A 86 BE    STX $BE
.,FB5C C6 A7    DEC $A7
.,FB5E F0 08    BEQ $FB68
.,FB60 A5 9E    LDA $9E
.,FB62 D0 27    BNE $FB8B
.,FB64 85 BE    STA $BE
.,FB66 F0 23    BEQ $FB8B
.,FB68 20 93 FC JSR $FC93
.,FB6B 20 8E FB JSR $FB8E
.,FB6E A0 00    LDY #$00
.,FB70 84 AB    STY $AB
.,FB72 B1 AC    LDA ($AC),Y
.,FB74 45 AB    EOR $AB
.,FB76 85 AB    STA $AB
.,FB78 20 DB FC JSR $FCDB
.,FB7B 20 D1 FC JSR $FCD1
.,FB7E 90 F2    BCC $FB72
.,FB80 A5 AB    LDA $AB
.,FB82 45 BD    EOR $BD
.,FB84 F0 05    BEQ $FB8B
.,FB86 A9 20    LDA #$20
.,FB88 20 1C FE JSR $FE1C
.,FB8B 4C BC FE JMP $FEBC
```

## Key Registers
- $DC0D - CIA 1 - Interrupt Control Register (ICR)

## References
- "verify_and_pointer_increment" — expands on final pointer increment and early-exit behavior when read/write pointer handling finishes
- "store_character_entry_and_initial_timing" — expands on the common register-restore/exit target ($FEBC) used by initial short-block and other early exits