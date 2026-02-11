# NMOS 6510 — repeated ARR to shift zeros or ones into A

**Summary:** Demonstrates using the undocumented ARR instruction (ARR — AND+ROR) with SEC or CLC and immediate #$FF on NMOS 6510 to repeatedly shift ones or zeros into the accumulator; shows progressive A values ($80 -> $C0 -> $E0 -> $F0 ... and $7F -> $3F -> $1F -> $0F ...).

## Technique
Because the carry after ARR reflects the state of bit 7 produced by the ARR operation, you can repeatedly execute ARR #$FF while controlling the carry (SEC to shift ones in, CLC to shift zeros in) to propagate ones or zeros into the high bits of A across multiple ARR iterations. The examples below show how A progressively accumulates upper-one bits when SEC is used, and upper-zero bits when CLC is used.

- With SEC before each ARR #$FF, ones are shifted into the high nibble over successive ARR instructions.
- With CLC before each ARR #$FF, zeros are shifted into the high nibble over successive ARR instructions.

(SEC/CLC are the 6502 instructions to set/clear the carry flag.)

## Source Code
```asm
; Shift ones in (initialize A = $80, then repeatedly ARR #$FF with SEC)
LDA #$80
SEC
ARR #$FF      ; -> A = $C0  -> SEC
ARR #$FF      ; -> A = $E0  -> SEC
ARR #$FF      ; -> A = $F0  -> SEC
; ... continues filling upper bits with ones

; Shift zeros in (initialize A = $7F, then repeatedly ARR #$FF with CLC)
LDA #$7F
CLC
ARR #$FF      ; -> A = $3F  -> CLC
ARR #$FF      ; -> A = $1F  -> CLC
ARR #$FF      ; -> A = $0F  -> CLC
; ... continues clearing upper bits to zero
```

## References
- "arr_opcode_flags_and_table" — expands the flag behavior behind repeated ARR
- "arr_load_register_depending_on_carry" — related trick using ARR to move carry state into a register

## Mnemonics
- ARR
