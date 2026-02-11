# store character ($FA60) — KERNAL entry

**Summary:** KERNAL routine at $FA60 handles "store character" entry for tape/serial input: it calls tape-byte setup (JSR $FB97), clears the byte-received flag ($9C), sets max byte timing (LDX #$DA / JSR $F8E2), inspects copies count ($BE) and serial-status ($AA), and exits to the common interrupt-restore path (JMP $FEBC) or branches into short-block / copies handling (JSR $FE1C).

## Flow / Behavior
This entry performs the following sequence (addresses shown for clarity):

- JSR $FB97 — perform new tape-byte setup (prepares for receiving a tape byte).
- STA $9C — clear the "byte received" flag in zero page ($9C).
- LDX #$DA / JSR $F8E2 — set the maximum timing counter for a byte ($DA loaded into X) and call the timing-setup routine.
- LDA $BE — load copies count; if zero, skip saving a temporary receiver-input-bit.
- STA $A7 — when copies count is non-zero, save the temporary receiver-input-bit storage in $A7.
- LDA #$0F — (value loaded, then...)
- BIT $AA — test serial-status byte ($AA). The BIT instruction affects flags used by the next branch.
- BPL $FA8D — if the negative flag is clear (sign bit of $AA clear), branch to $FA8D (alternate path; not contained in this chunk).
- If the branch is not taken (sign bit set), execution continues:
  - LDA $B5 — load a status/flag byte at $B5.
  - BNE $FA86 — if $B5 ≠ 0 branch to $FA86.
  - LDX $BE / DEX — decrement the copies count in X.
  - D0 $0B BNE $FA8A — if result ≠ 0 branch to $FA8A (falls through to the common exit).
  - LDA #$08 / JSR $FE1C — set the "short-block" indicator (A = #%00001000) and call $FE1C which ORs this into serial status (effectively setting the short-block bit).
  - D0 04 BNE $FA8A — branch on Z≠0 (conditional based on subroutine result).
- $FA86 path: LDA #$00 / STA $AA — clear serial-status byte ($AA) when appropriate.
- $FA8A: JMP $FEBC — jump to the KERNAL common interrupt-restore and exit routine.

Notes:
- The routine uses zero-page locations $9C (byte-received flag), $A7 (temporary receiver-input-bit), $B5, $BE (copies count), and $AA (serial-status).
- The code either sets a short-block status (OR into serial status via JSR $FE1C) or clears $AA and then transfers control to the common interrupt restore/exit ($FEBC).
- Branch targets outside this chunk (notably $FA8D and subroutines) contain the remaining logic paths; those are referenced but not included here.

**[Note: Source may contain an error — the inline comment "branch always" next to D0 04 BNE is incorrect: D0 is BNE (conditional), not an unconditional branch.]**

## Source Code
```asm
.,FA60 20 97 FB JSR $FB97       ; new tape byte setup
.,FA63 85 9C    STA $9C         ; clear byte received flag
.,FA65 A2 DA    LDX #$DA        ; set timing max byte
.,FA67 20 E2 F8 JSR $F8E2       ; set timing
.,FA6A A5 BE    LDA $BE         ; get copies count
.,FA6C F0 02    BEQ $FA70
.,FA6E 85 A7    STA $A7         ; save receiver input bit temporary storage
.,FA70 A9 0F    LDA #$0F
.,FA72 24 AA    BIT $AA
.,FA74 10 17    BPL $FA8D
.,FA76 A5 B5    LDA $B5
.,FA78 D0 0C    BNE $FA86
.,FA7A A6 BE    LDX $BE         ; get copies count
.,FA7C CA       DEX
.,FA7D D0 0B    BNE $FA8A       ; if ?? restore registers and exit interrupt
.,FA7F A9 08    LDA #$08        ; set short block
.,FA81 20 1C FE JSR $FE1C       ; OR into serial status byte
.,FA84 D0 04    BNE $FA8A       ; restore registers and exit interrupt, (conditional)
.,FA86 A9 00    LDA #$00
.,FA88 85 AA    STA $AA
.,FA8A 4C BC FE JMP $FEBC       ; restore registers and exit interrupt
```

## References
- "rs232_parity_and_startbit_handling" — expands on the alternate serial-status path taken when BIT $AA indicates another path (BPL/BVS related handling).
- "interrupt_restore_and_checksum_validation" — expands on the final early-exit target (JMP $FEBC) used by this entry for short-block and zero-copy exits.
