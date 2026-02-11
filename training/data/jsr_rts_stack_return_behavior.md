# JSR and RTS (6502)

**Summary:** Exact 6502 behavior for JSR/RTS: JSR pushes the return address minus one onto the stack as two bytes (high byte first), and RTS pulls those two bytes, adds one, and resumes at the resulting address+1. Searchable terms: JSR, RTS, stack, return address minus one, high byte first, PC.

## Behavior
JSR (Jump to SubRoutine)
- When a JSR instruction executes, the processor calculates the return address (the address of the next instruction after the JSR) and subtracts one from it.
- The CPU then pushes that adjusted return address onto the stack as two bytes: the high-order byte is pushed first, then the low-order byte.
- After pushing the two bytes, execution continues at the JSR target address (the subroutine).

RTS (ReTurn from Subroutine)
- When an RTS executes, the CPU pulls two bytes from the stack: the low-order byte is pulled first (it was pushed last), then the high-order byte.
- Those two bytes are combined to form an address; the CPU adds one to that address and resumes execution at the resulting address.
- Effectively, because JSR pushed (return_address - 1) and RTS adds 1, execution continues at the original return_address.

Stack inspection
- The caller's return address (minus one) is present on the stack while the subroutine runs; examining the two bytes on the stack yields the caller's address (add one after combining the bytes to get the actual return point).

Example (addresses in hex)
- If a JSR at $0352 calls $033C, the instruction after the JSR is at $0355. The CPU pushes $0354 (i.e., $0355 - 1) onto the stack: high byte $03 is pushed first, then low byte $54. Within the subroutine an RTS will pull $54 then $03, form $0354, add one, and return to $0355.

## Source Code
```asm
.,0352  20 3C 03    JSR $033C        ; machine code bytes: opcode $20, low-byte $3C, high-byte $03
; After this JSR executes:
;   return address = $0355
;   pushed value = $0354  (return - 1)
; Stack push order (top grows downward):
;   push high byte $03
;   push low byte  $54
; On the stack (top first): $54, $03
.,033C  ; subroutine at $033C begins
.; ... subroutine code ...
.,03xx  60          RTS               ; RTS pops $54 then $03 -> forms $0354 ; +1 -> resume at $0355
```

```text
Stack snapshot (example; top shown first)
Top -> $54   ; low byte (pushed last, popped first)
       $03   ; high byte (pushed first, popped second)
Combine popped bytes: $03<<8 | $54 = $0354
RTS adds 1 -> $0355 (actual return address)
```

## References
- "manipulating_stack_for_control_flow" — expands on using fake return addresses to achieve JMP-like behavior via RTS

## Mnemonics
- JSR
- RTS
