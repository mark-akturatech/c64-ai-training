# NMOS 6510 - SHY (undocumented $9C) abs,X — store Y & (H+1)

**Summary:** Undocumented opcode $9C (SHY abs,X) performs an absolute,X store that writes (Y AND (H+1)) to memory; the high-byte increment (H+1) and resulting mask are timing-sensitive (page-cross, RDY, badline interactions). Useful for cycle-dependent tricks such as raster synchronization; SHY does not affect processor flags.

## Operation
SHY ($9C) uses absolute,X addressing and writes a value computed from Y AND (H+1) to the effective address. The H+1 term is the high byte of the (base) address incremented (i.e. H + 1), and whether that increment is observed depends on addressing timing (page-cross behavior and CPU stalling events such as RDY clear or VIC-II badlines). The instruction does not modify processor flags.

Behavioral summary:
- Effective addressing: absolute,X (base address + X). During the internal address calculation the high-byte increment may be performed.
- Stored value: A memory write of Y & (H+1) — the high-byte (H) incremented by one is used as a mask.
- Timing sensitivity: RDY line changes, VIC-II badlines (which pause the CPU), and page-cross conditions can change whether the high-byte increment occurs and thus change the mask — producing “unstable” or non-deterministic stored values depending on the cycle at which it runs.
- Flags: SHY does not affect N, Z or other status flags.

Caveat: The precise mask value depends on the high byte and its increment result at the moment the AND is performed; under some timing conditions the mask becomes $FF and the full Y is written, under others it can be a small value (e.g. $01) producing a known reduced result.

## Example: Sync with raster beam (remove cycle variance)
The following technique uses SHY’s timing-dependent stored value to synchronise code to a fixed CPU cycle position before setting up a raster-synced timer. It assumes $A2 (zero page) holds a value < $80 before start (e.g. $01). LDY is init'd to a test value (here $B5). The sequence relies on reading back the value just written to decide whether the previous SHY executed with the H+1 mask or without it.

Two equivalent views of the same loop (first shows the execution order when started):

Assembly view (what executes when the code was started):
```asm
loop = * + 1
    LDY #$B5
    LDX #$9C
    LDX #$00
    BPL loop

; initialize Y
; initialize X
```

Expanded, showing loop body:
```asm
loop:
    .byte $a0         ; (opcode timing / alignment in original)
    LDA $A2,X
    SHY $00A2,X
    BPL loop

; LDY
```

Explanation:
- SHY $00A2,X stores the computed (Y & (H+1)) to zero page address $A2 (with X = $00).
- The subsequent LDA $A2,X reads that value. Because SHY does not affect flags, the BPL depends solely on the result loaded by LDA.
- When H+1 mask is in effect such that (H+1) = $01 and Y = $B5, the stored byte is $01. The next LDA yields $01 (positive), so BPL branches and the loop continues.
- When the mask is absent (so the written value is the full Y = $B5), LDA loads $B5 which sets N (negative) and the BPL fails, exiting the loop.
- The timing event that toggles between masked and full write (e.g. a badline pausing the CPU on a particular internal cycle) effectively marks a known cycle; this yields a fixed X-position in a variable Y, allowing synchronization to the raster at a specific cycle.

Frame-timer variant (drops out on a specific raster line/cycle; may take multiple frames):
```asm
    LDY #$01
loop:
    LDX #243        ; target raster line (or any other badline)
    CPX $D012
    BNE *-3
    SHY $FFFF,X
    LDA $FF,X
    BEQ loop
```
Behavior:
- Poll $D012 until the desired raster line is reached (X = 243 here); then execute SHY $FFFF,X and read back LDA $FF,X.
- The sequence will consistently drop out on the chosen line/cycle combination (example: line 243 cycle 62) but may require several frames to synchronize (up to a small number of frames; the source notes up to seven frames in practice).

## Source Code
```asm
; First form (initial fragment from source)
loop = * + 1
    LDY #$B5
    LDX #$9C
    LDX #$00
    BPL loop

; Expanded loop form
loop:
    .byte $a0
    LDA $A2,X
    SHY $00A2,X
    BPL loop

; Frame-timer variant
    LDY #$01
loop:
    LDX #243 ; (or any other badline)
    CPX $D012
    BNE *-3
    SHY $FFFF, X
    LDA $FF, X
    BEQ loop
```

(These listings are verbatim reference examples from the source demonstrating SHY usage for raster sync.)

## Key Registers
- $D012 - VIC-II - Raster line compare register (used for raster polling/synchronization)

## References
- "unstable_address_high_byte_group" — expands on SHY's role in the unstable address-high-byte behavior group and timing-dependent stores

## Mnemonics
- SHY
