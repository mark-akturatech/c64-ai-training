# KERNAL helper: copy pointer bytes $C2/$C1 into temp $AD/$AC ($FB8E-$FB96)

**Summary:** Small Commodore 64 KERNAL helper at $FB8E that copies zero-page bytes $C2 -> $AD and $C1 -> $AC using LDA/STA/RTS; useful for transferring current pointer bytes into temporary AD/AC storage (pointer/offset computations).

## Description
This routine is a minimal helper used by the KERNAL to move two zero-page pointer bytes into temporary storage. The sequence:

- Loads the byte at $C2 and stores it to $AD.
- Loads the byte at $C1 and stores it to $AC.
- Returns with RTS.

Commonly used when rearranging pointer bytes for offset calculations or temporary preservation before further KERNAL routines (see referenced chunks for calling context). Located at addresses $FB8E through $FB96 in this disassembly.

## Source Code
```asm
.,FB8E A5 C2    LDA $C2
.,FB90 85 AD    STA $AD
.,FB92 A5 C1    LDA $C1
.,FB94 85 AC    STA $AC
.,FB96 60       RTS
```

## Key Registers
- $C2 - Zero page - pointer byte (source)
- $C1 - Zero page - pointer byte (source)
- $AD - Zero page - temporary storage (destination for $C2)
- $AC - Zero page - temporary storage (destination for $C1)

## References
- "compute_tape_or_disk_offsets_and_dispatch" — expands on pointer rearrangement used for offset computations
- "init_filename_state" — expands on initialization of registers which may feed into AC/AD usage