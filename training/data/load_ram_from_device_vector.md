# KERNAL LOAD entry: store setup pointer in $C3/$C4 then JMP ($0330)

**Summary:** Sets the KERNAL "setup pointer" by storing X/Y into $00C3/$00C4 and then performs an indirect JMP through the LOAD vector at $0330 (JMP ($0330)), which typically points into the ROM load routine (often $F4A5). Search terms: $C3, $C4, $0330, KERNAL, LOAD vector, STX, STY, JMP ($0330).

## Behavior
This KERNAL entry sequence performs the minimal setup required before dispatching to the full LOAD routine:

- STX $C3 stores the current X register into zero-page $00C3 (low byte of the KERNAL setup pointer).
- STY $C4 stores the current Y register into zero-page $00C4 (high byte of the KERNAL setup pointer).
- JMP ($0330) performs an indirect absolute jump using the 16-bit pointer stored at $0330/$0331. Control transfers to the address held in that vector.

The setup pointer ($00C3/$00C4) is used by the load implementation to locate setup data (parameters or workspace) supplied by the caller. The indirect JMP vector at $0330 lets the system route this entry point to the actual LOAD implementation in ROM; in most C64 KERNAL builds the vector points to the ROM load routine entry (commonly $F4A5), which then saves flags and checks the device number before continuing.

Side effects and notes:
- These instructions modify zero-page $00C3/$00C4.
- The JMP ($0330) reads the low byte from $0330 and the high byte from $0331 and transfers control without altering processor flags.
- The sequence itself does not preserve caller registers beyond X and Y being explicitly stored; the full load routine is responsible for saving/restoring any additional state.

## Source Code
```asm
.,F49E 86 C3    STX $C3         set kernal setup pointer low byte
.,F4A0 84 C4    STY $C4         set kernal setup pointer high byte
.,F4A2 6C 30 03 JMP ($0330)     do LOAD vector, usually points to $F4A5
```

## Key Registers
- $00C3-$00C4 - KERNAL zero page - setup pointer (low/high) for LOAD routine
- $0330 - KERNAL vector - LOAD vector pointer (indirect JMP target stored at $0330/$0331)

## References
- "load_routine_entry_and_device_check" — expands on the LOAD vector and the load routine entry that saves flags and checks the device number

## Labels
- $00C3
- $00C4
- $0330
