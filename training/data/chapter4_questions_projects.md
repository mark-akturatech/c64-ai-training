# Machine-language practice: subtraction, conditional arithmetic, LSR odd/even

**Summary:** Exercises for writing small 6502/C64 machine-language programs: subtract two single-digit numbers, conditionally double or halve a single-digit number based on its value, and detect ODD/EVEN using LSR and BCC/BCS instructions. Includes calling ML subroutines from ML and producing neat output.

**Exercises / Tasks**

- **Subtraction Program:**  
  Write a program to subtract two single-digit numbers, similar in structure to the addition/subroutine example referenced in the previous chapter. Organize the code using a callable machine-language subroutine for the arithmetic operation.

- **Conditional Arithmetic Program:**  
  Write a program to input a single-digit number. If the number is less than five, double it and print the result. If the number is five or greater, divide it by two (discarding the remainder) and print the result. Ensure the output is neatly formatted.

- **Odd/Even Detection Program:**  
  Write a program to input a single-digit number and print "ODD" or "EVEN" after the number, depending on its parity. Utilize the LSR instruction to shift the value right, then branch with BCC or BCS to determine even or odd:
  - `LSR` shifts the least significant bit into the Carry flag; if Carry = 1, the value was odd.
  - Follow `LSR` with `BCS` (branch if Carry set) to detect odd, or `BCC` (branch if Carry clear) to detect even.

## Source Code

```text
; Example: Detecting ODD or EVEN using LSR and BCC/BCS

    LDA number      ; Load the number into the accumulator
    LSR A           ; Logical Shift Right: shifts bit 0 into Carry
    BCC is_even     ; Branch if Carry is clear (even number)
    ; Code for handling odd numbers
    JMP continue
is_even:
    ; Code for handling even numbers
continue:
    ; Rest of the program
```

## Key Registers

- **Accumulator (A):** Used for arithmetic operations and data manipulation.
- **Processor Status Register (P):** Contains the Carry flag, which is affected by the LSR instruction.

## References

- "addition_program_using_subroutine" — expands on techniques for subtraction and subroutine organization.

## Mnemonics
- LSR
- BCC
- BCS
