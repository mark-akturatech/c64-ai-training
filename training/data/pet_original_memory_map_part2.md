# MACHINE — PET memory map continuation (zero page 00BD-01FF): CHRGET, tape, file pointers, STR$, stack

**Summary:** Continuation of the PET zero-page and low memory map covering addresses $00BD–$01FF with CHRGET (get BASIC character) routine entries, random seed, tape buffers and timing, file/device pointers, STR$ work area, tape read error log, and the processor stack ($0100–$01FF). Searchable terms: zero page, CHRGET, tape buffer, STR$, random seed, processor stack, $00BD, $0100.

**Memory map description**

This chunk lists zero-page and low-memory system locations used by the PET BASIC/KERNAL runtime. It enumerates byte and pointer locations used for string and tape I/O, the CHRGET subroutine, random seed, cursor/screen pointers, tape timing and buffer control, file/device logical/secondary addresses, and the standard 6502 stack area beginning at $0100.

Notable behaviors and overlaps:

- The $0100–$01FF region is the 6502 hardware stack; the source also documents higher-level uses that overlap this range:
  - $0100–$010A is listed as STR$ work area (temporary string work).
  - $0100–$013E is listed as tape read error log.
  - $0100–$01FF is the processor stack (hardware).
  
  These entries reflect software conventions that reuse stack memory for data in some PET implementations; the overlapping allocations should be treated cautiously (stack use conflicts with persistent data).

- Several entries are explicitly marked unused in the source.

- CHRGET (get BASIC character) occupies a multi-byte area ($00C2–$00D9) with internal BASIC pointers at $00C9–$00CA.

- Tape control and status bytes (start/end addresses, timing constants, buffer pointers, EOT flag, read timers, read/write block counters) are densely represented across $00C0–$00FF.

- File metadata (logical address, secondary address, device number, filename length/pointer) is present in the $00EE–$00FA range.

- The listing includes single-byte flags for cursor mode, tape read timer enabled, EOT received, read character error, INSERT count, and serial buffer word.

## Source Code

```text
00BD          189         Accumulator #2:  sign
00BE          190         Sign comparison: Accumulator #1 versus #2
00BF          191         Accumulator #1:  low-order (rounding)

00C0-00C1     192-193     Cassette buffer length; series pointer
00C2-00D9     194-217     CHRGET subroutine; get BASIC character
00C9-00CA     201-202     BASIC pointer (within above subroutine)
00DA-00DE     218-222     Random number seed
00DF          223         [unused?  not listed in original text. -wf]
00E0-00E1     224-225     Pointer to screen line
00E2          226         Position of cursor on above line
00E3-00E4     227-228     Utility pointer:  tape, scroll
00E5-00E6     229-230     Tape end address/end of current program
00E7-00E8     231-232     Tape timing constants
00E9          233         Tape buffer character
00EA          234         Direct/programmed cursor:  0 = direct
00EB          235         Tape read timer 1 enabled
00EC          236         EOT received from tape
00ED          237         Read character error
00EE          238         Number of characters in file name
00EF          239         Current file logical address
00F0          240         Current file secondary address
00F1          241         Current file device number
00F2          242         Line margin
00F3-00F4     243-244     Pointer:  start of tape buffer
00F5          245         Line where cursor lives
00F6          246         Last key; checksum; miscellaneous
00F7-00F8     247-248     Tape start address
00F9-00FA     249-250     File name pointer
00FB          251         Number of INSERTs outstanding
00FC          252         Write shift word; read character in
00FD          253         Tape blocks remaining to write/read
00FE          254         Serial word buffer
00FF          255         [unused?  not listed in original text. -wf]
0100-010A     256-266     STR$ work area
0100-013E     256-318     Tape read error log
0100-01FF     256-511     Processor stack
```

## References

- "pia_via_charts" — Addresses for PIA/VIA chips listed in PET memory map

## Labels
- CHRGET
