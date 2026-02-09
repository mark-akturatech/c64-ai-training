# CIA 6526 Complex Interface Adapter - CIA2 ($DD00-$DDFF)

**Summary:** CIA2 at base $DD00 (registers $DD00-$DD0F) controls VIC-II memory bank selection via Port A bits 0-1 (active low), handles the IEC serial bus signals on Port A, provides RS-232 signals across Port A/Port B (TXD/RXD/RTS/DTR/RI/DCD), exposes User Port I/O, and drives the FLAG pin connected to the serial-bus SRQ which generates an NMI on a negative edge (if enabled).

## Overview
CIA2 provides the system interface used by the VIC-II and external peripherals:

- VIC-II memory bank selection is controlled by Port A bits 0-1 (active low). These two bits select which 16K bank the VIC-II will map for screen memory, character ROM/RAM and sprites.
- The IEC (serial) bus for disk drives/printers is wired to Port A: ATN OUT, CLOCK OUT, DATA OUT, plus CLOCK IN and DATA IN inputs.
- RS-232 signals are mapped across both ports: TXD is Port A bit 2 (output); RXD and control/status lines are on Port B bits 0-4 (RXD, RTS, DTR, RI, DCD).
- The CIA2 FLAG pin is tied to the serial-bus SRQ (Service Request). A negative-going transition on FLAG/SRQ generates a CPU NMI when NMI generation is enabled.
- CIA2 registers occupy $DD00-$DD0F (standard CIA register block); the provided bit mappings and bank table below are the canonical wiring used on C64/C128-style boards.

Behavioral notes:
- VIC-II bank bits are active low (bits inverted); set bits to 0 to select the corresponding bank bit.
- IEC CLOCK/DATA IN lines are read-only inputs on Port A.
- RS-232 control/status lines on Port B include both outputs (RTS, DTR) and inputs (RI, DCD).
- NMI generation from FLAG requires that the CPU NMI path and CIA interrupt configuration permit NMIs (see CIA ICR/CPU NMI details in interrupt_handling reference).

## Source Code
```text
CIA2 (base $DD00) — Port bit wiring and VIC-II bank table

Port A ($DD00) bit assignments (bit7..bit0):
  Bit 7: DATA IN     (IEC DATA IN, input)
  Bit 6: CLOCK IN    (IEC CLOCK IN, input)
  Bit 5: DATA OUT    (IEC DATA OUT, output)
  Bit 4: CLOCK OUT   (IEC CLOCK OUT, output)
  Bit 3: ATN OUT     (IEC ATN OUT, output)
  Bit 2: TXD         (RS-232 TXD, output)
  Bit 1: BA1*        (VIC-II bank bit 1, active low)
  Bit 0: BA0*        (VIC-II bank bit 0, active low)

VIC-II bank selection (Port A bits 1-0 are active low):
  Bits 1-0    Bank    VIC-II Address Range
  --------    ----    --------------------
    %11        0      $0000-$3FFF   (BA1=1, BA0=1 -> bank 0)
    %10        1      $4000-$7FFF   (BA1=1, BA0=0 -> bank 1)
    %01        2      $8000-$BFFF   (BA1=0, BA0=1 -> bank 2)
    %00        3      $C000-$FFFF   (BA1=0, BA0=0 -> bank 3)

Port B ($DD01) typical RS-232 / User Port mapping (bit7..bit0):
  Bit 7: (user/general I/O)
  Bit 6: (user/general I/O)
  Bit 5: (user/general I/O)
  Bit 4: DCD    (RS-232 Data Carrier Detect, input)
  Bit 3: RI     (RS-232 Ring Indicator, input)
  Bit 2: DTR    (RS-232 Data Terminal Ready, output)
  Bit 1: RTS    (RS-232 Request To Send, output)
  Bit 0: RXD    (RS-232 RXD, input)

Other CIA2 registers (standard CIA layout at offsets $00-$0F):
  $DD00 - PRA   (Port A Data Register)     ; contains BA1/BA0, IEC, TXD
  $DD01 - PRB   (Port B Data Register)     ; contains RXD, RTS, DTR, RI, DCD
  $DD02 - DDRA  (Port A Data Direction)
  $DD03 - DDRB  (Port B Data Direction)
  $DD04 - TALO  (Timer A low)
  $DD05 - TAHI  (Timer A high)
  $DD06 - TBLO  (Timer B low)
  $DD07 - TBHI  (Timer B high)
  $DD08 - TOD_10TH (Time-of-day 1/10s)
  $DD09 - TOD_SEC   (Time-of-day seconds)
  $DD0A - TOD_MIN   (Time-of-day minutes)
  $DD0B - TOD_HR    (Time-of-day hours)
  $DD0C - SDR    (Serial Data Register)
  $DD0D - ICR    (Interrupt Control Register)
  $DD0E - CRA    (Control Register A)
  $DD0F - CRB    (Control Register B)

FLAG pin / SRQ / NMI:
  - CIA2 FLAG pin is connected to the IEC SRQ line.
  - A negative edge on FLAG/SRQ will generate an NMI on the CPU if NMI generation is enabled in system configuration (see interrupt_handling).
```

## Key Registers
- $DD00-$DD0F - CIA 6526 (CIA2) - Port A/Port B data registers, DDRA/DDRB, timers TMR A/B, Time-of-Day, SDR, ICR, CRA/CRB; Port A bits 0-1 = VIC-II bank select (active low), Port A bits 3-7 = IEC signals, Port A bit 2 = RS-232 TXD; Port B bits 0-4 = RS-232 RXD/RTS/DTR/RI/DCD.

## References
- "port_a_data_register_pra" — expands on CIA2 Port A bits 0-1 and IEC wiring
- "port_b_data_register_prb" — expands on RS-232 signals on CIA2 Port B
- "interrupt_handling" — expands on CIA ICR and NMI triggering behavior