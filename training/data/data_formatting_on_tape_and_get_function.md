# RS-232 on the Commodore 64 — GET#/PRINT# behavior and Control Register Map

**Summary:** Describes RS-232 on the C64 (TTL-level voltages, KERNAL handlers driven by CIA #2), GET# and PRINT# behavior (GET# returns returned characters, CHR$(0) yields an empty string which makes ASC(...) error), and the 8-bit control register format used in OPEN (baud, word length, stop bits). Mentions BASIC commands OPEN, CLOSE, CMD, INPUT#, GET#, PRINT# and the CIA2 address range $DD00-$DD0F used for timers/NMI.

## GET# and PRINT# behavior

- GET# reads characters from the RS-232 receive FIFO and returns characters exactly as received, including RETURN (CR) and punctuation.
- When a CHR$(0) byte is received it is represented as an empty string by GET#. Applying ASC(empty string) will cause a runtime error.
- Common technique to avoid ASC errors on possibly-empty strings:
  - Use GET# into a string variable A$ and then compute A = ASC(A$ + CHR$(0)).
  - If A$ is empty, A becomes 0; otherwise A contains the ASCII/byte value of the first character.
- PRINT# appends a RETURN (carriage return) at the end of a PRINT# output line. When composing multi-field output, insert explicit separator characters (e.g., comma, space, CHR$(13)) between items to control how the remote device receives fields.

## RS-232 interface and KERNAL handling

- Electrical: The C64 uses RS-232 signaling in standard format (start/stop/parity/baud), but at TTL voltage levels (0–5 V) — a level translator is required to connect to standard ±12 V RS-232 hardware. The Commodore RS-232 interface cartridge performs proper voltage conversion.
- Access: RS-232 is accessible from BASIC and from the KERNAL (for machine-language programs). BASIC-level commands: OPEN, CLOSE, CMD, INPUT#, GET#, PRINT#, and the reserved variable ST.
  - INPUT# and GET# read from the receive buffer; PRINT# and CMD write to the transmit buffer.
- KERNAL internals: The RS-232 KERNAL byte/bit handlers are driven by timers and interrupts from CIA #2 (6526). CIA #2 generates NMI requests for RS-232 processing so background RS-232 activity can occur during BASIC and machine-language execution.
- Hold-offs and resource conflicts:
  - The KERNAL has built-in hold-offs that disable RS-232 reception during cassette or serial bus activities. While cassette or serial-bus operations are active, RS-232 data cannot be received.
  - These hold-offs are local to the routines (so careful programming avoids interference), but be aware that RS-232 reception is suspended during those I/O operations.
- Buffers:
  - Two FIFOs (first-in/first-out), each 256 bytes, are allocated at the top of memory when an RS-232 channel is OPENed (512 bytes total). OPEN automatically allocates them; CLOSE frees them.
  - If there is insufficient free memory above your BASIC program when OPEN runs, no error is printed — instead the top of your BASIC program can be overwritten. (Be careful to ensure enough RAM before OPEN.)
- Channel and control-word rules:
  - Only one RS-232 channel should be OPEN at a time. A second OPEN resets buffer pointers and loses any data in buffers.
  - The OPEN filename field may contain up to 4 characters: the first two are control and command register characters; the remaining two are reserved for future options. Baud, parity and other options are selected via this control word.
  - There is no error-checking of the control word: an illegal or unsupported control word can cause the interface to operate at a very slow rate (below 50 baud).
  - lfn (logical file number) may be 1–255. If you choose lfn > 127, a line feed (LF) will follow carriage returns (CR) on transmitted lines.

## Source Code
```basic
REM OPEN syntax (BASIC)
OPEN lfn,2,0,"<control register><command register><opt baud low><opt baud high>"

REM Example technique to safely convert GET# result to numeric ASCII value:
GET#1,A$    : REM receive into string A$
A = ASC(A$ + CHR$(0))  : REM yields 0 if A$ is empty, otherwise ASCII of first char

REM Reminder: if lfn > 127 then transmitted CRs are followed by LF.
```

```text
Control Register Map (Figure 6-1, bitfield layout)

bits:  7 6 5  4  3 2 1 0
       | | |  |  +-+-+-+-+  BAUD RATE (bits 3-0)
       | | |  |  |0|0|0|0|  USER RATE [NI]
       | | |  |  |0|0|0|1|  50 BAUD
       | | |  |  |0|0|1|0|  75
       | | |  |  |0|0|1|1| 110
       | | |  |  |0|1|0|0| 134.5
       | | |  |  |0|1|0|1| 150
       | | |  |  |0|1|1|0| 300
       | | |  |  |0|1|1|1| 600
       | | |  |  |1|0|0|0| 1200
       | | |  |  |1|0|0|1|  (1800) 2400
       | | |  |  |1|0|1|0| 2400
       | | |  |  |1|0|1|1| 3600 [NI]
       | | |  |  |1|1|0|0| 4800 [NI]
       | | |  |  |1|1|0|1| 7200 [NI]
       | | |  |  |1|1|1|0| 9600 [NI]
       | | |  |  |1|1|1|1| 19200 [NI]

bit 4 = STOP BITS
  0 = 1 stop bit
  1 = 2 stop bits

bits 6-5 = WORD LENGTH
  00 = 8 bits
  01 = 7 bits
  10 = 6 bits
  11 = 5 bits
```

## Key Registers
- $DD00-$DD0F - CIA 2 (6526) - timers and interrupt/NMI sources used by RS-232 KERNAL handlers

## References
- "working_with_cassette_tape" — expands on tape formatting details and separators