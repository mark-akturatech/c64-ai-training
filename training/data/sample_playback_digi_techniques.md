# SID 6581/8580 — 4-bit Digitized Sample Playback via Volume-Register Click

**Summary:** 4-bit digitized sample playback technique for the SID (write-driven clicks on $D418) using nybble-packed samples (two 4-bit samples per byte). Covers CPU/timing tradeoffs, typical sample rates (4–8 kHz), 6581 vs 8580 behavioral differences, and the ~330 kΩ resistor mod for 8580 EXT IN.

**Technique overview**
On the MOS 6581, writes to the SID volume register ($D418) produce an audible click proportional to the volume change. By rapidly writing successive 4-bit amplitude nibbles to $D418, you can play digitized audio at 4-bit resolution (16 levels). Samples are typically stored nybble-packed (two 4-bit samples per byte) to halve memory bandwidth.

Key points:
- Format: nybble-packed 4-bit samples (high nybble then low nybble). Two output writes per byte.
- Quality: 4-bit audio (16 amplitude levels). Typical usable sample rates are 4 kHz (low quality) to ~8 kHz (telephone quality).
- Timing: Tight, deterministic timing required — usually driven by a CIA timer IRQ or a carefully-timed loop on the CPU. Writes must occur at fixed intervals (half-byte and full-byte boundaries as shown in the example).
- CPU cost: High. This method consumes significant CPU time and conflicts with normal SID music because the volume register is shared.
- FILTER bit: Example code ORs with #$10 to preserve filter routing (bit 4 used to keep low-pass or filter routing on in typical usage).
- 6581 vs 8580: Works well on the 6581. On the 8580 the click is much weaker; adding a ~330 kΩ resistor from EXT IN to ground restores digi playback capability on many 8580 chips by biasing the external input (hardware mod required).

Advanced note:
- Mahoney-style 8-bit digi techniques exist that exploit combined waveform and pulse-width quirks on the 6581 to achieve higher effective resolution, but these are more complex and CPU- / setup-intensive.

## Source Code
```asm
; Play 4-bit sample (nybble-packed, 2 samples per byte)
; Called at sample rate (typically 4-8 kHz via CIA timer)
; Assumes sample_ptr is a zeropage pointer to the sample buffer and
; sample_index is a zero-page index (byte index into packed stream).

play_sample:
    ldy sample_index
    lda (sample_ptr),y   ; Load packed sample byte

    ; Extract high nybble (first sample)
    lsr
    lsr
    lsr
    lsr
    ora #$10             ; Keep low-pass filter on (optional)
    sta $d418            ; Write to volume register

    ; ... wait half sample period ...

    lda (sample_ptr),y   ; Reload packed byte
    and #$0f             ; Extract low nybble (second sample)
    ora #$10             ; Keep filter bits
    sta $d418

    iny
    sty sample_index
    rts
```

Notes in source:
- The example uses ORA #$10 to preserve filter-routing bit(s) when writing amplitude nibbles.
- Timing between the two writes (half-sample period) must be maintained precisely by the caller (e.g., split CIA timer intervals or a short busy-wait loop).
- This listing is the core playback routine; buffer management, sample pointer setup, IRQ handling and repeat/loop logic are not included.

## Key Registers
- $D415-$D418 - SID - Filter control and volume/voice-output routing and volume register (writes to $D418 produce the audible volume-change click used for digi playback)

## References
- "chip_variants_6581_8580" — expands on electrical/behavioral differences between 6581 and 8580 (why 8580 needs resistor mod)
- "known_quirks" — documents SID quirks including the volume-register click used for digi playback