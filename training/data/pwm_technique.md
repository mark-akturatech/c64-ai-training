# SID Pulse Width Modulation (PWM) — Voice 1 ($D402/$D403), Control ($D404)

**Summary:** How to animate SID pulse width (12-bit PWM) by initializing $D402/$D403 to 50% ($0800) and toggling the pulse waveform + gate via $D404; shows per-frame increment loop and notes to use a 16-bit accumulator + delta for smoother PWM updates.

## Description
Pulse Width Modulation on the SID changes the duty cycle of the pulse waveform to create animated, chorus-like timbres. The SID uses a 12-bit pulse width value formed from the low byte at $D402 and the high 4 bits in $D403 (mask with #$0F to keep within 12-bit range).

- Set $D402/$D403 to $0800 (2048 decimal) for a 50% square wave.
- Enable the pulse waveform and gate by writing the appropriate bits to $D404 (example uses #$41: pulse + gate).
- Update PWM once per frame (raster-synced or via timer interrupt) by incrementing the 12-bit value in $D402/$D403. The example increments the low byte and carries into the high nibble; the high byte is masked with #$0F to keep it within 12 bits.
- For smoother modulation, use a higher-resolution accumulator (16-bit counter) and add a delta each frame, then map the accumulator’s top 12 bits to the SID pulse width (use a 16-bit accumulator to increase effective resolution).

Caveat: The sample uses a simple increment per frame; audible stepping can be reduced by using finer step sizes and updating more frequently or by using the 16-bit accumulator + delta technique.

## Source Code
```asm
; Set initial pulse width to 50% (square wave)
lda #$00
sta $d402         ; PW lo
lda #$08
sta $d403         ; PW hi ($0800 = 2048 = 50%)

; Select pulse waveform + gate
lda #$41          ; Pulse ($40) + Gate ($01)
sta $d404

; In the main loop, increment pulse width each frame:
pwm_loop:
  ; Wait for rasterline (or use timer interrupt)
  inc $d402       ; Increment pulse width low byte
  bne no_carry
  inc $d403       ; Carry to high byte
  lda $d403
  and #$0f        ; Keep within 12-bit range
  sta $d403
no_carry:
  jmp pwm_loop
```

## Key Registers
- $D400-$D406 - SID (Voice 1) - Frequency low/high, PW low/high (12-bit), Control (waveform + gate), Attack/Decay, Sustain/Release

## References
- "waveforms_pulse_rectangle" — details on pulse width role in timbre and pulse/rectangle waveform behavior
- "raster_synchronized_playback" — timing and methods for synchronizing PWM updates to raster or timers