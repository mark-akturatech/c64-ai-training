# BASSFT — BASIC warm-start routine ($E37B)

**Summary:** BASIC warm-start (BASSFT) at $E37B in the BASIC ROM, vectored in at BASIC entry. Handles BRK or STOP/RESTORE: closes I/O channels (JSR $FFCC CLRCHN), clears input prompt flag ($0013), calls CLR (JSR $A67A), enables IRQ (CLI), sets X = #$80 and JMPs indirect to the IERROR vector at $0300 to print READY/error; returned A is tested (TXA / BMI) to select READY or the generic error printer.

## Description
This routine is the BASIC warm-start entry point (BASSFT). Typical callers are the 6510 BRK handling path or the STOP/RESTORE key handler. Behavior in order:

- JSR $FFCC — call CLRCHN to close all open I/O channels.
- LDA #$00 / STA $13 — clear the input-prompt flag at zero page $0013.
- JSR $A67A — call CLR (BASIC clear routine).
- CLI — enable IRQs.
- LDX #$80 — place the warm-start error/READY selector value in X (#$80).
- JMP ($0300) — indirect jump through the IERROR vector at $0300 to perform the error/READY output sequence.
- Execution returns with the error number in A; TXA moves X into A and BMI is used to test if the returned code indicates only READY should be shown (branch on negative = >= $80). If not, it jumps to the generic error-print routine.

Control-flow targets referenced:
- CLRCHN ($FFCC) — close channels
- CLR ($A67A) — clear BASIC workspace
- IERROR vector ($0300) — used to invoke the error/READY printing code
- Error printer ($A43A) and READY printer ($A474) — selected after return

## Source Code
```asm
                                *** BASSFT: BASIC WARM START
                                This is the BASIC warm start routine that is vectored at
                                the very start of the BASIC ROM. The routine is called by
                                the 6510 BRK instruction, or STOP/RESTORE being pressed.
                                It outputs the READY prompt via the IERROR vector at
                                $0300. If the error code, in (X) is larger than $80, then
                                only the READY text will be displayed.
.,E37B 20 CC FF JSR $FFCC       ; CLRCHN, close all I/O channels
.,E37E A9 00    LDA #$00
.,E380 85 13    STA $13         ; input prompt flag
.,E382 20 7A A6 JSR $A67A       ; do CLR
.,E385 58       CLI             ; enable IRQ
.,E386 A2 80    LDX #$80        ; error code #$80
.,E388 6C 00 03 JMP ($0300)     ; perform error via IERROR vector
.,E38B 8A       TXA             ; move X->A (error number)
.,E38C 30 03    BMI $E391       ; if >= $80 branch to READY
.,E38E 4C 3A A4 JMP $A43A       ; else print error (generic printer)
.,E391 4C 74 A4 JMP $A474       ; print READY
```

## Key Registers
- $0013 - Zero page - input prompt flag (cleared by BASSFT)
- $0300 - RAM/Vector - IERROR vector (indirect JMP target used to perform error/READY output)

## References
- "init_cold_start" — expands on the BASIC cold start sequence that follows warm start
- "initcz_initialize_basic_ram" — expands on zero-page variables and vectors set up during cold init referenced by warm-start behavior

## Labels
- BASSFT
- IERROR
