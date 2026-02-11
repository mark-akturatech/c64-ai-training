# CSTE2 ($F838) — KERNAL cassette PLAY+RECORD check / 'RECORD' message trigger

**Summary:** Disassembly excerpt for KERNAL routine CSTE2 at $F838 that calls CS10 ($F82E) to test cassette switches, checks flags via BEQ/BNE, and (when both PLAY and RECORD are active) sets Y to #$2E (pointer/index MS8-MS1) to display the "RECORD" message; branches back into the "PRESS PLAY" path when appropriate. Searchable terms: $F838, $F82E, CSTE2, CS10, CS25, CS30, LDY #$2E, KERNAL cassette.

**Description**
This chunk is a small, fully commented disassembly fragment of the KERNAL cassette-state routine labeled CSTE2 at $F838. Behavior summary:

- **JSR $F82E (CS10):** Performs cassette switch checks and debounce, likely verifying the status of the PLAY and RECORD switches.
- **BEQ $F836 (CS25):** If the previous call sets the Z flag (indicating the cassette is not in the expected state), branch back to handle the "PRESS PLAY" prompt.
- **LDY #$2E:** Load Y with immediate value $2E, corresponding to the index of the "RECORD" message in the message table.
- **BNE $F81E (CS30):** Unconditionally branch to the routine that displays the "RECORD" message.

The routine checks if both PLAY and RECORD are active. If so, it triggers the display of the 'RECORD' message. Otherwise, control branches back to the "PRESS PLAY" prompt.

## Source Code
```asm
; CHECKS FOR PLAY & RECORD
;
.; Address  Opcode   Mnemonic    Label/Comment
.,F838 20 2E F8  JSR $F82E       ; CSTE2  JSR CS10
.,F83B F0 F9     BEQ $F836       ;        BEQ    CS25
.,F83D A0 2E     LDY #$2E        ;        LDY    #MS8-MS1        ; "RECORD"
.,F83F D0 DD     BNE $F81E       ;        BNE    CS30
```

## Key Registers
- **Y Register:** Loaded with $2E to point to the "RECORD" message in the message table.

## References
- "press_play_prompt_and_debounce" — expands on related cassette switch checks and messaging functions
- "block_entry_read_write_setup" — expands on setup before read/write block operations

## Labels
- CSTE2
