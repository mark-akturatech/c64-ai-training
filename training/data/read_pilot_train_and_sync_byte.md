# Read Pilot train and Sync byte (loader phase)

**Summary:** Detects C64 tape pilot byte ($40) and sync byte ($5A), loops until sync is found, performs self-modifying code by storing $2B into address $036D (changes branch target), zeroes checksum storage ($05), and transfers control toward header-read state.

## Behavior and flow
This routine inspects each assembled incoming byte and distinguishes three cases: pilot, sync, or neither.

- CMP #$40 / BEQ $0379 — If the incoming byte equals the Pilot value $40, branch back to $0379 to continue consuming the pilot byte run (i.e. keep reading pilot bytes).
- If not pilot, CMP #$5A / BEQ $038E — if the byte equals the Sync value $5A, it is treated as the Sync byte and the routine transitions into the header-read state.
- If neither pilot nor sync, BNE $03E0 — retry alignment/seek the FIRST pilot byte again (resynchronise to the pilot run).

On detecting Sync ($5A) the routine:
- LDA #$2B / STA $036D — writes $2B into memory at $036D. This is self-modifying code: $036D holds an operand (low byte) used by a branch/jump at $036C, and storing $2B changes the branch target so execution will continue at $0399 (state-switch).
- LDA #$00 / STA $05 — initializes zero into $05 (used here for checksum accumulation/storage).
- BEQ $0379 — follows the zero result of LDA #$00 and branches to $0379 to continue the next phase (reads an unused byte then header bytes — see referenced chunk "read_unused_byte").

This implements a simple finite-state machine: consume pilot bytes, detect sync, flip runtime control flow via self-modifying code to enter the header-read sequence, and reset checksum state.

## Source Code
```asm
; ********************************************
; * Read Pilot train and Sync byte           *
; ********************************************
0384  C9 40          CMP #$40       ; Compare incoming byte to Pilot ($40)
0386  F0 F1          BEQ $0379      ; If Pilot, loop back to keep consuming pilot bytes
0388  C9 5A          CMP #$5A       ; Compare incoming byte to Sync ($5A)
038A  F0 02          BEQ $038E      ; If Sync, handle transition

038C  D0 52          BNE $03E0      ; If neither, retry alignment (seek FIRST Pilot byte)

038E  A9 2B          LDA #$2B
0390  8D 6D 03       STA $036D      ; Self-modify code: change branch target operand at $036D
0393  A9 00          LDA #$00
0395  85 05          STA $05        ; Initialize checksum/storage to 0
0397  F0 E0          BEQ $0379      ; Branch (Z=1 from LDA #$00) to continue to next phase
; ********************************************
; * Read Pilot train and Sync byte.END       *
; ********************************************
```

## References
- "irq_isr" — expands on ISR constructs and how bytes are consumed by this routine
- "read_unused_byte" — the next phase: reads an unused byte immediately before header bytes
