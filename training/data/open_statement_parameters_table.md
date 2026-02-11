# OPEN / Tape I/O: OPEN file#,device#,number,string; INPUT#, PRINT#, GET# behavior

**Summary:** Describes the BASIC OPEN statement format (`OPEN file#,device#,number,string`), common C64 device numbers (cassette 1, modem 2, screen 3, printer 4/5, disk 8-11), detailed per-device semantics for the "number" parameter (secondary/auxiliary addressing), and tape I/O behavior for INPUT#, PRINT#, and GET# — including RETURN/CHR$(13), CHR$(0) handling, and the ASC(A$+CHR$(0)) workaround.

**OPEN statement format and device numbers**

The BASIC OPEN statement uses the four-parameter format:

`OPEN file#, device#, number, "string"`

- **file#** — Logical channel number used in subsequent INPUT#/PRINT#/GET# statements.
- **device#** — Device number (device select number on the IEC bus or internal device).
- **number** — Device-specific secondary/auxiliary number (meaning varies by device).
- **"string"** — Usually filename, mode string, or device-specific control string (device-dependent).

Common device numbers (C64):

- 0 — Screen
- 1 — Cassette (tape)
- 2 — RS-232 device
- 3 — Screen (printer-to-screen or similar)
- 4, 5 — Printer devices
- 8–11 — Disk drives (drive numbers on IEC bus; often 8 is the first drive)

**Per-device semantics for the "number" parameter**

The "number" parameter, also known as the secondary address, has device-specific meanings:

- **Cassette (Device 1):**
  - `0` — Read from tape.
  - `1` — Write to tape.
  - `2` — Write to tape with end-of-tape marker.

- **Disk Drives (Devices 8–11):**
  - `0–14` — Data channels for reading/writing files.
  - `15` — Command channel for sending disk commands and receiving status messages.

- **Printers (Devices 4, 5):**
  - The secondary address can control printer features, such as character sets or print modes. Specific values depend on the printer model and its supported commands.

- **Screen (Device 3):**
  - The secondary address is typically ignored or used for specific screen control commands.

- **RS-232 (Device 2):**
  - The secondary address may be used to specify baud rates or other communication parameters, depending on the implementation.

**Tape data formatting and separators**

- When saving to tape (or writing with PRINT# to the cassette device), each PRINT or PRINT# statement automatically appends a RETURN code (CHR$(13)) to the output line.
- Tape data items must be separated explicitly by a separator (comma or RETURN) if you need distinct fields. If you concatenate items without separators, they will appear contiguous on tape with only the final RETURN separating the whole record.
- Common approaches:
  - Put one item per PRINT# to force RETURN between items.
  - Use a variable for the separator, e.g., `R$=CHR$(13)` or `R$=","` and concatenate in one PRINT# to save space:
    - Example (concise form): `R$="," : PRINT#1, A$+R$+B$+R$+C$`
  - Do not place commas or other punctuation between variable names in the PRINT argument list unless you intend the punctuation to be written; concatenation is often preferred to avoid extra program token/space usage.

**GET#, INPUT#, PRINT# behavior; CHR$(0) and ASC()**

- **INPUT#** behaves like INPUT but reads from the specified channel; data items are separated either by RETURN (end-of-line) or commas.
- **PRINT#** writes a RETURN at the end of the line automatically (same as PRINT).
- **GET#** reads one character at a time from the channel; it returns the character as a one-character string, or an empty string when CHR$(0) is received.
- The cassette CHR$(0) is returned as an empty string (""), not as a one-character string with code 0. Using ASC on an empty string triggers an ILLEGAL QUANTITY ERROR.
- Defensive code pattern to inspect raw tape characters without risking errors:
  - Bad (can error): `GET#1, A$ : A = ASC(A$)`
  - Safe: `GET#1, A$ : A = ASC(A$ + CHR$(0))`
    - The appended CHR$(0) ensures A$ is never empty for ASC; when A$ is non-empty, ASC(A$+CHR$(0)) returns the code of the first character as intended.

## Source Code

```basic
REM OPEN statement format example (prototype)
OPEN file#, device#, number, "string"
```

```text
Character position map (example showing concatenated items, no separators):

 1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25
 D  O  G              C  A  T                      T  R  E  E  RETURN
```

```text
Proper tape file with separators (comma and RETURN):

 1  2  3  4  5  6  7  8  9 10 11 12 13
 D  O  G  ,  C  A  T  ,  T  R  E  E  RETURN
```

```basic
REM Examples showing GET# and ASC handling

REM Unsafe (errors on empty string)
GET#1, A$ : A = ASC(A$)

REM Safe (append CHR$(0) to avoid empty-string ASC error)
GET#1, A$ : A = ASC(A$ + CHR$(0))

REM Example of using a separator variable and single PRINT# to insert commas/returns
R$ = "," : PRINT#1, A$ + R$ + B$ + R$ + C$
```

```basic
REM Example of OPEN usage for disk devices (SETLFS/SETNAM/SAVE workflow)

REM Set logical file number, device number, and secondary address
LDA #1        ; Logical file number
LDX #8        ; Device number (disk drive 8)
LDY #0        ; Secondary address (data channel 0)
JSR SETLFS

REM Set file name
LDA #FILENAME_LENGTH
LDX #<FILENAME
LDY #>FILENAME
JSR SETNAM

REM Save memory to file
LDA #<START_ADDRESS
STA $FB       ; Store start address low byte in zero page
LDA #>START_ADDRESS
STA $FC       ; Store start address high byte in zero page
LDX #<END_ADDRESS
LDY #>END_ADDRESS
LDA #$FB      ; Pointer to start address in zero page
JSR SAVE

FILENAME:
  .BYTE "MYFILE",0
FILENAME_LENGTH = * - FILENAME

START_ADDRESS = $0800
END_ADDRESS = $0A00
```

## References

- "save_kernal_routine" — Saving to device via SAVE requires SETLFS/SETNAM
- Commodore 64 Programmer's Reference Guide: Input/Output Guide - Serial Port (cont.) ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_6/page_363.html?utm_source=openai))
- Commodore 64 User's Guide ([manuals.plus](https://manuals.plus/m/25b4bf43dffbf5ba9480c0f1d45f21fe7711ff403a70e7d2e12bc652a88460c0?utm_source=openai))
- C64 DOS Commands - Commodore BASIC Programming Part 5 - Retro Game Coders ([retrogamecoders.com](https://retrogamecoders.com/c64-dos-commands/?utm_source=openai))
- KERNAL API | Ultimate Commodore 64 Reference ([pagetable.com](https://www.pagetable.com/c64ref/kernal/?utm_source=openai))

## Labels
- SETLFS
- SETNAM
- SAVE
