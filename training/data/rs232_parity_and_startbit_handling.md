# RS-232 Receiver Bit Processing and Parity Handling (ROM $FA8D–$FABE)

**Summary:** Handles RS-232 receiver bit processing: checks flags $B5/$B6, shifts temporary receiver bit storage ($A7) into Carry, compares that bit against the RS232 parity/sign byte ($BD) and accepts only when the bit differs. Manages nibble counting in $AA, sets buffer-start conditions and may call JSR $FB8E to copy the I/O start address to the buffer; sets $AB and branches to the common interrupt-exit path.

## Flow and behavior
This code is reached from a serial/entry and timing check path and implements a single-bit decision for RS-232 reception followed by nibble counting and buffer-start logic.

Step-by-step behavior:
- $FA8D–$FA8F: Early branch checks (BVS/BNE) route control; code only proceeds when prior conditions allow.
- $FA91–$FA97: Test status flags in zero page $B5 and $B6; if either is nonzero, branch back to the common exit ($FA8A).
- $FA99–$FA9B: LDA $A7; LSR — shift the temporary receiver-bit storage right one bit. The bit shifted out becomes the processor Carry (Carry = received bit).
- $FA9C–$FAA3: LDA $BD — load the RS-232 parity/sign byte into A (sets N flag based on bit7). The subsequent BMI/BCC/CLC/BCS sequence implements a compare between Carry (received bit) and the sign bit (bit7) of $BD:
  - If sign bit (N) = 0: BCC checks Carry; if Carry=0 branch to $FABA (reject path). If Carry=1 fall through, clear Carry (CLC) and continue (accept path).
  - If sign bit (N) = 1: BMI jumps to the BCS test; BCS branches to $FABA when Carry=1 (reject), otherwise continue (accept).
  - Net effect: execution continues to the nibble handling only when the received bit differs from bit7 of $BD (i.e., r != p). When they match, control goes to the reject/short-block path at $FABA.
- $FAA5–$FAA7: AND #$0F; STA $AA — isolate the low nibble of A and store it in $AA.
- $FAA9–$FAAB: DEC $AA; if result is non-zero branch back to the common exit ($FA8A). This implements a nibble countdown: only when $AA decrements to zero does the code take the buffer-start path.
- $FAAD–$FAB6: If nibble count reached zero, set $AA = $40, JSR $FB8E (copy I/O start address to buffer), then clear $AB (LDA #$00; STA $AB). The following BEQ $FA8A is an unconditional branch (LDA #$00 sets Z=1, so BEQ is always taken) returning to the common interrupt/exit code.
- $FABA–$FABE: Reject/short-block path: set $AA = $80 and branch to the common exit ($FA8A). The branch at $FABE (BNE) is also effectively unconditional because LDA #$80 leaves Z=0.

Notes on flags and branches:
- Carry after the LSR of $A7 holds the received bit and is deliberately used across the LDA $BD instruction (LDA does not touch Carry), allowing the combination of BMI/BCC/BCS/CLC to test equality/inequality between the received bit and $BD bit7.
- The code uses LDA immediate to set the Z flag so that subsequent BEQ/BNE behave as unconditional branches (a common compact pattern in 6502 code).

Overall outcomes:
- If received bit matches $BD bit7 → take reject path: $AA = $80 and return to interrupt exit.
- If received bit differs from $BD bit7 → accept path: decrement low nibble in $AA; only when it reaches zero does the code set up buffer start ($AA = $40), call JSR $FB8E to copy I/O start address to the buffer, clear $AB, then return.

## Source Code
```asm
.,FA8D 70 31    BVS $FAC0       
.,FA8F D0 18    BNE $FAA9       
.,FA91 A5 B5    LDA $B5         
.,FA93 D0 F5    BNE $FA8A       
.,FA95 A5 B6    LDA $B6         
.,FA97 D0 F1    BNE $FA8A       
.,FA99 A5 A7    LDA $A7         get receiver input bit temporary storage
.,FA9B 4A       LSR             
.,FA9C A5 BD    LDA $BD         get RS232 parity byte
.,FA9E 30 03    BMI $FAA3       
.,FAA0 90 18    BCC $FABA       
.,FAA2 18       CLC             
.,FAA3 B0 15    BCS $FABA       
.,FAA5 29 0F    AND #$0F        
.,FAA7 85 AA    STA $AA         
.,FAA9 C6 AA    DEC $AA         
.,FAAB D0 DD    BNE $FA8A       
.,FAAD A9 40    LDA #$40        
.,FAAF 85 AA    STA $AA         
.,FAB1 20 8E FB JSR $FB8E       copy I/O start address to buffer address
.,FAB4 A9 00    LDA #$00        
.,FAB6 85 AB    STA $AB         
.,FAB8 F0 D0    BEQ $FA8A       
.,FABA A9 80    LDA #$80        
.,FABC 85 AA    STA $AA         
.,FABE D0 CA    BNE $FA8A       restore registers and exit interrupt, branch always
```

## Key Registers
- $A7 - Zero page - temporary receiver input bit storage (shifted with LSR; bit shifted into Carry)
- $AA - Zero page - nibble/count and status byte ($00–$0F used for nibble countdown; set to $40 on buffer-start accept, $80 on reject)
- $AB - Zero page - buffer-related byte (cleared to #$00 when starting buffer; exact high-level role in buffer indexing handled elsewhere)
- $BD - Zero page - RS-232 parity/sign byte (bit7 tested via N flag to compare with received bit)
- $B5 - Zero page - status flag tested (nonzero → exit)
- $B6 - Zero page - status flag tested (nonzero → exit)

## References
- "store_character_entry_and_initial_timing" — expands on this logic reached from entry/timing checks when serial-status bits select the RS232 path
- "buffer_copy_and_load_store" — expands on when a byte or start-of-buffer is accepted this code calls $FB8E and then control flows into buffer-copy/load handling

## Labels
- $A7
- $AA
- $AB
- $BD
- $B5
- $B6
