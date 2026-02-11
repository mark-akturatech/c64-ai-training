# RS-232 Parity & Stop-Bit Handling (Commodore 64 ROM disassembly)

**Summary:** 6502 routine that selects and applies RS-232 parity modes (odd, even, fixed mark/space, or disabled), reads the parity byte from $BD, sets/clears the parity bit into the X register (using DEX/LDX #$FF), and adjusts the RS232 bit-count in $B4 to account for one or two stop bits; reads a pseudo‑6551 control register at $0293 to distinguish 1 vs 2 stop bits.

## Behavior and flow
- Purpose: decide parity-bit value (0/1) and adjust the RS‑232 bit-count ($B4) to reflect stop-bit insertion before handing control to the transmitter setup routine.
- Parity-mode selection is encoded in processor status flags and branch instructions:
  - BEQ (zero) at $EEDC: parity disabled path.
  - BMI (negative) at $EEDE: fixed mark/space parity path.
  - BVS (overflow set) at $EEE0: even parity path.
  - else: odd parity path.
- Odd parity path:
  - Load parity byte from $BD.
  - If $BD != 0, leave parity bit = 0; if $BD == 0, make parity bit = 1 (DEX used to produce parity bit = 1 in X).
  - DEC $B4: decrement RS232 bit count to account for one stop bit.
  - Read pseudo‑6551 control register at $0293 and BPL to test sign (branch target determines whether 1 stop bit is being used). If branch not taken, treat as two stop bits and DEC $B4 again.
- Even parity path:
  - Load parity byte from $BD.
  - If $BD == 0, leave parity bit = 0; else make parity bit = 1 (same DEX trick).
  - Stop-bit handling identical to odd path (DEC $B4 plus optional second DEC depending on $0293).
- Fixed mark/space parity path:
  - Use V flag tests (BVS/BVC) to choose fixed space (parity bit = 0) or fixed mark (parity bit = 1).
  - Then adjust stop-bit count: INC/DEC $B4 as required and set stop-bit value in X (LDX #$FF used).
- Parity disabled path (special case):
  - Parity bit is treated as the first stop bit. The code increments $B4 (effectively reducing number of stop bits) and forces the stop-bit indicator (X = $FF) so that the parity position becomes a stop bit.
- Bit-count semantics:
  - $B4 holds the RS232 bit count used by the transmit logic; the routine increments/decrements $B4 to add/remove the parity bit and stop bits from the remaining bit count.
  - The code uses X values $FF (stop bit = 1) and $FE (stop bit = 0?) — the listing comments: "$FF is one stop bit, $FE is two stop bits" (these values are used by downstream transmit setup).
- Output handoff:
  - After parity and stop-bit adjustments, control continues to the transmit-setup routine (referenced elsewhere: "rs232_setup_next_tx_byte").

## Source Code
```asm
.,EEDC F0 14    BEQ $EEF2       if parity disabled go ??
.,EEDE 30 1C    BMI $EEFC       if fixed mark or space parity go ??
.,EEE0 70 14    BVS $EEF6       if even parity go ??
                                else odd parity
.,EEE2 A5 BD    LDA $BD         get RS232 parity byte
.,EEE4 D0 01    BNE $EEE7       if parity not zero leave parity bit = 0
.,EEE6 CA       DEX             make parity bit = 1
.,EEE7 C6 B4    DEC $B4         decrement RS232 bit count, 1 stop bit
.,EEE9 AD 93 02 LDA $0293       get pseudo 6551 control register
.,EEEC 10 E3    BPL $EED1       if 1 stop bit save parity bit and exit
                                else two stop bits ..
.,EEEE C6 B4    DEC $B4         decrement RS232 bit count, 2 stop bits
.,EEF0 D0 DF    BNE $EED1       save bit and exit, branch always
                                parity is disabled so the parity bit becomes the first,
                                and possibly only, stop bit. to do this increment the bit
                                count which effectively decrements the stop bit count.
.,EEF2 E6 B4    INC $B4         increment RS232 bit count, = -1 stop bit
.,EEF4 D0 F0    BNE $EEE6       set stop bit = 1 and exit
                                do even parity
.,EEF6 A5 BD    LDA $BD         get RS232 parity byte
.,EEF8 F0 ED    BEQ $EEE7       if parity zero leave parity bit = 0
.,EEFA D0 EA    BNE $EEE6       else make parity bit = 1, branch always
                                fixed mark or space parity
.,EEFC 70 E9    BVS $EEE7       if fixed space parity leave parity bit = 0
.,EEFE 50 E6    BVC $EEE6       else fixed mark parity make parity bit = 1, branch always
                                decrement stop bit count, set stop bit = 1 and exit. $FF is one stop bit, $FE is two
                                stop bits
.,EF00 E6 B4    INC $B4         decrement RS232 bit count
.,EF02 A2 FF    LDX #$FF        set stop bit = 1
.,EF04 D0 CB    BNE $EED1       save stop bit and exit, branch always
```

## Key Registers
- $0293 - 6551 (pseudo) - control register read to decide 1 vs 2 stop bits (sign bit tested via BPL)
- $00BD - RAM - RS232 parity byte (loaded to decide parity bit value)
- $00B4 - RAM - RS232 bit count (decremented/incremented to account for parity and stop bits)

## References
- "rs232_compute_bit_count" — expands on how many bits are transmitted (8/7/5 data bits and stop bit adjustments)
- "rs232_setup_next_tx_byte" — called after parity/stop-bit processing to set up the next Tx byte