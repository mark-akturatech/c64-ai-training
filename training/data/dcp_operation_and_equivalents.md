# NMOS 6510 — DCP (Decrement memory then Compare with A) (undocumented)

**Summary:** DCP is an undocumented NMOS 6510 / 6502 opcode that performs DEC (memory) followed immediately by CMP (A vs memory). It decrements the target memory location and sets N/Z/C according to the CMP result (compare after decrement).

**Description**
- **Operation:** DCP performs a memory decrement (equivalent to DEC mem) then performs a compare of the accumulator with the new memory value (equivalent to CMP mem). The final processor flags N, Z, and C reflect the result of the CMP (the compare after the decrement). Any N/Z results produced by the DEC are subsequently overwritten by the CMP. DEC's effect on the carry flag (C) does not apply — the carry is set/cleared only by the CMP portion of DCP.
- **Use case:** DCP can replace the common legal instruction sequence DEC mem / LDA mem / CMP other_mem (or DEC mem / LDA mem / CMP #imm) when the desired compare is A vs the decremented memory value — saving bytes/cycles by folding DEC and CMP together.
- **Caution:** DCP is an illegal/undocumented opcode on NMOS 6502-family chips (including 6510). Behavior is specific to NMOS implementations; use only when targeting hardware where the undocumented opcode is known to behave as expected.

**Opcode Variants**
DCP supports multiple addressing modes, each with a specific opcode and cycle count:

- **Zero Page:** Opcode $C7, 2 bytes, 5 cycles
- **Zero Page,X:** Opcode $D7, 2 bytes, 6 cycles
- **Absolute:** Opcode $CF, 3 bytes, 6 cycles
- **Absolute,X:** Opcode $DF, 3 bytes, 7 cycles
- **Absolute,Y:** Opcode $DB, 3 bytes, 7 cycles
- **(Indirect,X):** Opcode $C3, 2 bytes, 8 cycles
- **(Indirect),Y:** Opcode $D3, 2 bytes, 8 cycles

*Note: Cycle counts are based on available documentation and may vary depending on specific hardware implementations.*

**Example: Decrementing a 16-bit Counter Using DCP**
To decrement a 16-bit counter located at memory addresses `counter_lo` and `counter_hi`:


In this example:
- `LDA #$00` loads 0 into the accumulator.
- `DCP counter_lo` decrements the low byte and compares it to 0.
- If the result is zero (i.e., the low byte wrapped around), `DEC counter_hi` decrements the high byte.

**Test Program**
The following test program demonstrates the DCP instruction's behavior:


This program decrements a 16-bit counter and handles the case where the low byte wraps around, necessitating a decrement of the high byte.

**Timing Considerations**
The DCP instruction combines DEC and CMP into a single operation, resulting in cycle savings compared to executing DEC and CMP separately. For example:

- **DEC Zero Page:** 5 cycles
- **CMP Zero Page:** 3 cycles
- **Total for DEC + CMP:** 8 cycles

In contrast:

- **DCP Zero Page:** 5 cycles

This results in a 3-cycle savings when using DCP over separate DEC and CMP instructions.

## Source Code

```assembly
; Decrement 16-bit counter at counter_lo/counter_hi
LDA #$00
DCP counter_lo
BNE skip_hi
DEC counter_hi
skip_hi:
```

```assembly
; Test program for DCP instruction
; Assumes counter_lo and counter_hi are initialized elsewhere

LDA #$00
DCP counter_lo
BNE no_wrap
DEC counter_hi
no_wrap:
; Continue with program
```


## References
- [6502 Instruction Set](https://www.masswerk.at/6502/6502_instruction_set.html)
- [The 6502 Instruction Set Decoded](https://llx.com/Neil/a2/opcodes.html)
- [Visual6502wiki/6502 Timing States - NESdev Wiki](https://www.nesdev.org/wiki/Visual6502wiki/6502_Timing_States)

## Mnemonics
- DCP
- DCM
