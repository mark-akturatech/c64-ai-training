# SID Filter Registers $D415-$D418

**Summary:** SID filter registers $D415-$D418 control the 11-bit filter cutoff, resonance, voice routing, filter modes (LP/BP/HP combinations) and master volume on the SID 6581/8580 chips; cutoff mapping differs between 6581 (~200 Hz–12 kHz, non-linear) and 8580 (~30 Hz–12 kHz, more linear).

## Filter registers — behavior and notes
- $D415/$D416 form an 11-bit FILTER CUTOFF value (0–2047). The effective cutoff frequency is chip-dependent: the 6581 yields a non-linear, temperature-sensitive response roughly spanning ~200 Hz to ~12 kHz; the 8580 yields a more linear response roughly spanning ~30 Hz to ~12 kHz.
- $D417 sets RESONANCE (4 bits) and routes voices or the external input into the filter (bits for EX/3/2/1). Higher resonance increases the peak at cutoff; on the 6581 high resonance can cause self-oscillation.
- $D418 selects filter MODE bits (HP/BP/LP), a MUTE bit for voice 3, and the master VOLUME (4-bit).
- Filter mode bits can be combined to produce composite responses:
  - LP only = low-pass
  - BP only = band-pass
  - HP only = high-pass
  - LP + HP = notch / band-reject
  - LP + BP = low-pass with wider/altered rolloff
  - HP + BP = high-pass with wider/altered rolloff
  - LP + BP + HP = all-pass (phase shifting)
- MUTE 3 (bit 7 of $D418) mutes voice 3 output but the oscillator still runs and can be sampled/read for modulation purposes (see $D41B for voice 3 readback/use).
- Cutoff composition formula (11-bit value):
  - Cutoff = (HighByte * 8) + (LowByte AND 7)
  - Where HighByte = $D416, LowByte = $D415 (bits 2-0)
- Resonance: 0–15 (4-bit). On 6581, high resonance may cause self-oscillation and audible peak; 8580 has milder resonance behavior.
- External input routing: set FILT EX bit in $D417 to route the external audio input (EXT IN pin) through the filter.
- Master volume is 4 bits (0–15) in $D418 (lower nibble).

## Source Code
```text
Register map (write-only):

$D415 / 54293 - FILTER CUTOFF FREQUENCY LOW
  Bits 2-0: Low 3 bits of 11-bit cutoff frequency
  Bits 7-3: Unused

$D416 / 54294 - FILTER CUTOFF FREQUENCY HIGH
  Bits 7-0: High 8 bits of 11-bit cutoff frequency
  Cutoff value = (HighByte * 8) + (LowByte AND 7)
  Range: 0-2047

Approximate cutoff frequency mapping (chip-dependent):
  6581: ~200 Hz to ~12 kHz (non-linear, temperature dependent)
  8580: ~30 Hz to ~12 kHz (more linear response)

$D417 / 54295 - FILTER RESONANCE AND VOICE ROUTING
  Bits 7-4: RESONANCE (0-15)
           Controls peak/emphasis at cutoff frequency; high values increase peak.
           On 6581, max resonance can self-oscillate.
  Bit 3:    FILT EX  - Route external audio input through filter
  Bit 2:    FILT 3   - Route Voice 3 through filter
  Bit 1:    FILT 2   - Route Voice 2 through filter
  Bit 0:    FILT 1   - Route Voice 1 through filter

$D418 / 54296 - FILTER MODE AND MASTER VOLUME
  Bit 7:    MUTE 3   - Disconnect Voice 3 output (1 = muted)
                      (Voice 3 oscillator still runs and can be read at $D41B)
  Bit 6:    HP       - High-pass filter enable (1 = on)
  Bit 5:    BP       - Band-pass filter enable (1 = on)
  Bit 4:    LP       - Low-pass filter enable (1 = on)
  Bits 3-0: VOLUME   - Master volume (0-15)

Filter mode combinations:
  LP only        : Low-pass
  BP only        : Band-pass
  HP only        : High-pass
  LP + HP        : Notch / band-reject
  LP + BP        : Low-pass with altered/wider rolloff
  HP + BP        : High-pass with altered/wider rolloff
  LP + BP + HP   : All-pass (phase shifting)
```

## Key Registers
- $D415-$D418 - SID - Filter cutoff low/high (11-bit), resonance, external/voice routing, filter mode bits, mute voice 3, master volume

## References
- "filter_cutoff_frequency" — detailed cutoff mapping and differences
- "resonance_control" — resonance behavior and 6581 self-oscillation
- "pinout_reference" — external input (EXT IN) pin and routing details