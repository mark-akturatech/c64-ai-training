# CLN232 — KERNAL cleanup for RS-232 (CIA2 / CB2 / ENABL)

**Summary:** KERNAL routine CLN232 configures CIA#2 ($DD00-$DD0F) and the KERNAL ENABL flag ($02A1) for RS-232: it writes $7F to the CIA ICR ($DD0D), sets DDRB ($DD03) bits for the user port (DTR/RTS), drives PRB ($DD01) DTR/RTS high, sets PA2 (bit 2 of PRA $DD00) high, clears ENABL ($02A1), and returns (RTS).

## Purpose and behavior
CLN232 prepares the 6526 (CIA #2) and KERNAL state for RS-232 operation. Steps performed, in order:

- Clear/acknowledge CIA interrupt conditions by writing #$7F to the CIA2 interrupt control register (ICR).
- Configure DDRB to make the user-port bits for DTR/RTS outputs (LDA #$06 → DDRB).
- Drive PRB bits corresponding to DTR/RTS high (STA PRB).
- Set PA2 (bit 2 of PRA) as an output and drive it high by ORing with #$04 then storing back to PRA — this preserves other PRA bits.
- Clear the KERNAL ENABL flag (zero page $02A1) to disable any previously enabled behavior.
- Return to the caller (RTS).

All writes use absolute CIA2 addresses ($DD00-$DD0D). The routine does not alter other zero-page KERNAL variables except ENABL.

## Source Code
```asm
                                ; CLN232 - CLEAN UP 232 SYSTEM FOR OPEN/CLOSE
                                ;  SET UP DDRB AND CB2 FOR RS-232
                                ;
.,F483 A9 7F    LDA #$7F        CLN232 LDA #$7F        ;CLEAR NMI'S
.,F485 8D 0D DD STA $DD0D              STA D2ICR
.,F488 A9 06    LDA #$06               LDA #%00000110  ;DDRB
.,F48A 8D 03 DD STA $DD03              STA D2DDRB
.,F48D 8D 01 DD STA $DD01              STA D2PRB       ;DTR,RTS HIGH
.,F490 A9 04    LDA #$04               LDA #$04        ;OUTPUT HIGH PA2
.,F492 0D 00 DD ORA $DD00              ORA D2PRA
.,F495 8D 00 DD STA $DD00              STA D2PRA
.,F498 A0 00    LDY #$00               LDY #00
.,F49A 8C A1 02 STY $02A1              STY ENABL       ;CLEAR ENABLS
.,F49D 60       RTS                    RTS
                                .END
```

## Key Registers
- $DD00 - CIA #2 - PRA (Port A) read/write; bit 2 (PA2) is set high here
- $DD01 - CIA #2 - PRB (Port B) write; used to drive DTR/RTS high
- $DD03 - CIA #2 - DDRB (Data Direction Register B); set to #%00000110 to make DTR/RTS outputs
- $DD0D - CIA #2 - ICR (Interrupt Control Register); written with #$7F to clear/acknowledge NMIs/ICR bits
- $02A1 - Zero-page RAM - KERNAL ENABL flag (cleared to $00)

## References
- "open_rs232_init_and_param_transfer" — expands on CLN232 invocation at the start of OPN232 to prepare RS-232 hardware
- "rs232_line_response_checks" — describes subsequent validation of port and line states set by CLN232