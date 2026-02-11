# KERNAL NMI handler — T1 (Transmit) NMI path ($FE72–$FE88)

**Summary:** Describes the Commodore 64 KERNAL ROM NMI handling path for the T1 (transmit) NMI: masks and tests the ENABL NMI mask ($02A1), uses NXTBIT ($00B5) to form the next RS‑232 output bit, writes the bit to CIA#2 Port A ($DD00) to transmit, and restores CIA#2 ICR ($DD0D). Mentions nested-NMI considerations due to the 6526 ICR.

## Behavior and notes
This ROM fragment implements the handling for the T1 transmit NMI source:

- The routine first restricts the current NMI sources by masking with ENABL ($02A1) so only enabled NMI sources remain visible. The mask is copied into X (TAX) for later use.
- It tests the masked value for the T1 bit; if T1 is not set execution branches away.
- If T1 is set, the code reads CIA#2 Port A (D2PRA, $DD00), clears the current transmit bit(s) with AND #$FB (masking out bit 2), ORs in the next transmit bit held in NXTBIT ($00B5), and writes the result back to CIA#2 Port A ($DD00) to effect the serial output.
- After transmitting, ENABL ($02A1) is reloaded and written to CIA#2 ICR ($DD0D) to restore the NMI enables so the system is ready for subsequent NMIs.
- The code comments and surrounding KERNAL logic imply care about nested NMIs: the 6526 (CIA) ICR format and write semantics can cause another interrupt to become pending when ICR is written, so the full NMI dispatch must be capable of nested handling (see referenced chunks for the nested dispatch code).

**[Note: Source may contain an error — the comment mentions saving Y on the stack, but the shown instruction sequence only does TYA/TAX and does not PHA; the intended Y save/push is not present in the fragment.]**

## Source Code
```asm
                                ; DISABLE NMI'S UNTILL READY
                                ;  SAVE ON STACK
                                ;
.,FE72 98       TYA             NNMI20 TYA             ;.Y SAVED THROUGH RESTORE
.,FE73 2D A1 02 AND $02A1              AND ENABL       ;SHOW ONLY ENABLES
.,FE76 AA       TAX                    TAX             ;SAVE IN .X FOR LATTER
                                ;
                                ; T1 NMI CHECK - TRANSMITT A BIT
                                ;
.,FE77 29 01    AND #$01               AND #$01        ;CHECK FOR T1
.,FE79 F0 28    BEQ $FEA3              BEQ NNMI30      ;NO...
                                ;
.,FE7B AD 00 DD LDA $DD00              LDA D2PRA
.,FE7E 29 FB    AND #$FB               AND #$FF-$04    ;FIX FOR CURRENT I/O
.,FE80 05 B5    ORA $B5                ORA NXTBIT      ;LOAD DATA AND...
.,FE82 8D 00 DD STA $DD00              STA D2PRA       ;...SEND IT
                                ;
.,FE85 AD A1 02 LDA $02A1              LDA ENABL       ;RESTORE NMI'S
.,FE88 8D 0D DD STA $DD0D              STA D2ICR       ;READY FOR NEXT...
                                ;
```

## Key Registers
- $DD00-$DD0F - CIA 2 - Port A (PRA) and CIA#2 registers including ICR at $DD0D (used for transmit and interrupt control)
- $02A1 - RAM/KERNAL - ENABL (NMI enable mask used to show only enabled NMI sources)
- $00B5 - RAM - NXTBIT (next output bit for serial transmit, ORed into PRA before write)

## References
- "rs232_nmi_entry_and_rom_check" — entry/setup that leads to this NMI handler
- "nested_nmi_dispatch_and_rstrab" — handling for nested NMIs after transmit (T2/FLAG)
- "popen_patch_and_baudof_calculation_and_end" — NXTBIT and BAUD timing values set by POPEN/BAUD table

## Labels
- ENABL
- NXTBIT
- D2PRA
- D2ICR
