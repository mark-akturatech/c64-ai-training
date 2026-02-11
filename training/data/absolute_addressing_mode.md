# Absolute Addressing (Absolute Mode)

**Summary:** Absolute addressing specifies a full 16-bit memory address ($0000-$FFFF) and accesses a single fixed memory location; used by instructions such as JSR and JMP. Limitations: absolute addressing targets one fixed address only (no range).

## Absolute Addressing
Absolute addressing supplies a full 16-bit memory address in the instruction, allowing access to any single location in the $0000-$FFFF address space. Common uses shown in the source:

- Program control: JSR (jump to subroutine) and JMP (jump) use absolute addressing to transfer execution to a specific address anywhere in memory.
- Variables and I/O: any fixed RAM, ROM, or I/O address can be referenced absolutely (examples below).
- Limitation: an absolute-address instruction reaches only the exact address encoded; it cannot address a range or be offset without rewriting the instruction.

Concrete examples from source text:
- Exchanging memory at $0380 and $0381 (absolute addressing by explicit addresses).
- Keyboard storage at $03C0.
- Subroutines called at $FFD2 and $033C.
- Machine-specific single-address operations (decimal + hex shown in source):
  - PET/CBM mode switch at 59468 (hex $E84C).
  - VIC-20 sound volume at 36878 (hex $900E).
  - Commodore 64 screen background color at 53281 (hex $D021).

## Key Registers
- $D021 - VIC-II - screen background color (C64)

## References
- "jmp_indirect_mode_and_rom_link" — expands on JMP ($addr) indirect variant for ROM link
