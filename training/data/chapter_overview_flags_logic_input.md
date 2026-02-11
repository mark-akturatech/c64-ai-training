# Chapter 3 — Flags, Logic, and Input

**Summary:** This chapter delves into the 6502 microprocessor's status flags, handling of signed numbers, the structure and function of the status register, introductory concepts of interrupts, logical bitwise instructions, and the GETIN and STOP input subroutines.

**Flags**

The 6502 processor utilizes several status flags to indicate the outcome of operations. These flags are:

- **Zero (Z) Flag:** Set when the result of an operation is zero.
- **Carry (C) Flag:** Set when an operation results in a carry out of the most significant bit in addition, or a borrow in subtraction.
- **Negative (N) Flag:** Reflects the most significant bit of the result, indicating a negative outcome in two's complement representation.
- **Overflow (V) Flag:** Set when an operation results in a signed overflow.

**Testable Flags: Z, C, N, V**

These flags can be tested using branch instructions:

- **BEQ (Branch if Equal):** Branches if the Z flag is set.
- **BCC (Branch if Carry Clear):** Branches if the C flag is clear.
- **BPL (Branch if Plus):** Branches if the N flag is clear.
- **BVS (Branch if Overflow Set):** Branches if the V flag is set.

**Signed Numbers**

The 6502 represents signed numbers using two's complement notation. In this system:

- Positive numbers range from 0 to 127 (`$00` to `$7F`).
- Negative numbers range from -1 to -128 (`$FF` to `$80`).

The most significant bit (MSB) serves as the sign bit: `0` for positive and `1` for negative numbers.

**The Status Register**

The status register (P) is an 8-bit register that holds the processor's status flags. Its bit layout is as follows:


- **N (Negative):** Set if the result of the last operation had bit 7 set.
- **V (Overflow):** Set if the last operation resulted in a signed overflow.
- **- (Unused):** Not used; always set to `1` in the stack.
- **B (Break):** Set when a BRK instruction is executed.
- **D (Decimal):** Set to enable Binary-Coded Decimal (BCD) mode for arithmetic operations.
- **I (Interrupt Disable):** Set to disable maskable interrupts.
- **Z (Zero):** Set if the result of the last operation was zero.
- **C (Carry):** Set if the last operation resulted in a carry or borrow.

**First Concepts of Interrupts**

Interrupts are signals that temporarily halt the CPU's current operations to execute a higher-priority task. The 6502 supports:

- **Non-Maskable Interrupt (NMI):** Cannot be disabled; triggered by a specific hardware signal.
- **Interrupt Request (IRQ):** Can be disabled by setting the I flag in the status register.

**Logical Operators: ORA, AND, EOR**

The 6502 provides the following bitwise logical instructions:

- **ORA (Logical Inclusive OR):** Performs a bitwise OR between the accumulator and a memory location.
- **AND (Logical AND):** Performs a bitwise AND between the accumulator and a memory location.
- **EOR (Exclusive OR):** Performs a bitwise XOR between the accumulator and a memory location.

**GETIN Subroutine**

The GETIN subroutine reads a character from the input buffer. If the buffer is empty, it returns `0`. This is useful for reading keyboard input in a non-blocking manner.

**STOP Subroutine**

The STOP subroutine halts the program until a key is pressed. It continuously checks the input buffer and resumes execution once input is detected.

## Source Code

```
Bit 7  | Bit 6  | Bit 5  | Bit 4  | Bit 3  | Bit 2  | Bit 1  | Bit 0
-------|--------|--------|--------|--------|--------|--------|--------
N      | V      | -      | B      | D      | I      | Z      | C
```


```assembly
; Example: Testing the Zero Flag
LDA #$00        ; Load 0 into the accumulator
BEQ ZeroFlagSet ; Branch if Zero flag is set

; Example: Signed Arithmetic
LDA #$7F        ; Load 127 into the accumulator
ADC #$01        ; Add 1
; Result is $80 (-128 in two's complement), V flag is set due to overflow

; Example: Logical Instructions
LDA #$F0        ; Load accumulator with 11110000
AND #$0F        ; AND with 00001111
; Result is 00000000, Z flag is set

; GETIN Subroutine
GETIN:
  JSR $FFE4     ; Jump to GETIN routine in KERNAL
  RTS           ; Return from subroutine

; STOP Subroutine
STOP:
  JSR $FFE1     ; Jump to STOP routine in KERNAL
  RTS           ; Return from subroutine
```

## Key Registers

- **Status Register (P):** Addressed implicitly; holds the processor's status flags.
- **Accumulator (A):** Used in arithmetic and logical operations.
- **Program Counter (PC):** Points to the next instruction to execute.

## References

- "flags_introduction_and_z_flag" — expands on detailed explanation of flags and the Z flag
- "logical_operations_overview" — expands on logical operator topics introduced in the chapter
- "getin_subroutine_keyboard_input" — expands on GETIN and input subroutines introduced here

## Labels
- GETIN
- STOP

## Mnemonics
- BEQ
- BCC
- BPL
- BVS
- ORA
- AND
- EOR
