# KERNAL: Tape-related routines (Turn Off Tape Motor; Check/Advance Tape R/W Pointer)

**Summary:** Describes three Commodore 64 KERNAL cassette/tape-related routines: "Turn Off the Tape Motor" at $FCD1, "Check the Tape Read/Write Pointer" at $FCDB (compares current and ending tape R/W addresses), and "Advance the Tape Read/Write Pointer" at $FCE1 (increments the current R/W pointer). Includes routine purposes, ROM addresses (hex and decimal), assembly listings, calling conventions, and side effects.

**Turn Off the Tape Motor**
Routine name: "Turn Off the Tape Motor"  
Address: 64721 decimal = $FCD1 hex (KERNAL ROM).  

Purpose: Switches the cassette/tape motor off.

**Assembly Listing:**

**Calling Convention:**
- **Entry:** No parameters required.
- **Exit:** No return values; A, X, and Y registers are preserved.

**Side Effects:**
- Disables the cassette motor by clearing bit 0 of CIA2 port A ($900F).
- Temporarily disables interrupts during operation.

**Check the Tape Read/Write Pointer**
Routine name: "Check the Tape Read/Write Pointer"  
Address: 64731 decimal = $FCDB hex (KERNAL ROM).  

Purpose: Compares the current tape read/write address with the ending read/write address.

**Assembly Listing:**

**Calling Convention:**
- **Entry:** No parameters required.
- **Exit:** A register contains the result of the comparison:
  - A = 0: Current pointer equals ending pointer.
  - A > 0: Current pointer is greater than ending pointer.
  - A < 0: Current pointer is less than ending pointer.
- X and Y registers are preserved.

**Side Effects:**
- Affects the N (negative) and Z (zero) flags based on the comparison result.

**Advance the Tape Read/Write Pointer**
Routine name: "Advance the Tape Read/Write Pointer"  
Address: 64737 decimal = $FCE1 hex (KERNAL ROM).  

Purpose: Increments the current tape read/write pointer by one byte.

**Assembly Listing:**

**Calling Convention:**
- **Entry:** No parameters required.
- **Exit:** No return values; A, X, and Y registers are preserved.

**Side Effects:**
- Increments the current tape read/write pointer.
- May affect the N (negative) and Z (zero) flags based on the result of the increment operations.

## Source Code

```assembly
FCD1   78          SEI             ; Disable interrupts
FCD2   A9 00       LDA #$00        ; Load A with 0
FCD4   8D 0F 90    STA $900F       ; Store 0 into $900F (CIA2 port A)
FCD7   58          CLI             ; Enable interrupts
FCD8   60          RTS             ; Return from subroutine
```

```assembly
FCDB   AD 0A 90    LDA $900A       ; Load current tape R/W pointer low byte
FCDE   CD 0C 90    CMP $900C       ; Compare with ending R/W pointer low byte
FCE1   AD 0B 90    LDA $900B       ; Load current tape R/W pointer high byte
FCE4   ED 0D 90    SBC $900D       ; Subtract ending R/W pointer high byte
FCE7   60          RTS             ; Return from subroutine
```

```assembly
FCE1   EE 0A 90    INC $900A       ; Increment current tape R/W pointer low byte
FCE4   D0 02       BNE $FCE8       ; If no overflow, skip next instruction
FCE6   EE 0B 90    INC $900B       ; Increment current tape R/W pointer high byte
FCE9   60          RTS             ; Return from subroutine
```


## References
- "ramtas_ram_test_and_memory_pointers" — expands on initialization of tape buffer pointer and RAM top/bottom.
- "irq_vector_table" — expands on IRQ vectors that point to cassette read/write routines.

## Labels
- TURN_OFF_THE_TAPE_MOTOR
- CHECK_THE_TAPE_READ_WRITE_POINTER
- ADVANCE_THE_TAPE_READ_WRITE_POINTER
