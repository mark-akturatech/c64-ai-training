# RS-232: store received byte into Rx circular buffer and update status/errors

**Summary:** This routine processes a fully received RS-232 byte by storing it into the receive (Rx) circular buffer, updating the Rx end pointer ($029B), and handling status and error conditions. It also manages parity checking and sets the appropriate status/error bits in the RS-232 status register ($0297).

**Operation**

Upon assembling a complete RS-232 byte, this routine performs the following steps:

- **Buffer Management:**
  - Load the current Rx buffer end index from $029B into the Y register and increment it.
  - Compare Y to $029C (Rx buffer start/index-to-check) to detect a full buffer.
    - If equal (buffer full), branch to set an overrun error.
  - Save the incremented index back to $029B.
  - Decrement Y to restore the index for the subsequent store operation.

- **Bit Count Adjustment:**
  - Load the assembled byte from $AA and the bit count from $0298.
  - Compare the bit count to #$09 (9 bits = data bits + stop bit).
    - If less than 9, shift the assembled byte right (LSR) and increment the bit count until 9 bits are present.

- **Storing the Byte:**
  - Store the assembled byte into the Rx circular buffer using indirect-indexed addressing with the pointer at $F7.

- **Parity Handling:**
  - Load mask #$20 and perform a BIT operation on $0294 (pseudo 6551 command register) to test if parity checking is enabled.
    - If parity checking is disabled, branch back to bit-receive setup.
    - If enabled, test the parity mode by branching based on the sign/negative flag from the BIT result.
  - Compute parity by XORing the received data parity bit ($A7) with the receiver parity bit ($AB).
    - Evaluate the result to determine parity match or mismatch using BEQ/BVS/BVC instructions.
    - On parity mismatch, set the parity error bit (#$01) to be ORed into $0297.

- **Error Setting:**
  - If buffer-full/overrun: load #$04 to indicate Rx overrun and OR into $0297.
  - If break detected: load #$80 to indicate break condition and OR into $0297.
  - If framing error: load #$02 to indicate frame error and OR into $0297.

- **Final Steps:**
  - Store the final RS-232 status byte to $0297.
  - Jump to the routine that sets up reception of the next RS-232 bit (JMP $EF7E).

**Notes:**

- Zero-page/workspace locations $AA, $A7, $AB, and $F7 are used as temporary storage/pointers by the ROM.
- The code contains several `.BYTE $2C` markers in the disassembly; these are the standard 6502 BIT-absolute skip trick used in ROM code to chain multiple error-code LDA entries through a single ORA/STA exit path.

## Source Code

```assembly
.,EF97 AC 9B 02 LDY $029B       ; Load index to Rx buffer end
.,EF9A C8       INY             ; Increment index
.,EF9B CC 9C 02 CPY $029C       ; Compare with index to Rx buffer start
.,EF9E F0 2A    BEQ $EFCA       ; Branch if buffer is full
.,EFA0 8C 9B 02 STY $029B       ; Save index to Rx buffer end
.,EFA3 88       DEY             ; Decrement index
.,EFA4 A5 AA    LDA $AA         ; Load assembled byte
.,EFA6 AE 98 02 LDX $0298       ; Load bit count
.,EFA9 E0 09    CPX #$09        ; Compare with 9 bits (data + stop)
.,EFAB F0 04    BEQ $EFB1       ; Branch if all nine bits received
.,EFAD 4A       LSR             ; Else shift byte right
.,EFAE E8       INX             ; Increment bit count
.,EFAF D0 F8    BNE $EFA9       ; Loop (branch always)
.,EFB1 91 F7    STA ($F7),Y     ; Store received byte to Rx buffer
.,EFB3 A9 20    LDA #$20        ; Load mask for parity enable bit
.,EFB5 2C 94 02 BIT $0294       ; Test pseudo 6551 command register
.,EFB8 F0 B4    BEQ $EF6E       ; Branch if parity disabled
.,EFBA 30 B1    BMI $EF6D       ; Branch if mark or space parity
.,EFBC A5 A7    LDA $A7         ; Load received data parity bit
.,EFBE 45 AB    EOR $AB         ; XOR with receiver parity bit
.,EFC0 F0 03    BEQ $EFC5       ; Branch if parity matches
.,EFC2 70 A9    BVS $EF6D       ; Branch if overflow set (parity error)
.,EFC4 2C       .BYTE $2C       ; Placeholder for missing BIT operand
.,EFC5 50 A6    BVC $EF6D       ; Branch if overflow clear (no parity error)
.,EFC7 A9 01    LDA #$01        ; Load parity error bit
.,EFC9 2C       .BYTE $2C       ; Placeholder for missing BIT operand
.,EFCA A9 04    LDA #$04        ; Load overrun error bit
.,EFCC 2C       .BYTE $2C       ; Placeholder for missing BIT operand
.,EFCD A9 80    LDA #$80        ; Load break error bit
.,EFCF 2C       .BYTE $2C       ; Placeholder for missing BIT operand
.,EFD0 A9 02    LDA #$02        ; Load frame error bit
.,EFD2 0D 97 02 ORA $0297       ; OR with RS-232 status byte
.,EFD5 8D 97 02 STA $0297       ; Store RS-232 status byte
.,EFD8 4C 7E EF JMP $EF7E       ; Setup to receive next RS-232 bit
.,EFDB A5 AA    LDA $AA         ; Load assembled byte
.,EFDD D0 F1    BNE $EFD0       ; Branch if non-zero (frame error)
.,EFDF F0 EC    BEQ $EFCD       ; Branch always (break error)
```

## Key Registers

- **$0294**: Pseudo-6551 command register; parity enable/mode tested via BIT #$20.
- **$0297**: RS-232 status register; bits used here: parity error (#$01), frame error (#$02), overrun error (#$04), break error (#$80).
- **$0298**: Bit count for the currently assembled Rx character; compared to #$09.
- **$029B**: Rx buffer end/index; incremented and stored.
- **$029C**: Rx buffer start/index-to-check; used to detect full buffer.
- **$F7**: Zero-page pointer to base of Rx circular buffer; used with STA ($F7),Y.
- **$AA**: Zero-page location for assembled Rx byte; source byte stored into buffer.
- **$A7**: Zero-page location for RS-232 received data parity bit; used in parity calculation.
- **$AB**: Zero-page location for receiver parity bit; used in parity calculation.

## References

- "rs232_rx_nmi_bit_processing" — Details on how this routine receives and assembles bits into the byte stored at $AA.
- "rs232_no_start_bit_received" — Discusses conditions that may branch here after errors to restart bit reception.

## Labels
- $0294
- $0297
- $0298
- $029B
- $029C
- $F7
- $AA
- $A7
- $AB
