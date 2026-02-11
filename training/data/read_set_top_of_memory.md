# Read/Set Top of Memory ($FE25-$FE33)

**Summary:** ROM routine at $FE25-$FE33 that reads or sets the system "top of memory" pointer stored at $0283/$0284. Uses the Carry flag to select operation (Carry=1: read, Carry=0: set); X/Y are used to return or supply the pointer bytes.

## Description
This KERNAL routine branches on the processor Carry flag to either read or set the top-of-memory pointer:

- Entry: call (JSR) to $FE25.
- Decision: BCC $FE2D at $FE25 — if Carry is clear, control falls through to the "set" path; if Carry is set, the routine performs the "read" path.
- Read path (Carry = 1): loads the low byte of the top-of-memory pointer from $0283 into X and the high byte from $0284 into Y, then returns (RTS). Caller receives the pointer in X/Y.
- Set path (Carry = 0): stores the caller-supplied X/Y into $0283/$0284 (low/high respectively) to update the top-of-memory, then returns.

Calling convention summary:
- Input (set): Carry clear; X = new low byte, Y = new high byte.
- Output (read): Carry set; X = low byte of top-of-memory ($0283), Y = high byte ($0284).

This routine is referenced by other routines (e.g., "test_ram_and_find_ram_end" to initialize the top of memory) and a wrapper at $FF99 that provides a higher-level interface.

## Source Code
```asm
        ; read/set the top of memory, Cb = 1 to read, Cb = 0 to set
.,FE25  90 06      BCC $FE2D        ; if Cb clear go set the top of memory

        ; read the top of memory
.,FE27  AE 83 02   LDX $0283        ; get memory top low byte
.,FE2A  AC 84 02   LDY $0284        ; get memory top high byte

        ; set the top of memory
.,FE2D  8E 83 02   STX $0283        ; set memory top low byte
.,FE30  8C 84 02   STY $0284        ; set memory top high byte
.,FE33  60         RTS
```

## Key Registers
- $0283 - RAM - top-of-memory pointer, low byte
- $0284 - RAM - top-of-memory pointer, high byte

## References
- "test_ram_and_find_ram_end" — expands on calls this routine to set top of memory
- "read_set_top_of_memory_wrapper" — expands on wrapper at $FF99

## Labels
- READ_SET_TOP_OF_MEMORY
- RAMTOP
