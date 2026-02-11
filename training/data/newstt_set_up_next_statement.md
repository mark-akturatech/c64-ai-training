# ********* - NEWSTT ($A7AE) — Set Up Next Statement for Execution

**Summary:** Routine NEWSTT at $A7AE (42926) tests the STOP key (RUN/STOP break), updates the pointer to the current BASIC line number, and positions the BASIC text pointer to the start of the next statement so statement parsing/execution can continue.

**Description**
NEWSTT performs three primary tasks used by the BASIC interpreter:
- Check for the STOP key (RUN/STOP) to detect user break requests.
- Update the interpreter's pointer to the current line number (synchronizing the "current line" state).
- Position the BASIC text pointer to the beginning of the next statement so the next statement can be read and dispatched by the interpreter.

This routine is a control-flow helper invoked during statement dispatch/read-execute cycles; it does not include the actual statement execution logic (see referenced chunks for dispatch and break-handling behavior).

## Source Code
```assembly
A7AE  20 2C A8   JSR $A82C      ; Check for STOP key (RUN/STOP)
A7B1  A5 7A      LDA $7A        ; Load TXTPTR low byte
A7B3  A4 7B      LDY $7B        ; Load TXTPTR high byte
A7B5  C0 02      CPY #$02       ; Compare high byte with $02 (direct mode check)
A7B7  EA         NOP            ; No operation
A7B8  F0 04      BEQ $A7BE      ; If in direct mode, skip saving OLDTXT
A7BA  85 3D      STA $3D        ; Save TXTPTR low byte to OLDTXT
A7BC  84 3E      STY $3E        ; Save TXTPTR high byte to OLDTXT
A7BE  A0 00      LDY #$00       ; Initialize Y register to 0
A7C0  B1 7A      LDA ($7A),Y    ; Load byte at TXTPTR
A7C2  D0 43      BNE $A807      ; If not end of line, process statement
A7C4  A0 02      LDY #$02       ; Set Y to 2
A7C6  B1 7A      LDA ($7A),Y    ; Load line number low byte
A7C8  18         CLC            ; Clear carry flag
A7C9  D0 03      BNE $A7CE      ; If line number is not zero, continue
A7CB  4C 4B A8   JMP $A84B      ; Jump to immediate mode handler
A7CE  C8         INY            ; Increment Y
A7CF  B1 7A      LDA ($7A),Y    ; Load line number low byte
A7D1  85 39      STA $39        ; Store in CURLIN low byte
A7D3  C8         INY            ; Increment Y
A7D4  B1 7A      LDA ($7A),Y    ; Load line number high byte
A7D6  85 3A      STA $3A        ; Store in CURLIN high byte
A7D8  98         TYA            ; Transfer Y to A
A7D9  65 7A      ADC $7A        ; Add TXTPTR low byte
A7DB  85 7A      STA $7A        ; Store back to TXTPTR low byte
A7DD  90 02      BCC $A7E1      ; If no carry, skip incrementing TXTPTR high byte
A7DF  E6 7B      INC $7B        ; Increment TXTPTR high byte
A7E1  6C 08 03   JMP ($0308)    ; Jump to next statement execution
```

## Key Registers
- **TXTPTR ($7A-$7B):** Pointer to the current position in the BASIC program text.
- **CURLIN ($39-$3A):** Stores the current BASIC line number being executed.
- **OLDTXT ($3D-$3E):** Pointer to the last executed statement, used for CONT command.

## References
- "stop_key_break_test" — expands on STOP key checking and break handling  
- "gone_read_execute_next_statement" — expands on statement dispatch after NEWSTT positions text pointer

## Labels
- TXTPTR
- CURLIN
- OLDTXT
