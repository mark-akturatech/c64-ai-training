# BRA — Branch Always (opcode $80)

**Summary:** BRA is the relative (signed 8-bit) "branch always" instruction with opcode $80, introduced in the 65C02 processor. It uses relative addressing and requires 3 cycles, with an additional cycle if the branch crosses a page boundary. On NMOS 6502/6510 processors, including those in the Commodore 64, opcode $80 is an illegal/undocumented instruction and should not be used.

**Description**
BRA performs an unconditional branch using a signed 8-bit relative displacement from the next instruction. It does not test or modify any processor status flags.

- **Mnemonic/Syntax:** BRA label
- **Addressing Mode:** Relative (signed 8-bit offset)
- **Size:** 2 bytes (opcode + offset)
- **Opcode:** $80
- **Operand Encoding:** Signed offset = target_address - (PC_after_opcode + 1) = target - (PC + 2)
- **Cycles:** 3 cycles (branch always taken). If the branch target is on a different 256-byte page than PC+2, add 1 extra cycle (4 total).
- **Flags Affected:** None

**Compatibility Note:** BRA is an official opcode on the CMOS 65C02 and compatible CPUs. On original NMOS 6502 and the 6510 used in the Commodore 64, $80 is not a documented instruction and its behavior is unpredictable. Therefore, BRA ($80) should not be used on stock C64 hardware unless the specific CPU variant is known to support it.

## Source Code
```asm
; Encoding example (assembled bytes shown as comments)

        ORG $1000
label:  ; target
        ; ... target code ...

        ORG $0FF0
        ; example: branch from $0FF0 to $1000
        BRA label        ; assembled: $80 $0E
                        ; calculation: offset = $1000 - ($0FF0 + 2) = $1000 - $0FF2 = $0E

; Machine code form:
; $80 <signed_offset>
; e.g. $80 $FE  => branch backwards by 2 (offset -2)

; Notes:
; - Offset is a signed 8-bit two's-complement value (-128 to +127).
; - Assembled offset is target - (PC + 2) where PC is the instruction address.
```

## Key Registers
(omitted — this chunk documents an instruction, not hardware registers)

## References
- "bbr_bbs_branch_on_bit_reset_set" — expands on other branch families (BBR/BBS) and how branch opcodes are arranged