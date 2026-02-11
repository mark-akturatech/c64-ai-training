# Kernal Jump Table ($FF81-$FFF5 / 65409-65525)

**Summary:** The Kernal jump table, located in ROM at $FF81–$FFF5, consists of 39 three-byte JMP instructions that provide stable entry points for the Commodore 64's operating system routines. The first 15 entries at $FFC0–$FFEA are consistent across Commodore machines. Some routines are also vectored through the RAM vector table at $0314–$031A, allowing for user customization.

**Description**

The Kernal jump table is a ROM-resident table of JMP instructions designed to provide stable entry points into the operating system routines, regardless of ROM layout or revision. Each table entry is 3 bytes: one byte for the JMP absolute opcode ($4C) followed by a 16-bit little-endian address pointing to the actual routine in ROM. Programs should call (JSR) to the jump-table entry addresses rather than hard-coding ROM routine addresses; this preserves compatibility across different machines and Kernal revisions.

Key properties:

- **Location range:** $FF81–$FFF5 (decimal 65409–65525).
- **Entries:** 39 entries, each 3 bytes; total size = 117 bytes.
- **Consistent subrange:** The subrange $FFC0–$FFEA (decimal 65472–65514) comprises the first 15 table entries and is consistent across all Commodore machines (from early PETs onward).
- **RAM vectors:** Some I/O-related Kernal routines are also referenced by RAM vectors beginning at $0314; those RAM vectors ($0314–$031A) can be modified to point at user-supplied handlers, enabling device-support extension without changing programs that call the Kernal jump entries.

Usage notes:

- **Calling routines:** Call through the jump-table entry (JSR to the entry address). Because the entry is a JMP to the ROM routine, the ROM routine’s normal RTS will correctly return control to the original caller.
- **Customizing behavior:** If a routine is also vectored through the RAM vector table at $0314–$031A, that RAM vector can be updated to redirect I/O handling to custom code; programs calling the jump-table entry will use the overridden behavior transparently.

**Detailed Jump Table Entries**

Below is the detailed list of each jump-table entry, including the entry-point address, routine name, RAM vector (if any), ROM address, and a brief routine summary:

| Entry Address | Routine Name | RAM Vector | ROM Address | Summary |
|---------------|--------------|------------|-------------|---------|
| $FF81         | CINT         |            | $E518       | Initialize the screen editor and VIC-II chip. |
| $FF84         | IOINIT       |            | $E37B       | Initialize I/O devices. |
| $FF87         | RAMTAS       |            | $E3BF       | Test and initialize RAM. |
| $FF8A         | RESTOR       |            | $E3D0       | Restore default system and interrupt vectors. |
| $FF8D         | VECTOR       |            | $E3D5       | Read or set RAM vectors. |
| $FF90         | SETMSG       |            | $E3E1       | Control system messages. |
| $FF93         | SECOND       |            | $E3F4       | Send secondary address to device. |
| $FF96         | TKSA         |            | $E3F7       | Send TALK secondary address. |
| $FF99         | MEMTOP       |            | $E3FA       | Set top of memory. |
| $FF9C         | MEMBOT       |            | $E3FD       | Set bottom of memory. |
| $FF9F         | SCNKEY       |            | $E402       | Scan the keyboard. |
| $FFA2         | SETTMO       |            | $E40D       | Set timeout for IEEE bus. |
| $FFA5         | ACPTR        |            | $E4A2       | Accept byte from serial bus. |
| $FFA8         | CIOUT        |            | $E4A5       | Output byte to serial bus. |
| $FFAB         | UNTALK       |            | $E4A8       | Send UNTALK command. |
| $FFAE         | UNLISTEN     |            | $E4AB       | Send UNLISTEN command. |
| $FFB1         | LISTEN       |            | $E4AE       | Send LISTEN command. |
| $FFB4         | TALK         |            | $E4B1       | Send TALK command. |
| $FFB7         | READST       |            | $E4B4       | Read I/O status word. |
| $FFBA         | SETLFS       |            | $E4B7       | Set logical file parameters. |
| $FFBD         | SETNAM       |            | $E4BA       | Set filename parameters. |
| $FFC0         | OPEN         | $031A      | $E4BD       | Open a logical file. |
| $FFC3         | CLOSE        | $031C      | $E4C0       | Close a logical file. |
| $FFC6         | CHKIN        | $031E      | $E4C3       | Open a channel for input. |
| $FFC9         | CHKOUT       | $0320      | $E4C6       | Open a channel for output. |
| $FFCC         | CLRCHN       | $0322      | $E4C9       | Clear all I/O channels. |
| $FFCF         | CHRIN        | $0324      | $E4CC       | Get a character from the input channel. |
| $FFD2         | CHROUT       | $0326      | $E4CF       | Output a character to the output channel. |
| $FFD5         | LOAD         | $0330      | $E4D2       | Load memory from a device. |
| $FFD8         | SAVE         | $0332      | $E4D5       | Save memory to a device. |
| $FFDB         | SETTIM       |            | $E4D8       | Set real-time clock. |
| $FFDE         | RDTIM        |            | $E4DB       | Read real-time clock. |
| $FFE1         | STOP         | $0328      | $E4DE       | Check STOP key status. |
| $FFE4         | GETIN        | $032A      | $E4E1       | Get a character from the keyboard buffer. |
| $FFE7         | CLALL        | $032C      | $E4E4       | Close all open files. |
| $FFEA         | UDTIM        |            | $E4E7       | Update real-time clock. |
| $FFED         | SCREEN       |            | $E4EA       | Set screen parameters. |
| $FFF0         | PLOT         |            | $E4ED       | Read or set cursor position. |
| $FFF3         | IOBASE       |            | $E4F0       | Get I/O base address. |

