# CIA 6526 Register Map (Offsets $00-$0F) — CIA1 $DC00/$DCFF, CIA2 $DD00/$DDFF

**Summary:** CIA 6526 register map for offsets $00-$0F showing CIA1 ($DC00-$DC0F) and CIA2 ($DD00-$DD0F) addresses: PRA, PRB, DDRA, DDRB, Timer A/B low/high, TOD registers, SDR, ICR, CRA, CRB. Note: this 16-byte map repeats across $DC00-$DCFF and $DD00-$DDFF.

## Register map overview
This chunk lists the primary CIA (6526) register offsets $00-$0F and their absolute addresses for CIA1 and CIA2 on the C64 memory map. The 16-byte register block (offsets $00-$0F) is mirrored every 16 bytes throughout the $DC00-$DCFF (CIA1) and $DD00-$DDFF (CIA2) ranges — e.g. $DC10 mirrors $DC00, $DD20 mirrors $DD10, etc.

Registers covered (offset → name):
- $00 PRA — Port A data register
- $01 PRB — Port B data register
- $02 DDRA — Data Direction Register A
- $03 DDRB — Data Direction Register B
- $04 TALO — Timer A low byte
- $05 TAHI — Timer A high byte
- $06 TBLO — Timer B low byte
- $07 TBHI — Timer B high byte
- $08 TOD10THS — Time-of-Day tenths of seconds
- $09 TODSEC — Time-of-Day seconds
- $0A TODMIN — Time-of-Day minutes
- $0B TODHR — Time-of-Day hours
- $0C SDR — Serial Data Register
- $0D ICR — Interrupt Control Register
- $0E CRA — Control Register A
- $0F CRB — Control Register B

Behavioral notes contained in source:
- The map repeats every 16 bytes across $DC00-$DCFF and $DD00-$DDFF (explicitly stated).

## Source Code
```text
Offset  CIA 1    CIA 2    Name           Description
------  -----    -----    ----           -----------
$00     $DC00    $DD00    PRA            Data Port A
$01     $DC01    $DD01    PRB            Data Port B
$02     $DC02    $DD02    DDRA           Data Direction Register A
$03     $DC03    $DD03    DDRB           Data Direction Register B
$04     $DC04    $DD04    TALO           Timer A Low Byte
$05     $DC05    $DD05    TAHI           Timer A High Byte
$06     $DC06    $DD06    TBLO           Timer B Low Byte
$07     $DC07    $DD07    TBHI           Timer B High Byte
$08     $DC08    $DD08    TOD10THS       TOD Tenths of Seconds
$09     $DC09    $DD09    TODSEC         TOD Seconds
$0A     $DC0A    $DD0A    TODMIN         TOD Minutes
$0B     $DC0B    $DD0B    TODHR          TOD Hours
$0C     $DC0C    $DD0C    SDR            Serial Data Register
$0D     $DC0D    $DD0D    ICR            Interrupt Control Register
$0E     $DC0E    $DD0E    CRA            Control Register A
$0F     $DC0F    $DD0F    CRB            Control Register B

Note: The register map repeats every 16 bytes throughout the
$DC00-$DCFF and $DD00-$DDFF ranges (i.e., $DC10 mirrors $DC00, etc.)
```

## Key Registers
- $DC00-$DC0F - CIA 1 - PRA ($00), PRB ($01), DDRA ($02), DDRB ($03), TALO/TAHI ($04/$05), TBLO/TBHI ($06/$07), TOD ($08-$0B), SDR ($0C), ICR ($0D), CRA ($0E), CRB ($0F)
- $DD00-$DD0F - CIA 2 - PRA ($00), PRB ($01), DDRA ($02), DDRB ($03), TALO/TAHI ($04/$05), TBLO/TBHI ($06/$07), TOD ($08-$0B), SDR ($0C), ICR ($0D), CRA ($0E), CRB ($0F)
- $DC00-$DCFF - CIA 1 repeated map every 16 bytes (mirror of $DC00-$DC0F)
- $DD00-$DDFF - CIA 2 repeated map every 16 bytes (mirror of $DD00-$DD0F)

## References
- "port_a_data_register_pra" — PRA ($00) detailed bit assignments
- "port_b_data_register_prb" — PRB ($01) detailed bit assignments
- "ddra_ddrb" — DDRA/DDRB ($02/$03) direction control
- "timer_a_16bit" — Timer A ($04/$05)
- "timer_b_16bit" — Timer B ($06/$07)
- "time_of_day_clock" — TOD ($08-$0B)
- "serial_data_register_sdr" — SDR ($0C)
- "interrupt_control_register_icr" — ICR ($0D)
- "control_register_a" — CRA ($0E)
- "control_register_b" — CRB ($0F)

## Labels
- PRA
- PRB
- DDRA
- DDRB
- TALO
- TAHI
- ICR
- CRA
