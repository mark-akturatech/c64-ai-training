# RS232NMI (KERNAL ROM) — RS-232 NMI entry sequence ($FE43-$FE5B)

**Summary:** RS232NMI KERNAL entry at $FE43-$FE5B: SEI, indirect JMP via NMINV ($0318), push A/X/Y to stack, disable NMIs by storing #$7F into $DD0D (CIA2 ICR / D2ICR), read $DD0D into Y and BMI-test, JSR $FD02 (A0INT) to check $A000 ROM, and JMP through ($8002) if $A000 ROM is present.

## Description
This KERNAL fragment handles the RS-232 NMI entry path and quickly decides whether to vector into the $A000 ROM or continue normal NMI processing.

Sequence summary (exact operations preserved):
- SEI at $FE43 to mask IRQs while handling the NMI (comment: "NO IRQ'S ALLOWED...COULD MESS UP CASSETTES").
- JMP ($0318) at $FE44 — indirect jump through the NMINV vector ($0318) (allows NMI redirection).
- Push registers to preserve state: PHA, TXA / PHA, TYA / PHA (push A, X, Y with X transferred to A first).
- LDA #$7F; STA $DD0D — write #$7F to CIA2 ICR (D2ICR) to disable all NMIs as indicated by the comment.
- LDY $DD0D; BMI $FE72 — read back D2ICR into Y and branch on negative (BMI) to the NNMI20 handler when the tested condition indicates "NO...RS232/OTHER" (per original comments).
- JSR $FD02 (label A0INT) — call check for $A000 ROM presence.
  - If BNE from that call (non-zero) occurs, skip the next step.
  - If the check indicates the $A000 ROM is present (zero return), JMP ($8002) — indirect jump through the vector at $8002 to enter the $A000 ROM handler.

Behavioral notes preserved from source (no additional inference):
- D2ICR is written to disable NMIs and then read back to decide the NMI source.
- A0INT at $FD02 is consulted to detect the presence of the $A000 ROM; successful detection causes an indirect jump through ($8002).

## Source Code
```asm
                                .LIB   RS232NMI
.,FE43 78       SEI             NMI    SEI             ;NO IRQ'S ALLOWED...
.,FE44 6C 18 03 JMP ($0318)            JMP (NMINV)     ;...COULD MESS UP CASSETTES
.,FE47 48       PHA             NNMI   PHA
.,FE48 8A       TXA                    TXA
.,FE49 48       PHA                    PHA
.,FE4A 98       TYA                    TYA
.,FE4B 48       PHA                    PHA
.,FE4C A9 7F    LDA #$7F        NNMI10 LDA #$7F        ;DISABLE ALL NMI'S
.,FE4E 8D 0D DD STA $DD0D              STA D2ICR
.,FE51 AC 0D DD LDY $DD0D              LDY D2ICR       ;CHECK IF REAL NMI...
.,FE54 30 1C    BMI $FE72              BMI NNMI20      ;NO...RS232/OTHER
                                ;
.,FE56 20 02 FD JSR $FD02       NNMI18 JSR A0INT       ;CHECK IF $A0 IN...NO .Y
.,FE59 D0 03    BNE $FE5E              BNE NNMI19      ;...NO
.,FE5B 6C 02 80 JMP ($8002)            JMP ($8002)     ;...YES
```

## Key Registers
- $DD0D - CIA 2 - Interrupt Control Register (D2ICR) — written with #$7F to disable NMIs; read back and tested via LDY/BMI in this sequence

## References
- "stop_key_and_warm_start_restore" — expands on stop-key check and warm-start handling reached if not ROM
- "nmi_prepare_and_t1_transmit" — continues into preparing for NMI handling and T1 transmit

## Labels
- D2ICR
- NMINV
- A0INT
