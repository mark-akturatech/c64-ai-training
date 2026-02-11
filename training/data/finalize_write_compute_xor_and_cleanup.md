# Finalize directory write, compute XOR checksum, and cleanup (KERNAL $FB43-$FB8B)

**Summary:** KERNAL routine (entry $FB43) finalizes a directory write by calling device send/handshake routines ($FCDB, $FCD1, $FC93, $FB8E), sets flags ($AA), disables IRQs (SEI), writes to CIA1 serial register ($DC0D), updates counters ($BE, $A7), and computes a simple XOR checksum by reading bytes from ($AC),Y into $AB. On completion it conditionally calls device handshake $FE1C and returns to the central exit $FEBC.

## Description
This code fragment performs the final device transfer and local verification steps after preparing a directory write. High-level flow:

- Call $FCDB to send the prepared buffer to the device; if $FCDB returns non-zero (BNE), jump to central exit at $FEBC.
- Set zero-page flag $AA = #$80 and disable interrupts with SEI.
- Initialize X = #$01 and store into CIA1 register $DC0D (serial-in register), then reload $DC0D into X (reads the same CIA register).
- Reload X from zero-page $BE, decrement it (DEX) and if negative skip storing back; otherwise restore $BE from X — this sequence updates the transfer counter stored at $BE.
- Decrement $A7 (another transfer/byte-count); if it becomes zero branch to a subsequent section.
- Test $9E and branch to exit on non-zero (early abort); otherwise store X back to $BE and proceed.
- Call device protocol subroutines $FC93 and $FB8E (part of device/serial protocol).
- Compute XOR checksum: zero Y and $AB, then loop:
  - LDA ($AC),Y — read next byte from the buffer pointed to by zero-page indirect pointer $AC.
  - EOR $AB ; STA $AB — accumulate XOR into $AB.
  - Call $FCDB then $FCD1 (device/handshake calls). Branch back to read next byte while the carry is clear (BCC).
- After loop, compare accumulator $AB XORed with $BD — if zero, jump to exit $FEBC; otherwise load #$20 and call $FE1C (device handshake/ack), then jump to $FEBC.

Zero-page variables used here (examples): $AA (flag), $AB (running XOR checksum), $AC (pointer to data), $BE/$A7 (transfer counters), $9E, $BD (expected checksum).

## Source Code
```asm
.,FB43 20 DB FC JSR $FCDB
.,FB46 D0 43    BNE $FB8B
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
- $DC00-$DC0F - CIA 1 - Serial I/O and control registers (notably $DC0C SEROUT, $DC0D SERIN, plus ICR/CRA) — this code writes X to $DC0D (SERIN).

## References
- "check_for_duplicate_entries_and_write_buffer_to_device" — continues after the JSR $FCDB when no immediate errors occurred
- "initial_device_setup_and_flag_tests" — shares the same central exit $FEBC used for early abort conditions