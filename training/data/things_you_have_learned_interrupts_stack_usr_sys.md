# MACHINE: Stack, Calls, Interrupts, USR/SYS, IA chips, and CHRGET

**Summary:** Describes the 6502 hardware stack at $0100-$01FF (LIFO), push/pull instruction pairs (PHA/PLA, PHP/PLP), JSR/RTS stack mechanics (JSR stores return address minus one), CPU interrupt/BRK behavior (three-byte push and RTI restore), ROM interrupt sequences that push A/X/Y and branch via an indirect address (user-modifiable), the difference between USR and SYS in BASIC, IA chips (PIA/VIA/CIA) roles, and CHRGET as a BASIC-interpreter wedge entry point.

## Stack location and LIFO behavior
The 6502 hardware stack resides on page 1 from $01FF downward to $0100 (stack pointer decrements on push). It is LIFO: the last value pushed is the first pulled. The stack is intended for temporary storage and return addresses; improper balancing of pushes and pulls commonly causes fatal program errors.

## Matching pushes and pulls
Always ensure that every push has a matching pull and that control-flow changes (branches/jumps/RTS/RTI) do not omit expected stack activity. A subroutine or interrupt that assumes saved values are present will fail if earlier code skipped a pull or left extra pushes.

## Push/pull instructions (PHA/PLA, PHP/PLP)
- PHA: push accumulator A to the stack.
- PLA: pull from stack into A.
- PHP: push processor status register (SR) to the stack.
- PLP: pull SR from the stack.
Use PHA/PLA for temporary saves of A; use PHP/PLP for saving/restoring status across operations (deferred decisions). Always restore SR to the exact state expected by calling code.

## JSR and RTS stack mechanics
- JSR pushes a return address (the address of the last byte of the JSR operand minus one, i.e. "return address minus 1") onto the stack and transfers control to the subroutine.
- RTS pulls the stored return address from the stack and returns to the instruction following the caller's JSR.
Because JSR/RTS handle the push/pull automatically, you can use them without explicit stack management — provided intervening code and interrupts preserve stack balance.

## Interrupts, BRK and RTI
- A CPU interrupt (including BRK) results in a three-byte push to the stack (the interrupt-supplied values) and a transfer to the interrupt vector/handler; RTI restores those pushed items so the interrupted program can resume.
- Note: Commodore ROMs augment the hardware interrupt handling: the ROM interrupt entry sequences often push A, X, and Y (register saves) and then branch through an indirect address that the user can modify. Because interrupts are active frequently, this ROM entry/indirect-branch pattern can be used to run code even when no BASIC program is executing.

## USR vs SYS (BASIC)
- USR is a BASIC function: it calls a preset address (via the USR vector), accepts a numeric argument, and can return a numeric value.
- SYS is a BASIC command (similar usage in practice). Both are used to invoke machine-code routines from BASIC, but USR is treated conceptually as a function returning a value.

## IA chips (PIA, VIA, CIA) and their functions
The PIA/VIA/CIA family (general term "IA chips") handle multiple I/O and timing roles:
- Latching input/output ports and recording events in flags
- Generating and controlling interrupts
- Providing timers and event scheduling
For detailed programming and timing behavior consult the specific chip datasheet (chip-specific registers and timing are complex and chip-dependent).

## CHRGET and BASIC interpreter extension
The BASIC interpreter frequently calls a ROM subroutine named CHRGET to obtain characters/lexemes while parsing. Modifying or intercepting CHRGET is a common entry point ("wedge") for extending or altering BASIC behavior (inserting new keywords, altering tokenization, etc.).

## Key Registers
- $0100-$01FF - 6502 - Hardware stack page (SP operates here; stack grows downward)

## References
- "interrupt_project_example" — expands on Example that used IRQ vector modification  
- "infiltrating_basic_wedge_intro_and_CHRGET_location" — expands on CHRGET as wedge entry point

## Labels
- CHRGET

## Mnemonics
- PHA
- PLA
- PHP
- PLP
- JSR
- RTS
- RTI
- BRK
