# MACHINE - Important Memory Addresses (PET/CBM, VIC, C64)

**Summary:** System pointer addresses and common machine vectors ($0000–$03FF zero page/low memory) for PET/CBM, VIC, and C64: Start of BASIC, Start of Variables, End of Arrays, Bottom of Strings, Top of Memory, Status word ST, USR jump, CHRGET subroutine, Floating accumulator, and Keytouch register.

## Pointer map and meanings
This chunk lists important system pointers (hex) used by PET/CBM, VIC, and C64 ROM/BASIC kernels. Each pointer is the low-memory location where the operating system or BASIC stores addresses or small system values (commonly used by machine code monitors, BASIC interpreters, and user programs).

Short descriptions:
- Start of BASIC — address of the BASIC program start pointer.
- Start of Variables — pointer to the start of BASIC variables (symbol table area).
- End of Arrays — pointer to the end-of-arrays area (first free byte after arrays).
- Bottom of Strings — pointer to the bottom of string storage (first free byte for string data).
- Top of Memory — top-of-memory (TOM) pointer used by the monitor/OS (start of user RAM).
- Status word ST — BASIC status word (interpreter flags/state).
- USR jump — machine-code USR function vector entry point (CALL/USR).
- CHRGET subroutine — ROM entry for CHRGET (character input/get routine).
- Floating accumulator — pointer/address of the floating-point accumulator/storage used by ROM routines.
- Keytouch register — keyboard scan/key buffer location used by ROM/monitor.

(Descriptions are terse; all symbol names and addresses come from the original table.)

## Source Code
```text
Some Important Memory addresses (hexadecimal):
Original ROM PET not included.

Pointer:                PET/CBM    VIC     C64
-----------------------------------------------
Start of BASIC           0028      002B    002B
Start of Variables       002A      002D    002D
End of Arrays            002E      0031    0031
Bottom of Strings        0030      0033    0033
Top of Memory            0034      0037    0037

Status word ST           0096      0090    0090
USR jump                 0000      0000    0310
CHRGET subroutine        0070      0073    0073
Floating accumulator     005E      0061    0061
Keytouch register        0097      00CB    00CB

---
Additional information can be found by searching:
- "glossary" which expands on definitions of TOM, pointers, and memory layout
- "disk_user_guide_program_list" which expands on monitor placement near top-of-memory (TOM)
```

## Key Registers
- $0028 - PET/CBM - Start of BASIC
- $002B - VIC, C64 - Start of BASIC
- $002A - PET/CBM - Start of Variables
- $002D - VIC, C64 - Start of Variables
- $002E - PET/CBM - End of Arrays
- $0031 - VIC, C64 - End of Arrays
- $0030 - PET/CBM - Bottom of Strings
- $0033 - VIC, C64 - Bottom of Strings
- $0034 - PET/CBM - Top of Memory (TOM)
- $0037 - VIC, C64 - Top of Memory (TOM)
- $0096 - PET/CBM - Status word ST
- $0090 - VIC, C64 - Status word ST
- $0000 - PET/CBM, VIC - USR jump (vector entry)
- $0310 - C64 - USR jump (vector entry)
- $0070 - PET/CBM - CHRGET subroutine
- $0073 - VIC, C64 - CHRGET subroutine
- $005E - PET/CBM - Floating accumulator
- $0061 - VIC, C64 - Floating accumulator
- $0097 - PET/CBM - Keytouch register
- $00CB - VIC, C64 - Keytouch register

## References
- "glossary" — expands on definitions of TOM, pointers, and memory layout
- "disk_user_guide_program_list" — monitor placement near top-of-memory (TOM)

## Labels
- START_OF_BASIC
- START_OF_VARIABLES
- END_OF_ARRAYS
- BOTTOM_OF_STRINGS
- TOP_OF_MEMORY
- STATUS_WORD_ST
- USR_JUMP
- CHRGET
- FLOATING_ACCUMULATOR
- KEYTOUCH_REGISTER
