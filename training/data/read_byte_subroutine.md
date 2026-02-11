# Read byte subroutine (bit-serial -> MSb-first byte)

**Summary:** 6502 assembly subroutine that reads 8 bits from tape using JSR $02D4 / bit handler at $02E1, collects them MSb-first into zero-page buffer $F7 using ROL, uses $F8 as the 8-bit loop counter, and performs border flashing via INC $D020.

**Description**
This subroutine implements the common "read byte" used by C64 tape loaders. Sequence and behavior:

- LDA #$07 / STA $F8 sets the bit counter to 7, counting 8 iterations (0..7) to read 8 bits.
- Each loop iteration calls JSR $02D4 to perform a bit alignment/read operation. The called code (bit-read handler at $02E1) places the incoming bit into the processor Carry flag.
- ROL $F7 shifts the accumulator at zero-page $F7 left one bit and pulls in the Carry as the least-significant bit of the shifted byte; because bits arrive MSb-first the ROL sequence packs them into $F7 in MSb-first order.
- INC $D020 toggles the VIC-II border register to produce a visible border flash (used as a timing/visual indicator during loading).
- DEC $F8 and BPL loop control: DEC decrements the counter; BPL branches back to the JSR while the high bit of $F8 is clear (signed >=0). After eight iterations the loop falls through.
- Final LDA $F7 returns the assembled byte in A; RTS returns to the caller.

Behavioral notes:
- The ROL relies entirely on the Carry set/cleared by the bit-read handler at $02E1; correctness depends on that routine's timing and bit placement.
- $F7 is used as the shift/accumulator buffer; callers should initialize or preserve it if needed.
- INC $D020 writes to VIC-II border color ($D020), producing a flash each bit read — this modifies system state (not just a no-op).

## Source Code
```asm
; Read byte subroutine
03E7  A9 07       LDA #$07        ; 8 bits to read...
03E9  85 F8       STA $F8
03EB  20 D4 02    JSR $02D4
03EE  26 F7       ROL $F7         ; group them MSb-first
                                  ; ROL retrieves the Carry
                                  ; bit where incoming bit was
                                  ; stored (code at $02E1)
03F0  EE 20 D0    INC $D020       ; Performs border flashing
03F3  C6 F8       DEC $F8
03F5  10 F4       BPL $03EB
03F7  A5 F7       LDA $F7
03F9  60          RTS

03FA  00 00       ; separator / trailing bytes
```

## Key Registers
- $D020 - VIC-II - Border color register (writes cause visible border flash)
- $F7 - Zero page - Bit accumulator / MSb-first buffer
- $F8 - Zero page - Bit counter (initialized to $07 for 8 bits)
- $02D4 - Loader code - Called routine to align/read a single bit (JSR target)
- $02E1 - Loader code - Bit-read handler that sets/Clears Carry with incoming bit

## References
- "loader_core_leader_sync_and_header_read" — expands on called-from context reading leader, sync and header bytes
- "load_loop_store_and_checksum" — expands on called-from context used by the Load Loop to read stored data bytes and compute/check checksum

## Labels
- D020
- F7
- F8
