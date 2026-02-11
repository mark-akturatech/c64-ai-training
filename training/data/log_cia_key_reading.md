# LOG CIA KEY READING (KERNAL)

**Summary:** Reads CIA keyboard register $DC01, waits for the value to settle (double-read), tests the sign bit and, for certain conditions, stores the sampled key value in STKEY ($0091). Uses CIA1 data port writes ($DC00) to latch/drive the keyboard and TAX/LDX/STA loops for stable-polling and a small wrap-based test.

## Description
This KERNAL routine polls the CIA keyboard register at $DC01 and stores a detected STOP/RVS keypress into STKEY ($91). It uses a stable-read technique (read/memory-compare loop) to avoid transient values, and toggles a value into the CIA data port ($DC00) to latch or influence the keyboard lines.

Step-by-step behavior:
- LDA $DC01 / CMP $DC01 / BNE loop: reads $DC01 twice, looping until two consecutive reads match (stable value).
- TAX / BMI $F6DA: moves the stable value to X and tests the accumulator's sign (bit 7). If negative (N flag set), branch to store A into STKEY and return.
- LDX #$BD; STX $DC00: write #$BD to $DC00 (drive/latch pattern).
- AE 01 DC / EC 01 DC / BNE loop: load $DC01 into X and loop until X equals $DC01 (stable X vs memory).
- STA $DC00: write the previously sampled A to $DC00 (restoring or altering the drive pattern).
- INX / BNE skip-store: increment X; if increment does not wrap to zero (i.e., X != 0), the routine returns. If INX wraps X to zero, execution falls through to store the key in STKEY.
- STA $91: store the accumulator (sampled key value) into zero page $91 (STKEY), marking STOP/RVS detection.
- RTS: return from subroutine.

Notes:
- The double-read (read then CMP against the same address) is a debounce/stability check.
- The writes to $DC00 are used to change the CIA port outputs that drive the keyboard matrix (latch/select pattern). The exact bit-level meaning of $BD is not decoded here — the code uses the pattern as a transient latch/scan value.
- STKEY ($91) is a zero-page flag used elsewhere by the STOP routine (see references).

## Source Code
```asm
                                *** LOG CIA KEY READING
                                This routine tests the keyboard for either <STOP> or <RVS>
                                pressed. If so, the keypress is stored in STKEY.
.,F6BC AD 01 DC LDA $DC01       keyboard read register
.,F6BF CD 01 DC CMP $DC01
.,F6C2 D0 F8    BNE $F6BC       wait for value to settle
.,F6C4 AA       TAX
.,F6C5 30 13    BMI $F6DA
.,F6C7 A2 BD    LDX #$BD
.,F6C9 8E 00 DC STX $DC00       keyboard write register
.,F6CC AE 01 DC LDX $DC01       keyboard read register
.,F6CF EC 01 DC CPX $DC01
.,F6D2 D0 F8    BNE $F6CC       wait for value to settle
.,F6D4 8D 00 DC STA $DC00
.,F6D7 E8       INX
.,F6D8 D0 02    BNE $F6DC
.,F6DA 85 91    STA $91         STKEY, flag STOP/RVS
.,F6DC 60       RTS
```

## Key Registers
- $DC00-$DC01 - CIA1 - keyboard port writes/reads (drive/latch via $DC00, data read via $DC01)
- $0091 - Zero page - STKEY (stores STOP/RVS keypress)

## References
- "stop_check_stop_key" — expands on STKEY ($91) usage by the STOP routine

## Labels
- CIA1
- STKEY
