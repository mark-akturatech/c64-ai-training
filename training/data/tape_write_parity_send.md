# ROM $FC4E-$FC54 — Set parity and store tape write byte (KERNAL)

**Summary:** Toggles the parity bit stored in $009B and writes the result into the tape write byte variable $00BD so the parity bit will be transmitted on the next tape bit cycle; then jumps to $FEBC to restore registers and exit the interrupt. Searchable terms: $009B, $00BD, parity, tape write, $FEBC, ROM $FC4E.

## Description
This small KERNAL routine runs at the end of a byte transmission to prepare the parity bit for the next outgoing bit cycles. It:
- Loads the parity flip state from zero page $009B,
- XORs it with #$01 to toggle the parity,
- Stores the resulting parity bit byte into the tape write byte variable $00BD so the tape ISR will output it next,
- Jumps to $FEBC to restore registers and exit the interrupt.

The routine is the final step after a byte's data bits have been shifted out; the parity bit follows and is prepared here.

## Source Code
```asm
        ; set parity as next bit and exit interrupt
.,FC4E  A5 9B     LDA $9B         ; get parity bit
.,FC50  49 01     EOR #$01        ; toggle it
.,FC52  85 BD     STA $BD         ; save as tape write byte
.,FC54  4C BC FE  JMP $FEBC       ; restore registers and exit interrupt
```

## Key Registers
- $009B - Zero Page - parity flip/state used by tape output routine
- $00BD - Zero Page - tape write byte (next bit to be transmitted by tape ISR)

## References
- "tape_write_shift_count_and_new_byte_setup" — handles the next step when a byte's data bits are exhausted and the parity bit is sent next

## Labels
- $009B
- $00BD
