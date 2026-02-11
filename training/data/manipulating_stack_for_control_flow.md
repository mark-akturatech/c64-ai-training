# Using the stack for control flow (fake return address / table-driven dispatch)

**Summary:** Technique for using 6502 stack manipulation (PHA/PLA and RTS) to perform a JMP-like indirect transfer by pushing a two-byte "fake return address" (low then high) and executing RTS; useful for table-driven dispatch (LDA TABLE1,X / TABLE2,X / PHA; RTS). Keywords: RTS, PHA, LDA, fake return address, table-driven dispatch, 6502 stack.

## Mechanism
RTS on the 6502 pulls two bytes from the stack (low byte first, then high byte), forms a 16-bit address, then increments that address by one and sets the program counter to the result. To make RTS transfer control to an arbitrary address you must place (target-1) on the stack in little-endian order: push the low byte first, then the high byte.

- Order on stack: PHA (push low), PHA (push high). The last PHA becomes the top of stack and is pulled first by RTS (as the low byte).
- RTS behavior (concise): pull low, pull high, PC := (high<<8 | low) + 1.
- Therefore, to reach JMP $2469 with RTS you must have $2468 on the stack (low=$68, high=$24), pushed as low then high.

This allows indirect transfers whose targets depend on runtime values (e.g., X index selecting table entries) without using JSR/JMP/branch opcodes.

## Example: direct fake-JMP
- Intended effect: JMP $2469
- Required stack contents before RTS: low=$68, high=$24 (i.e., $2468 so RTS increments to $2469)
- Push sequence: push low first, then high

## Example: table-driven dispatch
- Put low/high pairs in two byte tables (TABLE1 contains low bytes, TABLE2 contains high bytes).
- Load index X to choose an entry, push the two bytes for that entry (low then high), then RTS to jump to the selected target.

## Source Code
```asm
; Direct fake-JMP example: makes RTS transfer to $2469
    LDA #$24
    PHA         ; push low byte? (we push low first: see ordering below)
    LDA #$68
    PHA         ; push high byte
    RTS         ; pulls $68 (low), $24 (high) -> forms $2468; RTS adds 1 -> $2469

; Table-driven dispatch example (TABLE1 = low bytes, TABLE2 = high bytes)
    LDX #<index>    ; X selects entry
    LDA TABLE1,X
    PHA             ; push low byte of target (push low first)
    LDA TABLE2,X
    PHA             ; push high byte of target
    RTS             ; jump to selected target (word on stack + 1)

; Example table layout (little-endian pairs across two tables)
TABLE1: .byte $69, $90, $20   ; low bytes for targets $2469, $2490, $2020 ...
TABLE2: .byte $24, $24, $20   ; high bytes
```

## References
- "jsr_rts_stack_return_behavior" — stack contents expected by RTS (details of push/pop order and return address increment)

## Mnemonics
- RTS
- PHA
