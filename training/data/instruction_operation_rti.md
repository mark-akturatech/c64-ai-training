# RTI (Return from Interrupt) — pseudocode: pull SR then PC low/high

**Summary:** RTI pops the processor status (SR/P) from the stack then pops the return address low and high bytes to restore the program counter (PC). Keywords: RTI, PULL, SET_SR, stack, PC, processor status.

## Operation
RTI restores the CPU state saved on the stack by an interrupt entry. The sequence in the pseudocode is:

1. Pull one byte from the hardware stack and write it into the processor status register (SET_SR). (PULL = pop byte from stack; SET_SR = write byte to status register.)
2. Pull the low byte of the return address from the stack.
3. Pull the high byte of the return address from the stack, combine the two bytes into a 16-bit address, and load that into PC.

The order is important: status is restored first, then PCL (low), then PCH (high). After RTI finishes, execution resumes at the restored PC with the restored processor status.

## Source Code
```asm
/* RTI */
    src = PULL();
    SET_SR(src);
    src = PULL();
    src |= (PULL() << 8);	/* Load return address from stack. */
    PC = (src);
```

## References
- "instruction_tables_rti" — expands on the RTI opcode and related instruction table entries.

## Mnemonics
- RTI
