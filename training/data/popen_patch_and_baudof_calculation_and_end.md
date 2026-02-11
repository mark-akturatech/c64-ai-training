# POPEN (KERNAL ROM patch)

**Summary:** POPEN (ROM $FF2E) is a KERNAL RS-232 open routine patch that computes a half-bit-rate adjuster BAUDOF ($0299-$029A) from M51AJB ($0296 = M51AJB+1 in code) and CBIT-derived offsets. It uses a rotate/add sequence (ROL/ADC) to form BAUDOF and stores the low/high bytes, then returns; the module ends with two NOPs and .END.

## Description
POPEN is a small KERNAL routine (entry at $FF2E) intended to produce BAUDOF, a two-byte half-bit timing adjustment used by the serial transmit timing logic. The routine:

- Loads the high byte of the M51AJB value (LDA $0296 — referenced as M51AJB+1).
- Performs a left rotate (ROL) on A, transfers the result to Y (TAY), then transfers X to A (TXA) to combine parts of the original value and the rotated value.
- Adds an immediate constant #$C8 (ADC #$C8 — described as CBIT+CBIT) to the A register to include CBIT-derived offset(s).
- Stores the resulting A into $0299 (BAUDOF, low byte).
- Restores A from Y, adds #$00 (ADC #$00) to include any carry into the high byte, and stores into $029A (BAUDOF+1, high byte).
- Returns (RTS). The file ends with two NOPs and the assembler .END.

Comments in the source annotate M51AJB as (FREQ/BAUD/2 - 100) and explain that this POPEN variation is used to configure RS-232 open behavior for a "universal KERNAL" (i.e., generic baud handling).

## Operation / Algorithm
- Input variables:
  - M51AJB (two-byte value; code reads the high byte at $0296) — described as (FREQ/BAUD/2 - 100).
  - CBIT (single-byte offset, implied by comment "ADC #CBIT+CBIT" represented by ADC #$C8).
- Steps:
  1. TAX (preserve X or set up A->X context for combining parts).
  2. LDA $0296 (load M51AJB+1).
  3. ROL A (rotate left, bringing in carry, effectively mixing bits for half-bit calculation).
  4. TAY (save rotated result in Y).
  5. TXA (bring original X into A).
  6. ADC #$C8 (add CBIT*2 offset; immediate constant here is $C8).
  7. STA $0299 (store low byte BAUDOF).
  8. TYA / ADC #$00 (restore rotated high part and add carry into high byte).
  9. STA $029A (store high byte BAUDOF+1).
  10. RTS (return to caller).
- Side-effects: modifies A, X, Y registers and writes $0299-$029A. Leaves no stack imbalance.

## Source Code
```asm
                                ;
                                ; POPEN - PATCHES OPEN RS232 FOR UNIVERSAL KERNAL
                                ;
.,FF2E AA       TAX             POPEN  TAX             ;WE'RE CALCULATING BAUD RATE
.,FF2F AD 96 02 LDA $0296              LDA M51AJB+1    ; M51AJB=FREQ/BAUD/2-100
.,FF32 2A       ROL                    ROL A
.,FF33 A8       TAY                    TAY
.,FF34 8A       TXA                    TXA
.,FF35 69 C8    ADC #$C8               ADC #CBIT+CBIT
.,FF37 8D 99 02 STA $0299              STA BAUDOF
.,FF3A 98       TYA                    TYA
.,FF3B 69 00    ADC #$00               ADC #0
.,FF3D 8D 9A 02 STA $029A              STA BAUDOF+1
.,FF40 60       RTS                    RTS
.,FF41 EA       NOP                    NOP
.,FF42 EA       NOP                    NOP
                                .END
```

## Key Registers
- $0296 - KERNAL RAM - M51AJB+1 (high byte of M51AJB; M51AJB described as FREQ/BAUD/2 - 100)
- $0299-$029A - KERNAL RAM - BAUDOF (low/high) half-bit rate adjustment used by transmit timing
- $FF2E-$FF42 - KERNAL ROM - POPEN routine (computes BAUDOF and returns; ends with NOPs and .END)

## References
- "baud_table_and_cbit" — expands on how POPEN computes BAUDOF and how BAUDOF/BAUDO table entries and CBIT interact
- "nmi_prepare_and_t1_transmit" — explains how the BAUD/bit timing values computed here affect NXTBIT and transmit timing

## Labels
- POPEN
- M51AJB
- BAUDOF
