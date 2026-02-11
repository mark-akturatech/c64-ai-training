# RS-232: get byte from receive circular buffer (ROM $F086–$F0A3)

**Summary:** Returns one byte from the RS-232 receive circular buffer by inspecting RS-232 status ($0297) and Rx indices ($029C/$029B). Clears/sets the Rx-empty bit (bit 3 / $08), reads via zero-page pointer ($00F7), increments the start index, and returns $00 if buffer empty.

## Description
This ROM routine implements a single-byte dequeue from the RS-232 receive circular buffer:

- Load the RS-232 status byte from $0297 and the Rx-buffer start index into Y from $029C.
- Compare Y (start) to the Rx-buffer end index at $029B; if equal the buffer is empty:
  - Set the Rx-empty flag (ORA #$08) in the status byte, store it back to $0297, return $00.
- If not empty:
  - Clear the Rx-empty flag by AND #$F7 (clears bit 3, mask $08), store status back to $0297.
  - Read one byte from the Rx buffer using the zero-page 16-bit pointer at $00F7/$00F8 with indexed indirect addressing LDA ($F7),Y.
  - Increment the start index at $029C (INC $029C).
  - Return with the byte in A.

Notes:
- The Rx-empty flag is bit 3 ($08) of the status byte at $0297 (cleared by AND #$F7, set by ORA #$08).
- The routine uses zero-page indirect addressing via ($F7),Y — the 16-bit base pointer for the circular buffer is stored at zero page $00F7/$00F8.
- Equality of start and end indices ($029C == $029B) is used to indicate an empty buffer.

## Source Code
```asm
        ;*** get byte from RS232 buffer
.,F086 AD 97 02    LDA $0297        ; get the RS232 status register
.,F089 AC 9C 02    LDY $029C        ; get index to Rx buffer start
.,F08C CC 9B 02    CPY $029B        ; compare with index to Rx buffer end
.,F08F F0 0B       BEQ $F09C        ; return null if buffer empty
.,F091 29 F7       AND #$F7         ; clear the Rx buffer empty bit
.,F093 8D 97 02    STA $0297        ; save the RS232 status register
.,F096 B1 F7       LDA ($F7),Y      ; get byte from Rx buffer
.,F098 EE 9C 02    INC $029C        ; increment index to Rx buffer start
.,F09B 60          RTS
.,F09C 09 08       ORA #$08         ; set the Rx buffer empty bit
.,F09E 8D 97 02    STA $0297        ; save the RS232 status register
.,F0A1 A9 00       LDA #$00         ; return null
.,F0A3 60          RTS
```

## Key Registers
- $0297 - RS-232 status - bit 3 = Rx-empty flag ($08). Read-modify-write to clear/set empty flag.
- $029C - RS-232 Rx buffer start index - compared against $029B to detect empty; incremented after dequeue.
- $029B - RS-232 Rx buffer end index - compared against start index to detect empty.
- $00F7-$00F8 - Zero page - 16-bit pointer to Rx circular buffer base (used by LDA ($F7),Y).

## References
- "rs232_input_highlevel_handshake_and_interrupt_control" — expands on when higher-level checks permit receiving
- "rs232_device_input_handling_loop" — expands on the consumer loop that calls this routine when getting device input