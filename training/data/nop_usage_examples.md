# NMOS 6510 — Using Undocumented NOPs (Examples)

**Summary:** Examples and patterns for using undocumented NOP variants (multi-byte NOPs / DOP / TOP / NOP #imm) on the NMOS 6510/6502 to:

1. Acknowledge IRQs by performing a read (absolute NOP).
2. Skip instructions without altering flags/registers (use DOP variants instead of BIT).
3. Disable existing instructions by replacing opcodes (replace JMP $4C with NOP $0C).
4. Interleave code and data using NOP #imm bytes to save memory at the cost of cycles.

**Techniques**

**Acknowledge IRQ by Performing a Read**

Some undocumented NOPs perform a memory read (absolute-style NOPs). Use a NOP that executes the same read that an IRQ handler expects to see to acknowledge or trigger the same side-effect without altering registers or flags.

**Skip Instructions Without Altering Flags/Registers**

Use undocumented DOP (Double NOP) variants—multi-byte NOPs that do not affect NZ flags—when you want to skip over bytes/instructions but preserve processor flags and registers. This is preferable to using BIT or other instructions that modify flags.

**Disable Instructions by Replacing Opcodes**

Many official and unofficial opcodes differ by only one bit. You can disable a branch or a jump by replacing the official opcode with a same-length undocumented NOP:

- Example: JMP absolute is $4C (3 bytes). Replace with the undocumented absolute NOP opcode $0C (3 bytes) to turn a jump into a three-byte NOP without changing subsequent bytes. This removes the jump while keeping code layout intact.

**Interleave Code and Data to Save Memory (Trade Cycles for Bytes)**

If a table has sparse used offsets, interleave table data bytes between code using NOP #imm (single-byte immediate NOP variants) or multi-byte NOPs to occupy the unused offsets. This reduces overall memory use but adds 2 cycles (or the NOP's cycles) per skipped datum at runtime.

Use only in non-performance-critical code because each interleaved datum costs CPU cycles during table access.

**Caveats**

- Unofficial NOP opcodes and behavior differ between NMOS and CMOS 65xx variants; test on target hardware/emulator.
- Some undocumented opcodes are actually illegal/unstable on future processors; rely on them only when necessary and when targeting NMOS 6502/6510 specifically.

## Source Code

```asm
; Example: Interleave code and data (from source)
; Non-performance-critical code start
something:
    LDX foo
    LDA coltable1,x
    STA $D020
    .byte $80        ; NOP #IMM (DOP)
; Data values at offset $00, $08, $10 interleaved
; into the code
sometable:
    .byte $55
    LDA coltable2,x
    STA $D021
    .byte $80        ; NOP #IMM (DOP)
    .byte $aa
    LDA coltable3,x
    STA $D022
    .byte $80        ; NOP #IMM (DOP)
    .byte $ff
    ...
otherthing:
    ...
; X contains $00, $08, $10...
    LDA sometable,x
    ...
```

```text
; JAM (KIL, HLT, CIM, CRP) — Source Table
Type: Lock-up

Opcode  Mnemonic  Function        Size  Cycles  N V - B D I Z C
$02     JAM       CPU lock-up     1     -       - - - - - - - -
$12     JAM       CPU lock-up     1     -       - - - - - - - -
$22     JAM       CPU lock-up     1     -       - - - - - - - -
$32     JAM       CPU lock-up     1     -       - - - - - - - -
```

```asm
; Example: Disable a JMP by Replacing Opcode
; Original bytes (JMP $8000):
;   $4C $00 $80        ; JMP $8000
; Replace opcode with undocumented absolute NOP:
;   $0C $00 $80        ; 3-byte NOP (does not jump)
```

## References

- "nop_variants" — expanded mapping of undocumented NOP opcodes and recommended uses

**Undocumented NOP Opcodes**

The NMOS 6510/6502 processors have several undocumented NOP (No Operation) opcodes, each with specific behaviors regarding size, cycle count, and flag effects. Below is a comprehensive mapping of these opcodes:

| Opcode | Mnemonic | Addressing Mode | Bytes | Cycles | Flags Affected | Description                                                                 |
|--------|----------|-----------------|-------|--------|----------------|-----------------------------------------------------------------------------|
| $1A    | NOP      | Implied         | 1     | 2      | None           | No operation                                                                |
| $3A    | NOP      | Implied         | 1     | 2      | None           | No operation                                                                |
| $5A    | NOP      | Implied         | 1     | 2      | None           | No operation                                                                |
| $7A    | NOP      | Implied         | 1     | 2      | None           | No operation                                                                |
| $DA    | NOP      | Implied         | 1     | 2      | None           | No operation                                                                |
| $FA    | NOP      | Implied         | 1     | 2      | None           | No operation                                                                |
| $80    | NOP      | Immediate       | 2     | 2      | None           | Fetch immediate byte, no operation                                          |
| $82    | NOP      | Immediate       | 2     | 2      | None           | Fetch immediate byte, no operation                                          |
| $89    | NOP      | Immediate       | 2     | 2      | None           | Fetch immediate byte, no operation                                          |
| $C2    | NOP      | Immediate       | 2     | 2      | None           | Fetch immediate byte, no operation                                          |
| $E2    | NOP      | Immediate       | 2     | 2      | None           | Fetch immediate byte, no operation                                          |
| $04    | NOP      | Zero Page       | 2     | 3      | None           | Fetch zero page address, no operation                                       |
| $44    | NOP      | Zero Page       | 2     | 3      | None           | Fetch zero page address, no operation                                       |
| $64    | NOP      | Zero Page       | 2     | 3      | None           | Fetch zero page address, no operation                                       |
| $14    | NOP      | Zero Page,X     | 2     | 4      | None           | Fetch zero page address with X offset, no operation                         |
| $34    | NOP      | Zero Page,X     | 2     | 4      | None           | Fetch zero page address with X offset, no operation                         |
| $54    | NOP      | Zero Page,X     | 2     | 4      | None           | Fetch zero page address with X offset, no operation                         |
| $74    | NOP      | Zero Page,X     | 2     | 4      | None           | Fetch zero page address with X offset, no operation                         |
| $D4    | NOP      | Zero Page,X     | 2     | 4      | None           | Fetch zero page address with X offset, no operation                         |
| $F4    | NOP      | Zero Page,X     | 2     | 4      | None           | Fetch zero page address with X offset, no operation                         |
| $0C    | NOP      | Absolute        | 3     | 4      | None           | Fetch absolute address, no operation                                        |
| $1C    | NOP      | Absolute,X      | 3     | 4*     | None           | Fetch absolute address with X offset, no operation; *add 1 cycle if page crossed |
| $3C    | NOP      | Absolute,X      | 3     | 4*     | None           | Fetch absolute address with X offset, no operation; *add 1 cycle if page crossed |
| $5C    | NOP      | Absolute,X      | 3     | 4*     | None           | Fetch absolute address with X offset, no operation; *add 1 cycle if page crossed |
| $7C    | NOP      | Absolute,X      | 3     | 4*     | None           | Fetch absolute address with X offset, no operation; *add 1 cycle if page crossed |
| $DC    | NOP      | Absolute,X      | 3     | 4*     | None           | Fetch absolute address with X offset, no operation; *add 1 cycle if page crossed |
| $FC    | NOP      | Absolute,X      | 3     | 4*     | None           | Fetch absolute address with X offset, no operation; *add 1 cycle if page crossed |

*Note: For Absolute,X addressing modes, an additional cycle is added if a page boundary is crossed during execution.*

These undocumented NOPs can be strategically used for various purposes, such as timing adjustments, code alignment, or as placeholders during code development.

*Sources: [8bitworkshop documentation](https://8bitworkshop.com/docs/chips/m6502/insns/NOP.html), [C64-Wiki](https://www.c64-wiki.com/wiki/NOP)*

## Mnemonics
- NOP
- DOP
- TOP
- JAM
- KIL
- HLT
- CIM
- CRP
