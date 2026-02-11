# NMI/BRK, RS-232 and Cassette I/O Routines (KERNAL addresses and descriptions)

**Summary:** Describes KERNAL entry points and handlers for NMI/BRK and RS-232 bit-timed NMIs (addresses: $FE43, $FE66, $FE72; RAM vector $0318), and documents cassette I/O routines and control points (cassette checks, read/write IRQs, tape data output on 6510 port $0001). Includes the RS-232 baud prescaler formula and CPU clock constants (NTSC/PAL).

**NMI, BRK and RS-232 handlers (brief)**

- **NMI interrupt entry point:** Listed at decimal 65091 ($FE43). The standard NMI handler jumps through a RAM vector at 792 ($0318). The handler checks whether the NMI was caused by RS-232 bit timing (via CIA timers); otherwise, it treats the event as a RESTORE key press.

- **BRK warm start:** Listed at decimal 65126 ($FE66). Handles STOP/RESTORE combinations (warm-start BRK handling).

- **NMI RS-232 handler:** Listed at decimal 65138 ($FE72). Handles RS-232 bit send/receive via NMI-driven bit timing.

- **RS-232 baud rate support:** KERNAL contains baud prescaler tables (NTSC table referenced at decimal 65218 / $FEC2). Prescaler formula given as:


  where CLOCK is the CPU clock: NTSC 1,022,730 Hz, PAL 985,250 Hz.

  The NTSC prescaler table at $FEC2 contains the following values:

  | Baud Rate | Prescaler Value (Low Byte) | Prescaler Value (High Byte) |
  |-----------|----------------------------|-----------------------------|
  | 50        | $E8                        | $03                         |
  | 75        | $A8                        | $02                         |
  | 110       | $7C                        | $02                         |
  | 134.5     | $68                        | $02                         |
  | 150       | $54                        | $02                         |
  | 300       | $A8                        | $01                         |
  | 600       | $54                        | $01                         |
  | 1200      | $2A                        | $01                         |
  | 1800      | $1C                        | $01                         |
  | 2400      | $14                        | $01                         |
  | 3600      | $0E                        | $01                         |
  | 4800      | $0A                        | $01                         |
  | 7200      | $06                        | $01                         |
  | 9600      | $04                        | $01                         |
  | 19200     | $02                        | $01                         |
  | 38400     | $01                        | $01                         |

  These values are stored in the KERNAL ROM at $FEC2 and are used to set the CIA #2 timers for RS-232 communication. ([scribd.com](https://www.scribd.com/doc/170569167/Mapping-the-64?utm_source=openai))

**Cassette I/O routines (addresses and behavior)**

- **Check Cassette Switch:** Subroutine entry at decimal 63544 ($F838). Tests recorder button(s).

- **Test Cassette Buttons and Handle Messages for Tape Write:** Entry at 63553 ($F841). Tests sense switch; if no button pressed, prints "PRESS PLAY & RECORD" and loops until cassette button or STOP key pressed; on button press, prints "OK". These messages cannot be suppressed by flag at 157 ($009D).

- **Start Reading a Block of Data from the Cassette:** Entry at 63588 ($F864). Tests cassette switch and initializes flags for reading a block.

- **Start Writing a Block of Data to the Cassette:** Entry at 63605 ($F875). Tests cassette switch and initializes flags for writing a block.

- **Common Code for Read/Write Block:** Entry at 63696 ($F8D0). Sets up CIA #1 Timer B to drive IRQ for cassette read/write, saves old IRQ vector and installs read/write IRQ, blanks screen to avoid VIC-II memory contention affecting timing.

- **Test STOP Key during Cassette I/O:** Entry at 63714 ($F8E2). Polls STOP key to abort tape I/O if pressed.

- **Adjust CIA #1 Timer A for Tape Bit Timing:** Entry at 63788 ($F92C).

- **Read Tape Data (IRQ):** Entry at 64096 ($FA60). IRQ handler used during cassette read; restores IRQ vector at end of read.

- **Receive and Store Next Character from Cassette:** Entry at 64398 ($FB8E). Part of cassette read IRQ that collects the next byte.

- **Move Tape SAVE/LOAD Address into Pointer at 172:** Entry at 64407 ($FB97).

- **Reset Counters for New Byte Read/Write:** Entry at 64422 ($FBA6).

- **Toggle Tape Data Output Line:** Entry at 64456 ($FBC8). Sets CIA #1 Timer B and toggles the Tape Data Output line (6510 on-chip I/O port bit 3 at location $0001).

