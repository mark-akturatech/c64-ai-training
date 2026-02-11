# RS232: enqueue one byte into transmit circular buffer (KERNAL $F014)

**Summary:** Places a byte into the RS-232 transmit circular buffer using indirect-indexed addressing (($F9),Y). Calls setup_for_transmit (JSR $F028), updates buffer end pointer ($029E/$029D), checks for full buffer, and stores the byte at the computed slot.

## Operation
This routine ensures the RS-232 transmit machinery has been started (JSR $F028), then increments the Tx buffer end index stored at $029E, compares the incremented index with the Tx buffer start index stored at $029D to detect a full buffer (end+1 == start), and loops back to the setup call while full. If not full it writes the updated end index back to $029E, decrements Y to obtain the buffer slot index (original end), loads the byte to transmit from zero page $009E, and stores it into the circular buffer via indirect-indexed addressing using the pointer at zero page $00F9 (($F9),Y).

Notes:
- Full-buffer check: LDY $029E ; INY ; CPY $029D ; BEQ (loop). The BEQ indicates (end + 1) == start → buffer full.
- Pointer mechanism: ($F9),Y is used to index the buffer base; $00F9 is the zero-page base pointer (low/high bytes in $00F9/$00FA).
- Data source: LDA $009E reads the byte to enqueue (zero-page location $009E).
- The routine loops until the buffer has space (busy-wait); no interrupts or waiting policy is implemented here.

## Source Code
```asm
                                *** send byte to the RS232 buffer
.,F014 20 28 F0 JSR $F028       setup for RS232 transmit
                                send byte to the RS232 buffer, no setup
.,F017 AC 9E 02 LDY $029E       get index to Tx buffer end
.,F01A C8       INY             + 1
.,F01B CC 9D 02 CPY $029D       compare with index to Tx buffer start
.,F01E F0 F4    BEQ $F014       loop while buffer full
.,F020 8C 9E 02 STY $029E       set index to Tx buffer end
.,F023 88       DEY             index to available buffer byte
.,F024 A5 9E    LDA $9E         read the RS232 character buffer
.,F026 91 F9    STA ($F9),Y     save the byte to the buffer
```

## Key Registers
- $029E - RAM - Tx buffer end index (incremented, written back)
- $029D - RAM - Tx buffer start index (compared against end to detect full)
- $00F9 - Zero Page - pointer to Tx buffer base (used as indirect base for STA ($F9),Y)
- $009E - Zero Page - source byte to enqueue for RS232 transmit

## References
- "rs232_setup_for_transmit" — ensures transmit machinery/timer/interrupts are started before queuing bytes
- "rs232_setup_next_tx_byte" — consumes bytes from the Tx buffer to build the serial bitstream

## Labels
- RS232_ENQUEUE
