# KERNAL FE8B–FEA0 — Nested NMI handling for 6526 ICR (T2 / FLAG detection)

**Summary:** KERNAL ROM routine at $FE8B–$FEA0 tests for a second NMI using TXA / AND #$12 (checks 6526 ICR T2 and FLAG bits), dispatches to T2NMI ($FED6) or FLNMI ($FF07) as nested subroutines, then calls RSTRAB ($EEBB) and jumps to NMIRTI ($FEB6). Searchable terms: FE8B, FED6, FF07, EEBB, FEB6, 6526 ICR, T2, FLAG, TXA, AND #$12.

## Description
This ROM fragment implements "nested" handling of a second NMI because of the 6526 (CIA) Interrupt Control Register semantics. The code assumes the X register contains the CIA interrupt-bit snapshot; it uses TXA to examine those bits in A.

Behavior summary:
- TXA / AND #$12 tests whether either FLAG ($10) or T2 ($02) interrupt bits are set. If neither is set, skip nested handling.
- If either bit is set, AND #$02 isolates T2:
  - If T2 is set, JSR $FED6 (T2NMI) — handle a normal received bit (sample/update timer).
  - If T2 is clear (FLAG set), JSR $FF07 (FLNMI) — handle a start-bit (flag edge) setup.
- After the chosen handler returns, JSR $EEBB (RSTRAB) recomputes baud/timer/return state as needed.
- Finally JMP $FEB6 (NMIRTI) transfers control to the NMI return/restore logic.

Design note: instead of treating the second NMI as a separate interrupt level, this code treats it like a subroutine call from within the current NMI handler (hence explicit JSRs/JMPs) to preserve correct sequencing given the CIA ICR behavior.

## Source Code
```asm
; BECAUSE OF 6526 ICR STRUCTURE...
;  HANDLE ANOTHER NMI AS A SUBROUTINE
;
.,FE8B 8A       TXA                    TXA             ;TEST FOR ANOTHER NMI
.,FE8C 29 12    AND #$12               AND #$12        ;TEST FOR T2 OR FLAG
.,FE8E F0 0D    BEQ $FE9D              BEQ NNMI25
.,FE90 29 02    AND #$02               AND #$02        ;CHECK FOR T2
.,FE92 F0 06    BEQ $FE9A              BEQ NNMI22      ;MUST BE A FLAG
                                ;
.,FE94 20 D6 FE JSR $FED6              JSR T2NMI       ;HANDLE A NORMAL BIT IN...
.,FE97 4C 9D FE JMP $FE9D              JMP NNMI25      ;...THEN CONTINUE OUTPUT
                                ;
.,FE9A 20 07 FF JSR $FF07       NNMI22 JSR FLNMI       ;HANDLE A START BIT...
                                ;
.,FE9D 20 BB EE JSR $EEBB       NNMI25 JSR RSTRAB      ;GO CALC INFO (CODE COULD BE IN LINE)
.,FEA0 4C B6 FE JMP $FEB6              JMP NMIRTI
```

## References
- "nmi_prepare_and_t1_transmit" — expands on code called after T1 transmit (restores NMI enables and checks for additional NMIs)
- "t2nmi_subroutine_sample_and_timer_update" — expands on T2NMI handling (normal received-bit processing)
- "flnmi_half_bit_setup_and_return" — expands on FLNMI (start-bit/flag edge setup)