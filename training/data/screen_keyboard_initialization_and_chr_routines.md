# Kernal Screen & Keyboard Initialization and Related Routines ($E4EC–$E5A0)

**Summary:** This section details the Kernal ROM routines and tables responsible for screen and keyboard initialization, cursor handling, and related functions. It includes descriptions of the PAL baud-rate prescaler table at $E4EC, the cassette "file found" pause patch, and various initialization routines such as IOBASE ($E500), SCREEN ($E505), PLOT ($E50A), Initialize Screen & Keyboard ($E518), and Initialize Screen Line Link Table & Clear Screen ($E544). Additionally, it references related CHRIN/CHROUT entry addresses and key memory locations pertinent to cursor and screen line links.

**Baud Rate Table (PAL) — $E4EC**

The PAL baud-rate prescaler table at $E4EC provides prescaler divisors for standard RS-232 baud rates, ensuring correct interrupt timing on European (PAL) machines. This table mirrors the format of the NTSC table at $FEC2 but contains different numeric prescaler values due to the slightly slower PAL system clock. The prescaler values are calculated using the formula:


Where the PAL system clock frequency is approximately 985,248 Hz. The table at $E4EC contains the following prescaler values:

| Baud Rate | Prescaler Value |
|-----------|-----------------|
| 50        | $2619           |
| 75        | $1944           |
| 110       | $111A           |
| 134.5     | $0DE8           |
| 150       | $0C70           |
| 300       | $0606           |
| 600       | $02D1           |
| 1200      | $0137           |
| 1800      | $00AE           |
| 2400      | $0069           |

These values are stored as two-byte words in the table, corresponding to each baud rate. ([gist.github.com](https://gist.github.com/cbmeeks/4287745eab43e246ddc6bcbe96a48c19?utm_source=openai))

**IOBASE — $E500**

The IOBASE routine, located at $E500, is a documented Kernal routine with a vector at $FFF3 (65523). Upon entry, it returns the base address of memory-mapped I/O devices:

- X ← low byte of I/O base (current version returns 0)
- Y ← high byte of I/O base (current version returns 220 / $DC)

This results in $DC00 being loaded into the X and Y registers, pointing to CIA #1. The intended use is to allow code to form a zero-page indirect pointer to the I/O device base, enabling software to access I/O through the returned base rather than hardcoding device addresses.

**SCREEN — $E505**

The SCREEN routine at $E505 is a documented Kernal routine with a vector at $FFED (65517). It returns the screen dimensions:

- X ← number of screen columns (current: 40 / $28)
- Y ← number of screen rows (current: 25 / $19)

This routine is used by programs to adapt formatting to the machine's screen geometry.

**PLOT (Read/Set Cursor) — $E50A**

The PLOT routine at $E50A is a documented Kernal routine with a vector at $FFF0 (65520). Its behavior depends on the Carry flag:

- If Carry = 1 (SEC used before JSR), the routine reads the cursor position:
  - X ← cursor column (from location $00D6)
  - Y ← cursor row (from location $00D3)
- If Carry = 0 (CLC used before JSR), the routine sets the cursor position:
  - .Y and .X supplied with desired row/column; the routine stores them to $00D3/$00D6 and calls the screen-pointer setup routine at $E56C.

Users can access this via BASIC by loading the desired X, Y, and P register values into the save area at decimal 780 ($030C) and calling the vector.

**Initialize Screen & Keyboard — $E518**

The routine at $E518 is the original CINT Kernal entry for screen and keyboard initialization. In later versions, this routine was extended. The sequence is as follows:

- Calls the routine at $E5A0 to set up default I/O values
- Initializes cursor blink flags
- Installs keyboard decode vector
- Initializes key-repeat delay and repeat frequency counters
- Sets current color code and maximum keyboard buffer size

After initialization, it falls through into the next Kernal routine.

**Initialize Screen Line Link Table & Clear Screen — $E544**

The routine at $E544 initializes the screen line link table starting at decimal 217 ($00D9), clears the main screen RAM, and clears Color RAM to the background color. This routine also falls through to the following routine.

**Cassette "File Found" Patch**

In later Kernal revisions, a patch was added to the cassette file-find routine. After locating the tape file and displaying the on-screen "FILETITLE FOUND" message, the patched behavior introduces a brief pause and polls for a keypress. If a key is pressed within the pause, the load continues immediately; if not, the load resumes automatically after the pause. In the original (older) Kernal, pressing the Commodore key was required to continue. ([es.scribd.com](https://es.scribd.com/document/478068118/Mapping-The-C64?utm_source=openai))

**Related CHRIN/CHROUT and Screen/Keyboard Routines**

This section references higher-level I/O entry points and several nearby screen and keyboard helper routines:

- LP2 (CHROUT support) — $E5B4 (58804)
- Read input line / wait for CR — $E5CA (58826)
- CHRIN screen/keyboard handling — $E632 (58930)
- Additional routines in the range $E65C–$ECA0 (approx. decimal 59012–59888) handle quote checking, adding characters to the screen, return-from-CHROUT handling, advancing the cursor, scrolling, inserting blank lines, moving screen lines, etc.

## Source Code

```
PRESCALER = ((CLOCK / BAUDRATE) / 2) - 100
```

## Labels
- IOBASE
- SCREEN
- PLOT
- CHRIN
