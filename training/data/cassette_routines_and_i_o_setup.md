# Kernal RS-232 / Cassette I/O Routines and Messages

**Summary:** Kernal ROM routines and message data for RS-232 and cassette I/O (routine entry addresses $EF59–$F1CA), Kernal control messages stored at $F0BD (61629), GETIN/CHRIN/CHROUT documented entry behavior and jump-table vectors (GETIN vector $FFE4 -> RAM vector $032A), and OPEN/CLOSE Kernal entry points ($E1BE/$E1C7).

**Overview**
This chunk documents the Commodore 64 Kernal ROM routines involved in RS-232 serial and cassette I/O: bit-level receive handlers, byte receive and transmit setup, device-specific CHKIN/CHKOUT/GETIN/CHROUT interfaces, and the ASCII control messages used for tape operations. It also covers interaction with the CIA#2 NMI used for RS-232 timing and the conditions under which Kernal prints I/O status messages (direct mode check at $009D).

Key behavioral points:
- RS-232 routines are driven by NMIs (CIA#2); a subroutine disables those NMIs before time-sensitive cassette/serial operations.
- GETIN/CHRIN: GETIN (Kernal documented entry) and CHRIN behave identically for all devices except the keyboard. When the keyboard is the current input device, GETIN reads from the keyboard buffer at $0277 and depends on the IRQ handler to fill that buffer.
- PRINT of Kernal control messages checks the "messages enabled" flag at $009D (157 decimal) before printing (routine prints message indexed by Y).
- Kernal control messages are stored with the high-bit set on the last byte of each message (ASCII + 128), simplifying parsing of message ends.

**Routines and Behavior Notes**
- $EF59 (61273) — Receive Next RS-232 Bit (called from NMI): Receives the next serial bit during NMI-driven serial input.
- $EF7E (61310) — Setup to Receive a New Byte from RS-232: Prepares state to assemble the next incoming RS-232 byte.
- $EF90 (61328) — Test If Start Bit Received from RS-232: Detects start-bit condition.
- $EF97 (61335) — Put a Byte of Received Data into RS-232 Receive Buffer: Checks for receive-buffer overrun, stores received byte, checks parity/framing/break errors, and primes reception for next byte.
- $EFE1 (61409) — CHKOUT for RS-232 Device: Called by Kernal CHKOUT to mark logical file as output channel (requires file OPEN).
- $F014 (61460) — CHROUT for RS-232 Device: Called by Kernal CHROUT to send a byte over RS-232 after CHKOUT and OPEN.
- $F04D (61517) — CHKIN for RS-232 Device: Called by Kernal CHKIN to mark logical file as input channel (requires file OPEN).
- $F086 (61574) — GETIN for RS-232 Device: Called by Kernal GETIN and CHRIN to retrieve next byte from RS-232 receive buffer; checks for Receive Buffer Empty error.
- $F0A4 (61604) — Stop CIA #2 RS-232 NMIs for Serial/Cassette Routines: Disables NMIs from CIA#2 to avoid timing interference during serial/cassette I/O.
- $F0BD (61629) — Kernal Control Messages: ASCII text area storing I/O control messages used for tape/serial prompts and status; last byte of every message has bit 7 set.
- $F12B (61739) — Print Kernal Error Message if in Direct Mode: Checks $009D; if enabled, prints message indexed by Y.
- $F13E (61758) — GETIN (documented): Kernal documented GETIN routine (jump-table entry at $FFE4); gets char from current input device (device number at $0099). For keyboard, GETIN reads keyboard buffer at $0277 and depends on IRQ.
- $F157 (61783) — CHRIN: Input a character from the current device (operates like GETIN for non-keyboard devices).
- $F1CA (61898) — CHROUT: Output a character to the current output device (documented CHROUT behavior is consistent with RS-232 CHROUT above).
- $E1BE (57790) — OPEN: Kernal OPEN entry used by file operations (interacts with tape/serial device open semantics).
- $E1C7 (57799) — CLOSE: Kernal CLOSE entry for closing logical files.

RAM/Vector locations referenced:
- GETIN documented vector via IRQ/BRK/entry: jump-table entry at $FFE4 (65508 decimal) that jumps through RAM vector at $032A (810 decimal).
- Current input device number stored at $0099 (153 decimal).
- "Messages enabled" flag at $009D (157 decimal).
- Keyboard buffer start at $0277 (631 decimal).

## Source Code
```text
Kernal routine addresses and brief descriptions:

$EF59  (61273)  Receive Next RS-232 Bit (NMI)
$EF7E  (61310)  Setup to Receive a New Byte from RS-232
$EF90  (61328)  Test If Start Bit Received from RS-232
$EF97  (61335)  Put a Byte of Received Data into RS-232 Receive Buffer
$EFE1  (61409)  CHKOUT for the RS-232 device
$F014  (61460)  CHROUT for the RS-232 Device
$F04D  (61517)  CHKIN for the RS-232 Device
$F086  (61574)  GETIN for the RS-232 Device
$F0A4  (61604)  Stop CIA #2 RS-232 NMIs for Serial/Cassette Routines
$F0BD  (61629)  Kernal Control Messages (ASCII area; messages end with high-bit set)
$F12B  (61739)  Print Kernal Error Message if in Direct Mode (checks $009D)
$F13E  (61758)  GETIN (documented Kernal entry; jump-table at $FFE4 -> vector $032A)
$F157  (61783)  CHRIN
$F1CA  (61898)  CHROUT
$E1BE  (57790)  OPEN
$E1C7  (57799)  CLOSE

Kernal control messages stored at $F0BD (61629), each terminated by byte with bit7=1:
I/O ERROR
SEARCHING
FOR
PRESS PLAY ON TAPE
PRESS RECORD & PLAY ON TAPE
LOADING
SAVING
VERIFYING
FOUND
OK

RAM locations:
$0099 (153)  - Current input device number
$009D (157)  - Messages enabled flag (non-zero: messages enabled)
$0277 (631)  - Keyboard buffer (GETIN reads here when keyboard is current device)
$032A (810)  - RAM vector used by documented GETIN jump-table entry ($FFE4)

Jump-table:
$FFE4 (65508)  - GETIN documented entry point (jumps through $032A)

Bit-level CIA #2 register usage details for "Stop CIA #2 RS-232 NMIs" routine:

The "Stop CIA #2 RS-232 NMIs" routine disables NMIs from CIA#2 to prevent timing interference during serial/cassette I/O operations. This is achieved by manipulating the Interrupt Control Register (ICR) at $DD0D (56589 decimal). The ICR controls the enabling and disabling of various interrupt sources. Writing to this register with bit 7 set enables the specified interrupts, while writing with bit 7 clear disables them.

In the context of stopping RS-232 NMIs, the routine writes a value to $DD0D with bit 7 clear and the appropriate bits set to disable specific interrupts. The relevant bits in the ICR are:

- Bit 4: FLAG line (RS-232 data received)
- Bit 3: Serial port (unused in C64)
- Bit 2: Time-of-day clock alarm
- Bit 1: Timer B underflow
- Bit 0: Timer A underflow

By writing a value with bit 7 clear and bits 0-4 set as needed, the routine disables the corresponding NMIs. For example, to disable the FLAG line interrupt (bit 4), the routine would write %00010000 to $DD0D.

Full assembly listings for the routines ($EF59..$F1CA):

Due to the extensive length of the assembly code for these routines, providing the full listings here is impractical. However, detailed disassemblies of the Commodore 64 Kernal ROM, including these routines, are available in various technical references and online resources. For comprehensive assembly listings, refer to the "Commodore 64 ROM Disassembly" available at [https://www.gbppr.net/iirg/c64-diss.html](https://www.gbppr.net/iirg/c64-diss.html).
```

## Key Registers
- $DD00-$DD0F - CIA 2 - serial/timer/interrupt registers used for RS-232 NMIs and timing control

## References
- "kernal_chrin_chrout_and_file_routines" — expands on OPEN/CLOSE/SETNAM/SETLFS interactions with tape and serial I/O

## Labels
- GETIN
- CHRIN
- CHROUT
- CHKIN
- CHKOUT
- OPEN
- CLOSE
