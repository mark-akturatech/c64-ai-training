# WAIT polling loop and final JMP to ENDCMD ($C194)

**Summary:** 6502 assembly polling loop that repeatedly loads the byte at memory location $0003 into the accumulator and branches back to WAIT if the Negative flag is set, then performs a jump to ENDCMD at $C194. Searchable terms: LDA, BMI, JMP, $0003, $C194, busy-wait, N flag.

**Behavior**

This routine implements a busy-wait loop:

- **LDA $0003**: Loads the byte at memory location $0003 into the accumulator.
- **BMI WAIT**: Branches back to WAIT if the Negative flag (N) is set.
- **JMP $C194**: Jumps to the ENDCMD routine at $C194 once the Negative flag is clear.

The loop continues until the value at $0003 has its most significant bit (bit 7) cleared, indicating a "ready" state.

## Source Code

```asm
; WAIT polling loop and final jump to ENDCMD
WAIT    LDA  $0003
        BMI  WAIT
        JMP  $C194
```

## Key Registers

- **$0003**: Zero Page - Status byte polled by the WAIT loop. The Negative flag is set if bit 7 of this byte is 1.
- **$C194**: ROM - Address of the ENDCMD routine.

## References

- "table_load_id_bytes_loop" — Details the TABLE loop that prepares ID bytes prior to entering the WAIT/poll loop.
- "inline_comments_id_labels" — Provides data/labels for ID table entries referred to by the TABLE loop.