# ROM: FAC1 zero-check and FAC2 copy (B86A–B86C)

**Summary:** Checks FAC1 for zero and branches accordingly using 6502 mnemonics (BNE, JMP). If FAC1 is zero it jumps to $BBFC to copy FAC2 into FAC1 and return; if non‑zero execution continues at $B86F to perform the FAC2+FAC1 add sequence.

## Description
This snippet is an entry check used before the "add FAC2 to FAC1" sequence. The two instructions perform a simple control-flow decision on the prior zero flag (set by the previous code that inspected FAC1):

- At $B86A a BNE $B86F transfers execution to $B86F when FAC1 is non‑zero (zero flag clear), continuing the add routine.
- At $B86C a JMP $BBFC is taken when FAC1 is zero (zero flag set); $BBFC is a helper that copies FAC2 into FAC1 and returns, so when FAC1 is zero the add degenerates to a copy.

No register or memory addresses for FAC1/FAC2 are given here; the snippet assumes earlier code has set the processor flags based on FAC1 before this branch.

## Source Code
```asm
.,B86A D0 03    BNE $B86F       ; branch if FAC1 is not zero
.,B86C 4C FC BB JMP $BBFC       ; FAC1 was zero so copy FAC2 to FAC1 and return
```

## References
- "save_rounding_and_load_exponents" — expands on exponent/rounding setup when FAC1 != 0