# Assembler directives, origin, and initial CPU/register setup

**Summary:** This fragment demonstrates assembler directives (`.OPT`, origin `*= $0500`), initializes zero-page drive pointers/flags (`LDA #$04 / STA $31`), increments a pointer/checksum byte at `$3A`, and calls GCR conversion routines (`JSR $F78F` and `JSR $F510`).

**Description**

This boot/utility fragment:

- Sets an assembler option (`.OPT P,02`) and defines the code origin at `$0500`.
- Initializes a drive-related zero-page pointer/flag by loading immediate `#$04` and storing it to `$31`.
- Increments the byte at zero-page `$3A` by loading it, transferring to X, incrementing X, transferring back to A, and storing it back to `$3A`.
- Calls two ROM subroutines at `$F78F` and `$F510` related to GCR conversion and data preparation for drive transfer.

## Source Code

```asm
    ; Assembler directives, origin, and initial CPU/register setup
    .OPT P,02         ; Set assembler option
    *= $0500          ; Set origin to $0500

    LDA #$04          ; Initialize drive-related pointer/flag
    STA $31

    LDA $3A           ; Load pointer/checksum low byte
    TAX
    INX               ; Increment X
    TXA
    STA $3A           ; Store incremented value back

    JSR $F78F         ; GCR conversion routine (prepare data)
    JSR $F510         ; Continue GCR/drive-prep
```

## References

- "source_listing_header_and_basic_boot" — expands on BASIC bootstrap that jumps here
- "find_header_and_wait_gap" — expands on next: waits for header/gap after GCR conversion
