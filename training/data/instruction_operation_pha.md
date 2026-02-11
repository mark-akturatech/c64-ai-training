# 6502 PHA (Push Accumulator)

**Summary:** PHA pushes the Accumulator (A) onto the processor stack (page $0100), using implied addressing. Opcode $48, 1 byte, 3 cycles. Stack pointer (S) is decremented after storing the byte.

## Description
PHA stores the current accumulator value onto the hardware stack located at addresses $0100 + S (S = stack pointer). The 6502 stack grows downward: a push writes to $0100 + S and then decrements S. On reset S is normally $FF (top of stack = $01FF). PHA uses implied addressing and does not modify any processor status flags.

Operation specifics (standard 6502 behavior):
- Effective address: $0100 + S
- Memory write: M[$0100 + S] = A
- Update: S := S - 1 (wraps from $00 to $FF)
- Flags: none affected
- Opcode: $48
- Bytes: 1
- Cycles: 3

PHA is commonly paired with PLA (pull accumulator, opcode $68) to save/restore A across subroutines or interrupts.

## Source Code
```text
/* PHA pseudocode (from source) */
    src = AC;
    PUSH(src);
```

```asm
; Example: push immediate value into A then push onto stack
    LDA #$7F    ; A <- $7F      (A9 7F)  2 cycles
    PHA         ; push A to $0100+S  (48)  3 cycles

; Macro patterns (safe, portable):
; Push the accumulator (direct):
    .macro PUSH_A
    PHA
    .endm

; Push an arbitrary memory location/value (loads into A then PHA):
    .macro PUSH src
    LDA src
    PHA
    .endm
```

```text
Opcode summary entry:
Mnemonic: PHA
Opcode: $48
Addressing: Implied
Bytes: 1
Cycles: 3
Effect: Push A to stack ($0100 + S); S = S - 1
Flags: No flags affected
```

## References
- "instruction_tables_pha" — expands on PHA opcode and table entries

## Mnemonics
- PHA
