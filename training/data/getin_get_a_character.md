# GETIN ($FFE4) — Get a character

**Summary:** GETIN is a KERNAL input routine at $FFE4 (65508) that removes one character from the keyboard queue (up to 10 chars, filled by SCNKEY) and returns its ASCII in the A register; for RS‑232 it returns a single character in A. Preparatory calls: CHKIN, OPEN. Check READST for error/status.

## Description
GETIN (call vector $FFE4 / 65508) obtains one character from the current input channel and returns it in the accumulator (A):

- Keyboard channel:
  - Removes one character from the keyboard queue and returns its ASCII code in A.
  - If the queue is empty, A is set to zero.
  - The keyboard queue is filled by an interrupt-driven keyboard scan routine (SCNKEY) and holds up to 10 characters; once full, further keystrokes are ignored until the buffer drops below capacity.
- RS‑232 (serial) channel:
  - A single character is returned in A (only A is used).
  - Use READST to check validity/status of the returned character.
- If the channel is serial, cassette, or screen, higher-level input handling is done by BASIN (use BASIN instead as indicated).

Behavioral notes:
- GETIN is a low-level, immediate input routine — it reads from the currently selected input channel.
- It does not perform higher-level channel handling (use CHRIN for channel-aware input).
- Error/status conditions are reported via READST (see READST for meanings).

## Metadata
- Purpose: Get a character
- Call address: $FFE4 (hex) / 65508 (decimal)
- Communication registers: A (returns ASCII or zero)
- Preparatory routines: CHKIN, OPEN
- Error returns: See READST
- Stack requirements: 7+
- Registers affected: A (X, Y may be altered)

## Usage
1. Open/select the desired input channel (OPEN, CHKIN as appropriate).
2. Call GETIN with JSR $FFE4 (or JSR GETIN if symbol defined).
3. Test A for zero (keyboard empty) or otherwise handle the returned ASCII.
4. For serial input, consult READST after GETIN to verify & interpret status.

Example behavior: loop waiting until a non-zero character is returned.

## Source Code
```asm
        ; WAIT FOR A CHARACTER
WAIT    JSR GETIN       ; (vector $FFE4)
        CMP #0
        BEQ WAIT
```

## Key Registers
- $FFE4 - KERNAL - GETIN (Get a character from current input channel; call vector)

## References
- "chrin_get_character_from_input_channel" — CHRIN retrieves characters from the current input channel (higher-level handling vs GETIN)
- "iobase_define_io_memory_page" — IOBASE and I/O page locations used for RS-232 and other device access

## Labels
- GETIN
