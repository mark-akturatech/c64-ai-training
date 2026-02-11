# 6502: Subroutine and Interrupt Instructions (JSR/RTS/BRK/RTI/NOP)

**Summary:** Encodings and brief behavior for 6502 subroutine and interrupt instructions: JSR ($20, 3 bytes), RTS ($60, 1 byte), BRK ($00, 1 byte) which sets B and I flags, RTI ($40, 1 byte) which restores processor flags, and NOP ($EA, 1 byte). Mentions use of stack operations (PHA/PLA/PHP/PLP) with interrupts/subroutines.

## Instruction Summary
This chunk lists the common control-transfer and interrupt-related opcodes on the 6502 and their immediate effects as given in the source.

- JSR (Jump to Subroutine) — Absolute addressing, opcode $20, 3 bytes. Transfers control to a subroutine; return uses RTS. (Pushes a return address onto the stack.)
- RTS (Return from Subroutine) — Implied, opcode $60, 1 byte. Returns from a JSR by pulling the return address from the stack.
- BRK (Force an Interrupt) — Implied, opcode $00, 1 byte. Causes a software interrupt; sets B and I flags (B: break flag, I: interrupt disable).
- RTI (Return from Interrupt) — Implied, opcode $40, 1 byte. Returns from an interrupt and restores processor status flags and the return address from the stack.
- NOP (No Operation) — Implied, opcode $EA, 1 byte. Does nothing other than consume cycles.

Note: Stack manipulation instructions (PHA/PLA/PHP/PLP) are commonly used around interrupts and subroutine calls to save/restore registers and status on the stack.

## Source Code
```text
JSR	Jump to a subroutine 	Absolute	JSR $aaaa	$20	3	none
RTS	Return from subroutine 	Implied	RTS	$60	1	none
BRK	Force an interrupt	Implied	BRK	$00	1	B, I
RTI	Return from Interrupt	Implied	RTI	$40	1	All
NOP	No Operation 	Implied	NOP	$EA	1	none

JSR	Jump to a subroutine 	Absolute	JSR $aaaa	$20	3	none
RTS	Return from subroutine 	Implied	RTS	$60	1	none
BRK	Force an interrupt	Implied	BRK	$00	1	B, I
RTI	Return from Interrupt	Implied	RTI	$40	1	All
NOP	No Operation 	Implied	NOP	$EA	1	none

Additional information can be found by searching:
- "stack_instructions" which expands on stack operations used by RTI/RTS
- "status_flag_instructions" which expands on BRK/RTI interact with processor status flags
```

## References
- "stack_instructions" — expands on stack operations used by RTI/RTS
- "status_flag_instructions" — expands on BRK/RTI interaction with processor status flags

## Mnemonics
- JSR
- RTS
- BRK
- RTI
- NOP
