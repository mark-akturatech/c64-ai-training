# get_byte — Minimal datasette byte reader (uses get_pulse, canary bit)

**Summary:** `get_byte` waits for a byte marker (using `get_pulse` and `threshold_medium_long`), detects end-of-data if the marker's second pulse is short, then reads 8 data bits by calling `get_pulse` twice per bit and assembling bits with `ROR` using a canary-bit sentinel. Uses instructions: `JSR`, `CMP`, `BCS`, `LDA`, `PHA`, `PLA`, `ROR`, `RTS`.

**Description**
This routine reads a single byte from the tape stream using a lower-level `get_pulse` routine for pulse classification.

High-level behavior:
- Wait for a "byte marker" by calling `get_pulse` and testing the returned pulse length against `threshold_medium_long` (via `CMP #$ff-threshold_medium_long` and `BCS`).
  - If the first pulse is not "long", loop and wait again.
- Call `get_pulse` a second time to classify the marker's second pulse:
  - If that second pulse is "short" (`BCS` taken), this indicates end-of-data and the routine returns.
  - Otherwise, proceed to read 8 data bits.
- To read 8 bits:
  - The routine initializes the shift/canary pattern with `A = #%01111111` (MSB=0, other bits=1). The MSB of this pattern acts as a canary sentinel that will be observed via the carry after `ROR` to detect loop termination.
  - For each bit: push the current shift byte (`PHA`), call `get_pulse` twice (first pulse ignored, second contains bit timing), pull the shift byte (`PLA`), `ROR` to shift the new bit into the carry/bit-0 position; `BCS` loops while the canary bit has not yet reached the carry (i.e., until the sentinel indicates 8 bits read).
- Returns with `RTS`. If the marker indicates end-of-data, `RTS` is taken early.

Notes:
- `get_pulse` is expected to return a pulse-length classification in `A` (compare against `threshold_medium_long`). The implementation and exact return values are in the referenced `get_pulse` routine.
- The canary technique (initial `%01111111`) provides a 1-bit-wide sentinel so the loop can count exactly 8 `ROR` shifts without an explicit counter (MSB=0 moves through the shifts until carry signals completion).

## Source Code
```asm
get_byte:
; wait for byte marker
    jsr get_pulse
    cmp #$ff-threshold_medium_long
    bcs get_byte    ;not long
    jsr get_pulse
    bcs b2          ;short = end of data
; get 8 bits
    lda #%01111111
b1: pha
    jsr get_pulse   ;ignore first
    jsr get_pulse
    pla
    ror             ;shift in bit
    bcs b1          ;until canary bit
b2: rts
```

## References
- "get_pulse_routine" — expands on and implements `get_pulse` used for pulse classification
- "canary_bit_technique" — explains the sentinel/canary method used to detect completion of bit shifting
- "data_block_reading" — shows how `get_byte` is used to read bytes into memory and assemble data blocks
