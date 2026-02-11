# Equal-Tempered Scale — SID Oscillator Frequency Values & Compact Lookup

**Summary:** Equal-tempered scale frequency values for the SID oscillator frequency control registers; 12 semitones per octave (12th root of 2), table based on 1.02 MHz master clock with A‑4 = 440 Hz; memory-efficient method: store 12 16-bit values for octave 8 (C-7..B-7, 24 bytes) and derive lower octaves by right-shifting; pack semitone (lower nibble) and octave (upper nibble) into one byte for lookup/shift routine; B-7 requires a special MSB-handling case when shifting.

**Overview**
- The equal-tempered scale contains 12 semitones per octave. Each semitone frequency = previous semitone × 2^(1/12).
- The full table (Appendix E) lists the 16-bit values to write into the SID oscillator frequency control registers to produce each note. That table was calculated for a 1.02 MHz master clock and concert pitch A‑4 = 440 Hz. For other master clock frequencies, use the frequency-to-register equation in the SID Register Description (referenced in the original source).
- A naïve full table for 8 octaves × 12 semitones requires 96 16-bit entries = 192 bytes.

**Memory-efficient generation**
- Observation: a note one octave lower has exactly half the frequency (and thus half the 16-bit register value). Therefore a 16-bit value for a note in octave N+1 can be converted to octave N by dividing by two.
- Store only the 12 semitone 16-bit values for octave 8 (C-7 through B-7). This is 12 × 2 bytes = 24 bytes.
- To generate any lower-octave note: select the semitone 16-bit value from the octave‑8 table, then right-shift it once per octave difference (each right-shift = divide by two).
- This saves memory while keeping exact integer register values consistent with the original full table (within the integer truncation of right shifts).

**B-7 and MSB special-case**
- The table includes B-7 (highest semitone) even though B-7 may be beyond the usable oscillator range; it is required for consistent octave-derived calculations.
- When right-shifting a 16-bit value, if the MSB (bit 15) of B-7 is set, a simple logical right-shift routine may lose that bit. The source suggests handling B-7’s MSB as a special case — e.g., generate that bit into the processor CARRY before shifting so the 16-bit arithmetic shift maintains the correct result when dividing by two repeatedly.
- Implementations must ensure the high byte/low byte pair is treated as a single 16-bit quantity when shifting (propagate carry between low and high byte).

**Semitone+Octave packing (1-byte note specifier)**
- The note can be encoded in one byte:
  - Lower nibble (bits 0–3): semitone index (0–11 addressing the 12-entry lookup table).
  - Upper nibble (bits 4–7): octave index (3 bits needed for 0–7; one bit unused).
- The division routine reads the octave nibble to determine how many right-shifts to perform on the 16-bit table value.
- Using this packed format keeps note lookup and octave scaling compact for table-driven playback routines.

## Source Code
```text
; Example assembly pseudocode for right-shifting a 16-bit value with MSB/CARRY handling

; Assume:
;   - A 16-bit value is stored in two consecutive bytes: LOW_BYTE and HIGH_BYTE
;   - The number of right shifts required is in the X register

ShiftRight:
    LDX #NUMBER_OF_SHIFTS  ; Load the number of shifts into X
    BEQ Done                ; If no shifts are needed, exit

ShiftLoop:
    LSR HIGH_BYTE           ; Logical shift right the high byte
    ROR LOW_BYTE            ; Rotate right the low byte (MSB from HIGH_BYTE into LOW_BYTE)
    DEX                     ; Decrement shift count
    BNE ShiftLoop           ; Repeat until all shifts are done

Done:
    RTS                     ; Return from subroutine
```
```text
; 12-entry octave‑8 16-bit values (C-7 to B-7) for the compact method

; Note   Frequency (Hz)   16-bit Register Value (Decimal)   16-bit Register Value (Hex)
; C-7    2093.00          35200                             $89C0
; C#7    2217.46          37300                             $91E4
; D-7    2349.32          39500                             $9A2C
; D#7    2489.02          41800                             $A348
; E-7    2637.02          44200                             $AC68
; F-7    2793.83          46700                             $B6AC
; F#7    2959.96          49300                             $C0F4
; G-7    3135.96          52000                             $CB20
; G#7    3322.44          54800                             $D5D0
; A-7    3520.00          57700                             $E164
; A#7    3729.31          60700                             $ED1C
; B-7    3951.07          63800                             $F94C
```