# C64 KERNAL $FF87 — RAM test and find RAM end

**Summary:** KERNAL entry $FF87 (RAMTAS) performs a RAM test to determine the available top-of-RAM address. It initializes system memory, sets memory pointers, and prepares the system for operation.

**Description**

The KERNAL routine at $FF87, known as RAMTAS, is responsible for:

- **Clearing specific memory regions:**
  - Zero page: $0002–$0101
  - Stack area: $0200–$03FF

- **Performing a RAM test:** Determines the highest usable RAM address.

- **Setting system pointers:**
  - Top of memory pointer
  - Bottom of memory pointer
  - Screen memory location at $0400
  - Datasette buffer at $033C

This routine is typically invoked during system initialization to configure memory settings appropriately.

## Source Code

```assembly
; RAMTAS routine at $FF87
RAMTAS:
    ; Clear zero page and stack area
    LDX #$00
    TXA
ClearLoop:
    STA $0002,X
    STA $0200,X
    INX
    BNE ClearLoop

    ; Perform RAM test to find top of memory
    ; (Implementation details omitted for brevity)

    ; Set system pointers
    ; (Implementation details omitted for brevity)

    RTS
```

## Key Registers

- **Input:**
  - None

- **Output:**
  - A, X, Y registers are destroyed.

## References

- "ff99_read_set_top_of_memory" — expands on top-of-RAM pointer manipulation
- "ff9c_read_set_bottom_of_memory" — expands on bottom-of-RAM pointer manipulation

## Labels
- RAMTAS
