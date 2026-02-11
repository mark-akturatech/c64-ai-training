# NMOS 6510 — R-M-W Dummy-Write Trick (Fred Gray Music Routine)

**Summary:** This document explores the exploitation of the NMOS 6502's read-modify-write (R-M-W) instruction timing to produce two consecutive write cycles, one cycle apart. This technique is utilized in scenarios such as toggling a SID control register and creating visual effects like grey dots or alternating character lines by synchronizing with the VIC-II's raster operations.

**R-M-W Dummy-Write Technique**

On the NMOS 6502, R-M-W instructions (INC, DEC, ASL, LSR, ROL, ROR) perform a read operation followed by two write cycles: a dummy write of the original value and a final write of the modified value. This results in two distinct bus write events in quick succession, which can be exploited in memory-mapped I/O operations to present one value to the VIC-II or other I/O devices at a precise moment, then change it immediately afterward.

**Technique Summary:**

1. **Pre-load the Target Byte:** Store the desired initial value into the target memory location.
2. **Execute an R-M-W Instruction:** Perform an R-M-W operation (e.g., `INC addr`); the bus will first see the pre-loaded value during the dummy write, followed by the modified value during the final write.
3. **Timing Considerations:** The dummy write and final write occur one cycle apart, allowing precise timing alignment with the VIC-II's memory fetch cycles.

**Constraints and Caveats:**

- **Applicable Memory Areas:** This technique is effective for character or bitmap memory where the VIC-II reads data at specific moments, and a one-cycle window suffices to change the byte afterward.
- **Limitations:** The method is unreliable for sprites or the screen bitmap in general due to different fetch timings and internal VIC-II buffering.
- **Precise Timing Required:** Accurate cycle-level timing is essential to align the VIC-II read with the dummy-write cycle, making this an advanced timing exploit.

**Example Usage:**

- **Toggling a SID Control Bit:**
  - To toggle a SID control register bit, pre-load the register with the desired value and then perform an `INC` operation:
- **Charset Byte Timing Trick:**
  - To make a character byte appear as $FF when the VIC-II reads it, then change to $00 immediately after:
  - Repeating this during a raster line can make the character byte alternate between $FF and $00 every other raster line with a single `INC` instruction.

**Visual Trick Example:**

- **Border/Grey-Dot Effect:**
  - Using `INC $D020` (border color register) can create "grey dots" spaced 8 pixels apart. This leverages the R-M-W timing and the fact that changing the border color at the right cycle can produce visible single-pixel or small-pattern artifacts. Precise cycle-exact code is required.

## Source Code

    ```assembly
    LDA #$40
    STA $D404    ; Pre-load SID control register with $40
    INC $D404    ; R-M-W: dummy-write $40, final-write $41 (two writes one cycle apart)
    ```

    ```assembly
    LDA #$FF
    STA $xxxx    ; Pre-load charset/bitmap byte so dummy-write will be $FF when VIC reads it
    INC $xxxx    ; Dummy-write $FF at VIC fetch, final write $00 immediately after
    ```


```assembly
; Toggle a SID control bit using R-M-W double-write
; (example from Fred Gray music routine)
LDA #$40
STA $D404    ; Pre-load SID control register with $40
INC $D404    ; R-M-W: dummy-write $40, final-write $41 (two writes one cycle apart)

; Charset byte timing trick (conceptual)
LDA #$FF
STA $xxxx    ; Pre-load charset/bitmap byte so dummy-write will be $FF when VIC reads it
INC $xxxx    ; Dummy-write $FF at VIC fetch, final write $00 immediately after

; Border / grey-dot trick (concept mention)
INC $D020    ; INC on $D020 (border color) can create "grey dots" spaced 8 pixels (cycle-exact)
```

## Key Registers

- **$D400-$D406:** SID (Voice 1: frequency, pulse width, control, ADSR) — control register included ($D404 is the typical control register for voice 1).
- **$D020:** VIC-II - Border color register (used in border/color-timing visual hacks).

## References

- "read_modify_write_dummy_write_behavior" — expands on R-M-W timing exploited to produce two writes in quick succession.

## Labels
- $D020
- $D404

## Mnemonics
- INC
- DEC
- ASL
- LSR
- ROL
- ROR
