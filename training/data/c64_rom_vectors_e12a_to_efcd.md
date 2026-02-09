# MACHINE - ROM routines list (E12A–EFCD)

**Summary:** Index of C64 KERNAL/ROM entry points and short descriptions for routines at $E12A–$EFCD, covering BASIC initialization, vector setup, screen I/O (clear/home/print/scroll), keyboard handling, VIC-II/video setup, and serial/RS-232 bus primitives (talk/listen/clock/send/receive/timeout).

**Routine Index**

- **$E12A** - Perform SYS
- **$E156** - Initialize BASIC
- **$E447** - Vectors for $0300
- **$E453** - Initialize vectors
- **$E45F** - Power-up message
- **$E500** - Get I/O messages
- **$E505** - Get screen size
- **$E50A** - Put/get row/column
- **$E518** - Initialize I/O
- **$E544** - Clear screen
- **$E566** - Home cursor
- **$E56C** - Set screen pointers
- **$E5A0** - Set I/O defaults
- **$E5B4** - Input from keyboard
- **$E632** - Input from screen
- **$E684** - Quote test
- **$E691** - Set up screen print
- **$E6B6** - Advance cursor
- **$E6ED** - Retreat cursor
- **$E701** - Back into previous line
- **$E716** - Output to screen
- **$E87C** - Go to next line
- **$E891** - Perform (return)
- **$E8A1** - Check line decrement
- **$E8B3** - Check line increment
- **$E8CB** - Set color code
- **$E8EA** - Scroll screen
- **$E965** - Open space on screen
- **$E9C8** - Move a screen line
- **$E9E0** - Synchronize color transfer
- **$E9F0** - Set start-of-line
- **$E9FF** - Clear screen line
- **$EA13** - Print to screen
- **$EA24** - Synchronize color pointer
- **$EA31** - Interrupt-clock, etc.
- **$EA87** - Read keyboard
- **$EB79** - Keyboard select vectors
- **$EB81** - Keyboard 1 — unshifted
- **$EBC2** - Keyboard 2 — shifted
- **$EC03** - Keyboard 3 — "Commodore" shifted
- **$EC44** - Graphics/text control
- **$EC4F** - Set graphics/text mode
- **$EC78** - Keyboard 4
- **$ECB9** - Video chip setup
- **$ECE7** - Shift/run equivalent
- **$ECF0** - Screen line address low
- **$ED09** - Send "talk" to serial bus
- **$ED0C** - Send "listen" to serial bus
- **$ED40** - Send to serial bus
- **$EDB2** - Serial timeout
- **$EDB9** - Send listen SA
- **$EDBE** - Clear ATN
- **$EDC7** - Send talk SA
- **$EDCC** - Wait for clock
- **$EDDD** - Send serial deferred
- **$EDEF** - Send "untalk" to serial bus
- **$EDFE** - Send "unlisten" to serial bus
- **$EE13** - Receive from serial bus
- **$EE85** - Serial clock on
- **$EE8E** - Serial clock off
- **$EE97** - Serial output "1"
- **$EEA0** - Serial output "0"
- **$EEA9** - Get serial in and clock signals
- **$EEB3** - Delay 1 millisecond
- **$EEBB** - RS-232 send
- **$EEC0** - RS-232 receive
- **$EED0** - RS-232 status
- **$EEE4** - RS-232 control
- **$EEF4** - RS-232 initialize
- **$EF0A** - RS-232 close
- **$EF15** - RS-232 open
- **$EF2D** - RS-232 set baud rate
- **$EF3A** - RS-232 set parity
- **$EF47** - RS-232 set stop bits
- **$EF54** - RS-232 set data bits
- **$EF61** - RS-232 set handshake
- **$EF6E** - RS-232 set buffer
- **$EF7B** - RS-232 set timeout
- **$EF88** - RS-232 set device
- **$EF95** - RS-232 set mode
- **$EFA2** - RS-232 set protocol
- **$EFAF** - RS-232 set flow control
- **$EFBC** - RS-232 set character size
- **$EFC9** - RS-232 set stop character
- **$EFD6** - RS-232 set start character
- **$EFE3** - RS-232 set escape character
- **$EFF0** - RS-232 set line termination
- **$EFFD** - RS-232 set line delay

## Source Code

(omitted — this chunk contains only the routine index and short descriptions; no assembly or tables were provided)

## References

- "c64_rom_vectors_efe1_to_fffa" — expands on remaining KERNAL and IRQ/NMI/serial handlers up to hardware vectors