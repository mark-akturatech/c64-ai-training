# IGONE Vector ($0308-$0309) — BASIC "execute next token" pointer

**Summary:** $0308-$0309 (IGONE) is a two-byte little-endian RAM vector pointing to the BASIC interpreter's GONE routine at $A7E4 (42980); it is part of the BASIC indirect vector table used to dispatch execution of the next BASIC program token.

## Description
The IGONE vector occupies addresses $0308 (low byte) and $0309 (high byte) in C64 memory. The vector holds the address of the GONE routine the BASIC interpreter calls to execute the next program token. By reading the two bytes at $0308/$0309 (little-endian), the interpreter obtains the entry point for token execution.

- Vector label: IGONE
- Target routine: GONE at $A7E4 (decimal 42980)
- Storage: 2 bytes, little-endian ($0308 = low, $0309 = high)
- Role: Part of the BASIC indirect vector table (used during BASIC token dispatch)

## Source Code
```text
; IGONE vector (two bytes, little-endian)
$0308 = $E4    ; low byte of target ($A7E4)
$0309 = $A7    ; high byte of target ($A7E4)

; Target routine
GONE = $A7E4   ; decimal 42980 - routine that executes the next BASIC program token
```

## Key Registers
- $0308-$0309 - RAM - IGONE: two-byte pointer (little-endian) to GONE routine ($A7E4 / 42980), part of BASIC indirect vector table

## References
- "basic_indirect_vector_table" — expands on BASIC indirect vectors overview

## Labels
- IGONE
- GONE
