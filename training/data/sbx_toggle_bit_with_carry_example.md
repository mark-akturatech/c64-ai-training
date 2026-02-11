# NMOS 6510: SBX flag trick to toggle one bit each loop and set another depending on carry

**Summary:** Example showing SEC / ROR, TAX, EOR, SBX #$10, LSR, BNE tight loop pattern on NMOS 6510 (undocumented SBX usage). Demonstrates shifting data into the carry, toggling a clock bit with EOR, using TAX to "disarm the AND in SBX", and using SBX to conditionally clear/set a data bit in X while preserving A.

## Example / Description
This loop is useful when you need a clock bit toggled every iteration and a data bit set or cleared depending on the current carry (e.g., serial clock/data output). Key ideas preserved from the source:

- SEC / ROR shifts one bit of a source into the carry (MSB -> C).
- STA databits stores A to the output port (symbolic label "databits").
- A is prepared with a base pattern (here #$3F) where the data bit is initially set.
- Each loop iteration toggles the clock bit in A with EOR #$20.
- TAX moves A into X to "disarm the AND in SBX" (per source wording). That prepares X so the following SBX, if executed, produces the intended X result without destructively changing A.
- BCC tests the carry produced by the earlier ROR. If carry is clear, SBX #$10 is executed to subtract/adjust X (per the source, this unsets the data bit in X).
- After conditional SBX, the code can "do something" with the value now in X while A remains preserved.
- LSR databits shifts the next bit of the source into carry; BNE loops until all bits are shifted out.

The example exploits SBX's behaviour (per the source) that allows adjusting X while preserving A, enabling a compact loop that both toggles a clock bit and sets/clears a data bit based on carry.

Notes preserved from source wording: "move value to X to disarm the AND in SBX" and "exploits SBX's non-destructive behaviour on A for bit/index handling." No additional undocumented internals are asserted beyond that.

## Source Code
```asm
; A contains the data
        SEC
        ROR     ; shift one 1 into the bitpattern, MSB to carry
        STA databits
        LDA #$3F        ; startvalue, data bit must be 1 here
loop:
        EOR #$20        ; toggle clock bit
        ; move value to X to disarm the AND in SBX
        TAX

        ; X = $1F/$3F (data bit set)

        BCC +
        ; substract without carry (unset data bit)
        SBX #$10

        ; X = $0F/$2F

+
        ; do something with the value in X (preserve A!)
        LSR databits     ; shift next bit into the carry, break
        BNE loop

        ; the loop when all bits are shifted out
```

## References
- "sbx_apply_mask_to_index_example" — expands on SBX's non-destructive behaviour on A for bit/index handling
- "sbc_opcode_entry" — related flag behaviours when performing subtract operations

## Mnemonics
- SBX
