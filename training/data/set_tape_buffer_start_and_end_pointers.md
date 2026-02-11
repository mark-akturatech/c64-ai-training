# set the tape buffer start and end pointers ($F7D7)

**Summary:** Assembly routine at $F7D7 that calls helper JSR $F7D0 to obtain the tape buffer start pointer in X/Y, saves the start pointer into $C1/$C2 (I/O address pointer), computes the tape buffer end pointer by adding a fixed length (#$00C0) into $AE/$AF using bytewise ADC with carry, and saves Y to $9F. Uses mnemonics JSR/TXA/STA/CLC/ADC/TYA/RTS and zero page addresses $C1/$C2/$AE/$AF/$9F.

**Operation**
This routine:

- Calls get_tape_buffer_start_pointer (JSR $F7D0). That helper returns the buffer start pointer in X (low) and Y (high).
- Copies X -> A (TXA) and stores A into $C1, making $C1 the I/O start pointer low byte.
- Clears carry (CLC) and adds the fixed buffer length low byte #$C0 to A (ADC #$C0), storing the result into $AE (tape buffer end pointer low byte).
- Loads Y -> A (TYA) and stores A into $C2, making $C2 the I/O start pointer high byte.
- Adds the fixed buffer length high byte #$00 to A (ADC #$00). The carry from the low-byte addition is preserved across TYA, so this ADC propagates any overflow into the high byte, then stores the result into $AF (tape buffer end pointer high byte).
- Stores Y into $9F (STA $9F).
- Returns (RTS).

Behavioral notes:
- The code uses the carry flag to propagate a possible overflow from the low-byte addition into the high byte (standard 16-bit add technique). CLC is explicitly set before the low-byte ADC to avoid an extra carry.
- Fixed buffer length is 0x00C0 (low #$C0, high #$00) — end = start + $00C0.
- The routine saves the high byte of the tape buffer start pointer (Y) into $9F, which is used as a tape buffer index in subsequent operations.

## Source Code
```asm
.,F7D7 20 D0 F7   JSR $F7D0       ; get tape buffer start pointer in X/Y
.,F7DA 8A         TXA             ; copy tape buffer start pointer low byte (X -> A)
.,F7DB 85 C1      STA $C1         ; save as I/O address pointer low byte
.,F7DD 18         CLC             ; clear carry for add
.,F7DE 69 C0      ADC #$C0        ; add buffer length low byte
.,F7E0 85 AE      STA $AE         ; save tape buffer end pointer low byte
.,F7E2 98         TYA             ; copy tape buffer start pointer high byte (Y -> A)
.,F7E3 85 C2      STA $C2         ; save as I/O address pointer high byte
.,F7E5 69 00      ADC #$00        ; add buffer length high byte (propagates carry)
.,F7E7 85 AF      STA $AF         ; save tape buffer end pointer high byte
.,F7E9 85 9F      STA $9F         ; save tape buffer start pointer high byte to $9F
.,F7EB 60         RTS             ; return
```

## Key Registers
- $C1 - Zero Page - I/O address pointer low byte (tape I/O start low)
- $C2 - Zero Page - I/O address pointer high byte (tape I/O start high)
- $AE - Zero Page - Tape buffer end pointer low byte
- $AF - Zero Page - Tape buffer end pointer high byte
- $9F - Zero Page - Tape buffer index

## References
- "get_tape_buffer_start_pointer" — obtains the tape buffer start pointer in X/Y
- "create_tape_header_and_initiate_write" — routine that uses start/end pointers before writing header data

## Labels
- $C1
- $C2
- $AE
- $AF
- $9F
