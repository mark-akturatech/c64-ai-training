# Initialise SID, CIA and IRQs (ROM disassembly $FDA3–$FDF6)

**Summary:** Saves and configures CIA (VIA) registers ($DC00/$DD00 ranges), disables interrupts, clears SID volume/filter select ($D418), sets 6510 port and DDR ($01/$00), and selects PAL/NTSC VIA timer values using ROM flag at $02A6. Contains the exact writes that initialise CIA timers (CRA/CRB), DDRs, and 6510 I/O during reset.

## Initialization sequence
This ROM block performs low-level hardware setup immediately after reset:

- Disable IRQs: load #$7F and store to both CIA ICRs to acknowledge/disable VIA interrupts.
- Save/initialise VIA (CIA) registers:
  - Save VIA1/VIA2 DRA (keyboard column driver / serial port/video address), DDRA/DDRB (data direction registers) and clear timer control registers (CRA/CRB).
  - CRA/CRB are configured for single-shot timer operation (CRA = #$08 written to $DC0E/$DD0E, CRB = $0F written to $DC0F/$DD0F).
  - DDRB/DDRA values set to define keyboard rows/columns and serial port direction (DDRB = #$00, DDRA = #$07 for VIA2; VIA1 DDRA/DDRB likewise).
- Clear SID volume/filter select: store #$00 (via X=0 write) to $D418 to reset SID filter/volume select.
- Initialise 6510 port and DDR:
  - Store #$E7 to zero-page $01 — the 6510 data port (enables I/O/KERNAL/BASIC, motor off, etc.).
  - Store #$2F to zero-page $00 — the 6510 data direction register (sets specified bits as outputs).
- PAL/NTSC timing selection:
  - Read ROM flag at $02A6 to determine PAL vs NTSC.
  - For NTSC: write $25 to VIA1 timer A low byte ($DC04) and $40 to VIA1 timer A high byte ($DC05).
  - For PAL: write $95 to VIA1 timer A low byte ($DC04) and $42 to VIA1 timer A high byte ($DC05).
- Jump to the appropriate next initialisation entry point ($FDF3 or $FF6E) after setting timing.

All register writes and immediate values used by the ROM are preserved in the assembly below.

## Source Code
```asm
                                *** initialise SID, CIA and IRQ
.,FDA3 A9 7F    LDA #$7F        disable all interrupts
.,FDA5 8D 0D DC STA $DC0D       save VIA 1 ICR
.,FDA8 8D 0D DD STA $DD0D       save VIA 2 ICR
.,FDAB 8D 00 DC STA $DC00       save VIA 1 DRA, keyboard column drive
.,FDAE A9 08    LDA #$08        set timer single shot
.,FDB0 8D 0E DC STA $DC0E       save VIA 1 CRA
.,FDB3 8D 0E DD STA $DD0E       save VIA 2 CRA
.,FDB6 8D 0F DC STA $DC0F       save VIA 1 CRB
.,FDB9 8D 0F DD STA $DD0F       save VIA 2 CRB
.,FDBC A2 00    LDX #$00        set all inputs
.,FDBE 8E 03 DC STX $DC03       save VIA 1 DDRB, keyboard row
.,FDC1 8E 03 DD STX $DD03       save VIA 2 DDRB, RS232 port
.,FDC4 8E 18 D4 STX $D418       clear the volume and filter select register
.,FDC7 CA       DEX             set X = $FF
.,FDC8 8E 02 DC STX $DC02       save VIA 1 DDRA, keyboard column
.,FDCB A9 07    LDA #$07        DATA out high, CLK out high, ATN out high, RE232 Tx DATA
                                high, video address 15 = 1, video address 14 = 1
.,FDCD 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,FDD0 A9 3F    LDA #$3F        set serial DATA input, serial CLK input
.,FDD2 8D 02 DD STA $DD02       save VIA 2 DDRA, serial port and video address
.,FDD5 A9 E7    LDA #$E7        set 1110 0111, motor off, enable I/O, enable KERNAL,
                                enable BASIC
.,FDD7 85 01    STA $01         save the 6510 I/O port
.,FDD9 A9 2F    LDA #$2F        set 0010 1111, 0 = input, 1 = output
.,FDDB 85 00    STA $00         save the 6510 I/O port direction register
.,FDDD AD A6 02 LDA $02A6       get the PAL/NTSC flag
.,FDE0 F0 0A    BEQ $FDEC       if NTSC go set NTSC timing
                                else set PAL timing
.,FDE2 A9 25    LDA #$25
.,FDE4 8D 04 DC STA $DC04       save VIA 1 timer A low byte
.,FDE7 A9 40    LDA #$40
.,FDE9 4C F3 FD JMP $FDF3
.,FDEC A9 95    LDA #$95
.,FDEE 8D 04 DC STA $DC04       save VIA 1 timer A low byte
.,FDF1 A9 42    LDA #$42
.,FDF3 8D 05 DC STA $DC05       save VIA 1 timer A high byte
.,FDF6 4C 6E FF JMP $FF6E
```

## Key Registers
- $DC00-$DC0F - CIA 1 (VIA1) — DRA/DDRA/DRB/DDRB, ICR, CRA/CRB, timers (including VIA1 Timer A low/high at $DC04/$DC05). Used for keyboard rows/columns and VIA interrupts/timers.
- $DD00-$DD0F - CIA 2 (VIA2) — DRA/DDRA/DRB/DDRB, ICR, CRA/CRB, timers. Used for serial port and RS232 control.
- $D400-$D418 - SID (MOS6581/8580) — voice registers and filter/volume select (filter/volume registers at $D415-$D418; $D418 is cleared here).
- $0000-$00FF - 6510 zero page I/O — zero-page port and DDR locations (port $01 at $01, DDR at $00 are written here).
- $02A6 - ROM flag byte — PAL/NTSC selection flag read to choose VIA timer values.

## References
- "reset_hardware_startup" — expands on called during reset to initialise chips
- "initialise_vic_and_screen_editor" — expands on subsequent initialisation performed after this