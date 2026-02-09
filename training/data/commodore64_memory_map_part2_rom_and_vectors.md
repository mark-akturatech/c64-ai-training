# MACHINE — C64 memory map continued: zero-page pointers, vectors, bank-switching

**Summary:** Covers C64 zero-page pointer area ($003B-$0070) usage (file tables, tape/cassette pointers, USR vectors), 6510 processor-port bank switching at $0000/$0001 (LORAM/HIRAM/CHAREN + DDR), ROM/RAM overlay addresses (BASIC, KERNAL, CHAR/I/O), I/O chip ranges (VIC-II, SID, CIA1, CIA2), and the 6502 interrupt vectors ($FFFA-$FFFF).

**Overview**
This chunk continues the machine-level view of the C64 memory map with emphasis on:
- Zero-page pointer region ($003B-$0070) used by BASIC/KERNAL for file tables, tape/cassette pointers, and transient pointers (often reused by ROM routines).
- 6510 processor-port (two bytes at $0000/$0001) used for bank-switching the ROM/I/O windows into the 64K CPU address space. $0000 is the data-direction register (DDR), $0001 is the data port whose low bits select ROM/I/O mapping.
- ROM and RAM overlay layout: $A000-$BFFF (BASIC ROM), $D000-$DFFF (I/O and Character ROM overlay), $E000-$FFFF (KERNAL ROM). These regions are selectively mapped in/out via the processor port.
- I/O chip ranges: VIC-II registers, SID voice/filter registers, CIA 1 and CIA 2 registers — all are in the $D000 area and are banked together with the character ROM/I/O overlay.
- Standard 6502 vectors at the top of memory: NMI, RESET, IRQ/BRK.

Note: many KERNAL/BASIC routines use zero-page pointers in $003B-$0070 for temporary storage and pointers into file/tape structures — these are transient and frequently repurposed between ROM calls.

**Zero-page pointers ($003B-$0070)**
The zero-page addresses from $003B to $0070 are utilized by the BASIC and KERNAL ROMs for various system functions. Below is a detailed map of these addresses:

