# IRQ-driven tape read: read CIA1 Timer B and compute elapsed low byte

**Summary:** Reads CIA1 Timer B ($DC06/$DC07), computes the elapsed low-byte as ($FF - T2C_low), detects low-byte rollover by comparing high bytes, saves the high byte into $B1, and reloads Timer B with $FFFF; relevant registers: $DC06/$DC07 (CIA1 Timer B low/high).

**Description**
This fragment is the start of an IRQ-driven tape-bit sampling routine that uses CIA1 Timer B as a free-running 16-bit down-counter. The code's goal is to read the current Timer B value, compute the elapsed low-byte (used for pulse classification), ensure no low-byte rollover occurred while reading, save the high-byte for later use, and then reload Timer B to $FFFF so timing restarts.

Step-by-step behavior:
- LDX $DC07 — read Timer B high byte into X (initial TB_hi).
- LDY #$FF / TYA — set A = $FF (via Y then transfer) preparing to compute ($FF - TB_low).
- SBC $DC06 — subtract Timer B low byte from A, so A := $FF - T2C_low (the elapsed low-byte).
- CPX $DC07 / BNE loop — compare the initially-read TB_hi (in X) with the current TB_hi; if they differ, the low byte rolled over during the read, and the sequence restarts to obtain a consistent pair.
- STX $B1 — store the captured high byte (initial TB_hi) into zero page $B1 (used as a timing constant / high part for later classification).
- TAX — copy the computed elapsed low-byte (A) into X for immediate use.
- STY $DC06 ; STY $DC07 — write $FF (Y) into the Timer B low and high registers, reloading Timer B with $FFFF so the timer restarts its countdown.

Important correctness notes:
- The routine uses the classic two-read consistency check (read high, read low, re-read high and compare) to detect low-byte rollover.
- Writing $FF into $DC06/$DC07 reloads Timer B to $FFFF; it is not a read/save operation.

## Source Code
```asm
                                read tape bits, IRQ routine
                                read T2C which has been counting down from $FFFF. subtract this from $FFFF
.,F92C AE 07 DC LDX $DC07       read CIA 1 timer B high byte
.,F92F A0 FF    LDY #$FF        set $FF
.,F931 98       TYA             A = $FF
.,F932 ED 06 DC SBC $DC06       subtract CIA 1 timer B low byte
.,F935 EC 07 DC CPX $DC07       compare it with CIA 1 timer B high byte
.,F938 D0 F2    BNE $F92C       if timer low byte rolled over loop
.,F93A 86 B1    STX $B1         save tape timing constant max byte
.,F93C AA       TAX             copy $FF - T2C_l
.,F93D 8C 06 DC STY $DC06       save CIA 1 timer B low byte
.,F940 8C 07 DC STY $DC07       save CIA 1 timer B high byte
```

## Key Registers
- $DC06-$DC07 - CIA 1 - Timer B low/high (this fragment uses $DC06/$DC07 for Timer B)

## References
- "restart_timer_b_and_save_icr_copies" — expands on immediately restarting Timer B and saving ICR copies after reading T2C
- "compute_shifted_timing_and_threshold_compare" — expands on using the computed difference for threshold comparisons