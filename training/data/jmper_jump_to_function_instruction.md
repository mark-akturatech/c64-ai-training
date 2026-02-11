# JMPER ($54-$56)

**Summary:** JMPER at $0054-$0056 is a 3-byte 6502 JMP instruction ($4C) stored in the BASIC work area; bytes $54 = $4C, $55 = low-byte, $56 = high-byte of a 16-bit address taken from the BASIC function table at $A052 (decimal 41042).

## Definition / Overview
JMPER occupies memory $0054-$0056 in the BASIC work area. The first byte is the 6502 absolute JMP opcode ($4C). The next two bytes are a little-endian 16-bit address loaded from the BASIC function-address table located at $A052. At runtime BASIC uses JMPER as an inline JMP to the required BASIC function by installing the function's address (low then high) after the $4C opcode.

Notes:
- The address bytes are copied from the function table at $A052 (decimal 41042).
- JMPER therefore forms a direct JMP to a BASIC routine whose entry address is provided by the function table.

## Source Code
```asm
; Layout example (reference only — bytes at runtime are copied from $A052)
* = $0054
JMPER:  .byte $4C        ; $0054 = JMP opcode
        .byte <addr_lo>  ; $0055 = low byte of function address (from $A052)
        .byte <addr_hi>  ; $0056 = high byte of function address (from $A052)

; Function table base (reference address)
; $A052 = start of BASIC function address table (contains 16-bit little-endian addresses)
```

## Key Registers
- $0054-$0056 - BASIC work area - JMPER: 3-byte 6502 JMP instruction ($4C, addr_lo, addr_hi)
- $A052 - BASIC ROM - Function table base (source of 16-bit function addresses copied into JMPER)

## References
- "basic_numeric_work_area_overview" — placement of JMPER within the BASIC work area

## Labels
- JMPER

## Mnemonics
- JMP
