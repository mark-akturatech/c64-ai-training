# KERNAL $F7EA-$F80C — Indirect compare loop using ($BB) and ($B2), index bytes $9E/$9F

**Summary:** KERNAL routine that JSRs $F72C, initializes a 16-bit index in zero page $9F:$9E, and loops comparing bytes fetched via indirect zero-page pointers ($BB),Y and ($B2),Y; increments $9E/$9F as a 16-bit index and exits on mismatch, on equal-to-limit ($B7), or after the index low byte wraps to zero. Search terms: $F72C, $F7EA, $F80C, ($BB),($B2), $9E/$9F, $B7.

## Description
- Entry: JSR $F72C (preparatory routine). If that call returns with carry set (BCS), the routine returns immediately ($F80C).
- Index initialization:
  - $9F ← #$05 (high byte)
  - $9E ← #$00 (low byte)
- Main loop (F7F7..F801):
  - CPY $B7 — compares current Y with the byte at $B7; if equal, branch to $F80B (clear carry, return success).
  - LDA ($BB),Y — load A from the indirect pointer at $BB with index Y (Y currently holds the low index for the first LDA).
  - LDY $9F — load Y from $9F (the high index byte).
  - CMP ($B2),Y — compare A with the byte fetched via indirect pointer at $B2 indexed by Y.
  - If bytes differ (BNE $F7EA) the routine returns to $F72C entry point (mismatch handling path).
- Index increment and loop control:
  - INC $9E (increment low byte)
  - INC $9F (increment high byte) — together these form a 16-bit increment across $9E/$9F (low/high).
  - LDY $9E ; BNE $F7F7 — if low byte is non‑zero, loop (this means the loop will iterate until the low byte wraps to zero).
- Successful exit: CLC ; RTS at $F80B/$F80C.
- Notes on addressing behavior:
  - The code uses two different Y values in each compare iteration: the first load (LDA ($BB),Y) uses Y as it was before LDY $9F (initially the low index), while the CMP ($B2),Y uses Y loaded from $9F (the high index). This is explicit in the code sequence and must be considered when tracing pointer/index relationships.
  - The CPY $B7 test occurs before the pair of indirect loads/comparisons; it checks Y (the low index at that moment) against $B7 to detect a termination condition.

## Source Code
```asm
.,F7EA 20 2C F7    JSR $F72C
.,F7ED B0 1D       BCS $F80C
.,F7EF A0 05       LDY #$05
.,F7F1 84 9F       STY $9F
.,F7F3 A0 00       LDY #$00
.,F7F5 84 9E       STY $9E
.,F7F7 C4 B7       CPY $B7
.,F7F9 F0 10       BEQ $F80B
.,F7FB B1 BB       LDA ($BB),Y
.,F7FD A4 9F       LDY $9F
.,F7FF D1 B2       CMP ($B2),Y
.,F801 D0 E7       BNE $F7EA
.,F803 E6 9E       INC $9E
.,F805 E6 9F       INC $9F
.,F807 A4 9E       LDY $9E
.,F809 D0 EC       BNE $F7F7
.,F80B 18          CLC
.,F80C 60          RTS
```

## Key Registers
- $009E - Zero Page - low index byte for the indirect compare loop
- $009F - Zero Page - high index byte for the indirect compare loop
- $00B2 - Zero Page - pointer used by CMP ($B2),Y
- $00BB - Zero Page - pointer used by LDA ($BB),Y
- $00B7 - Zero Page - byte compared against Y (termination/limit)

## References
- "prepare_channel_registers" — expands on registers/pointers prepared and used by the JSR $F72C call
- "increment_a6_and_check_limit" — expands on calling sequences used after comparisons and limit checks