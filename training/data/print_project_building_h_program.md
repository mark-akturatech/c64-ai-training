# Print 'H' at $033C (cassette buffer)

**Summary:** Small machine-language program assembled at $033C that demonstrates immediate addressing (LDA #$48), calling the KERNAL print routine JSR $FFD2 (CHROUT), and returning to the monitor with BRK. Includes assembler-ready listing and opcode bytes.

## Plan / Explanation
- Place the program at address $033C (the cassette buffer) and assemble there with the monitor assembler.
- LDA #$48 uses immediate addressing (the octothorpe/hash/pound sign indicates a value, not an address) to load A with $48 (ASCII 'H').
- JSR $FFD2 calls the KERNAL CHROUT routine which prints the character in A to the current output device (screen/console).
- BRK returns control to the machine-language monitor.

No additional data or memory manipulation is required for this minimal example.

## Source Code
```asm
* = $033C        ; assemble to cassette buffer area

LDA #$48        ; A9 48  -> load A with $48 ('H')
JSR $FFD2       ; 20 D2 FF -> call KERNAL CHROUT to print A
BRK             ; 00 -> return to monitor / break

; Assembled bytes at $033C:
; $033C: A9 48 20 D2 FF 00
```

## Key Registers
- $033C - Memory - Cassette buffer (used here as program load address)
- $FFD2 - KERNAL - CHROUT character output routine (prints A register)

## References
- "why_not_poke_screen_vs_ch_rout" — CHROUT vs POKE-to-screen discussion
- "monitor_assembler_extensions_nonsymbolic" — using the monitor assembler and non-symbolic addresses

## Labels
- CHROUT
