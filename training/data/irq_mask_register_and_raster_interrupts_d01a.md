# IRQ Mask ($D01A) and SID Voice 1 Registers (Pulse Width, VCREG, ADSR)

**Summary:** VIC-II IRQ mask and raster-install steps (registers $D01A, $D019, $D012, $D011; IRQ vector $0314-$0315), and SID Voice 1 registers for pulse width and control (PWLO1 $D402, PWHI1 $D403, VCREG1 $D404, ADSR $D405-$D406). Includes pulse-width formula, VCREG1 bit definitions, and ADSR envelope register layout.

**VIC-II IRQ Mask and Installing a Raster IRQ Routine**

The VIC-II provides several interrupt sources: raster compare, light pen trigger, sprite–sprite collision, and sprite–background collision. The IRQ Mask (enable) register at $D01A controls which of these sources can generate an interrupt. Each bit in $D01A corresponds to a specific interrupt source:

- **Bit 0**: Enable Raster Compare IRQ
- **Bit 1**: Enable Sprite–Background Collision IRQ
- **Bit 2**: Enable Sprite–Sprite Collision IRQ
- **Bit 3**: Enable Light Pen Trigger IRQ
- **Bits 4–7**: Not used

To set up a raster interrupt:

1. **Disable interrupts**: Use the `SEI` instruction to prevent other interrupts during setup.
2. **Enable the raster IRQ**: Set bit 0 of $D01A to 1.
3. **Set the raster line**: Write the desired raster line to $D012 (low byte) and set bit 7 of $D011 (high bit) if the line number exceeds 255.
4. **Install the IRQ handler**: Store the address of your interrupt routine at $0314 (low byte) and $0315 (high byte).
5. **Re-enable interrupts**: Use the `CLI` instruction to allow interrupts.

**Note**: When an interrupt occurs, the source must be acknowledged by writing a 1 to the corresponding bit in the Interrupt Status Register at $D019. For example, to acknowledge a raster interrupt:


This clears the raster interrupt flag and allows subsequent interrupts to occur. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_3/page_151.html?utm_source=openai))

**SID Voice 1: Pulse Width, Control Register (VCREG1), and ADSR**

**Pulse Width**: Controls the duty cycle of the pulse waveform for Voice 1. It's a 12-bit value (0–4095) split across two registers:

- **PWLO1 ($D402)**: Low byte
- **PWHI1 ($D403)**: High nybble (upper 4 bits)

The pulse width percentage is calculated as:


**VCREG1 ($D404)**: Voice 1 Control Register. This register controls various aspects of the voice:

- **Bit 0**: Gate (1 = Start attack/decay/sustain; 0 = Start release)
- **Bit 1**: Sync (1 = Synchronize oscillator with Oscillator 3 frequency)
- **Bit 2**: Ring Modulation (1 = Ring modulate Oscillators 1 and 3)
- **Bit 3**: Test (1 = Disable Oscillator 1)
- **Bit 4**: Select Triangle waveform
- **Bit 5**: Select Sawtooth waveform
- **Bit 6**: Select Pulse waveform
- **Bit 7**: Select Noise waveform

**ADSR Envelope**: Defines the volume envelope for Voice 1, consisting of four phases:

- **Attack**: Time to reach peak volume.
- **Decay**: Time to decrease to sustain level.
- **Sustain**: Volume level maintained until release.
- **Release**: Time to fade out to zero volume.

Each phase is controlled by 4-bit values (0–15):

- **Attack/Decay ($D405)**:
  - Bits 4–7: Attack
  - Bits 0–3: Decay
- **Sustain/Release ($D406)**:
  - Bits 4–7: Sustain
  - Bits 0–3: Release

The timing for each value is approximately:

| Value | Attack Time | Decay Time | Release Time |
|-------|-------------|------------|--------------|
| 0     | 2 ms        | 6 ms       | 6 ms         |
| 1     | 8 ms        | 24 ms      | 24 ms        |
| 2     | 16 ms       | 48 ms      | 48 ms        |
| 3     | 24 ms       | 72 ms      | 72 ms        |
| 4     | 38 ms       | 114 ms     | 114 ms       |
| 5     | 56 ms       | 168 ms     | 168 ms       |
| 6     | 68 ms       | 204 ms     | 204 ms       |
| 7     | 80 ms       | 240 ms     | 240 ms       |
| 8     | 100 ms      | 0.3 s      | 0.3 s        |
| 9     | 0.25 s      | 0.75 s     | 0.75 s       |
| 10    | 0.5 s       | 1.5 s      | 1.5 s        |
| 11    | 0.8 s       | 2.4 s      | 2.4 s        |
| 12    | 1 s         | 3 s        | 3 s          |
| 13    | 3 s         | 9 s        | 9 s          |
| 14    | 5 s         | 15 s       | 15 s         |
| 15    | 8 s         | 24 s       | 24 s         |

([atarimagazines.com](https://www.atarimagazines.com/compute/issue49/424_1_Programming_64_Sound.php?utm_source=openai))

**Note**: The sustain phase is a level, not a time. The sound remains at this level until the gate bit is cleared, initiating the release phase.

## Source Code

```assembly
LDA #$01
STA $D019
```

```
PULSE WIDTH (%) = (REGISTER VALUE / 40.95)
```


```text
; Example: Setting up a raster interrupt at line 100

SEI                 ; Disable interrupts
LDA #<IRQ_HANDLER   ; Load low byte of IRQ handler address
STA $0314           ; Store at IRQ vector low byte
LDA #>IRQ_HANDLER   ; Load high byte of IRQ handler address
STA $0315           ; Store at IRQ vector high byte
LDA $D011
AND #%01111111      ; Clear bit 7 (high bit of raster line)
STA $D011
LDA #100            ; Set raster line to 100
STA $D012
LDA $D01A
ORA #%00000001      ; Enable raster interrupt
STA $D01A
CLI                 ; Re-enable interrupts
RTS

IRQ_HANDLER:
  ; Your interrupt code here
  LDA #$01
  STA $D019          ; Acknowledge raster interrupt
  ; Additional processing
  JMP $EA31          ; Jump to system IRQ handler
```

## Key Registers

- **$D000–$D02E**: VIC-II registers, including raster compare ($D012/$D011 bit 7), IRQ flags ($D019), IRQ mask/enable ($D01A), and control registers.
- **$D400–$D406**: SID Voice 1 registers (PWLO1 $D402, PWHI1 $D403, VCREG1 $D404, ADSR $D405–$D406).

## References

- "vic_interrupt_flags_and_sources_$D019" — Checking and clearing flags when IRQ occurs
- Compute! Magazine Issue 49, "Programming 64 Sound" — ADSR Envelope Values ([atarimagazines.com](https://www.atarimagazines.com/compute/issue49/424_1_Programming_64_Sound.php?utm_source=openai))

## Labels
- PWLO1
- PWHI1
- VCREG1
- ADSR
