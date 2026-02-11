# Tape write: finish start-bit and begin data-bit transmission ($FBE3-$FC09)

**Summary:** Finishes the second half-cycle of the start bit and begins sending data-bit cycles for tape output (JSR $FBAD, JSR $FBA6, JMP $FEBC). Operates on zero-page tape variables $A9 (start-bit flag), $A4 (bit-cycle phase), $BD (write byte) and $9B (byte parity); inverts bits on the second half-cycle and updates parity.

## Description
This routine continues a tape byte write after the initial start-bit first half-cycle. Behavior is split between completing the start bit and then sending each data-bit (each bit is two full cycles). Key behaviors:

- Start-bit completion:
  - Checks the start-bit flag ($A9). If the start-bit is already marked complete, execution jumps to the data-bit send path.
  - Calls JSR $FBAD to set the time constant for the "1" half-cycle and toggle the tape output.
  - If executing the first half-cycle of that time constant, the interrupt handler returns to restore registers. Otherwise it increments $A9 to mark the start-bit as seen and returns.

- Data-bit send:
  - Calls JSR $FBA6 to transmit the LSB of the write byte to the tape (this routine toggles the tape according to the bit).
  - If in the first half-cycle, returns to restore registers.
  - On completion of a half-cycle pair, toggles the bit-cycle phase marker in $A4 (EOR #$01, stored back to $A4). A phase-complete (BEQ) branches to the next-bit setup (outside this chunk).
  - During the second half of a bit, the bit is inverted in the stored write byte ($BD) to implement the required pulse order (the send routine reads the LSB). The inverted LSB is masked (AND #$01) and EOR'd into $9B to update one-bit parity for the current byte.

- Bit timing semantics (from comments):
  - Each bit is sent as two full cycles. A '1' is a full cycle of $0160 system clocks then a full cycle of $00C0 system clocks. A '0' is $00C0 then $0160.
  - The start bit is formed from two half-cycles of $0110 then two half-cycles of $00B0, matching the first half of a '1' bit before proceeding.

- Exit:
  - After the parity/bit update or when first-half conditions require immediate return, the code jumps to $FEBC to restore registers and exit the interrupt.

This chunk does not include the next-bit shift/setup routine (runs when the bit-cycle phase completes) or the internals of $FBAD/$FBA6, which are referenced here.

## Source Code
```asm
.,FBE3 A5 A9    LDA $A9         get start bit check flag
.,FBE5 D0 09    BNE $FBF0       if the start bit is complete go send the byte bits
                                after the two half cycles of $0110 ststem clocks the start bit is completed with two
                                half cycles of $00B0 system clocks. this is the same as the first part of a 1 bit
.,FBE7 20 AD FB JSR $FBAD       set time constant for bit = 1 and toggle tape
.,FBEA D0 1D    BNE $FC09       if first half cycle go restore registers and exit
                                interrupt
.,FBEC E6 A9    INC $A9         set start bit check flag
.,FBEE D0 19    BNE $FC09       restore registers and exit interrupt, branch always
                                continue tape byte write. the start bit, both cycles of it, is complete so the routine
                                drops straight through to here. now the cycle pairs for each bit, and the parity bit,
                                are sent
.,FBF0 20 A6 FB JSR $FBA6       send lsb from tape write byte to tape
.,FBF3 D0 14    BNE $FC09       if first half cycle go restore registers and exit
                                interrupt
                                else two half cycles have been done
.,FBF5 A5 A4    LDA $A4         get tape bit cycle phase
.,FBF7 49 01    EOR #$01        toggle b0
.,FBF9 85 A4    STA $A4         save tape bit cycle phase
.,FBFB F0 0F    BEQ $FC0C       if bit cycle phase complete go setup for next bit
                                each bit is written as two full cycles. a 1 is sent as a full cycle of $0160 system
                                clocks then a full cycle of $00C0 system clocks. a 0 is sent as a full cycle of $00C0
                                system clocks then a full cycle of $0160 system clocks. to do this each bit from the
                                write byte is inverted during the second bit cycle phase. as the bit is inverted it
                                is also added to the, one bit, parity count for this byte
.,FBFD A5 BD    LDA $BD         get tape write byte
.,FBFF 49 01    EOR #$01        invert bit being sent
.,FC01 85 BD    STA $BD         save tape write byte
.,FC03 29 01    AND #$01        mask b0
.,FC05 45 9B    EOR $9B         EOR with tape write byte parity bit
.,FC07 85 9B    STA $9B         save tape write byte parity bit
.,FC09 4C BC FE JMP $FEBC       restore registers and exit interrupt
```

## Key Registers
- $A9 - Zero Page - start-bit-check flag (marks start-bit completion across half-cycles)
- $A4 - Zero Page - tape bit-cycle phase toggle (EOR #$01, tracks half/full phase)
- $BD - Zero Page - tape write byte (bit source; LSB sent, inverted during second half)
- $9B - Zero Page - tape write byte parity (one-bit parity accumulator for current byte)

## References
- "tape_write_irq_header_and_first_start_cycle" — sets up first half-cycle and initial start-bit handling
- "tape_write_shift_count_and_new_byte_setup" — handles shifting bits, updating counts and preparing the next byte when phase completes