- **Write Data to Cassette — Part 2 (IRQ):** Entry at 64456 ($FBC8) / repeated context.

- **Write Data to Cassette — Part 1 (IRQ):** Entry at 64618 ($FC6A).

- **Restore Default IRQ Routine:** Entry at 64659 ($FC93). Turns screen back on, stops cassette motor, resets CIA #1 Timer A to 60Hz (software clock), and restores the normal IRQ handler (keyboard scan / clock).

- **Terminate Cassette I/O:** Entry at 64696 ($FCB8). Calls restore-default-IRQ routine and returns from interrupt.

- **Final listed entry point:** 64714 ($FCCA).

## Source Code

  ```
  prescaler = ((CLOCK / BAUD) / 2) - 100
  ```


```assembly
; NMI Interrupt Entry Point at $FE43
FE43: 08        PHP             ; Push processor status onto stack
FE44: 68        PLA             ; Pull processor status into A
FE45: 29 EF     AND #$EF        ; Clear decimal mode flag
FE47: 48        PHA             ; Push modified status back onto stack
FE48: 48        PHA             ; Push A onto stack
FE49: 8A        TXA             ; Transfer X to A
FE4A: 48        PHA             ; Push A onto stack
FE4B: 98        TYA             ; Transfer Y to A
FE4C: 48        PHA             ; Push A onto stack
FE4D: BA        TSX             ; Transfer stack pointer to X
FE4E: BD 04 01  LDA $0104,X     ; Load processor status from stack
FE51: 29 10     AND #$10        ; Check for BRK flag
FE53: F0 03     BEQ $FE58       ; If not set, continue
FE55: 6C 16 03  JMP ($0316)     ; Jump to BRK vector
FE58: 6C 14 03  JMP ($0314)     ; Jump to IRQ vector
```

```assembly
; BRK Warm Start Routine at $FE66
FE66: 48        PHA             ; Push A onto stack
FE67: 8A        TXA             ; Transfer X to A
FE68: 48        PHA             ; Push A onto stack
FE69: 98        TYA             ; Transfer Y to A
FE6A: 48        PHA             ; Push A onto stack
FE6B: 6C 18 03  JMP ($0318)     ; Jump to NMI vector
```

```assembly
; RS-232 NMI Handler at $FE72
FE72: 48        PHA             ; Push A onto stack
FE73: 8A        TXA             ; Transfer X to A
FE74: 48        PHA             ; Push A onto stack
FE75: 98        TYA             ; Transfer Y to A
FE76: 48        PHA             ; Push A onto stack
FE77: 6C 1A 03  JMP ($031A)     ; Jump to RS-232 NMI vector
```

```assembly
; CIA Timer Control Example
; Set up CIA #2 Timer A for RS-232 bit timing
LDA #<PRESCALER_VALUE
STA $DD04       ; Timer A Low Byte
LDA #>PRESCALER_VALUE
STA $DD05       ; Timer A High Byte
LDA #%00010001  ; Start Timer A in continuous mode
STA $DD0E       ; Timer A Control Register
```

```assembly
; CIA Timer Control Example
; Set up CIA #1 Timer B for cassette I/O timing
LDA #<TIMER_B_VALUE
STA $DC06       ; Timer B Low Byte
LDA #>TIMER_B_VALUE
STA $DC07       ; Timer B High Byte
LDA #%00010001  ; Start Timer B in continuous mode
STA $DC0F       ; Timer B Control Register
```
([hitmen.c02.at](https://hitmen.c02.at/files/rr/html/c64-kernal.s.htm?utm_source=openai))

## Key Registers

- **$0001** - 6510 on-chip I/O port - Tape Data Output: bit 3 toggled by cassette write routines.

- **$009D** - Zero page flag (157) - controls suppression of cassette messages.

- **$0318** - RAM vector used by NMI handler jump.

- **$DC00-$DC0F** - CIA #1 - used for tape timing (Timer A and Timer B drive cassette IRQs).

- **$DD00-$DD0F** - CIA #2 - used for RS-232 bit timing and NMIs (RS-232 NMI control via CIA#2 timers).

## References

- "rs232_bit_control_and_nmi_related_routines" — expands on RS-232 bit timing and NMI use via CIA timers

- "cia2_control_registers_images_and_expansion_range" — expands on CIA#2 timers and control registers