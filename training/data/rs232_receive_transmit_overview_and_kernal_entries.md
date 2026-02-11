# RS-232 (User Port) — receive/transmit behavior, buffers, BASIC usage, and KERNAL entry points

**Summary:** RS-232 receive/transmit behavior for the Commodore 64: receive buffer overflow behavior, output buffer size (255 chars), recommended I/O methods (GET# preferred, INPUT#/CHRIN not recommended), x-line (RTS/CTS/DCD) handshake via CHKIN/CHKOUT, and KERNAL entry points (CHKIN $FFC6, GETIN $FFE4, CHRIN $FFCF, CHKOUT $FFC9, CHROUT $FFD2, CLOSE $FFC3). System recovery on CHROUT/blocking: WARM START via <RUN/STOP> + <RESTORE>.

## Receive behavior and BASIC recommendations
- GET# returns a character from the RS-232 receive buffer; if no data is available GET# returns a null character (ASCII $00). GET# is the recommended BASIC routine for non-blocking reads from the RS-232 channel.
- INPUT# and the KERNAL CHRIN routine are blocking: INPUT# will wait until a non-null character followed by a carriage return is received. If CTS or DSR disappear during an INPUT# (blocking) read, the system can hang and be left in a RESTORE-only state. For this reason INPUT# and CHRIN are NOT recommended.
- For high-speed data handling, machine language (KERNAL calls or direct buffer manipulation) is recommended because BASIC routines can be too slow, and receive buffer overflow can occur if data arrives faster than software services it.
- Unused bits in word lengths under 8 bits are zero-filled.

## Handshaking and receive overflow behavior
- CHKIN ($FFC6) implements x-line (RTS/CTS/DCD) handshake per the EIA RS-232-C standard (Aug 1979). The Commodore 64 is treated as the Data Terminal Equipment (DTE).
- If the hardware/software handshake is not observed or the receive buffer fills, incoming data can be lost. Use CHKIN/CHKOUT or program-level flow control to avoid overflow.
- The system provides receive buffering; exact zero-page pointer locations and buffer base pointers are documented elsewhere (see references).

## Transmit behavior and buffering
- The output buffer can hold up to 255 characters. If the buffer becomes full, CHROUT will block (wait) until the device allows further transmission.
- There is no automatic carriage-return delay built into the output channel. RS-232 printers without internal buffering or an external hold-off/handshake cannot reliably print unless the host or printer implements hold-off.
- CHKOUT ($FFC9) handles x-line handshake for output (RTS/CTS/DCD). If CHROUT blocks due to handshake or a full buffer, the system will remain waiting in CHROUT until transmission resumes or the user performs a WARM START (<RUN/STOP> + <RESTORE>) to recover.
- When closing an RS-232 channel, CLOSE discards both buffers, stops transmission/reception, sets RTS and transmitted data (Sout) lines high, and removes RS-232 buffers. Care must be taken to ensure data is transmitted before closing.

## BASIC usage and examples
- CMD lfn — acts the same as in BASIC specifications for device control.
- PRINT#lfn,<variable list> — use for writing to the RS-232 channel from BASIC.
- INPUT# is not recommended for RS-232 I/O due to blocking behavior and potential hangs if handshake lines change.
- To check from BASIC that transmission has completed before CLOSE, the source recommends polling a status variable (example below).

## KERNAL entry points (brief)
- CHKIN ($FFC6) — KERNAL entry that handles x-line handshake for receive (see Memory Map for entry/exit conditions).
- GETIN ($FFE4) — KERNAL entry for getting a character (non-blocking behavior described above).
- CHRIN ($FFCF) — KERNAL blocking input (not recommended).
- CHKOUT ($FFC9) — KERNAL entry that handles x-line handshake for transmit.
- CHROUT ($FFD2) — KERNAL entry for sending a character (will block if buffer full/handshake inactive).
- CLOSE ($FFC3) — KERNAL entry to close an RS-232 channel and discard buffers.

## Source Code
```text
+-----------------------------------------------------------------------+
| NOTES:                                                                |
|   If the word length is less than 8 bits, all unused bit(s) will be   |
| assigned a value of zero.                                             |
|   If a GET# does not find any data in the buffer, the character "" (a |
| null) is returned.                                                    |
|   If INPUT# is used, then the system will hang in a waiting condition |
| until a non-null character and a following carriage return is         |
| received. Therefore, if the Clear To Send (CTS) or Data Set Ready     |
| (DSR) line(s) disappear during character INPUT#, the system will hang |
| in a RESTORE-only state. This is why the INPUT# and CHRIN routines are|
| NOT recommended.                                                      |
|   The routine CHKIN handles the x-line handshake which follows the EIA|
| standard (August 1979) for RS-232-C interfaces. (The Request To Send  |
| (RTS), CTS, and Received line signal (DCD) lines are implemented with |
| the Commodore 64 computer defined as the Data Terminal device.)       |
+-----------------------------------------------------------------------+
```

```text
SENDING DATA TO AN RS-232 CHANNEL

When sending data, the output buffer can hold 255 characters before a
full buffer hold-off occurs. The system will wait in the CHROUT routine
until transmission is allowed or the <RUN/STOP> and <RESTORE> keys are
used to recover the system through a WARM START.

+-----------------------------------------------------------------------+
| IMPORTANT NOTES: There is no carriage-return delay built into the     |
| output channel. This means that a normal RS-232 printer cannot        |
| correctly print, unless some form of hold-off (asking the Commodore 64|
| to wait) or internal buffering is implemented by the printer. The     |
| hold-off can easily be implemented in your program. If a CTS (x-line)|
| handshake is implemented, the Commodore 64 buffer will fill, and then |
| hold-off more output until transmission is allowed by the RS-232      |
| device. X-line handshaking is a handshake routine that uses multi-    |
| lines for receiving and transmitting data.                            |
|   The routine CHKOUT handles the x-line handshake, which follows the  |
| EIA standard (August 1979) for RS-232-C interfaces. The RTS, CTS, and |
| DCD lines are implemented with the Commodore 64 defined as the Data   |
| Terminal Device.                                                      |
+-----------------------------------------------------------------------+
```

```basic
100 SS=ST: IF(SS=0 OR SS=8) THEN 100
110 CLOSE lfn
```

```text
KERNAL ENTRIES (as listed in source):
CHKIN ($FFC6)
GETIN ($FFE4)
CHRIN ($FFCF)
CHKOUT ($FFC9)
CHROUT ($FFD2)
CLOSE ($FFC3)
```

## Key Registers
- $FFC6 - KERNAL - CHKIN: RS-232 input x-line handshake entry (RTS/CTS/DCD handling)
- $FFE4 - KERNAL - GETIN: KERNAL non-blocking character input entry
- $FFCF - KERNAL - CHRIN: KERNAL blocking character input entry (not recommended)
- $FFC9 - KERNAL - CHKOUT: RS-232 output x-line handshake entry (RTS/CTS/DCD handling)
- $FFD2 - KERNAL - CHROUT: KERNAL character output entry (may block when buffer full)
- $FFC3 - KERNAL - CLOSE: Close RS-232 channel, clear buffers, set RTS/Sout high

## References
- "rs232_user_port_and_status_examples" — expands on RS-232 status register and sample BASIC programs that use GET#/PRINT#
- "rs232_buffer_and_memory_locations" — expands on Receiver/Transmitter buffer base pointers ($00F7/$00F9) and zero/nonzero page locations

## Labels
- CHKIN
- GETIN
- CHRIN
- CHKOUT
- CHROUT
- CLOSE
