# POKE/PEEK/WAIT Parameter Parsing and FAC1→Integer Conversion (ROM $B7EB–$B848)

**Summary:** Disassembly of Commodore 64 BASIC ROM routines at $B7EB–$B848 that parse parameters for POKE/WAIT, convert FAC_1 (floating accumulator) into a temporary 16-bit integer ($14/$15), implement PEEK (memory read → FAC_1) and POKE (write), and implement WAIT polling (loop testing (mem XOR EOR) AND mask). Includes checks for negative values and out-of-range exponents.

**Parameter Parsing and Behavior Summary**

- **Entry $B7EB:** Common entry that evaluates an address expression (JSR $AD8A), ensures it is numeric, converts FAC_1 to an integer in temporary integer ($14 low, $15 high) via JSR $B7F7, scans for a comma (JSR $B7F1), and then obtains the byte/quantity parameter. On return, X contains the byte parameter (used by POKE/WAIT), and the temporary 16-bit address is at $14/$15 (low/high).

- **FAC_1 → Temporary Integer ($B7F7):** Reads FAC_1 fields from zero page:
  - $66 — FAC_1 sign (LDA $66); negative values branch to illegal quantity at $B798.
  - $61 — FAC_1 exponent (LDA $61); compared to #$91 (CMP #$91); if ≥ $91, branch to illegal quantity at $B798 (exponent indicates value ≥ 2^16).
  - JSR $BC9B converts FAC_1 floating to fixed.
  - After conversion, $64 (mantissa byte 3) → temp low ($14), $65 (mantissa byte 4) → temp high ($15). RTS.

- **PEEK ($B80D):** Saves temp integer ($15/$14) on stack, calls $B7F7 to convert FAC_1 to integer (address), clears Y, reads a byte via indirect indexed LDA ($14),Y, copies the byte into Y (TAY), restores $14/$15 from stack, then JMP $B3A2 to convert Y (the read byte) into FAC_1 and return to BASIC.

- **POKE ($B824):** Calls $B7EB to get parameters; after return, TXA (8A) copies X into A (value to store), clears Y, then STA ($14),Y writes A to the address in $14/$15, RTS.

- **WAIT ($B82D):** Calls $B7EB to get address and first byte parameter (mask) in X; saves mask with STX $49. Then sets X=0 and JSR $0079 (scan memory) to check for an optional third argument. If a third argument exists, JSR $B7F1 scans for a comma and gets the third byte, stored via STX $4A as the EOR argument. The loop:
  - LDY #$00; LDA ($14),Y retrieves memory byte.
  - EOR $4A — XOR with optional EOR argument (0 if absent).
  - AND $49 — AND with mask (first argument).
  - BEQ loop if result is zero (i.e., wait until ((mem XOR EOR) AND mask) != 0).
  - RTS when condition satisfied.

**Notes on Argument Placement and Registers:**

- The temporary 16-bit address used for indirect accesses is stored at $14 (low) and $15 (high).
- FAC_1 fields accessed: $66 (sign), $61 (exponent), $64/$65 (mantissa bytes 3/4) — these feed the FAC_1→integer conversion.
- The "byte" parameter returned by the parameter parser is in X on return; POKE copies it to A with TXA before the write. WAIT saves that X into $49 (mask) and possibly uses $4A for an optional EOR argument.

## Source Code

