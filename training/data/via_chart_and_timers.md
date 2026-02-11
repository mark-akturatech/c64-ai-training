# MACHINE - VIA (6522) chart ($E840-$E84F)

**Summary:** VIA (6522) register map at $E840-$E84F showing parallel ports (PA/PB) and DDRs, Timer 1/2 and their latches, shift register (SR), Aux Control Register (ACR), Peripheral Control Register (PCR) with CA/CB controls (used for /DAV, /NRFD data handshake, retrace, tape motor and graphics/text signaling), and interrupt Flag/Enable registers (IFR/IER).

**VIA (6522) overview for $E840-$E84F**
This VIA block provides:
- Two 8-bit parallel ports (PA, PB) with corresponding Data Direction Registers (DDRA, DDRB) for user/parallel-I/O and system control lines.
- Timer 1: 16-bit timer with separate low/high bytes and a 16-bit latch (used for timed events, interrupts).
- Timer 2: 16-bit timer with low/high bytes (can be used for one-shot or event timing).
- Shift Register (SR): serial shift facility (not used in this mapping — marked unused).
- ACR (Auxiliary Control Register): controls Timer1/T2 modes, shift register mode, and PB/PA latch control.
- PCR (Peripheral Control Register): configures CA1/CA2/CB1/CB2 behavior (edges, pulldowns/pullups, handshakes). Chart shows CA2 used for Graphics/Text mode and CA1/CB2 as pull-ups for some signals.
- IFR (Interrupt Flag Register) and IER (Interrupt Enable Register): individual interrupt bits for Timer1/Timer2, CA/CB lines, and SR; IFR shows status, IER controls which bits generate CPU IRQs.

Notes:
- Addresses follow the 6522 standard register order (ORB/ORA/DDR etc.) with base at $E840.
- The chart documents how the VIA is used in the system for data handshake (/DAV, /NRFD), retrace, tape motor control, tape #2 signaling, and graphics/text mode selection via CA2.
- SR is marked unused in this implementation.

## Source Code
```text
VIA (6522) register chart for $E840-$E84F (visual reference)

      |                                                               |
      +- - - - - - - - - - - - - - Timer 1 - - - - - - - - - - - - - -+
$E845 |                                                               | 59461
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E846 |                                                               | 59462
      |                                                               |
      +- - - - - - - - - - - - - - - - Timer 1 Latch  - - - - - - - -+
$E847 |                                                               | 59463
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E848 |                                                               | 59464
      |                                                               |
      +- - - - - - - - - - - - - - Timer 2 - - - - - - - - - - - - - -+
$E849 |                                                               | 59465
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E84A |                    Shift Register (unused)                    | 59466
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E84B |  T1 Control   |  T2   |    Shift Register     |Latch Controls | 59467
      |               |Control|        Control        |  PB      PA   |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E84C |   CB2 (PUP) Control   |CB1 Ctl|      CA2 Control      |CA1 PUP| 59468
      |                       |Tape #2|  Graphics/Text Mode   |Control|
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E84D |  IRQ  |Timer 1|Timer 2|CB1 Int|CB2 Int|  SR   |CA1 Int|CA2 G/T| 59469
      |Status:|  Int  |  Int  |Tape #2| (PUP) |Unused | (PUP) |Unused |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E84E |  IRQ  |Timer 1|Timer 2|CB1 Int|CB2 Int|  SR   |CA1 Int|CA2 G/T| 59470
      |Enable:|  Int  |  Int  |Tape #2| (PUP) |Unused | (PUP) |Unused |
      +-------+-------+-------+-------+-------+-------+-------+-------+
$E84F |              Parallel User Port Data Register PA              | 59471
      |                                                               |
      +-------+-------+-------+-------+-------+-------+-------+-------+

Canonical 6522 register order (base $E840):
$E840 - ORB (Port B)            ; Port B data / outputs (handshake lines)
$E841 - ORA (Port A)            ; Port A data (user port)
$E842 - DDRB                    ; Data Direction Register B
$E843 - DDRA                    ; Data Direction Register A
$E844 - T1CL (Timer 1 low)
$E845 - T1CH (Timer 1 high)
$E846 - T1LL (Timer 1 latch low)
$E847 - T1LH (Timer 1 latch high)
$E848 - T2CL (Timer 2 low)
$E849 - T2CH (Timer 2 high)
$E84A - SR   (Shift Register)   ; marked unused in this system
$E84B - ACR  (Aux Control Reg)  ; T1/T2 modes, SR mode, latches
$E84C - PCR  (Peripheral Ctrl)  ; CA/CB control: CA2 graphics/text, CB2 pull-up/tape
$E84D - IFR  (Interrupt Flags)  ; bits: Timer1, Timer2, CB1, CB2, SR, CA1, CA2
$E84E - IER  (Interrupt Enable) ; enable bits mirror IFR positions
$E84F - ORA (no handshake)      ; Port A (read/write without handshaking)

IFR / IER bit order shown (from MSB to LSB in chart):
  IRQ | Timer1 | Timer2 | CB1 Int (Tape #2) | CB2 Int (PUP) | SR Unused | CA1 Int (PUP) | CA2 G/T Unused
```

## Key Registers
- $E840-$E84F - VIA (6522) - full VIA register block: ports (PA/PB, DDRs), Timer1/Timer2 and latches, Shift Register, ACR, PCR, IFR, IER.

(For quick subranges:)
- $E840-$E843 - VIA - Port B/A and Data Direction Registers (ORB/ORA/DDRB/DDRA)
- $E844-$E847 - VIA - Timer 1 (low/high) and Timer 1 latch (low/high)
- $E848-$E849 - VIA - Timer 2 (low/high)
- $E84A       - VIA - Shift Register (SR) (unused)
- $E84B       - VIA - ACR (Aux Control Register) — Timer and SR modes, latch controls
- $E84C       - VIA - PCR (Peripheral Control Register) — CA/CB control (graphics/text via CA2, tape/CB2)
- $E84D       - VIA - IFR (Interrupt Flag Register)
- $E84E       - VIA - IER (Interrupt Enable Register)
- $E84F       - VIA - Port A data register (no-handshake ORA)

## References
- "pia_charts_and_keyboard_and_ieee_function_map" — expands on related PIA/VIA register mappings and keyboard/IEEE function assignments
- MOS Technology 6522 VIA datasheet
- Commodore 64 Programmer's Reference Guide

## Labels
- ORB
- ORA
- DDRB
- DDRA
- ACR
- PCR
- IFR
- IER
