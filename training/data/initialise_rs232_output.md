# Initialise RS232 output (ROM disassembly at $F483)

**Summary:** Sets up CIA2 ($DD00-$DD0F) ports for RS-232: programs CIA2 ICR ($DD0D), DDRB/PRB ($DD03/$DD01) to assert DTR/RTS, forces Tx line high via PRA ($DD00 OR), clears the RS-232 interrupt-enable byte at $02A1, and returns to caller.

## Description
This routine configures the serial (RS-232) output lines and related CIA2 registers to a known state before the 6551/baud-rate chip is programmed. Steps performed:

- LDA #$7F / STA $DD0D — write $7F to CIA2 ICR to disable (mask) interrupts (source comment: "disable all interrupts").
- LDA #$06 / STA $DD03 — set CIA2 DDRB to $06 to configure the RS-232 DTR and RTS pins as outputs.
- STA $DD01 — write $06 into CIA2 Port B (PRB/DRB) to assert DTR and RTS outputs.
- LDA #$04; ORA $DD00; STA $DD00 — set bit $04 in CIA2 Port A (PRA/DRA) so the RS-232 Tx DATA line is driven high (OR preserves other PRA bits).
- LDY #$00; STY $02A1 — clear zero-page byte $02A1 (RS-232 interrupt-enable byte).
- RTS — return to caller.

**[Note: Source may contain an error — the listing refers to "VIA2"; on the C64 these registers reside in CIA2 (6526) at $DD00-$DD0F.]**

## Source Code
```asm
                                *** initialise RS232 output
.,F483 A9 7F    LDA #$7F        disable all interrupts
.,F485 8D 0D DD STA $DD0D       save VIA 2 ICR
.,F488 A9 06    LDA #$06        set RS232 DTR output, RS232 RTS output
.,F48A 8D 03 DD STA $DD03       save VIA 2 DDRB, RS232 port
.,F48D 8D 01 DD STA $DD01       save VIA 2 DRB, RS232 port
.,F490 A9 04    LDA #$04        mask xxxx x1xx, set RS232 Tx DATA high
.,F492 0D 00 DD ORA $DD00       OR it with VIA 2 DRA, serial port and video address
.,F495 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,F498 A0 00    LDY #$00        clear Y
.,F49A 8C A1 02 STY $02A1       clear the RS-232 interrupt enable byte
.,F49D 60       RTS             
```

## Key Registers
- $DD00-$DD0F - CIA2 (6526) - Port A/Port B, DDRs, timers and ICR (used here: $DD00 PRA, $DD01 PRB, $DD03 DDRB, $DD0D ICR)
- $02A1 - Zero Page - RS-232 interrupt-enable byte (cleared by this routine)

## References
- "open_rs232_device_and_buffer_setup" — Called by the RS232 open sequence to ensure VIA2/CIA2 and RS232 lines are in a known state before programming 6551/baud