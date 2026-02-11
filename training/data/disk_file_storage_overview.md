# Diskette file types (Sequential, Relative, Random) and RS-232 control/command summary

**Summary:** Describes Commodore 64 diskette file types — sequential, relative, and random — and RS-232 terminal control including baud-rate bytes, command/control register meanings (parity, handshake, duplex), KERNAL OPEN entry ($FFC0), receiver buffer size (255), and recommended BASIC usage (GET#). Includes original ASCII command-register map and baud-rate formulas.

**Diskette file types (Sequential / Relative / Random)**
- **Sequential files:** Linear, read/write in order; printing/formatting limitations similar to cassette tape — data often needs explicit record separators (delimiters) for reliable text printing or parsing.
- **Relative files:** Provide indexed (record-numbered) access via a separate command channel and a separate data channel; suitable for large datasets or database-like storage because records can be accessed/updated by record number without rewriting entire file. Recommended for large datasets.
- **Random files:** Allow arbitrary-position access within a file (also use separate command and data channels). Use when arbitrary byte/record addressing is required.
- **Note:** Relative and random files use two logical channels (one for data, one for commands/status) when programming the drive; consult the disk drive programming manual for drive-specific command syntax and examples (drive ROMs vary).

**RS-232 control and command registers (summary)**
- **Control/Register bytes:** The RS-232 interface uses single-byte control/command characters to configure baud rate (optional low/high bytes when lower 4 bits are zero), parity, handshake, and duplex. The command-register character is optional; the control-register character is required to set baud rates.
- **Baud-rate bytes:** The formulas for computing optional baud low/high bytes from system frequency and desired rate are as follows:
  - `<opt baud low> = (system frequency / (rate * 2)) - 100 - (<opt baud high> * 256)`
  - `<opt baud high> = INT((system frequency / (rate * 2) - 100) / 256)`
- **System frequency constants:**
  - NTSC: 1,022,730 Hz
  - PAL: 985,250 Hz
- **Parity/handshake/duplex:** The command register encodes parity options, handshake selection, duplex, and some unused bits. Parity encodings include: parity-disabled, odd, even, mark, and space; a duplex bit selects full/half duplex and low bits select handshake (0..3-line/X-line). See the command-register map in the Source Code section for the exact bit layout.
- **KERNAL OPEN:**
  - OPEN entry: $FFC0 (KERNAL entry point for OPEN). Important: In BASIC, OPEN should be performed before creating variables/arrays because opening an RS-232 channel performs an automatic CLR that allocates 512 bytes at top of memory; if 512 bytes are not available the program may be destroyed.
- **Receiver buffer behavior:**
  - The C64 RS-232 receiver buffer holds up to 255 characters; overflow is indicated in the RS-232 status word (ST in BASIC, RSSTAT in machine language). When overflow occurs, characters received during the full-buffer condition are lost. For high-speed input, use machine-language handlers to avoid buffer overflow and BASIC garbage-collection pauses.
- **BASIC syntax recommendation:**
  - Recommended: `GET#lfn, <string variable>`
  - Not recommended: `INPUT#lfn <variable list>`

## Source Code
```text
[Excerpt from source — command/control register map and baud formula as presented]

                               +-+-+-+-+----------------+
    <control register>- Is a single byte character (see Figure 6-1, Control
  Register Map) required to specify the baud rates. If the lower 4 bits of
  the baud rate is equal to zero (0), the <opt baud low><opt baud high>
  characters give you a rate based on the following:
    <opt baud low>=<system frequency/rate/2-100-<opt baud high>*256
    <opt baud high>=INT((system frequency/rate/2-100)/256

  350   INPUT/OUTPUT GUIDE
~


                              +-+-+-+-+-+-+-+-+
                              |7|6|5|4|3|2|1|0|
                              +-+-+-+-+-+-+-+-+
                               | | | | | | | |
                               | | | | | | | |
                               | | | | | | | |
                               | | | | | | | |
            PARITY OPTIONS ----+-+-+ | | | | +----- HANDSHAKE
  +---+---+---+---------------------+| | | |
  |BIT|BIT|BIT|     OPERATIONS      || | | |        0 - 3-LINE
  | 7 | 6 | 5 |                     || | | |        1 - X-LINE
  +---+---+---+---------------------+| | | |
  | - | - | 0 |PARITY DISABLED, NONE|| | | |
  |   |   |   |GENERATED/RECEIVED   || | | |
  +---+---+---+---------------------+| | | +------- UNUSED
  | 0 | 0 | 1 |ODD PARITY           || | +--------- UNUSED
  |   |   |   |RECEIVER/TRANSMITTER || +----------- UNUSED
  +---+---+---+---------------------+|
  | 0 | 1 | 1 |EVEN PARITY          ||
  |   |   |   |RECEIVER/TRANSMITTER |+------------- DUPLEX
  +---+---+---+---------------------+
  | 1 | 0 | 1 |MARK TRANSMITTED     |               0 - FULL DUPLEX
  |   |   |   |PARITY CHECK DISABLED|               1 - HALF DUPLEX
  +---+---+---+---------------------+
  | 1 | 1 | 1 |SPACE TRANSMITTED    |
  |   |   |   |PARITY CHECK DISABLED|
  +---+---+---+---------------------+


                      Figure 6-2. Command Register Map.

  The formulas above are based on the fact that:

    system frequency = 1.02273E6 NTSC (North American TV standard)
                     = 0.98525E6 PAL (U.K. and most European TV standard)

    <command register>- Is a single byte character (see Figure 6-2, Command
  Register Map) that defines other terminal parameters. This character is
  NOT required.

  KERNAL ENTRY:

    OPEN ($FFC0) (See KERNAL specifications for more information on entry
  conditions and instructions.)

  +-----------------------------------------------------------------------+
  | IMPORTANT NOTE: In a BASIC program, the RS-232 OPEN command should be |
  | performed before creating any variables or arrays because an automatic|
  | CLR is performed when an RS-232 channel is OPENed (This is due to the |
  | allocation of 512 bytes at the top of memory.) Also remember that your|
  | program will be destroyed if 512 bytes of space are not available at  |
  | the time of the OPEN statement.                                       |
  +-----------------------------------------------------------------------+

  GETTING DATA FROM AN RS-232 CHANNEL

    When getting data from an RS-232 channel, the Commodore 64 receiver
  buffer will hold up to 255 characters before the buffer overflows. This
  is indicated in the RS-232 status word (ST in BASIC, or RSSTAT in machine
  language). If an overflow occurs, then all characters received during a
  full buffer condition, from that point on, are lost. Obviously, it pays
  to keep the buffer as clear as possible.
    If you wish to receive RS-232 data at high speeds (BASIC can only go so
  fast, especially considering garbage collects. This can cause the re-
  ceiver buffer to overflow), you will have to use machine language
  routines to handle this type of data burst.

  BASIC SYNTAX:

    Recommended: GET#lfn, <string variable>
    NOT Recommended: INPUT#lfn <variable list>
```

## Key Registers
- $FFC0 - KERNAL - OPEN entry point (OPEN system call)

## References
- "open_statement_parameters_table" — expands on OPEN parameters for disk devices (device 8..11)

## Labels
- OPEN
