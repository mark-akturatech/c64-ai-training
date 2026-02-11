# C64 I/O Map: $D419-$D41A — Game Paddle Inputs

**Summary:** SID paddle A/D registers $D419-$D41A (PEEK 54297/54298) return 0–255 potentiometer values; CIA#1 Data Ports ($DC00/$DC01) select which controller port the SID reads and report paddle fire buttons (bits 2/3). BASIC reads require disabling the keyboard IRQ (POKE 56333,127) to avoid conflicts with the keyboard scan.

**Game paddle A/D and selection**
The SID chip provides two 8-bit potentiometer (paddle) registers at $D419 and $D41A, which contain analog-to-digital converted values from the potentiometers on the joystick controller ports. Each value ranges from 0 to 255 (0 = minimum resistance, 255 = maximum).

Only one controller port is read at a time. CIA #1 Data Port A ($DC00) controls which port the SID samples by writing to bits 6 and 7:

- **Bit 7 = 0, Bit 6 = 1**: Selects Controller Port 1 (decimal value 64)
- **Bit 7 = 1, Bit 6 = 0**: Selects Controller Port 2 (decimal value 128)

Since CIA#1 Port A is also used by the keyboard-scanning IRQ routine, the keyboard IRQ must be disabled before reliably selecting and reading the paddles from BASIC.

Typical sequence:

- Disable keyboard IRQ: `POKE 56333,127`
- Select Controller Port 1: `POKE 56320,64`
- Read paddles: `A = PEEK(54297)` ; `B = PEEK(54298)`
- Restore IRQ: `POKE 56333,129`

Fire buttons are reported on CIA Data Ports A and B:

- **Controller Port 1**: Fire buttons on bits 2 and 3 of $DC01 (CIA#1 Port B)
- **Controller Port 2**: Fire buttons on bits 2 and 3 of $DC00 (CIA#1 Port A)

A bit value of 0 indicates the corresponding button is pressed; 1 means released.

Machine language subroutines are recommended for more reliable and accurate paddle reads. Below is a routine adapted from the Commodore 64 Programmer's Reference Guide:

## Source Code
```assembly
; Four Paddle Read Routine (Can also be used for two)
; Author: Bill Hindorff

PORTA  = $DC00
CIDDRA = $DC02
SID    = $D400

* = $C100
BUFFER  .BYTE 0
PDLX    .WORD 0
PDLY    .WORD 0
BTNA    .BYTE 0
BTNB    .BYTE 0

* = $C000
PDLRD
    LDX #1        ; For four paddles or two analog joysticks
PDLRD0
    SEI
    LDA CIDDRA    ; Get current value of DDR
    STA BUFFER    ; Save it away
    LDA #$C0
    STA CIDDRA    ; Set PORT A for input
    LDA #$80
PDLRD1
    STA PORTA     ; Address a pair of paddles
    LDY #$80      ; Wait a while
PDLRD2
    NOP
    DEY
    BPL PDLRD2
    LDA SID+25    ; Get X value
    STA PDLX,X
    LDA SID+26    ; Get Y value
    STA PDLY,X
    LDA PORTA     ; Time to read paddle fire buttons
    ORA #$80      ; Make it the same as other pair
    STA BTNA      ; Bit 2 is PDL X, Bit 3 is PDL Y
    LDA #$40
    DEX           ; All pairs done?
    BPL PDLRD1    ; No
    LDA BUFFER
    STA CIDDRA    ; Restore previous value of DDR
    LDA PORTA+1   ; For 2nd pair -
    STA BTNB      ; Bit 2 is PDL X, Bit 3 is PDL Y
    CLI
    RTS
```

```basic
REM Example BASIC reads (decimal addresses as in source)
POKE 56333,127   : REM disable keyboard IRQ
POKE 56320,64    : REM select Controller Port 1
A = PEEK(54297)  : REM read $D419 (POTX)
B = PEEK(54298)  : REM read $D41A (POTY)
POKE 56333,129   : REM restore IRQ

REM BASIC checks for paddle fire buttons
PB(1) = (PEEK(56321) AND 4) / 4
PB(2) = (PEEK(56321) AND 8) / 8
PB(3) = (PEEK(56320) AND 4) / 4
PB(4) = (PEEK(56320) AND 8) / 8
```

## Key Registers
- $D419-$D41A - SID - Paddle POTX/POTY (A/D results; read via PEEK 54297/54298)
- $DC00 - CIA#1 Port A - Data Port A (keyboard scan, paddle selection, fire buttons)
- $DC01 - CIA#1 Port B - Data Port B (keyboard scan, fire buttons)

## References
- "ciapra_data_port_register_a" — expands on how CIA Port A bits control paddle selection
- "potx_poty_sid_paddle_registers" — expands on SID locations $D419-$D41A where paddle positions are read

## Labels
- POTX
- POTY
- PORTA
- CIDDRA
- SID
