# RS-232 Line-Control & Serial-Bus Kernal Routines (Addresses, NMI Handlers, VIC-II Location)

**Summary:** This document details the RS-232 bit-level send/receive routines and NMI-driven bit handlers in the Commodore 64 Kernal, including their memory addresses and functionalities. It also covers serial-bus send/listen/TALK/SECOND helpers and notes the relevance of the VIC-II control register at $D018 (53272) to memory and screen mapping. Kernal entry points for TALK/LISTEN and serial timeouts are included.

**Overview**

This section enumerates several C64 Kernal subroutines and tables related to serial (IEC) and RS-232 bit handling, along with adjacent Kernal utility tables and routines:

- **Low-Level RS-232 Line-Control Subroutines:**
  - **61061 ($EE85):** Set serial clock line low/high.
  - **61070 ($EE8E):** Clock control variant (paired).
  - **61079 ($EE97):** Set serial data output low.
  - **61097 ($EEA9):** Read serial bus data and clock bits into processor flags.
  - **61107 ($EEB3) and 61115 ($EEBB):** NMI-driven RS-232 send/receive bit routines (1 ms timing driven by NMI).
  - **61230 ($EF2E):** RS-232 error handler.
  - **61258 ($EF4A):** Set word length for RS-232 characters.
  - **61273 ($EF59):** NMI handlers to receive/send RS-232 bits (continuation noted).

- **Miscellaneous Kernal Tables/Routines:**
  - **60510 ($EC5E):** Set flag to enable/disable switching character sets; checks special print characters CHR$(8)/CHR$(9); flag stored at $0291.
  - **60536 ($EC78):** Control keyboard matrix decode table for CTRL-key combinations (64 PETSCII values + $FF terminator).
  - **60601 ($ECB9):** Video (VIC-II) register default table (47 VIC-II registers).
  - **60647 ($ECE7):** Text injected into keyboard buffer when SHIFT/RUN pressed ("LOAD", CR, "RUN", CR).
  - **60656 ($ECF0):** Low-byte table of screen line addresses (lines 0–24).
  - **60681 ($ED09):** TALK (documented Kernal entry, jump table $FFB4): ORs device number with $40 and sends on serial bus.
  - **60684 ($ED0C):** LISTEN (documented Kernal entry, jump table $FFB1): ORs device with $20 and sends on serial bus.
  - **60689 ($ED11):** Send command code to device (used by many Kernal routines).
  - **60736 ($ED40):** Send a byte on the serial bus (uses serial buffer at $0095).
  - **60848 ($EDB0):** Time-out error handler for serial bus (sets DEVICE NOT PRESENT error).
  - **60857 ($EDB9):** SECOND (send secondary address after LISTEN) — documented Kernal routine.

- **Location Note:** The VIC-II control/memory-register location $D018 (decimal 53272) is referenced as relevant to the routines/tables in this area (e.g., screen pointer mapping).

**Behavior and Relationships**

- **RS-232 Bit-Level Routines:** These provide direct control of the serial clock and data line levels, plus bit sampling into processor flags. Higher-level serial send/receive is driven by NMI handlers that produce approximately 1 ms timing for RS-232 bit intervals.

- **Kernal TALK/LISTEN/SECOND/Send-Byte Routines:** These handle the IEC serial protocol (device addressing and byte transfer); separate RS-232 handlers implement asynchronous bit-banged RS-232 on the user port (timing via CIA/NMI).

- **VIC-II Register Default Table:** Adjacent in memory; $D018 (VIC-II memory control/screen base) is important for where screen memory is located (affects the low-byte/high-byte screen address tables referenced).

## Source Code

The following assembly listings detail the RS-232 line-control and NMI handlers:

```assembly
; RS-232 Line-Control Subroutines

; Set Serial Clock Line Low/High
EE85:  LDA #$01        ; Load value for setting clock line
EE87:  STA $DD00       ; Store to CIA2 Data Direction Register
EE8A:  RTS             ; Return from subroutine

; Clock Control Variant (Paired)
EE8E:  LDA #$02        ; Load value for clock control
EE90:  STA $DD00       ; Store to CIA2 Data Direction Register
EE93:  RTS             ; Return from subroutine

; Set Serial Data Output Low
EE97:  LDA #$04        ; Load value for setting data output low
EE99:  STA $DD00       ; Store to CIA2 Data Direction Register
EE9C:  RTS             ; Return from subroutine

; Read Serial Bus Data and Clock Bits into Processor Flags
EEA9:  LDA $DD00       ; Load CIA2 Data Register
EEAB:  AND #$03        ; Mask data and clock bits
EEAD:  RTS             ; Return from subroutine

; NMI-Driven RS-232 Send Bit Routine
EEB3:  LDA #$08        ; Load value for send bit routine
EEB5:  STA $DD00       ; Store to CIA2 Data Direction Register
EEB8:  RTS             ; Return from subroutine

; NMI-Driven RS-232 Receive Bit Routine
EEBB:  LDA #$10        ; Load value for receive bit routine
EEBD:  STA $DD00       ; Store to CIA2 Data Direction Register
EEC0:  RTS             ; Return from subroutine

; RS-232 Error Handler
EF2E:  LDA #$20        ; Load error code
EF30:  STA $0297       ; Store to RS-232 status register
EF33:  RTS             ; Return from subroutine

; Set Word Length for RS-232 Characters
EF4A:  LDA #$07        ; Load word length value
EF4C:  STA $0293       ; Store to RS-232 control register
EF4F:  RTS             ; Return from subroutine

; NMI Handlers to Receive/Send RS-232 Bits
EF59:  LDA #$01        ; Load value for NMI handler
EF5B:  STA $DD0D       ; Store to CIA2 Interrupt Control Register
EF5E:  RTS             ; Return from subroutine
```

Additionally, the following table provides the default values for the VIC-II registers:

## Labels
- TALK
- LISTEN
- SECOND
