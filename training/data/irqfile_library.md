# KERNAL: SIMIRQ / PULS — IRQ simulation and BREAK handling (cassette)

**Summary:** SIMIRQ/PULS ($FF43-$FF58) is a KERNAL ROM helper that creates a software-simulated IRQ context for cassette processing: it fixes the saved BREAK flag in the stacked processor status (P) at entry and PULS inspects the previously saved P (from $0104+SP) to decide whether to vector to the BREAK handler ($0316 / CBINV) or to the IRQ handler ($0314 / CINV).

## Operation
SIMIRQ is entered by JSR SIMIRQ and performs a small stack/P-status manipulation so cassette code can run as if in an IRQ context while ensuring the stored BREAK flag does not falsely indicate a BRK instruction. Sequence and intent:

- SIMIRQ (start at $FF43)
  - PHP pushes the current processor status (P) to the stack.
  - PLA pulls the top-of-stack byte into A (this is used to access the stacked P image).
  - AND #$EF clears bit 4 (the BREAK flag) in A.
  - PHA pushes the modified status back onto the stack — effectively fixing the BREAK flag in the stacked P image.

- PULS (immediately follows at $FF48)
  - PHA / TXA / PHA / TYA / PHA saves A, X and Y on the stack in a known layout.
  - TSX transfers the stack pointer into X.
  - LDA $0104,X reads the previously saved processor status byte from page $01 at offset $0104 + X. (This routine relies on a copy of stacked status bytes being available at $0104+SP.)
  - AND #$10 isolates the BREAK flag (bit 4) from that saved status.
  - If the BREAK bit is set, JMP ($0316) — indirect jump via the CBINV vector to handle a BRK instruction.
  - If not set, JMP ($0314) — indirect jump via the CINV vector to handle a (simulated) IRQ.

Behavioral notes:
- The routine distinguishes a real BRK (break instruction) from an IRQ by checking the saved P status (BREAK bit) that was previously stored/copied into $0104+SP.
- Vectors at $0316 and $0314 are used as callbacks: CBINV (break handler) and CINV (IRQ handler).
- This code is intended for use by cassette-reading logic which must simulate interrupts without confusing a real BRK state.

## Source Code
```asm
                                .LIB   IRQFILE
                                ; SIMIRQ - SIMULATE AN IRQ (FOR CASSETTE READ)
                                ;  ENTER BY A JSR SIMIRQ
                                ;
.,FF43 08       PHP             SIMIRQ PHP
.,FF44 68       PLA                    PLA             ;FIX THE BREAK FLAG
.,FF45 29 EF    AND #$EF               AND #$EF
.,FF47 48       PHA                    PHA
                                ; PULS - CHECKS FOR REAL IRQ'S OR BREAKS
                                ;
.,FF48 48       PHA             PULS   PHA
.,FF49 8A       TXA                    TXA
.,FF4A 48       PHA                    PHA
.,FF4B 98       TYA                    TYA
.,FF4C 48       PHA                    PHA
.,FF4D BA       TSX                    TSX
.,FF4E BD 04 01 LDA $0104,X            LDA $104,X      ;GET OLD P STATUS
.,FF51 29 10    AND #$10               AND #$10        ;BREAK FLAG?
.,FF53 F0 03    BEQ $FF58              BEQ PULS1       ;...NO
.,FF55 6C 16 03 JMP ($0316)            JMP (CBINV)     ;...YES...BREAK INSTR
.,FF58 6C 14 03 JMP ($0314)     PULS1  JMP (CINV)      ;...IRQ
                                .END
```

## Key Registers
- $FF43-$FF58 - KERNAL ROM - SIMIRQ / PULS routine (IRQ simulation and BREAK handling)
- $0104 - RAM (page 1) - base of saved P status table used by PULS (accessed as $0104 + SP)
- $0314 - RAM (vector) - CINV vector (indirect JMP target for simulated IRQ)
- $0316 - RAM (vector) - CBINV vector (indirect JMP target for BREAK handling)

## References
- "rs232_nmi_library" — expands on SIMIRQ usage when cassette/serial code needs to simulate interrupts
- "vectors_table" — shows vectors that point to CINV/CBINV entries used by PULS

## Labels
- SIMIRQ
- PULS
- CINV
- CBINV
