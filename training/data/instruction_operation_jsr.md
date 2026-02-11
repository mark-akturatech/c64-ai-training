# 6502 JSR (Jump to Subroutine)

**Summary:** Describes the 6502 JSR instruction semantics: decrementing PC, pushing the return address (high then low) to the hardware stack (page $0100 + SP), and setting PC to the subroutine target. Includes pseudocode and example opcode ($20, absolute).

## Description
JSR (Jump to Subroutine, opcode $20 absolute) transfers control to a 16-bit target address while saving a return address on the stack. The saved return address is the address of the last byte of the JSR instruction (i.e., PC-1) so that an RTS (which pulls the address and then increments it) returns to the instruction following the JSR.

Key behaviors:
- PC at the time of pushing points to the next instruction after JSR operand; the implementation does PC-- to produce PC-1 (the address pushed).
- The 6502 pushes the high byte first, then the low byte.
- The stack resides at $0100+$SP; the stack grows downward (SP is decremented on each push).
- RTS (return) pulls low then high, forms the 16-bit address, then increments it before loading into PC — hence the JSR convention of pushing PC-1.

Sequence summary:
1. Fetch 2-byte absolute operand (low, high).
2. Compute return_address = PC - 1 (PC currently points to next instruction).
3. PUSH high(return_address)
4. PUSH low(return_address)
5. PC := target_address (operand)

## Source Code
```asm
; Pseudocode / reference implementation of JSR behavior
; Assume: PC is 16-bit program counter, PUSH(x) stores a byte on the 6502 stack
; (stack memory at $0100 + SP; push writes then decrements SP)

    ; JSR operand has already been fetched into 'src' (16-bit target)
    PC = PC_after_operand   ; PC already points to next instruction
    PC = PC - 1             ; push return address = PC - 1
    PUSH((PC >> 8) & $FF)   ; push high byte of return address
    PUSH(PC & $FF)          ; push low byte
    PC = src                ; set PC to target address

; Assembly example (absolute addressing, opcode $20):
        .org $1000
        JSR $2000        ; bytes: $20 $00 $20
; When executed from $1000:
; - After operand fetch PC = $1003
; - JSR pushes $1002 (high then low) onto stack
; - PC set to $2000
```

## References
- "instruction_tables_jsr" — expands on JSR opcode, addressing, and stack semantics.

## Mnemonics
- JSR
