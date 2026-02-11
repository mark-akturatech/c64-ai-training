# TI and TI$ (jiffy clock)

**Summary:** Describes the BASIC reserved variables TI and TI$, their implementation as calls to the Kernal routines RDTIM ($F6DD) and SETTIM ($F6E4), how reading/assigning invokes those routines and alters the underlying jiffy clock locations ($00A0-$00A02 / decimal 160-162), and how IRQ/tape I/O can disrupt the software jiffy clock.

## Description
TI and TI$ are not ordinary BASIC variables stored in the RAM variable area; they are implemented as interfaces to the system jiffy clock. Reading TI or TI$ (for example, assigning TI or TI$ to another variable) invokes the Kernal read-time routine RDTIM (decimal 63197, $F6DD). Assigning a value to TI$ invokes the Kernal set-time routine SETTIM (decimal 63204, $F6E4), which updates the underlying clock storage.

The BASIC jiffy clock is reflected in RAM locations printed in the example below (PEEK(160), PEEK(161), PEEK(162) — decimal addresses 160–162, i.e. $00A0–$00A02). Setting TI$ updates those locations; the IRQ-driven update mechanism (the keyboard IRQ handler) also modifies the clock. Because the clock is updated from the IRQ path, any code or device that steals, redirects, or replaces the IRQ vector (for example cassette/tape I/O routines that take over IRQ) will interfere with the software jiffy clock. User routines that redirect IRQ and fail to chain back to the normal handler will likewise upset clock operation.

Note: the example program below sets the jiffy clock to "235900" (23:59:00). The original source notes that after the program has been running for one minute, the printed underlying locations will be reset to zero.

## Source Code
```basic
100 TI$="235900"
110 PRINT TI$,PEEK(160),PEEK(161),PEEK(162)
120 GOTO 110
```

```text
Kernal routines:
- RDTIM  = decimal 63197 = $F6DD  (read time)
- SETTIM = decimal 63204 = $F6E4  (set time)

RAM locations used in example:
- decimal 160..162  = $00A0..$00A02  (PEEK locations printed by example)
```

## Key Registers
- $F6DD - Kernal - RDTIM (read time) (decimal 63197)
- $F6E4 - Kernal - SETTIM (set time) (decimal 63204)
- $00A0-$00A02 - RAM - jiffy clock storage (PEEK(160), PEEK(161), PEEK(162))

## References
- "tape_buffer_count_and_force_output_BUFPNT" — expands on tape I/O interactions that can affect IRQ and the jiffy clock  
- "tape_buffer_pointer_TAPE1_B2_B3" — expands on cassette buffer pointer and tape operations

## Labels
- RDTIM
- SETTIM