**Note:** The RAM vectors at $0314–$031A correspond to the following Kernal routines:

- **$0314–$0315 (CINV):** Hardware interrupt vector.
- **$0316–$0317 (CBINV):** BRK instruction interrupt vector.
- **$0318–$0319 (NMINV):** Non-maskable interrupt vector.
- **$031A–$031B (IOPEN):** OPEN routine vector.
- **$031C–$031D (ICLOSE):** CLOSE routine vector.
- **$031E–$031F (ICHKIN):** CHKIN routine vector.
- **$0320–$0321 (ICKOUT):** CHKOUT routine vector.
- **$0322–$0323 (ICLRCH):** CLRCHN routine vector.
- **$0324–$0325 (IBASIN):** CHRIN routine vector.
- **$0326–$0327 (IBSOUT):** CHROUT routine vector.
- **$0328–$0329 (ISTOP):** STOP routine vector.
- **$032A–$032B (IGETIN):** GETIN routine vector.
- **$032C–$032D (ICLALL):** CLALL routine vector.
- **$032E–$032F (USRCMD):** User-defined vector.
- **$0330–$0331 (ILOAD):** LOAD routine vector.
- **$0332–$0333 (ISAVE):** SAVE routine vector.

These vectors allow for redirection of the corresponding Kernal routines to user-defined handlers by modifying the vector addresses in RAM.

**Example Usage**

To output a character to the screen using the CHROUT routine:


In this example, the ASCII code for 'A' is loaded into the accumulator, and then the CHROUT routine is called via its jump-table entry at $FFD2. This outputs the character 'A' to the current output device, typically the screen.

## Source Code

```assembly
LDA #$41        ; Load ASCII code for 'A'
JSR $FFD2       ; Call CHROUT routine
```


## Key Registers

- **$FF81–$FFF5:** Kernal jump table (39 × 3-byte JMP entries).
- **$FFC0–$FFEA:** First 15 jump-table entries (stable across Commodore machines).
- **$0314–$0333:** RAM vector table (modifiable vectors referenced by some Kernal entries).

## References

- "KERNAL API | Ultimate Commodore 64 Reference" — detailed descriptions of Kernal routines and vectors.
- "C64 Programmer's Reference Guide: BASIC to Machine Language - The KERNAL" — comprehensive guide to the Kernal and its usage.

## Labels
- CHROUT
- CHRIN
- OPEN
- CLOSE
- GETIN
