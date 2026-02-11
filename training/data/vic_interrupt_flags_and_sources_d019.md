# VIC-II Interrupt Flag Register ($D019), VIC register mirroring, and SID register overview ($D400-$D41C)

**Summary:** Describes the VIC-II Interrupt Flag Register at $D019 (bitfield for raster, sprite collisions, light pen, and any-VIC-IRQ), the latched IRQ-clear behavior (write 1 to clear), recommended IRQ dispatch sequence, VIC register mirroring every 64 bytes in the $D000-$D3FF window, and an overview/map of the SID registers at $D400-$D41C including Voice 1 frequency and pulse-width layout and the frequency equation.

**VIC-II Interrupt Flag Register ($D019)**
$D019 is the VIC-II Interrupt Flag Register. Its bits are hardware-latched flags that indicate pending VIC-II interrupt sources; each flag is cleared by writing a 1 to that bit (write-1-to-clear). The important bits described here:

- Bit 0 — raster compare flag (set when raster equals $D012)
- Bit 1 — sprite/foreground (sprite-to-background) collision flag
- Bit 2 — sprite/sprite collision flag
- Bit 3 — light-pen trigger flag
- Bit 7 — any-VIC-IRQ indicator (set when any enabled VIC source has triggered)

Operational notes:
- The flags are latched until explicitly cleared by software (write a 1 to the corresponding bit).
- IRQ handler (VIC IRQ routine) should first check Bit 7 (any-VIC-IRQ) to quickly determine if the VIC triggered the CPU IRQ, then test the individual bits (0–6) to determine the exact source(s) and service them. Clear only those bits that you are handling by writing 1 to those bit positions; do not clear Bit7 directly as a substitute for checking/clearing the specific source bits.
- See the IRQ Mask Register ($D01A) for enabling/disabling individual VIC IRQ sources (reference in References).

**VIC-II register addressing / 1K window mirroring**
The VIC-II decodes only enough address lines to handle its 64 internal registers; the $D000-$D3FF (1K) CPU window contains repeated 64-byte mirrors of the VIC register block. Concretely:
- The VIC has 47 registers occupying a 64-byte range ($D000-$D03F is sufficient to cover all decoded registers), and higher address bits within $D000-$D3FF are not decoded — each 64-byte page is a mirror of the base 64-byte register page.
- Example: POKE 53281+64,1 (i.e. writing to $D021 + $40) is the same as POKE 53281,1; writing to any mirror affects the same internal VIC register.
- For clarity and maintainability, use the base addresses in the $D000-$D02E area when programming the VIC.

**SID overview (54272-54300 / $D400-$D41C)**
- Address range 54272-54300 ($D400-$D41C) — 6581 Sound Interface Device (SID) registers.
- SID is a 3-voice synthesizer: each voice has 16-bit frequency control, waveform selection, ADSR envelope (Attack/Decay and Sustain/Release), oscillator sync, ring-modulation; global filters (high-pass/low-pass/band-pass) and overall volume are also available.
- Typical sequence to produce sound:
  1. Set overall volume (Volume Register).
  2. Set frequency (write low byte then high byte of the 16-bit frequency register for the voice).
  3. Set ADSR envelope bytes (Attack/Decay, Sustain/Release).
  4. Select waveform and set the gate bit in the Control Register to start the attack phase; clear gate to start release. Keep waveform bits set while clearing gate so Release runs correctly.
- Many SID registers are write-only (cannot be read back via PEEK) except for the last four registers on the chip.

Frequency calculation (Voice 1 example):
- FREQUENCY = (REGISTER_VALUE * CLOCK / 16777216) Hz
- CLOCK (system clock): NTSC = 1,022,730 Hz; PAL = 985,250 Hz
- Using NTSC clock: FREQUENCY ≈ REGISTER_VALUE * 0.060959458 Hz
- REGISTER_VALUE is the 16-bit combined value: low byte + 256 * high byte

