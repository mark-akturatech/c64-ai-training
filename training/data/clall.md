# CLALL ($FFE7)

**Summary:** KERNAL entry CLALL at $FFE7 clears the file table and calls CLRCHN to close channels and restore I/O; caller-saved registers A and X are used. Real implementation reached indirectly via the vector at $032C and resides at ROM address $F32F.

## Description
CLALL (KERNAL $FFE7) clears the system file table (the KERNAL-managed channel/file entries) and then invokes the CLRCHN routine to perform per-channel close operations (UNLISTEN/UNTALK and related cleanup). The documented entry is a vectored KERNAL call — the $FFE7 entry jumps indirectly through the two-byte pointer stored at $032C to the actual ROM implementation at $F32F.

## Calling Convention
- Registers used: A, X (these registers are modified by the routine; do not expect them preserved).
- No parameters documented in this chunk.
- Effect: file table cleared, CLRCHN invoked for channel teardown and I/O restoration.

## Source Code
(omitted — original chunk contained no assembly/BASIC listing)

## Key Registers
- $FFE7 - KERNAL - CLALL entry point (clears file table; calls CLRCHN)
- $032C - RAM - two-byte indirect vector used by $FFE7 to reach ROM routine
- $F32F - ROM - actual implementation address reached via ($032C)

## References
- "CLRCHN ($FFCC)" — closes channels and performs UNLISTEN/UNTALK (channel teardown)