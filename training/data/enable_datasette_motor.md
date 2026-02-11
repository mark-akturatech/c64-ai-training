# Enable Datasette Motor via $01

**Summary:** Enable the C64 datasette motor by clearing bit $20 (bit 5) in the system/processor port $0001; read-modify-write $0001 to turn the motor on. Uses assembly LDA/AND/STA on $01.

## Details
Read the system port at $0001, clear the motor-control mask $20 (bit 5) and store the result back to $0001 to start the datasette motor. The common idiom uses an AND with the mask inverted to clear the bit.

- Motor on: clear bit $20 (bit 5).
- Common immediate: AND #$FF-$20 (i.e. AND #$DF).
- This operates on the processor/system port at $0001 (often referred to as $01).

Short example sequence (read-modify-write):
- Load $01 into A
- AND with the inverted motor mask to clear bit $20
- Store A back to $01

## Source Code
```asm
    lda $01
    and #$ff-$20    ;motor on
    sta $01
```

## Key Registers
- $0001 - Processor/System port - datasette motor control (clear bit $20 / bit 5 to enable motor)

## References
- "read_192_byte_header" — motor must be on to read header data
- "restore_screen_and_turn_off_motor" — turn motor off after loading