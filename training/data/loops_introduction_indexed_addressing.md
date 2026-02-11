# MACHINE — Loops and Indexed Addressing (HELLO at $034A–$034F)

**Summary:** Demonstrates using indexed addressing (LDA $034A,X) and the X index register to loop over a data string stored at $034A–$034F; shows immediate addressing (#) with an example LDX #$00 and explains the effective address concept (base + X/Y).

**Loops**
The example stores the characters for "HELLO" plus a RETURN as data at addresses $034A–$034F (these bytes are data, not assembled code). To avoid writing one instruction per character, use a loop that reads each character by indexed addressing: specify a fixed base address and let the CPU add the index register (X or Y) to form the effective address.

Key points from the source:
- Initialize the index with an immediate load: LDX #$00 — the '#' indicates an immediate constant (load literal 0 into X, not memory).
- Use indexed addressing to compute the effective address: LDA $034A,X reads from address ($034A + X).
- On the first iteration X = 0, so LDA $034A,X accesses $034A (the 'H'); when X = 1 it accesses $034B (the 'E'), and so on.
- Either X or Y can be used as the index register; the instruction syntax signals indexing with a comma (e.g., LDA $034A,X).
- Characters must be placed in memory as data (not assembled). The program loop must increment X each iteration and stop after the desired count (six characters in this example).

## Source Code
```asm
.A 033C  LDX #$00
.A 033E  LOOP: LDA $034A,X
.A 0341        JSR $FFD2
.A 0344        INX
.A 0345        CPX #$06
.A 0347        BNE LOOP
.A 0349        RTS
.A 034A  .BYTE $48, $45, $4C, $4C, $4F, $0D
```

## References
- "linking_machine_language_with_basic" — combining BASIC and machine language for repeated output
- "loop_implementation_inx_cpx_bne_full_code" — complete loop implementation and control flow examples
