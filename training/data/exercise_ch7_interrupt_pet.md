# PET/CBM Interrupt Project (Appendix E — Chapter 7)

**Summary:** Demonstrates IRQ vector patching on PET/CBM by installing a small IRQ handler at $033C, saving the original IRQ link into $03A0/$03A1 (copied from $0090/$0091), triggering the new vector by writing $03/$3C into $0091/$0090 and enabling interrupts, and restoring the original vector. Uses addresses $0090/$0091, $03A0/$03A1, $009B, and $8000; invokes via BASIC SYS 836 and disables via SYS 861.

**Description**
This PET/CBM variant installs a custom IRQ service routine (ISR) located at $033C. The ISR does a single-store operation: it loads the byte at $009B and stores it to $8000, then chains to the original IRQ handler via an indirect JMP through $03A0/$03A1 (the stored link).

Procedure overview:
- Copy the current IRQ vector (low/high bytes at $0090/$0091) into $03A0/$03A1 so the custom ISR can chain back to the original handler.
- Install the new IRQ vector by writing the low/high bytes of the custom handler address ($33C) into $0090/$0091 while interrupts are disabled (SEI).
- Re-enable interrupts (CLI) so the IRQ can fire and execute the installed handler.
- To uninstall, disable interrupts (SEI), copy the saved link from $03A0/$03A1 back into $0090/$0091, then re-enable interrupts (CLI).

Notes:
- SYS 836 (BASIC) will invoke the new interrupt code; SYS 861 will turn it off (as provided in the original appendix).
- The PET/CBM has no color attributes, so character display behavior referenced in VIC-20 versions does not apply here (characters are always visible).
- The source text refers to "original ROM machines" having the IRQ vector at "$0219/A" — this appears to be an artifact; the conventional pair would be $0219/$021A. ([commodore.ca](https://www.commodore.ca/gallery/magazines/compute/Compute-012-02.pdf?utm_source=openai))

## Source Code
```asm
.A 033C  LDA $9B
.A 033E  STA $8000
.A 0341  JMP ($03A0)

.A 0344  LDA $0090
.A 0347  STA $03A0
.A 034A  LDA $0091
.A 034D  STA $03A1

.A 0350  SEI
.A 0351  LDA #$3C
.A 0353  STA $0090
.A 0356  LDA #$03
.A 0358  STA $0091
.A 035B  CLI
.A 035C  RTS

.A 035D  SEI
.A 035E  LDA $03A0
.A 0361  STA $0090
.A 0364  LDA $03A1
.A 0367  STA $0091
.A 036A  CLI
.A 036B  RTS
```

```text
BASIC stub to install the custom IRQ handler:
10 SYS 836

BASIC stub to uninstall the custom IRQ handler:
10 SYS 861
```

## Key Registers
- **$0090/$0091**: IRQ vector (low/high bytes)
- **$03A0/$03A1**: Storage for original IRQ vector
- **$009B**: Keyboard shift/control flag
- **$8000**: Screen memory start address

## References
- "exercise_ch7_interrupt_vic20" — VIC-20 interrupt project (comparison and expanded VIC-20 notes)
- Compute! Magazine, Issue 12, May 1981, "PET Interrupts" ([commodore.ca](https://www.commodore.ca/gallery/magazines/compute/Compute-012-02.pdf?utm_source=openai))

## Labels
- $0090
- $0091
- $03A0
- $03A1
- $009B
- $8000
