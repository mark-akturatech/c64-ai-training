# 8K Operating System (Kernal ROM) — Chapter 7 Overview

**Summary:** Overview of the 8K Kernal ROM ($E000-$FFFF), underlying RAM usage, VIC-II access to RAM under the Kernal when using the top 16K bank, and noted Kernal patch ranges ($E4AD-$E4FF, $FF5B-$FF7F). Mentions Color RAM ($D800) initialization behavior and the BASIC→Kernal jump at $E000.

**Overview**
The Commodore 64 Kernal is an 8K ROM mapped at $E000-$FFFF. There is 8K of RAM physically under the Kernal ROM which can be used by temporarily switching out the ROM (requires disabling interrupts to avoid crashes). Even without switching the Kernal out, that RAM can be accessed by the VIC-II if the machine is banked to use the top 16K for video, allowing graphics data to be stored there.

The BASIC ROM on the C64 ends with a JMP $E000 instruction; BASIC routines therefore continue in the Kernal ROM. Because the BASIC ROM and Kernal ROM are not contiguous as on some other Commodore machines, certain routine addresses are displaced (the text notes a displacement of three bytes relative to the VIC version).

Kernal versions changed across production runs. Two patch/extension ranges are highlighted where later Kernal revisions place modifications:
- Decimal 58541–58623 (hex $E4AD–$E4FF)
- Decimal 65371–67407 (hex $FF5B–$FF7F)

A concrete behavioral change noted between original and newer Kernal revisions: when the screen is cleared, Color RAM at $D800 is initialized to the current background color on newer Kernals; original models initialized it to white.

This chapter is a guide rather than a full disassembly; many Kernal routines and vectors are referenced but not listed here — consult a full disassembly (or the referenced "kernal_routines_list" chunk) for instruction-level detail and exact entry points.

## Source Code
```asm
; Addresses & notes referenced in chapter text

; ROM / routine entry points
57344   $E000   ; Continuation of EXP Routine (BASIC ROM JMP target)
57411   $E043   ; POLY1

; Color RAM
55296   $D800   ; Color RAM - initialized to background color on newer Kernal versions

; Kernal patch ranges (decimal and hex)
58541-58623   ($E4AD-$E4FF)  ; Patch area 1 (later Kernal additions)
65371-67407   ($FF5B-$FF7F)  ; Patch area 2 (later Kernal additions)

; Note: BASIC ROM ends with "JMP $E000" so BASIC->Kernal addresses are shifted vs VIC
```

## Key Registers
- $E000-$FFFF - Kernal ROM - 8K Operating System ROM mapped at top of memory
- $E4AD-$E4FF - Kernal ROM patch range (58541-58623 decimal) - area for later Kernal additions/patches
- $FF5B-$FF7F - Kernal ROM patch range (65371-67407 decimal) - area for later Kernal additions/patches
- $D800 - Color RAM - 1K color memory used for screen characters (initialized differently by Kernal revisions)

## References
- "kernal_routines_list" — expands on table of Kernal routines and vector entries
- "kernal_patches_and_iobase_functions" — expands on later Kernal patches and IOBASE routine summary