Pulse waveform width (voice 1):
- Pulse width is 12-bit: composed of the low byte register and the low nibble of the high byte register (low byte + ((high byte & $0F) << 8)).
- The pulse width controls duty cycle when the pulse waveform is selected.
- The duty cycle percentage is calculated as: DUTY_CYCLE = (PULSE_WIDTH / 40.95)%
  - A PULSE_WIDTH value of 2048 results in a 50% duty cycle (square wave).
  - PULSE_WIDTH values range from 0 to 4095, corresponding to duty cycles from 0% to 100%.

## Source Code
```basic
REM VIC mirroring example (BASIC POKE)
POKE 53281,1       : REM $D021 = background color white
POKE 53281+64,1    : REM same effect (mirror)
POKE 53281+10*64,1 : REM also same effect (mirror)
```

```text
SID register summary (addresses decimal / hex and names shown in source)

54272  $D400  FRELO1    Voice 1 Frequency Control (low byte)
54273  $D401  FREHI1    Voice 1 Frequency Control (high byte)
54274  $D402  PWLO1     Voice 1 Pulse Width (low byte)
54275  $D403  PWHI1     Voice 1 Pulse Width (high byte; low nibble used)
54276  $D404  CR1       Voice 1 Control Register
54277  $D405  AD1       Voice 1 Attack/Decay
54278  $D406  SR1       Voice 1 Sustain/Release
54279  $D407  FRELO2    Voice 2 Frequency Control (low byte)
54280  $D408  FREHI2    Voice 2 Frequency Control (high byte)
54281  $D409  PWLO2     Voice 2 Pulse Width (low byte)
54282  $D40A  PWHI2     Voice 2 Pulse Width (high byte; low nibble used)
54283  $D40B  CR2       Voice 2 Control Register
54284  $D40C  AD2       Voice 2 Attack/Decay
54285  $D40D  SR2       Voice 2 Sustain/Release
54286  $D40E  FRELO3    Voice 3 Frequency Control (low byte)
54287  $D40F  FREHI3    Voice 3 Frequency Control (high byte)
54288  $D410  PWLO3     Voice 3 Pulse Width (low byte)
54289  $D411  PWHI3     Voice 3 Pulse Width (high byte; low nibble used)
54290  $D412  CR3       Voice 3 Control Register
54291  $D413  AD3       Voice 3 Attack/Decay
54292  $D414  SR3       Voice 3 Sustain/Release
54293  $D415  FCLO      Filter Cutoff Frequency (low byte)
54294  $D416  FCHI      Filter Cutoff Frequency (high byte)
54295  $D417  RES_FILT  Filter Resonance / Voice Filter Selection
54296  $D418  MODE_VOL  Filter Mode / Volume
54297  $D419  POTX      Paddle X Input (read-only)
54298  $D41A  POTY      Paddle Y Input (read-only)
54299  $D41B  OSC3      Oscillator 3 Output (read-only)
54300  $D41C  ENV3      Envelope 3 Output (read-only)
```

```text
Frequency formula (from source):
FREQUENCY = (REGISTER VALUE * CLOCK / 16777216) Hz
CLOCK = 1022730 (NTSC) or 985250 (PAL)
Using NTSC: FREQUENCY = REGISTER VALUE * 0.060959458 Hz
```

## Key Registers
- $D019 - VIC-II - Interrupt Flag Register (raster, sprite/foreground collision, sprite/sprite collision, light-pen, any-VIC-IRQ)
- $D000-$D02E - VIC-II - VIC register block (use base addresses; mirrors occur every $40 bytes within $D000-$D3FF)
- $D400-$D41C - SID - 6581 SID register block (Voice 1 frequency/pulse-width through SID control/filter registers)

## References
- "irq_mask_register_and_raster_interrupts_$D01A" — expands on using the IRQ Mask ($D01A) to enable/disable individual VIC IRQ sources and raster interrupt setup.

## Labels
- FRELO1
- FREHI1
- PWLO1
- PWHI1
- CR1
- AD1
- SR1
- MODE_VOL
