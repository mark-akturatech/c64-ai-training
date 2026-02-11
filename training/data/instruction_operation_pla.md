# PLA (Pull Accumulator) — 6502

**Summary:** PLA ($68) pulls a byte from the stack into the accumulator (A), increments the stack pointer, and updates the Negative (Sign) and Zero flags (N and Z). Uses the stack page at $0100; 4 cycles, implied addressing.

**Operation**
PLA is an implied instruction that reads one byte from the processor stack and places it into the accumulator:

- Addressing: implied (stack).
- Opcode: $68
- Length: 1 byte
- Cycles: 4
- Effect on flags: Updates N (Negative / Sign) and Z (Zero) only. Other flags are unchanged.
- Stack semantics: The 6502 stack is on page $01. PULL (the stack pop) increments the 8-bit stack pointer (SP) then reads memory at address $0100 + SP (wraps at $FF). Typical sequence:
  - SP := (SP + 1) & $FF
  - value := Memory[$0100 + SP]
  - A := value
  - N := (value & %10000000) != 0
  - Z := (value == 0)

Notes:
- PLA is the complement of PHA (Push Accumulator). PHA decrements SP and stores A at $0100+SP; PLA increments SP and loads from $0100+SP.
- Only N and Z are affected; carry, overflow, decimal, interrupt-disable, and break flags are left unchanged.
- On NMOS 6502 the instruction takes 4 clock cycles (standard behavior).

## Source Code
```text
Original provided pseudocode:
    /* PLA */
        src = PULL();
        SET_SIGN(src);	/* Change sign and zero flag accordingly. */
        SET_ZERO(src);
```

```asm
; Canonical PLA implementation (assembly / behavior summary)
; Opcode: $68
PLA     ; A <- PULL(); set N and Z based on A
```

```text
Canonical pseudocode / low-level semantics:

; PULL() semantics (stack pop):
SP = (SP + 1) & $FF            ; increment 8-bit stack pointer (wrap)
value = ReadMemory($0100 + SP) ; read from stack page

; PLA behavior (corrected):
A = value                      ; load accumulator with pulled value
N = (value & $80) != 0         ; set Negative (Sign) flag from bit 7
Z = (value == 0)               ; set Zero flag if value == 0
; other flags unchanged
```

## References
- "instruction_tables_pla" — PLA opcode expansion and instruction table entries

## Mnemonics
- PLA
