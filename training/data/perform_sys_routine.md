# SYS statement entry (BASIC ROM)

**Summary:** Entry code for the BASIC SYS statement (6502): evaluates the numeric expression (JSR $AD8A), converts FAC_1 to an integer (JSR $B7F7), pushes a synthetic return address and saved status onto the stack, restores processor status (PLP) and JMPs indirectly via the machine-code SYS vector at $0014 ($0014/$0015). On return, the routine saves returned A/X/Y and status into $030C-$030F and RTS.

## Operation
This routine implements the BASIC SYS call that transfers control from BASIC to a machine-language address:

- JSR $AD8A — Evaluate the SYS expression (ensures numeric or triggers "type mismatch").
- JSR $B7F7 — Convert FAC_1 (BASIC floating accumulator) to an integer held in a temporary integer (prepares the machine address argument).
- LDA #$E1 / PHA ; LDA #$46 / PHA — Push a crafted return address onto the stack (two bytes pushed). This forms a synthetic return so that the machine code invoked by SYS will RTS back into BASIC at the expected location.
- LDA $030F / PHA — Push the saved processor status byte (from BASIC work area) onto the stack so it can be restored after the machine code returns.
- LDA $030C ; LDX $030D ; LDY $030E — Load saved BASIC A/X/Y into the registers (these become the register state visible to the machine code).
- PLP — Pull processor status from stack (restores flags to the saved status); now registers and flags are set for the machine code call.
- JMP ($0014) — Indirect JMP through the SYS vector at $0014/$0015 to the machine-code address prepared by FAC_1 conversion (the system vector contains the low/high bytes of the target).
- (tail end of SYS code — when the machine code executes RTS, it returns to the synthetic return address pushed earlier)
- PHP — Push the current processor status onto the stack for temporary storage.
- STA $030C ; STX $030D ; STY $030E — Store returned A/X/Y into BASIC work area ($030C-$030E).
- PLA — Pull previously saved processor status from the stack (restore the status byte pushed before calling the SYS-return tail).
- STA $030F — Save the restored status byte back into $030F (BASIC work area).
- RTS — Return to BASIC.

Notes:
- FAC_1 is the BASIC floating accumulator (converted to integer by $B7F7).
- JMP ($0014) reads a 16-bit pointer at $0014/$0015 (SYS vector) and jumps there.
- The routine pushes a synthetic return address and status so that control can be resumed cleanly in BASIC after the invoked machine code performs an RTS.

## Source Code
```asm
; perform SYS
.,E12A 20 8A AD JSR $AD8A       ; evaluate expression and check is numeric, else do type mismatch
.,E12D 20 F7 B7 JSR $B7F7       ; convert FAC_1 to integer in temporary integer
.,E130 A9 E1    LDA #$E1        ; get return address high byte
.,E132 48       PHA             ; push as return address
.,E133 A9 46    LDA #$46        ; get return address low byte
.,E135 48       PHA             ; push as return address
.,E136 AD 0F 03 LDA $030F       ; get saved status register
.,E139 48       PHA             ; put on stack
.,E13A AD 0C 03 LDA $030C       ; get saved A
.,E13D AE 0D 03 LDX $030D       ; get saved X
.,E140 AC 0E 03 LDY $030E       ; get saved Y
.,E143 28       PLP             ; pull processor status
.,E144 6C 14 00 JMP ($0014)     ; call SYS address
                                ; tail end of SYS code
.,E147 08       PHP             ; save status
.,E148 8D 0C 03 STA $030C       ; save returned A
.,E14B 8E 0D 03 STX $030D       ; save returned X
.,E14E 8C 0E 03 STY $030E       ; save returned Y
.,E151 68       PLA             ; restore saved status
.,E152 8D 0F 03 STA $030F       ; save status
.,E155 60       RTS
```

## Key Registers
- $0014-$0015 - System vector (JMP indirect) — machine-code SYS vector used by JMP ($0014)
- $030C-$030F - BASIC work area — saved/returned A ($030C), X ($030D), Y ($030E), status ($030F)

## References
- "perform_save_routine" — expands on SAVE/LOAD/VERIFY file operations called elsewhere in BASIC I/O
- "set_filename_routine" — expands on SYS interaction with file I/O filename routines used by LOAD/SAVE/OPEN