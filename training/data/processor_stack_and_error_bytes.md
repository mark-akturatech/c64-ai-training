# Processor Stack ($0100-$01FF)

**Summary:** Memory page $0100-$01FF is the 6502 processor stack (C64 stack page) used for hardware/software stacking (interrupts, JSR/RTS, PHP/PLA, etc.) and holds datasette error-byte pointers ($0100-$013D). Searchable terms: $0100, $01FF, processor stack, datasette error bytes, FOR/GOSUB storage, 6502 SP.

## Description
The entire 256-byte page at $0100-$01FF is the 6502 processor stack area on the Commodore 64. The CPU uses an 8-bit stack pointer (SP) as an offset into this page: memory accesses for push/pull and interrupt/JSR/RTS operations are performed at addresses $0100 + SP.

- $0100-$013D are reserved in this map as "Error Bytes" — pointers used by the datasette routines (62 bytes).
- $0100-$01FF is the system processor stack used by the CPU for hardware and software stacking (interrupts, JSR/RTS return addresses, PHP/PLA, interrupts), and for BASIC interpreter storage such as FOR/NEXT and GOSUB bookkeeping (FOR/GOSUB storage).
- Stack semantics (6502): a PHA/JSR/BRK sequence pushes values at address $0100 + SP and decrements SP; PLA/RTS/RTI pull by incrementing SP then reading from $0100 + SP.

No per-byte register layout is defined here beyond the two functional regions above.

## Source Code
```text
Processor Stack ($0100-$01FF)

$0100-$013D  Error Bytes        Pointers to error bytes from datasette (62 bytes)
$0100-$01FF  Stack Area         System processor stack and FOR/GOSUB storage
```

## Key Registers
- $0100-$013D - Memory - Error bytes (datasette pointers)
- $0100-$01FF - Memory - Processor stack area (system processor stack and FOR/GOSUB storage)

## References
- "hardware_vectors" — expands on stack use by interrupts and vectors