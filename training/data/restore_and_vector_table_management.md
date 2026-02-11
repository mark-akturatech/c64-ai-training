# RESTOR ($FD15) and VECTOR ($FD1A) — RAM Vector Management and ROM Defaults ($FD30)

**Summary:** RESTOR at $FD15 restores the 16 RAM I/O vectors ($0314-$0333) to their default KERNAL ROM values held at $FD30; VECTOR at $FD1A reads or writes those 16 RAM vectors using the address in X/Y and the Carry flag to select store/load operations (call via jump-table entries $FF8A/$FF8D). Callers should execute SEI/CLI around VECTOR because it may change IRQ/NMI vectors.

**Description**

**RESTOR ($FD15)**

- Restores the 16 RAM vectors (the RAM table at $0314-$0333) to their standard default values taken from the ROM table beginning at $FD30.
- Entry is available through the KERNAL jump table at $FF8A (decimal 65418).

**VECTOR ($FD1A)**

- Loads or stores the 16 RAM vectors at $0314-$0333 from/to a table whose 16 vector addresses are pointed to by the 16-bit address held in X (low) / Y (high).
- Behavior is selected by the processor Carry flag on entry:
  - Carry clear: load the RAM vectors from the table at (Y:X).
  - Carry set: store the current RAM vectors into the table at (Y:X).
- Because VECTOR can change the IRQ/NMI vectors, the routine does not itself disable interrupts; the documentation recommends executing SEI before calling and CLI after returning (the power-on RESET does this).
- Entry is available through the KERNAL jump table at $FF8D (decimal 65421).

**ROM Table of Default Vectors ($FD30)**

The ROM table at $FD30 contains the 16 default RAM I/O vector addresses that are copied to $0314-$0333 by RESTOR. These defaults represent the standard KERNAL interrupt and I/O service entry points.

| Address | Vector Name | Default Address | Description |
|---------|-------------|-----------------|-------------|
| $0314-$0315 | CINV | $EA31 | IRQ Interrupt Vector |
| $0316-$0317 | CBINV | $FE66 | BRK Instruction Interrupt Vector |
| $0318-$0319 | NMINV | $FE47 | NMI Interrupt Vector |
| $031A-$031B | IOPEN | $F34A | KERNAL OPEN Routine Vector |
| $031C-$031D | ICLOSE | $F291 | KERNAL CLOSE Routine Vector |
| $031E-$031F | ICHKIN | $F20E | KERNAL CHKIN Routine Vector |
| $0320-$0321 | ICKOUT | $F250 | KERNAL CHKOUT Routine Vector |
| $0322-$0323 | ICLRCH | $F333 | KERNAL CLRCHN Routine Vector |
| $0324-$0325 | IBASIN | $F157 | KERNAL CHRIN Routine Vector |
| $0326-$0327 | IBSOUT | $F1CA | KERNAL CHROUT Routine Vector |
| $0328-$0329 | ISTOP | $F6ED | KERNAL STOP Routine Vector |
| $032A-$032B | IGETIN | $F13E | KERNAL GETIN Routine Vector |
| $032C-$032D | ICLALL | $F32F | KERNAL CLALL Routine Vector |
| $032E-$032F | USRCMD | $FE66 | User-Defined Vector (Unused) |
| $0330-$0331 | ILOAD | $F4A5 | KERNAL LOAD Routine Vector |
| $0332-$0333 | ISAVE | $F5ED | KERNAL SAVE Routine Vector |

These vectors are initialized during system reset and can be modified by the user to redirect system routines.

**Usage Notes**

- VECTOR is the generic routine for saving or restoring the entire 16-vector table in one call; RESTOR is a convenience to reset them to the ROM defaults.
- Always protect calls that may change interrupt vectors (VECTOR) by disabling interrupts (SEI) prior to the call and re-enabling (CLI) afterwards, unless you are certain the operation is safe in your context.

## Source Code

The following assembly code demonstrates the implementation of the RESTOR routine:

```assembly
RESTOR:
    LDX #$1F        ; Load X with 31 (16 vectors * 2 bytes each - 1)
    LDY #$00        ; Start with Y at 0
RESTOR_LOOP:
    LDA $FD30,Y     ; Load byte from ROM table at $FD30
    STA $0314,Y     ; Store byte into RAM vector table at $0314
    INY             ; Increment Y
    DEX             ; Decrement X
    BPL RESTOR_LOOP ; Loop until all bytes are copied
    RTS             ; Return from subroutine
```

This routine copies the 32 bytes from the ROM table at $FD30 to the RAM vector table at $0314, effectively restoring the default system vectors.

For the VECTOR routine, the implementation is as follows:

```assembly
VECTOR:
    PHP             ; Push processor status to stack
    PHA             ; Push accumulator to stack
    LDA #$00        ; Clear A
    STA $C3         ; Store low byte of address
    STA $C4         ; Store high byte of address
    PLA             ; Pull accumulator from stack
    PLP             ; Pull processor status from stack
    BCC LOAD_VECTORS; Branch if carry clear (load vectors)
    ; Store vectors
    LDY #$1F        ; Load Y with 31
STORE_LOOP:
    LDA $0314,Y     ; Load byte from RAM vector table
    STA ($C3),Y     ; Store byte into user table
    DEY             ; Decrement Y
    BPL STORE_LOOP  ; Loop until all bytes are stored
    RTS             ; Return from subroutine
LOAD_VECTORS:
    LDY #$1F        ; Load Y with 31
LOAD_LOOP:
    LDA ($C3),Y     ; Load byte from user table
    STA $0314,Y     ; Store byte into RAM vector table
    DEY             ; Decrement Y
    BPL LOAD_LOOP   ; Loop until all bytes are loaded
    RTS             ; Return from subroutine
```

This routine either loads or stores the 16 RAM vectors based on the state of the Carry flag and the address provided in registers X and Y.

## Key Registers

- **$FD15**: KERNAL ROM - RESTOR entry (restore 16 RAM vectors to ROM defaults)
- **$FD1A**: KERNAL ROM - VECTOR entry (load/store 16 RAM vectors; Carry selects store/load)
- **$FD30**: KERNAL ROM - ROM table of default 16 vectors (copied to $0314-$0333)
- **$FF8A**: KERNAL ROM jump-table entry pointing to RESTOR (entry point)
- **$FF8D**: KERNAL ROM jump-table entry pointing to VECTOR (entry point)
- **$0314-$0333**: RAM - RAM vector table (16 vectors for interrupts and I/O routines)

## References

- "ramtas_ram_test_and_memory_pointers" — RAM initialization and pointers that complement vector setup
- "ioinit_initialize_cia_and_sid" — I/O initialization affected by vector values
- "power_on_reset_routine" — RESET sequence that executes SEI, calls VECTOR/RESTOR, then CLI

## Labels
- RESTOR
- VECTOR
