# NMOS 6510 — DCP (illegal) usage examples

**Summary:** Demonstrates using the illegal NMOS 6510 DCP (DEC then CMP) opcode (not a standard DEC) as a compact replacement for sequences like LDA (zp),Y / SEC / SBC #$01 / STA (zp),Y and as a way to decrement a 16-bit value when the low byte is in A (with carry behavior). Mentions (zp),Y addressing and that DCP performs DEC memory then CMP A,mem.

**DCP as a compact replacement for LDA (zp),Y / SEC / SBC #$01 / STA (zp),Y**
DCP performs a memory decrement followed by a compare of A with the new memory value (DEC m ; CMP A,m). When you need to decrement a memory operand and also compare it against A (or leave A untouched while producing a compare), the DCP (zp),Y illegal opcode can replace the usual four-instruction sequence (LDA (zp),Y / SEC / SBC #$01 / STA (zp),Y), saving bytes and cycles and leaving A unchanged while providing the compare result for free.

Note: DCP is an illegal/undocumented opcode on NMOS 6502/6510 (behavior relies on that implementation).

**Example: decrementing a 16-bit value when low byte is in A and carry must be set**
When the low byte of a 16-bit value is held in A and the carry must be set after decrement, DCP can shorten the code and preserve A while also producing the correct carry.

- Conventional sequence (explicit DEC on high byte):
  - Precondition: low byte already in A, carry is set
  - Do SBC #$01 to subtract 1 from the low byte using the carry
  - If borrow occurred (BCS falls through), DEC highbyte and re-SEC to restore carry

- Optimized using DCP on the high byte:
  - After SBC #$01, if borrow cleared then A becomes $FF; a DCP highbyte performs DEC highbyte then CMP A,highbyte. Because A is $FF when borrow occurred, the CMP in DCP will set the carry appropriately without a separate SEC instruction, saving one byte and two CPU cycles compared to the explicit DEC/SEC sequence.

(Exact cycles/byte savings depend on the DCP opcode variant used; see referenced opcode-variants table.)

## Source Code
```asm
; Conventional approach (low byte in A, carry set)
; lowbyte is in A, carry is set
    SBC #$01
    BCS skip_dechigh    ; branch if no borrow (carry set)
    ; borrow happened -> carry cleared
    DEC highbyte
    SEC                 ; restore carry
skip_dechigh
    ; continue...

; Optimized using DCP (saves one byte and two cycles)
; lowbyte is in A, carry is set
    SBC #$01
    BCS skip_dcp        ; branch if no borrow (carry set)
    ; borrow happened -> carry cleared, A == $FF
    DCP highbyte        ; DEC highbyte ; CMP A,highbyte  (illegal opcode)
skip_dcp
    ; continue...
```

```asm
; Example use-case noted in header (conceptual)
; DCP (zp),Y can replace:
;   LDA (zp),Y
;   SEC
;   SBC #$01
;   STA (zp),Y
; with:
;   DCP (zp),Y    ; DEC (zp),Y ; CMP A,(zp),Y  — leaves A unchanged, compare done
```

**DCP Opcode Variants Table**

The DCP (Decrement Memory and Compare) instruction is an undocumented opcode on the NMOS 6502/6510 processors. It combines the operations of decrementing a memory location and comparing the result with the accumulator. Below is a table detailing the various addressing modes, opcodes, byte sizes, and cycle counts for the DCP instruction:

| Addressing Mode | Opcode | Bytes | Cycles |
|-----------------|--------|-------|--------|
| Zero Page       | $C7    | 2     | 5      |
| Zero Page,X     | $D7    | 2     | 6      |
| Absolute        | $CF    | 3     | 6      |
| Absolute,X      | $DF    | 3     | 7      |
| Absolute,Y      | $DB    | 3     | 7      |
| (Indirect,X)    | $C3    | 2     | 8      |
| (Indirect),Y    | $D3    | 2     | 8      |

*Note: Cycle counts may vary depending on specific hardware implementations and conditions such as page boundary crossings.*

## References
- "6502 'Illegal' Opcodes Demystified" — provides detailed information on undocumented opcodes, including DCP. [https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes](https://www.masswerk.at/nowgobang/2021/6502-illegal-opcodes)
- "6502 Instruction Tables" — offers a comprehensive table of 6502 instructions, including undocumented ones. [https://www.masswerk.at/6502/instruction-tables/](https://www.masswerk.at/6502/instruction-tables/)

## Mnemonics
- DCP
- DCM