| Address | Symbol | Description |
|---------|--------|-------------|
| $003B   | TXTTAB | Pointer to start of BASIC program text |
| $003D   | VARTAB | Pointer to start of BASIC variables |
| $003F   | ARYTAB | Pointer to start of BASIC arrays |
| $0041   | STREND | Pointer to end of BASIC arrays (start of free memory) |
| $0043   | FRETOP | Top of string storage |
| $0045   | FRESPC | Bottom of string storage |
| $0047   | MEMSIZ | Highest address used by BASIC |
| $0049   | CURLIN | Current BASIC line number |
| $004B   | OLDLIN | Line number for CONT command |
| $004D   | OLDTXT | Address for CONT command |
| $004F   | DATLIN | Line number for DATA command |
| $0051   | DATPTR | Pointer to DATA items |
| $0053   | INPPTR | Pointer to input buffer |
| $0055   | VARNAM | Pointer to variable name being searched |
| $0057   | VARPNT | Pointer to variable value |
| $0059   | FORPNT | Pointer to current FOR/NEXT loop |
| $005B   | VARPTR | Pointer to variable in assignment |
| $005D   | STRPTR | Pointer to string in assignment |
| $005F   | CHRGET | Pointer to current character in BASIC line |
| $0061   | CHRGOT | Pointer to last character fetched |
| $0063   | TEMPPT | Temporary pointer |
| $0065   | FAC1   | Floating-point accumulator 1 |
| $006A   | FAC2   | Floating-point accumulator 2 |
| $006F   | ARGPTR | Pointer to function argument |
| $0071   | ARGTYP | Type of function argument |
| $0072   | JUMPER | Jump vector for BASIC functions |
| $0073   | INDEX  | Index for FOR/NEXT loops |
| $0074   | SUBFLG | Subscript flag |
| $0075   | DIMFLG | DIM statement flag |
| $0076   | GARBFL | Garbage collection flag |
| $0077   | CHRFLG | CHRGET routine flag |
| $0078   | CHRCTR | Character counter |
| $0079   | CHRBUF | Character buffer |
| $007A   | TEMPST | Temporary storage |
| $007B   | TEMPST | Temporary storage |
| $007C   | TEMPST | Temporary storage |
| $007D   | TEMPST | Temporary storage |
| $007E   | TEMPST | Temporary storage |
| $007F   | TEMPST | Temporary storage |
| $0080   | TEMPST | Temporary storage |
| $0081   | TEMPST | Temporary storage |
| $0082   | TEMPST | Temporary storage |
| $0083   | TEMPST | Temporary storage |
| $0084   | TEMPST | Temporary storage |
| $0085   | TEMPST | Temporary storage |
| $0086   | TEMPST | Temporary storage |
| $0087   | TEMPST | Temporary storage |
| $0088   | TEMPST | Temporary storage |
| $0089   | TEMPST | Temporary storage |
| $008A   | TEMPST | Temporary storage |
| $008B   | TEMPST | Temporary storage |
| $008C   | TEMPST | Temporary storage |
| $008D   | TEMPST | Temporary storage |
| $008E   | TEMPST | Temporary storage |
| $008F   | TEMPST | Temporary storage |
| $0090   | TEMPST | Temporary storage |
| $0091   | TEMPST | Temporary storage |
| $0092   | TEMPST | Temporary storage |
| $0093   | TEMPST | Temporary storage |
| $0094   | TEMPST | Temporary storage |
| $0095   | TEMPST | Temporary storage |
| $0096   | TEMPST | Temporary storage |
| $0097   | TEMPST | Temporary storage |
| $0098   | TEMPST | Temporary storage |
| $0099   | TEMPST | Temporary storage |
| $009A   | TEMPST | Temporary storage |
| $009B   | TEMPST | Temporary storage |
| $009C   | TEMPST | Temporary storage |
| $009D   | TEMPST | Temporary storage |
| $009E   | TEMPST | Temporary storage |
| $009F   | TEMPST | Temporary storage |
| $00A0   | TEMPST | Temporary storage |
| $00A1   | TEMPST | Temporary storage |
| $00A2   | TEMPST | Temporary storage |
| $00A3   | TEMPST | Temporary storage |
| $00A4   | TEMPST | Temporary storage |
| $00A5   | TEMPST | Temporary storage |
| $00A6   | TEMPST | Temporary storage |
| $00A7   | TEMPST | Temporary storage |
| $00A8   | TEMPST | Temporary storage |
| $00A9   | TEMPST | Temporary storage |
| $00AA   | TEMPST | Temporary storage |
| $00AB   | TEMPST | Temporary storage |
| $00AC   | TEMPST | Temporary storage |
| $00AD   | TEMPST | Temporary storage |
| $00AE   | TEMPST | Temporary storage |
| $00AF   | TEMPST | Temporary storage |
| $00B0   | TEMPST | Temporary storage |
| $00B1   | TEMPST | Temporary storage |
| $00B2   | TEMPST | Temporary storage |
| $00B3   | TEMPST | Temporary storage |
| $00B4   | TEMPST | Temporary storage |
| $00B5   | TEMPST | Temporary storage |
| $00B6   | TEMPST | Temporary storage |
| $00B7   | TEMPST | Temporary storage |
| $00B8   | TEMPST | Temporary storage |
| $00B9   | TEMPST | Temporary storage |
| $00BA   | TEMPST | Temporary storage |
| $00BB   | TEMPST | Temporary storage |
| $00BC   | TEMPST | Temporary storage |
| $00BD   | TEMPST | Temporary storage |
| $00BE   | TEMPST | Temporary storage |
| $00BF   | TEMPST | Temporary storage |
| $00C0   | TEMPST | Temporary storage |
| $00C1   | TEMPST | Temporary storage |
| $00C2   | TEMPST | Temporary storage |
| $00C3   | TEMPST | Temporary storage |
| $00C4   | TEMPST | Temporary storage |
| $00C5   | TEMPST | Temporary storage |
| $00C6   | TEMPST | Temporary storage |
| $00C7   | TEMPST | Temporary storage |
| $00C8   | TEMPST | Temporary storage |
| $00C9   | TEMPST | Temporary storage |
| $00CA   | TEMPST | Temporary storage |
| $00CB   | TEMPST | Temporary storage |
| $00CC   | TEMPST | Temporary storage |
| $00CD   | TEMPST | Temporary storage |
| $00CE   | TEMPST | Temporary storage |
| $00CF   | TEMPST | Temporary storage |
| $00D0   | TEMPST | Temporary storage |
| $00D1   | TEMPST | Temporary storage |
| $00D2   | TEMPST | Temporary storage |
| $00D3   | TEMPST | Temporary storage |
| $00D4   | TEMPST | Temporary storage |
| $00D5   | TEMPST | Temporary storage |
| $00D6   | TEMPST | Temporary storage |
| $00D7   | TEMPST | Temporary storage |
| $00D8   | TEMPST | Temporary storage |
| $00D9   | TEMPST | Temporary storage |
| $00DA   | TEMPST | Temporary storage |
| $00DB   | TEMPST | Temporary storage |
| $00DC   | TEMPST |