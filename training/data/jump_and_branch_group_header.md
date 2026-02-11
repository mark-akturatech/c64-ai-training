# 6502 Jump and Branch Group (JMP and Conditional Branches)

**Summary:** This section details the jump and branch instructions of the 6502 CPU, including the unconditional jump (`JMP`) and conditional branch opcodes (`BEQ`, `BNE`, etc.). It covers opcode encodings, addressing modes, cycle counts, known CPU quirks, and provides example assembly usage.

**Description**

The 6502 CPU's jump and branch instructions allow for control flow alterations within a program. This group includes:

- **JMP (Jump):** Unconditional jump to a specified address.
- **Conditional Branches:** Instructions that alter the program counter based on specific flag conditions.

### Opcode Encodings

- **JMP (Jump):**
  - Absolute: `4C`
  - Indirect: `6C`

- **Conditional Branches:**
  - BPL (Branch on Plus): `10`
  - BMI (Branch on Minus): `30`
  - BVC (Branch on Overflow Clear): `50`
  - BVS (Branch on Overflow Set): `70`
  - BCC (Branch on Carry Clear): `90`
  - BCS (Branch on Carry Set): `B0`
  - BNE (Branch on Not Equal): `D0`
  - BEQ (Branch on Equal): `F0`

### Addressing Modes

- **JMP:**
  - *Absolute:* Direct jump to a specified 16-bit address.
  - *Indirect:* Jump to the address stored at a specified 16-bit address. Notably, if the indirect vector address ends in `FF` (e.g., `$12FF`), the 6502 will fetch the LSB from `$12FF` and the MSB from `$1200` instead of `$1300` due to a known bug. ([nesdev.org](https://www.nesdev.org/obelisk-6502-guide/reference.html?utm_source=openai))

- **Conditional Branches:**
  - *Relative:* The operand is an 8-bit signed offset (-128 to +127) added to the program counter if the branch is taken. This allows branching within approximately ±127 bytes from the current instruction. ([nesdev.org](https://www.nesdev.org/obelisk-6502-guide/addressing.html?utm_source=openai))

### Cycle Counts and Timing

- **JMP:**
  - Absolute: 3 cycles
  - Indirect: 5 cycles

- **Conditional Branches:**
  - If the branch is not taken: 2 cycles
  - If the branch is taken:
    - Same page: 3 cycles
    - Different page: 4 cycles (due to page boundary crossing) ([c64os.com](https://c64os.com/post/6502instructions?utm_source=openai))

### Indirect JMP Page-Boundary Bug

The original 6502 has a known bug with the indirect `JMP` instruction when the vector address is at the end of a memory page (e.g., `$xxFF`). Instead of fetching the MSB from `$xx00` of the next page, it incorrectly fetches it from `$xx00` of the same page. This can lead to unexpected jump addresses. To avoid this, ensure that indirect jump vectors do not cross page boundaries. ([nesdev.org](https://www.nesdev.org/obelisk-6502-guide/reference.html?utm_source=openai))

### Example Assembly Usage

- **JMP Absolute:**

- **JMP Indirect:**

- **Conditional Branches:**


## Source Code

  ```assembly
  JMP $C000  ; Jump to address $C000
  ```

  ```assembly
  JMP ($FFFC)  ; Jump to the address stored at $FFFC/$FFFD
  ```

  ```assembly
  LDA #$00
  BEQ ZeroFlagSet  ; Branch if Zero flag is set
  ; Continue here if Zero flag is not set
  ```

  ```assembly
  LoopStart:
    ; Loop body
    DEC Counter
    BNE LoopStart  ; Branch back to LoopStart if Counter is not zero
  ```


```text
; Example: Using JMP and Branch Instructions

; Unconditional Jump
JMP Start

; Conditional Branches
Start:
  LDA #$00
  BEQ ZeroFlagSet  ; Branch if Zero flag is set
  ; Continue here if Zero flag is not set

ZeroFlagSet:
  ; Code to execute when Zero flag is set

; Loop Example
LoopStart:
  ; Loop body
  DEC Counter
  BNE LoopStart  ; Branch back to LoopStart if Counter is not zero
```

## Key Registers

- **Program Counter (PC):** Updated by `JMP` and branch instructions to alter the flow of execution.
- **Status Register (P):** Flags affected by operations, influencing conditional branches:
  - **N (Negative):** Set if the result of the last operation was negative.
  - **V (Overflow):** Set if the last operation resulted in an overflow.
  - **Z (Zero):** Set if the result of the last operation was zero.
  - **C (Carry):** Set if the last operation resulted in a carry out.

## References

- "jmp_instruction" — expands on JMP absolute/indirect
- "branch_instructions" — expands on conditional branch opcodes

## Mnemonics
- JMP
- BPL
- BMI
- BVC
- BVS
- BCC
- BCS
- BNE
- BEQ
