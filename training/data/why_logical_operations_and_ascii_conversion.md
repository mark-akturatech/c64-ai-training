# Logical Operators (AND / ORA / EOR)

**Summary:** Uses of 6502 logical instructions AND, ORA, and EOR for bit-level control: masking input bits for testing (use AND and inspect the Z flag), setting/clearing I/O control lines on interface ports, creating oscillating effects by flipping bits (EOR), and converting between ASCII and binary digit representations without arithmetic.

## Why logical operations?
Logical instructions operate on each bit independently within a byte, so you can turn individual bits on, off, or flip them without disturbing the other bits in the same byte. This is useful wherever one byte encodes multiple independent signals or flags.

Common practical uses:
- Control of external hardware via interface adapter (IA) I/O ports: each bit can represent a separate control line; logical ops change one control line without altering others.
- Masking input for bit tests: AND unwanted bits to zero, then test the result (Z flag set if result is zero) to detect a particular input bit state.
- Oscillation/animation effects: flip bits with EOR to create blinking pixels, flashing text, or simple audio toggles.
- Code translation between character (ASCII) and numeric values: clear or set specific bits (AND / ORA) to convert ASCII-coded digits to their numeric equivalents or vice versa, often simpler than arithmetic.

Example showing bit patterns (binary notation %nnnnnnnn):
- ASCII "5" = %00110101
- Binary 5   = %00000101

To convert ASCII "5" (%00110101) to numeric 5 (%00000101) you can mask out bit positions that represent ASCII offsets using AND; to create ASCII from a numeric digit you can OR in the necessary bits with ORA. EOR is used when you need to flip bits (toggle) rather than force them to 0 or 1.

## References
- "logical_eor_and_examples" — expands on EOR example and flipping bits  
- "getin_subroutine_keyboard_input" — describes GETIN returning ASCII input and conversion techniques

## Mnemonics
- AND
- ORA
- EOR
