# IOINIT: INIT I/O (KERNAL, vectored from $FF84)

**Summary:** KERNAL IOINIT initializes CIA#1/$DC00-$DC0F and CIA#2/$DD00-$DD0F registers, disables SID sound ($D418), programs 6510 I/O port ($00/$01), and sets video bank/serial-bus bits via CIA2 port A. Vectored from $FF84 and prepares system hardware (IRQs, DDRs, timer control registers) for boot.

## IOINIT behavior
This routine (KERNAL IOINIT) performs low-level hardware initialization:

- Clears CIA IRQ control registers to mask IRQs (STA $DC0D, $DD0D with #$7F).
- Clears CIA#1 data port ($DC00) — used for keyboard matrix scanning.
- Sets CIA timer control registers A/B for both CIAs ($DC0E/$DD0E, $DC0F/$DD0F) with #$08 (timer A control) and #$00? (timer B control set via STA of #$00 earlier).
- Sets CIA DDRB ($DC03/$DD03) to input (STX with X=#$00) so Port B is inputs.
- Writes $00 to SID filter/volume ($D418) to disable audible output.
- Sets CIA#1 DDRA ($DC02) to all outputs (STX after DEX yields X=$FF).
- Sets CIA#2 port A ($DD00) to #$07 — selects video bank $0000-$3FFF (bit mapping used by KERNAL).
- Sets CIA#2 DDRA ($DD02) to #$3F — configures serial-bus and video-bank related lines.
- Programs 6510 CPU port: writes #$E7 to $01 (I/O port data), then #$2F to $00 (I/O DDR) to make selected lines outputs.

Sequence notes:
- X is loaded with #$00 and used to clear CIA#1/2 DDRB ($DC03/$DD03) and SID ($D418). X is then decremented (DEX) to $FF and stored to $DC02, making CIA#1 Port A outputs.
- Values written are explicit immediate constants (#$7F, #$08, #$07, #$3F, #$E7, #$2F); their bit meanings are hardware-specific (see CIA and 6510 port bitmaps).
**[Note: Source may contain an error — the inline bit pattern comment for #$E7 ("%XX100111") does not match #$E7 (binary 11100111).]**

## Source Code
```asm
.,FDA3 A9 7F    LDA #$7F
.,FDA5 8D 0D DC STA $DC0D       ; CIA#1 IRQ control register
.,FDA8 8D 0D DD STA $DD0D       ; CIA#2 IRQ control register
.,FDAB 8D 00 DC STA $DC00       ; CIA#1 data port (keyboard)
.,FDAE A9 08    LDA #$08
.,FDB0 8D 0E DC STA $DC0E       ; CIA#1 control register timer A
.,FDB3 8D 0E DD STA $DD0E       ; CIA#2 control register timer A
.,FDB6 8D 0F DC STA $DC0F       ; CIA#1 control register timer B
.,FDB9 8D 0F DD STA $DD0F       ; CIA#2 control register timer B
.,FDBC A2 00    LDX #$00
.,FDBE 8E 03 DC STX $DC03       ; CIA#1 DDRB. Port B is input
.,FDC1 8E 03 DD STX $DD03       ; CIA#2 DDRB. Port B is input
.,FDC4 8E 18 D4 STX $D418       ; No sound from SID (filter/volume)
.,FDC7 CA       DEX
.,FDC8 8E 02 DC STX $DC02       ; CIA#1 DDRA. Port A is output
.,FDCB A9 07    LDA #$07        ; %00000111
.,FDCD 8D 00 DD STA $DD00       ; CIA#2 dataport A. Set Videobank to $0000-$3fff
.,FDD0 A9 3F    LDA #$3F        ; %00111111
.,FDD2 8D 02 DD STA $DD02       ; CIA#2 DDRA. Serial bus and videobank
.,FDD5 A9 E7    LDA #$E7        ; 6510 I/O port - (binary 11100111)
.,FDD7 85 01    STA $01
.,FDD9 A9 2F    LDA #$2F        ; 6510 I/O DDR - %00101111
.,FDDB 85 00    STA $00
```

## Key Registers
- $DC00-$DC0F - CIA#1 (6526) - data ports, DDRs, timer control registers (includes $DC00 data port, $DC02 DDRA, $DC03 DDRB, $DC0D IRQ control, $DC0E/$DC0F timer A/B control)
- $DD00-$DD0F - CIA#2 (6526) - data ports, DDRs, timer control registers (includes $DD00 data port A, $DD02 DDRA, $DD03 DDRB, $DD0D IRQ control, $DD0E/$DD0F timer A/B control)
- $D415-$D418 - SID (6581) - Filter/volume region (writes here disable sound; $D418 used)
- $0000-$0001 - 6510 CPU port - $00 = Data Direction Register (DDR), $01 = Port Data (I/O port used for memory banking / datasheet-controlled lines)

## References
- "enable_timer" — expands on called later to start CIA1 timer based on PAL/NTSC
- "start_timer" — expands on actual timer start sequence; references these CIA timer/control registers

## Labels
- IOINIT
