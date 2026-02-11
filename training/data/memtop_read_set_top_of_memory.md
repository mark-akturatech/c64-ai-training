# MEMTOP (KERNAL) — Read/Set top of memory ($FE25-$FE33, vector $FFA9)

**Summary:** KERNAL MEMTOP entry (vectored from $FFA9) reads or sets the top-of-memory address stored in MEMSIZ ($0283/$0284). If the Carry flag is set on entry the routine loads MEMSIZ into X/Y; if Carry is clear it stores X/Y into MEMSIZ. Uses absolute LDX/LDY/STX/STY and returns with RTS.

## Description
This small KERNAL helper provides a single, vectored entry to read or write the 16-bit "top of memory" value stored at MEMSIZ ($0283 = low, $0284 = high). Calling convention and behavior:

- Entry: JSR to the KERNAL vector at $FFA9 (MEMTOP). The implementation shown lives at $FE25-$FE33.
- Input:
  - Carry set on entry -> read MEMSIZ into X (low) / Y (high).
  - Carry clear on entry -> store X (low) / Y (high) into MEMSIZ.
- Side effects:
  - X and Y are modified (loaded or stored as described).
  - LDX/LDY update N/Z flags; Carry is only tested (BCC) and otherwise left unchanged by the routine.
  - No stack or other registers are altered (no PHA/PLA, no ACC/A changes apart from implied by instructions).
- Data layout:
  - MEMSIZ is a 16-bit little-endian address at $0283 (low) / $0284 (high).
- Return: RTS (single return point after either read or write).

Typical usage: callers JSR $FFA9 after placing desired top-of-memory in X/Y and clearing Carry to set it, or set Carry and JSR to retrieve MEMSIZ into X/Y. This routine is used by RAMTAS/system initialization variants to establish the top of RAM after memory testing.

## Source Code
```asm
; *** MEMTOP: READ/SET TOP OF MEMORY
; The KERNAL routine MEMTOP ($FFA9) jumps to this routine.
; If carry is set on entry, the top of memory address will
; be loaded into (X/Y). If carry is clear on entry, the top
; of memory will be set according to the contents in (X/Y)

.,FE25 90 06    BCC $FE2D       ; branch if Carry = 0 -> store X/Y
.,FE27 AE 83 02 LDX $0283       ; Carry = 1 path: load X from MEMSIZ low
.,FE2A AC 84 02 LDY $0284       ; load Y from MEMSIZ high
.,FE2D 8E 83 02 STX $0283       ; store X to MEMSIZ low (Carry=0 path)
.,FE30 8C 84 02 STY $0284       ; store Y to MEMSIZ high
.,FE33 60       RTS             ; return
```

## Key Registers
- $0283-$0284 - RAM - MEMSIZ low/high (16-bit top-of-memory, little-endian)
- $FE25-$FE33 - KERNAL ROM - MEMTOP routine implementation
- $FFA9 - KERNAL vector (entry point for MEMTOP)

## References
- "ramtas_init_system_constants" — expands on RAMTAS calls and variants that set top-of-memory via the FE2D/FE27 paths

## Labels
- MEMTOP
- MEMSIZ
