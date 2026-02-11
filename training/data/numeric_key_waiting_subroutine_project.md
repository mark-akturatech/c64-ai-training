# Wait-for-numeric-key subroutine (JSR $FFE1 / GETIN $FFE4 / CHROUT $FFD2)

**Summary:** Subroutine (assembled at $033C) that polls RUN/STOP via JSR $FFE1, calls GETIN ($FFE4) to read a key, validates ASCII digits with CMP #$30 / CMP #$3A and BCC/BCS, echoes the accepted digit using JSR $FFD2 (CHROUT), converts ASCII '0'–'9' to binary with AND #$0F, then returns RTS.

## Operation
This routine loops until a numeric key (ASCII '0'..'9', $30..$39) or RUN/STOP is detected.

- JSR $FFE1 is invoked first to check the RUN/STOP condition; the code branches (BEQ) to the RTS target if that check indicates a termination condition.
- If not terminated, JSR $FFE4 (GETIN) is used to obtain a character in A. If no key is present, A will be zero and be rejected by the subsequent CMP.
- The low bound is enforced with CMP #$30 followed by BCC back to the poll loop (rejects values < $30).
- The high bound is enforced with CMP #$3A followed by BCS back to the poll loop. CMP #$3A is used rather than CMP #$39 because BCS branches on carry set (greater than or equal); comparing to $3A causes BCS to reject $3A and above while allowing $39 (the ASCII '9') through.
- Once an ASCII digit is confirmed, JSR $FFD2 (CHROUT) echoes the character to the screen.
- The ASCII digit in A is then converted to its binary 0–9 value by AND #$0F (mask off the high nibble).
- The routine finally returns with RTS.

Notes preserved from source:
- The character must be echoed before the AND #$0F conversion because CHROUT expects the ASCII character.
- The BEQ branch had to be patched to point to the RTS; the example uses a guessed address that happens to match ($0351).

## Assembler notes and testing
- Example assembly origin used in the text: .A $033C (SYS 828 corresponds to $033C decimal 828).
- The assembler in the example requires an extra RETURN after finishing entry to avoid address-prompt confusion.
- Testing: assemble, return to BASIC, run with SYS 828. Non-numeric keys are ignored; numeric keys are echoed and routine returns. Press RUN/STOP to exercise the termination branch. The text suggests verifying BASIC/ML interaction with a BASIC loop calling the machine routine.

## Source Code
```asm
.A 033C  JSR $FFE1
.A 033F  BEQ $0351
.A 0341  JSR $FFE4
.A 0344  CMP #$30
.A 0346  BCC $033C
.A 0348  CMP #$3A
.A 034A  BCS $033C
.A 034C  JSR $FFD2
.A 034F  AND #$0F
.A 0351  RTS
```

## References
- "getin_subroutine_keyboard_input" — expands on Uses GETIN for keyboard input
- "stop_subroutine_runstop_key" — expands on Uses STOP to detect RUN/STOP key
- "why_logical_operations_and_ascii_conversion" — expands on Converts ASCII to binary using AND #$0F

## Labels
- GETIN
- CHROUT
