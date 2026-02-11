# Tape write IRQ — first start-bit half-cycle handling (C64 ROM $FBCD–$FBE0)

**Summary:** Handles the very first half-cycle of a tape start bit in the tape-write IRQ (triggered by VIA/CIA timer T2). Checks the first-cycle flag at $00A8, programs the first start-cycle time constant via JSR $FBB1 (LDA #$10 / LDX #$01), toggles the start-cycle flag (INC $00A8), and tests the tape buffer high byte $00B6 for end-of-block (BPL / JMP $FC57).

## Routine purpose
This IRQ handler is invoked on each VIA/CIA timer timeout that generates tape write timing. Its immediate concern is the special handling of the very first half-cycle of a start bit. The handler:
- Tests the "first-cycle-done" flag ($00A8). If that flag is set, the routine continues with the normal per-bit/byte processing (not covered here).
- If the flag is clear, it writes the first start-cycle time constant (low byte #$10, high byte #$01) using a JSR to $FBB1, which programs the timer and toggles the tape line.
- Depending on the return/flags from $FBB1, it may exit immediately (first half-cycle only) or mark the first-cycle-done flag and then test for end-of-block using the tape buffer high byte ($00B6).
- If the block is complete (buffer high byte has bit 7 set), it transfers to the block-complete tape routine at $FC57.

This code is the gate that establishes the unique timing for the first half-cycle and then transitions the state machine into sending the rest of the start bit and subsequent data bits.

## Detailed flow
- LDA $00A8 / BNE $FBE3
  - If $00A8 != 0 the handler branches to the "rest of byte" processing (start bit first cycle already completed).
- LDA #$10 / LDX #$01 / JSR $FBB1
  - Loads the first start-cycle time constant (low = $10, high = $01) and calls $FBB1 to write that time constant and toggle the tape output line.
  - The subsequent BNE $FC09 tests the processor flags as set by the called routine (branch taken if non-zero), causing an immediate exit if this IRQ serviced only the first half-cycle.
- INC $00A8
  - Sets the "first start-cycle done" flag so future IRQs will follow the normal bit/byte processing path.
- LDA $00B6 / BPL $FC09
  - Loads the tape buffer high byte and branches (positive) to exit if the block is not complete (bit 7 clear).
- JMP $FC57
  - If buffer high byte bit 7 is set, jump to the block-complete tape routine.

Notes:
- The source names the interrupt source as "VIA 2 T2" (timer 2). The code relies on $FBB1 to program the time constant and toggle the tape line; the JSR target is responsible for setting flags that determine whether the IRQ function should return immediately after the first half-cycle.
- The end-of-block condition is encoded in bit 7 of the tape buffer high byte ($00B6); when set, control is transferred to the block-complete handling code at $FC57.

## Source Code
```asm
.,FBCD A5 A8    LDA $A8         get start bit first cycle done flag
.,FBCF D0 12    BNE $FBE3       if first cycle done go do rest of byte
                                each byte sent starts with two half cycles of $0110 ststem clocks and the whole block
                                ends with two more such half cycles
.,FBD1 A9 10    LDA #$10        set first start cycle time constant low byte
.,FBD3 A2 01    LDX #$01        set first start cycle time constant high byte
.,FBD5 20 B1 FB JSR $FBB1       write time constant and toggle tape
.,FBD8 D0 2F    BNE $FC09       if first half cycle go restore registers and exit
                                interrupt
.,FBDA E6 A8    INC $A8         set start bit first start cycle done flag
.,FBDC A5 B6    LDA $B6         get buffer address high byte
.,FBDE 10 29    BPL $FC09       if block not complete go restore registers and exit
                                interrupt. the end of a block is indicated by the tape
                                buffer high byte b7 being set to 1
.,FBE0 4C 57 FC JMP $FC57       else do tape routine, block complete exit
```

## Key Registers
- $00A8 - RAM - start-bit "first-cycle-done" flag (0 = first half-cycle not yet done, non-zero = done)
- $00B6 - RAM - tape buffer high byte; bit 7 = end-of-block indicator

## References
- "tape_write_start_bit_and_bit_send_phase" — continues processing after the first start-cycle to finish the start bit and begin sending data bits
- "tape_write_block_complete_and_leader_setup" — handles the block-complete path when buffer high byte indicates end-of-block

## Labels
- START_BIT_FIRST_CYCLE_DONE
- TAPE_BUFFER_HIGH
