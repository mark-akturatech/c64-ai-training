# SMB0..SMB7 (Kick Assembler)

**Summary:** Kick Assembler mnemonics for the SMB (Set Memory Bit) family: smb0..smb7 with their opcode bytes ($87, $97, $A7, $B7, $C7, $D7, $E7, $F7).

**Description**
The SMB (Set Memory Bit) instructions are used to set a specific bit in a zero-page memory location. Each instruction corresponds to setting a different bit (0 through 7) in the specified memory address.

- **Addressing Mode:** Zero Page
- **Operand Format:** The instruction is followed by a single byte specifying the zero-page address.

**Semantics:**
- **smb0 ($87):** Sets bit 0 of the memory location.
- **smb1 ($97):** Sets bit 1 of the memory location.
- **smb2 ($A7):** Sets bit 2 of the memory location.
- **smb3 ($B7):** Sets bit 3 of the memory location.
- **smb4 ($C7):** Sets bit 4 of the memory location.
- **smb5 ($D7):** Sets bit 5 of the memory location.
- **smb6 ($E7):** Sets bit 6 of the memory location.
- **smb7 ($F7):** Sets bit 7 of the memory location.

**Operation:**
1. Fetch the operand (zero-page address).
2. Read the value from the zero-page address.
3. Set the specified bit in the value.
4. Write the modified value back to the zero-page address.

**Cycle Count:** 5 cycles

**Interrupts and Timing Effects:** No known side effects on interrupts or timing beyond the standard cycle count.

**Assembler Usage Example:**

**CPU Family Support:** The SMB instructions are not part of the original 6502 instruction set. They are available in the Rockwell 65C02 and the Western Design Center (WDC) 65C02 processors. They are not supported by the original NMOS 6502 or the 6510 CPUs.

## Source Code

```asm
smb3 $12  ; Sets bit 3 at zero-page address $12
```

```text
smb0

$87

smb1

$97

smb2

$a7

smb3

$b7

smb4

$c7

smb5

$d7

smb6

$e7

smb7

$f7
```

## References
- "rmb_reset_memory_bit_instructions" — expands on RMB family (Reset Memory Bit), the counterpart to SMB
- "sta_stz_trb_tsb_special_ops" — expands on other store/bit-manipulation instructions shown next in the Quick Reference

## Mnemonics
- SMB0
- SMB1
- SMB2
- SMB3
- SMB4
- SMB5
- SMB6
- SMB7
