# 6502: Pseudocode helper macros, flag helpers, and register aliases

**Summary:** Defines helper macros and semantics used in 6502 instruction pseudocode: SET_SIGN, SET_ZERO, SET_CARRY, SET_OVERFLOW, SET_INTERRUPT, SET_BREAK, SET_DECIMAL, REL_ADDR, SET_SR, GET_SR, PULL, PUSH, LOAD, STORE, IF_* flag queries, clk, and register aliases (AC, XR, YR, PC, SP). Includes standard SR (status register) bit layout and stack addressing ($0100) behavior.

**Macros and semantics**
- src
  - The byte value being operated on (8-bit unsigned).
- SET_SIGN(value)
  - Sets the Negative (N) flag if bit 7 of value is 1, clears it otherwise.
  - Equivalent test: if (value & 0x80) N = 1 else N = 0.
- SET_ZERO(value)
  - Sets the Zero (Z) flag if value == 0, clears it otherwise.
- SET_CARRY(condition)
  - If condition evaluates true/non-zero, set Carry (C) = 1; otherwise clear C = 0.
  - condition is typically an arithmetic result or boolean expression supplied by the instruction implementation.
- SET_OVERFLOW(condition)
  - If condition true, set Overflow (V) = 1; else clear V = 0.
  - For ADC/SBC, condition is the signed overflow test (e.g., (~(A ^ M) & (A ^ R) & 0x80) != 0).
- SET_INTERRUPT(condition), SET_BREAK(condition), SET_DECIMAL(condition)
  - Same pattern as SET_CARRY/SET_OVERFLOW: set or clear the respective flag (I, B, D) depending on boolean condition.
- REL_ADDR(PC, src)
  - Compute the signed 8-bit relative target: PC + sign_extend_8(src).
  - src is treated as an 8-bit signed displacement (-128..+127); the result is the branch target address.
- SET_SR(value)
  - Load the CPU status flags from the 8-bit value.
  - Updates N, V, D, I, Z, C according to corresponding bits; handling of B and the unused bit varies by context (see SR layout).
- GET_SR()
  - Pack current status flags into an 8-bit value and return it.
  - Typical packing order: N V 1 B D I Z C (bit 5 is often the unused/high bit set to 1 in many implementations/emulators).
- PULL
  - Pop one byte from the hardware stack and return it (used for PLA, PLP).
  - Implementation semantics (see Stack behavior).
- PUSH(value)
  - Push one byte onto the hardware stack (used for PHA, PHP).
  - Implementation semantics (see Stack behavior).
- LOAD(address) / STORE(address, value)
  - Memory read/write at the given absolute address. LOAD returns an 8-bit value; STORE writes an 8-bit value.
- IF_* macros (IF_CARRY, IF_OVERFLOW, IF_SIGN, IF_ZERO, IF_INTERRUPT, etc.)
  - Return true if the corresponding flag is set, false otherwise.
  - Useful inside conditional pseudocode (e.g., if IF_CARRY then ...).
- clk
  - A variable representing the cycle count for the instruction instance. Adjusted by addressing-mode/page-cross penalties and branch taken/not-taken cases. The pseudocode increments or sets clk where noted by the instruction timing rules.

**Status register (SR) bit layout**
- Standard 6502 SR bit positions (bit7..bit0):
  - Bit 7: N (Negative)
  - Bit 6: V (Overflow)
  - Bit 5: unused / typically set to 1 (emulator-dependent)
  - Bit 4: B (Break)
  - Bit 3: D (Decimal mode)
  - Bit 2: I (Interrupt disable)
  - Bit 1: Z (Zero)
  - Bit 0: C (Carry)
- Notes:
  - SET_SR/GET_SR must map these bits to/from the internal flag fields.
  - The Break (B) flag is implementation/stack-context sensitive (pushed as part of PHP/BRK/RTI semantics); emulators may differ in how bit 5 is handled.
  - **[Note: Source may contain an error — exact handling of bit 5 (unused) and bit 4 (B) when pushing/pulling SR can vary between implementations; follow target emulator/CPU doc for RTI/PHP behavior.]**

**Stack behavior (PUSH / PULL)**
- Stack page: hardware stack is on page $0100. Effective stack address = $0100 | SP.
- SP is an 8-bit stack pointer that indexes into $0100-$01FF.
- PUSH(value)
  - STORE($0100 | SP, value)
  - SP = (SP - 1) & 0xFF
  - This writes to the current SP location then decrements SP (so initial push from SP=$FF stores at $01FF).
- PULL (pop)
  - SP = (SP + 1) & 0xFF
  - value = LOAD($0100 | SP)
  - Returns value
  - This increments SP first, then reads the byte (matching PLA/PLP semantics).
- Edge conditions: SP wraps 8-bit (0x00 -> 0xFF etc.) per 6502 behavior.

**Addressing helpers**
- REL_ADDR(PC, src)
  - Treat src as unsigned 8-bit, sign-extend to signed 8-bit, add to PC to produce absolute target.
  - Example: if src = 0xFE, signed = -2, REL_ADDR(PC,0xFE) = PC - 2.
- When pseudocode references "src" without a mode, it is the value fetched by the addressing mode; the macros operate only on that provided byte.

**Clock and timing (clk)**
- clk is used to record the number of machine cycles the particular instruction instance consumes.
- Pseudocode may increment clk conditionally (e.g., branches, page-cross cycles).
- For exact cycle counts consult the instruction timing tables for the chosen addressing mode and CPU variant.

**Register aliases**
- AC — Accumulator (A)
- XR — X index register (X)
- YR — Y index register (Y)
- PC — Program Counter (PC)
- SP — Stack Pointer (SP)

## Source Code
```text
; Pseudocode examples for SET_SR and GET_SR push/pop semantics

; SET_SR(value)
; Load the CPU status flags from the 8-bit value.
; Updates N, V, D, I, Z, C according to corresponding bits;
; handling of B and the unused bit varies by context.

; Pseudocode:
N = (value >> 7) & 1
V = (value >> 6) & 1
; Bit 5 is unused and typically set to 1 when pushed to the stack
; Bit 4 (B) is set to 1 when pushed by BRK/PHP, 0 when pushed by IRQ/NMI
D = (value >> 3) & 1
I = (value >> 2) & 1
Z = (value >> 1) & 1
C = value & 1

; GET_SR()
; Pack current status flags into an 8-bit value and return it.
; Typical packing order: N V 1 B D I Z C

; Pseudocode:
value = (N << 7) | (V << 6) | (1 << 5) | (B << 4) | (D << 3) | (I << 2) | (Z << 1) | C
return value
```

## References
- "instruction_timing_tables" — expands on timing information referenced when pseudocode mentions clock cycles