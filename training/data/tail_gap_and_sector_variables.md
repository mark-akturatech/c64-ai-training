# Initialize disk variables at $0620 / $0626 / $0628

**Summary:** This routine initializes memory locations $0620, $0626, and $0628, which are used for disk operations. It stores the accumulator's value into $0620, loads an immediate value into $0626, and clears $0628.

**Description**

This initialization sequence sets up three memory locations used by the disk-image builder/driver routine:

- `STA $0620` — Stores the current accumulator value into $0620.
- `LDA #$0A ; STA $0626` — Loads the immediate value $0A into the accumulator and stores it into $0626.
- `LDA #$00 ; STA $0628` — Clears the memory location $0628 by loading $00 into the accumulator and storing it there.

These variables are used for tail/gap and sector tracking when creating or emitting disk sectors/headers.

## Source Code

```asm
; Assembly code to initialize disk variables
; Assumes A is preloaded with the desired value for $0620
STA $0620        ; Store A into $0620
LDA #$0A         ; Load immediate value $0A
STA $0626        ; Store it into $0626
LDA #$00         ; Load immediate value $00
STA $0628        ; Store it into $0628
```

## References

- "initialization_code_and_zero_page_setup" — Expands on zero-page and register initialization performed earlier.
- "sector_counter_and_headers_intro" — Expands on sector counter, LED control, and header creation setup.
