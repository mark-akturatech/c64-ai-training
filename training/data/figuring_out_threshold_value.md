# Deduce cassette-loader threshold from CIA1 Timer B (IRQ + FLAG line)

**Summary:** How to extract the cassette pulse threshold from a C64 loader that uses CIA #1 Timer B and the FLAG-line IRQ ($DC06/$DC07, $DC0D, $DC0F). Shows how the loader sets a Timer B latch, how the IRQ code tests against $0200, and how to convert the resulting threshold (clock cycles) to the TAP-format byte.

## Figuring out the threshold value

This applies to loaders that: use CIA #1 Timer B as a down-counter, arm a FLAG-line interrupt, and use an IRQ handler to sample the CIA Timer B and decide whether a cassette pulse was shorter/longer than a fixed threshold.

Typical sequence performed before installing the loader's IRQ vector:
- Writes $1F to $DC0D to clear/disable the relevant CIA interrupts (Timer A, Timer B, TOD alarm, serial shift, FLAG — see ICR semantics note below).
- Loads the Timer B latch bytes via $DC06 (low) and $DC07 (high). Example latch used in the sample loader: $03A0 (low=$A0 into $DC06, high=$03 into $DC07).

The loader's IRQ handler samples Timer B (high byte) on FLAG events. In the example the handler reads $DC07 and effectively tests whether the 16-bit Timer B counter is above or below $0200. Because the counter was initialized from the latch and counts down, the threshold (in clock cycles) is:

Threshold (cycles) = TimerB_latch - $0200

Example numeric steps (as used in the sample):
- Timer B latch = $03A0 = 928 cycles
- Compare baseline = $0200 = 512 cycles
- Threshold = 928 − 512 = 416 cycles

Convert cycles → microseconds → TAP byte:
- Convert cycles to µs using CPU frequency (PAL C64 ≈ 985,248 Hz used in this example):
  Threshold(µs) = Threshold(cycles) * (1,000,000 / CPU_freq)
  = 416 * (1,000,000 / 985,248) ≈ 422.22 µs
- Convert µs → TAP "threshold byte" using the loader/TAP convention given here:
  TapDataByte = Threshold(µs) * 0.123156
  = 422.22 * 0.123156 ≈ 51.98 → 52 decimal = $34

So for latch $03A0 the TAP threshold byte is $34.

Why the IRQ uses the Timer B high byte and $0200
- Testing a 16-bit down-counter against $0200 can be reduced to checking the high byte (TBHI) relative to 2. If TBHI > 2 the count is > $0200; if TBHI < 2 the count is < $0200; if TBHI == 2 you must inspect the low byte. Many loaders only need to know whether the pulse is shorter/longer than a coarse threshold and therefore read only TBHI.
- The example handler performs bitwise ops (EOR / LSR / ROR) and uses the result as the sampled bit in a bit-shift/collection routine. It does not perform a full 16-bit SBC subtraction; instead it uses faster bit-manipulation to derive a decision-bit and to integrate that bit into the byte-under-construction. Using SBC would be heavier, change arithmetic flags and carry, and would not integrate as cleanly with the per-bit shift-and-rotate pattern used by many loaders.

CIA FLAG line
- The CIA "FLAG" pin is a general-purpose input that can be configured to generate an interrupt (ICR). On CIA #1 the FLAG input is commonly wired to the Cassette Read line of the cassette port. When the cassette hardware toggles the FLAG input, the CIA can assert an interrupt (assuming ICR bits are enabled) and the CPU will vector to the IRQ handler. The loader uses this to sample Timer B at each pulse edge.

**[Note: Source may contain an error — CIA ICR write semantics depend on the MSB of the written value (set/clear vs direct mask). Verify whether writing $1F to $DC0D is intended to set or clear those ICR bits on the specific CIA implementation.]**

## Source Code
```asm
; Setup before changing the IRQ vector:
LDA #$1F       ; disable Timer A interrupt
STA $DC0D      ; disable Timer B interrupt
               ; disable TOD clock alarm interrupt
               ; disable serial shift register interrupt
               ; disable FLAG line(1) interrupt

; Set Timer B latch to $03A0
LDA #$A0       ; Timer B Countdown start value (low)
STA $DC06
LDA #$03       ; Timer B Countdown start value (high)
STA $DC07
```

```asm
; Example IRQ handler (excerpt)
PHA
TYA
PHA
LDA $DC07

LDY #$11       ; Re-Start Timer B
STY $DC0F      ; Force latched value to be loaded to Timer B counter
               ; Timer B counts microprocessor cycles

INC $D020

EOR #$02       ; Revert bit
LSR
LSR
ROR $A9        ; Move it to MSb of $A9 (Endianess: LSbF)
BCC done       ; Whole byte read?
NOP
LDA $DC0D
PLA
TAY
PLA
RTI
```

```text
TAP conversion example (numeric):
TimerB_latch = $03A0 = 928 cycles
Baseline = $0200 = 512 cycles
Threshold_cycles = 928 - 512 = 416 cycles

Using PAL CPU frequency 985,248 Hz:
Threshold_us = 416 * (1,000,000 / 985,248) ≈ 422.22 µs
TapDataByte = Threshold_us * 0.123156 ≈ 51.98 → 52 decimal = $34
```

## Key Registers
- $DC00-$DC0F - CIA #1 - low-level CIA registers (PRA/PRB, DDRs, Timer A low/high, Timer B low/high, TOD, Serial, ICR, CRA, CRB)
- $DC06-$DC07 - CIA #1 - Timer B latch / high-low (TBLO/TBHI) used to set the countdown ($03A0 in example)
- $DC0D - CIA #1 - Interrupt Control Register (ICR) — used to enable/disable FLAG and timer interrupts (loader writes $1F in example)
- $DC0F - CIA #1 - Control Register B (CRB) — writing the load bit forces the latch into Timer B counter (used to restart/force load)
- $FFFE-$FFFF - CPU vector - IRQ vector replaced by loader to point to its IRQ handler

## References
- "irq_loader_setup_part1_disassembly" — shows writes to CIA timer latch and interrupt control registers used to set threshold
- "tap_format_conversion" — how to convert threshold in clock cycles to TAP byte value

## Labels
- TBLO
- TBHI
- ICR
- CRB
