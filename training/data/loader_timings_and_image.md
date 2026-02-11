# IRQ Tape-Loader — Timing Diagram

**Summary:** Timing diagram for an IRQ-based C64 tape loader, detailing pulse widths, threshold/sample points, and related timing information.

**Overview**

This section provides a textual representation of the timing diagram for an IRQ-driven tape loader. The diagram illustrates pulse widths, threshold levels, sample points, and other timing markers that define the loader's bit/byte decoding behavior.

**Timing Details**

The Commodore 64's tape system encodes data using pulse width modulation. Each bit is represented by a specific pulse length:

- **Bit "0"**: A short pulse followed by a medium pulse.
- **Bit "1"**: A medium pulse followed by a short pulse.

The pulse durations are as follows:

- **Short Pulse**: Approximately 176 microseconds (µs) per half-cycle, totaling 352 µs per full cycle.
- **Medium Pulse**: Approximately 256 µs per half-cycle, totaling 512 µs per full cycle.
- **Long Pulse**: Approximately 336 µs per half-cycle, totaling 672 µs per full cycle.

These values correspond to frequencies of 2840 Hz, 1953 Hz, and 1488 Hz, respectively. ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))

**CIA Timer Configuration**

The Commodore 64 utilizes the Complex Interface Adapter (CIA) timers to measure pulse durations during tape operations. The CIA timers operate at the system clock frequency, which is approximately 985.248 kHz for PAL systems and 1.022727 MHz for NTSC systems. ([stackoverflow.com](https://stackoverflow.com/questions/10496921/timer-frequency-for-c64-cia-timers?utm_source=openai))

To detect pulse lengths, Timer A of CIA #1 is configured to count system clock cycles. The timer is loaded with a value that represents the threshold between short and medium pulses. For example, a threshold value of 263 cycles corresponds to approximately 267 µs, which is between the durations of short and medium pulses. ([cadaver.github.io](https://cadaver.github.io/rants/irq-tape.html?utm_source=openai))

**Assembly Code Example**

Below is an example of how to set up CIA Timer A for measuring pulse durations:


In this setup, Timer A is loaded with the threshold value and started in continuous mode. An interrupt is enabled to trigger when the timer underflows, indicating that a pulse longer than the threshold has been detected.

## Source Code

```assembly
; Set Timer A to count system clock cycles
LDA #<263        ; Low byte of threshold value
STA $DC04        ; CIA #1 Timer A Low Byte
LDA #>263        ; High byte of threshold value
STA $DC05        ; CIA #1 Timer A High Byte

; Configure Timer A control register
LDA #%00010001   ; Start Timer A, continuous mode
STA $DC0E        ; CIA #1 Control Register A

; Enable Timer A interrupt
LDA #%00000001   ; Enable Timer A interrupt
STA $DC0D        ; CIA #1 Interrupt Control Register
```


## Key Registers

- **$DC04**: CIA #1 Timer A Low Byte
- **$DC05**: CIA #1 Timer A High Byte
- **$DC0E**: CIA #1 Control Register A
- **$DC0D**: CIA #1 Interrupt Control Register

## References

- ([c64-wiki.com](https://www.c64-wiki.com/wiki/Datassette_Encoding?utm_source=openai))
- ([stackoverflow.com](https://stackoverflow.com/questions/10496921/timer-frequency-for-c64-cia-timers?utm_source=openai))
- ([cadaver.github.io](https://cadaver.github.io/rants/irq-tape.html?utm_source=openai))

## Labels
- $DC04
- $DC05
- $DC0E
- $DC0D