```asm
        ;*** get parameters for POKE/WAIT
.,B7EB 20 8A AD    JSR $AD8A       ; evaluate expression and check if numeric, else type mismatch
.,B7EE 20 F7 B7    JSR $B7F7       ; convert FAC_1 to integer in temporary integer
.,B7F1 20 FD AE    JSR $AEFD       ; scan for ",", else do syntax error then warm start
.,B7F4 4C 9E B7    JMP $B79E       ; get byte parameter and return

        ;*** convert FAC_1 to integer in temporary integer
.,B7F7 A5 66       LDA $66         ; get FAC1 sign
.,B7F9 30 9D       BMI $B798       ; if -ve do illegal quantity error then warm start
.,B7FB A5 61       LDA $61         ; get FAC1 exponent
.,B7FD C9 91       CMP #$91        ; compare with exponent = 2^16
.,B7FF B0 97       BCS $B798       ; if >= do illegal quantity error then warm start
.,B801 20 9B BC    JSR $BC9B       ; convert FAC1 floating to fixed
.,B804 A5 64       LDA $64         ; get FAC1 mantissa 3
.,B806 A4 65       LDY $65         ; get FAC1 mantissa 4
.,B808 84 14       STY $14         ; save temporary integer low byte
.,B80A 85 15       STA $15         ; save temporary integer high byte
.,B80C 60          RTS             

        ;*** perform PEEK()
.,B80D A5 15       LDA $15         ; get line number high byte
.,B80F 48          PHA             ; save line number high byte
.,B810 A5 14       LDA $14         ; get line number low byte
.,B812 48          PHA             ; save line number low byte
.,B813 20 F7 B7    JSR $B7F7       ; convert FAC_1 to integer in temporary integer
.,B816 A0 00       LDY #$00        ; clear index
.,B818 B1 14       LDA ($14),Y     ; read byte
.,B81A A8          TAY             ; copy byte to Y
.,B81B 68          PLA             ; pull byte
.,B81C 85 14       STA $14         ; restore line number low byte
.,B81E 68          PLA             ; pull byte
.,B81F 85 15       STA $15         ; restore line number high byte
.,B821 4C A2 B3    JMP $B3A2       ; convert Y to byte in FAC_1 and return

        ;*** perform POKE
.,B824 20 EB B7    JSR $B7EB       ; get parameters for POKE/WAIT
.,B827 8A          TXA             ; copy byte to A
.,B828 A0 00       LDY #$00        ; clear index
.,B82A 91 14       STA ($14),Y     ; write byte
.,B82C 60          RTS             

        ;*** perform WAIT
.,B82D 20 EB B7    JSR $B7EB       ; get parameters for POKE/WAIT
.,B830 86 49       STX $49         ; save byte (mask)
.,B832 A2 00       LDX #$00        ; clear mask (prepare to detect optional arg)
.,B834 20 79 00    JSR $0079       ; scan memory (detect third arg)
.,B837 F0 03       BEQ $B83C       ; skip if no third argument
.,B839 20 F1 B7    JSR $B7F1       ; scan for "," and get byte, else syntax error then warm start
.,B83C 86 4A       STX $4A         ; save EOR argument
.,B83E A0 00       LDY #$00        ; clear index
.,B840 B1 14       LDA ($14),Y     ; get byte via temporary integer (address)
.,B842 45 4A       EOR $4A         ; EOR with second argument (optional)
.,B844 25 49       AND $49         ; AND with first argument (mask)
.,B846 F0 F8       BEQ $B840       ; loop if result is zero
.,B848 60          RTS             
```

## References

- "val_string_to_fac_and_restore_exec" — covers FAC1-to-integer conversion helper used by these routines
- Commodore 64 ROM Disassembly: [https://www.pagetable.com/c64ref/c64disasm/](https://www.pagetable.com/c64ref/c64disasm/)
- C64 ROM: Routine at B79E: [https://skoolkid.github.io/sk6502/c64rom/asm/B79E.html](https://skoolkid.github.io/sk6502/c64rom/asm/B79E.html)
- C64 ROM: Routine at B79B: [https://skoolkid.github.io/sk6502/c64rom/asm/B79B.html](https://skoolkid.github.io/sk6502/c64rom/asm/B79B.html)
- C64 ROM: Routine at B798: [https://skoolkid.github.io/sk6502/c64rom/asm/B798.html](https://skoolkid.github.io/sk6502/c64rom/asm/B798.html)
- C64 ROM: Routine at B3A2: [https://skoolkid.github.io/sk6502/c64rom/asm/B3A2.html](https://skoolkid.github.io/sk6502/c64rom/asm/B3A2.html)
- C64 ROM: Routine at BC9B: [https://skoolkid.github.io/sk6502/c64rom/asm/BC9B.html](https://skoolkid.github.io/sk6502/c64rom/asm/BC9B.html)
- C64 ROM: Routine at AD8A: [https://skoolkid.github.io/sk6502/c64rom/asm/AD8A.html](https://skoolkid.github.io/sk6502/c64rom/asm/AD8A.html)
