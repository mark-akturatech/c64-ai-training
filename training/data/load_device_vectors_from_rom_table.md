# Commented KERNAL vector copy: $FD93,X/$FD94,X -> $0314/$0315

**Summary:** KERNAL routine that loads a two‑byte device vector (low/high) from ROM table addresses $FD93,X and $FD94,X into runtime RAM pointers $0314/$0315 using X‑indexed LDA/STA. Contains JSR $FC93 and a conditional BEQ that can skip the copy; ends with RTS.

## Description
This small KERNAL subroutine (entry at $FCB8 in the disassembly) performs the following steps:
- Calls a helper at $FC93 (JSR $FC93). The result of that call affects the Zero flag.
- If Zero is set, execution branches to $FC54 (BEQ $FC54) and the vector copy is skipped.
- Otherwise it copies two bytes from the ROM vector table into the runtime vector locations:
  - LDA $FD93,X ; STA $0314  — copy low byte of device vector
  - LDA $FD94,X ; STA $0315  — copy high byte of device vector
- Returns with RTS.

X is used as the index into the ROM table (device index). The routine therefore installs the device driver pointer (two‑byte little‑endian address) from the ROM table into the KERNAL/IO runtime location at $0314/$0315.

## Source Code
```asm
.,FCB8 20 93 FC JSR $FC93
.,FCBB F0 97    BEQ $FC54
.,FCBD BD 93 FD LDA $FD93,X
.,FCC0 8D 14 03 STA $0314
.,FCC3 BD 94 FD LDA $FD94,X
.,FCC6 8D 15 03 STA $0315
.,FCC9 60       RTS
```

## Key Registers
- $FD93-$FD94 - KERNAL ROM - Device vector table (two-byte pointers, low at $FD93+X, high at $FD94+X)
- $0314-$0315 - RAM - Runtime device vector pointers / IO table entries (installed from ROM table)

## References
- "transfer_loop_and_interrupt_masking" — expands on vectors reloaded during transfer setup/teardown
- "set_status_bit_0x20" — expands on status bits modified around vector loads