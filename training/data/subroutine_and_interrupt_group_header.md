# 6502: Subroutine and Interrupt Group (JSR, RTS, BRK, RTI, NOP)

**Summary:** Describes 6502 subroutine and interrupt-control instructions JSR ($20), RTS ($60), BRK ($00), RTI ($40), and NOP ($EA): opcodes, bytes, cycles, addressing modes, exact stack behavior (push/pull order and return-address semantics), flags affected, and the IRQ/BRK vector addresses ($FFFE/$FFFF).

**Overview**
This group contains the instructions used to call/return from subroutines (JSR/RTS), invoke a software interrupt (BRK), return from interrupts (RTI), and a do-nothing placeholder (NOP). Key behaviors to remember:
- The 6502 stack is at $0100 + S (S is the 8-bit stack pointer); pushes decrement S after storing, pulls increment S before reading.
- JSR and BRK push return addresses onto the stack; RTS and RTI pull values and resume execution.
- BRK/IRQ use the IRQ/BRK vector at $FFFE/$FFFF (low byte at $FFFE), NMI uses $FFFA/$FFFB, RESET uses $FFFC/$FFFD.
- Push/pull byte order and whether the CPU sets the B (break) bit in the pushed status differ between BRK and hardware interrupts.

**JSR (Jump to Subroutine)**
- Opcode: $20
- Addressing: Absolute
- Length: 3 bytes
- Cycles: 6
- Effect on flags: None
- Stack behavior: Pushes the return address (address of the last byte of the JSR instruction — effectively PC+2) onto the stack as a 16-bit value: high byte pushed first, then low byte.
- Semantics: PC is set to the operand address; use RTS to return.
- Return behavior: RTS will pull the stored return address and increment it (see RTS).

**Example:**

Assume the following code at memory location $1000:

Execution steps:
1. PC is at $1000; JSR $2000 is executed.
2. The return address ($1002) is pushed onto the stack:
   - High byte ($10) is pushed first.
   - Low byte ($02) is pushed next.
3. PC is set to $2000; execution continues at the subroutine.

Stack after JSR:

**RTS (Return from Subroutine)**
- Opcode: $60
- Addressing: Implied
- Length: 1 byte
- Cycles: 6
- Effect on flags: None
- Stack behavior: Pulls two bytes from the stack (low byte first, then high byte) to form a 16-bit value, then increments that value and loads it into PC. Execution resumes at (pulled_address + 1).
- Notes: This increment compensates for the return-address convention used by JSR (JSR pushed PC+2 so RTS +1 yields the next instruction after the original JSR).

**Example:**

Continuing from the previous JSR example, assume the subroutine at $2000 ends with RTS:

Execution steps:
1. RTS is executed at $200X.
2. Low byte ($02) is pulled from the stack.
3. High byte ($10) is pulled from the stack.
4. PC is set to $1002 + 1 = $1003; execution resumes at the instruction following the original JSR.

Stack after RTS:

**BRK (Force Break / Software Interrupt)**
- Opcode: $00
- Addressing: Implied (treated as a 2-byte instruction: BRK + padding byte)
- Length: 1 byte (but the processor advances PC by two when forming the pushed return address)
- Cycles: 7
- Effect on flags: Sets the Interrupt Disable flag (I) in the processor before vector fetch; the pushed copy of the status has the Break (B) bit set.
- Stack behavior:
  - Pushes the return address (PC+2 — address after the BRK padding) onto the stack: high byte pushed first, then low byte.
  - Pushes the status register (P) onto the stack with the B bit set in the pushed value.
- Vector: Loads the new PC from the IRQ/BRK vector at $FFFE/$FFFF (low byte at $FFFE).
- Notes: The B bit in the pushed status is a flag set in the saved copy; the actual P register's B flag behaves differently (B is not a directly stored hardware flag).

**Example:**

Assume the following code at memory location $3000:

Execution steps:
1. PC is at $3000; BRK is executed.
2. The return address ($3002) is pushed onto the stack:
   - High byte ($30) is pushed first.
   - Low byte ($02) is pushed next.
3. The status register is pushed onto the stack with the B bit set.
4. PC is set to the address stored at $FFFE/$FFFF; execution continues at the interrupt handler.

Stack after BRK:

**RTI (Return from Interrupt)**
- Opcode: $40
- Addressing: Implied
- Length: 1 byte
- Cycles: 6
- Effect on flags: Restores the processor status (including I) from the value pulled from the stack.
- Stack behavior: Pulls the status byte from the stack first, then pulls two bytes for PC (low then high) and loads PC with the pulled 16-bit value. Execution resumes at that address.
- Notes: RTI restores flags precisely to the pushed value (including the I flag) and is used to return from BRK, IRQ, and NMI handlers (handlers for BRK/IRQ are entered via vector load, not by RTI itself).

**Example:**

Continuing from the previous BRK example, assume the interrupt handler ends with RTI:

Execution steps:
1. RTI is executed at $400X.
2. Status register is pulled from the stack.
3. Low byte ($02) is pulled from the stack.
4. High byte ($30) is pulled from the stack.
5. PC is set to $3002; execution resumes at the instruction following the original BRK.

Stack after RTI:

**NOP (No Operation)**
- Opcode: $EA
- Addressing: Implied (there are undocumented NOP variants with other opcodes/addressing, not covered here)
- Length: 1 byte
- Cycles: 2
- Effect on flags: None
- Semantics: Does nothing other than consume time/cycles; used for timing padding or alignment.

**Implementation notes (stack & vectors)**
- Stack base: $0100 — effective stack address = $0100 + S
- Push order used by JSR/BRK/IRQ: high byte of return address, then low byte (so RTS/RTI must pull low then high).
- Vector addresses (little-endian, low byte first):
  - IRQ/BRK vector: $FFFE (low), $FFFF (high)
  - NMI vector: $FFFA/$FFFB
  - RESET vector: $FFFC/$FFFD

## Source Code

```
$1000: JSR $2000
$1003: NOP
```

```
Address  Value
$01FE    $10
$01FF    $02
```

```
$2000: ... ; subroutine code
$200X: RTS
```

```
Address  Value
$01FE    (original value)
$01FF    (original value)
```

```
$3000: BRK
$3001: NOP
```

```
Address  Value
$01FD    Status Register with B bit set
$01FE    $30
$01FF    $02
```

```
$4000: ... ; interrupt handler code
$400X: RTI
```

```
Address  Value
$01FD    (original value)
$01FE    (original value)
$01FF    (original value)
```

```assembly
; Example demonstrating JSR and RTS with stack behavior

; Main program
$1000:  JSR $2000      ; Call subroutine at $2000
$1003:  NOP            ; Next instruction after subroutine

; Subroutine
$2000:  ...            ; Subroutine code
$200X:  RTS            ; Return to caller
```

```assembly
; Example demonstrating BRK and RTI with stack behavior

; Main program
$3000:  BRK            ; Software interrupt
$3001:  NOP            ; Instruction after BRK

; Interrupt handler
$4000:  ...            ; Interrupt handler code
$400X:  RTI            ; Return from interrupt
```

## References
- "subroutine_interrupt_instructions" — expanded details for JSR/RTS/BRK/RTI/NOP
- "stack_instructions" — expands on stack operations used by subroutines and interrupts

## Mnemonics
- JSR
- RTS
- BRK
- RTI
- NOP
