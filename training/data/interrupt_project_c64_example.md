# C64 IRQ hook: copy $91 -> $0400 each interrupt, chain to original via ($03A0)

**Summary:** Example C64 IRQ hook that places an ISR at $033C which copies the byte at $0091 to screen RAM $0400, then JMPs indirect to the original IRQ handler stored at $03A0/$03A1; setup code saves the original vector from $0314/$0315 into $03A0/$03A1 and installs $033C as the IRQ vector (SEI/CLI used). SYS 836 enables, SYS 861 disables. Mentions $D800 color RAM for display fixes.

## Description
This project installs a custom IRQ handler on the Commodore 64 that runs ~60Hz, copying the single byte found at $0091 into the top‑left screen character cell at $0400. The custom handler then chains to the previously installed (original) IRQ routine using an indirect jump through $03A0/$03A1.

Key flow:
- ISR at $033C:
  - LDA $0091
  - STA $0400
  - JMP ($03A0) — chains to original IRQ so normal system interrupts continue
- Enabler routine at $0344:
  - Copies the existing IRQ vector from $0314/$0315 to $03A0/$03A1 (save original)
  - SEI, then stores $03/$3C into $0315/$0314 to point IRQ vector at $033C, CLI, RTS
  - Invoke from BASIC with SYS 836 (836 decimal = $0344)
- Disabler routine at $035D:
  - SEI, copy $03A0/$03A1 back into $0314/$0315 (restore original vector), CLI, RTS
  - Invoke from BASIC with SYS 861 (861 decimal = $035D)

Notes and caveats:
- SEI/CLI bracket the vector write to prevent interrupts while the vector is being changed.
- The indirect JMP ($03A0) requires that $03A0/$03A1 hold a valid address (low/high). That address is filled by the enabler by copying $0314/$0315 before overwriting them.
- The byte copied comes from $0091 (not a vector) — ensure the desired character/code is stored there before enabling.
- Some C64 machines show the new character as blue-on-blue (invisible) because color RAM for the corresponding screen cell may also need updating. Fix by writing an appropriate nybble into color RAM at $D800 + offset (color memory is separate 4‑bit per cell).
- Chaining to the original IRQ preserves system behavior (e.g., CIA timers, raster handling). Failing to chain will break system services.

## Source Code
```asm
; ISR: placed at $033C
.A 033C  LDA $0091
.A 033E  STA $0400
.A 0341  JMP ($03A0)

; Enable routine: save original IRQ vector to $03A0/$03A1 then install $033C as IRQ
.A 0344  LDA $0314
.A 0347  STA $03A0
.A 034A  LDA $0315
.A 034D  STA $03A1

.A 0350  SEI
.A 0351  LDA #$3C
.A 0353  STA $0314
.A 0356  LDA #$03
.A 0358  STA $0315
.A 035B  CLI
.A 035C  RTS

; Disable routine: restore original IRQ vector from $03A0/$03A1
.A 035D  SEI
.A 035E  LDA $03A0
.A 0361  STA $0314
.A 0364  LDA $03A1
.A 0367  STA $0315
.A 036A  CLI
.A 036B  RTS
```

```basic
10 REM Enable custom IRQ
20 SYS 836   : REM jumps to $0344 (enable)
30 REM Disable custom IRQ
40 SYS 861   : REM jumps to $035D (disable)
```

## Key Registers
- $0314-$0315 - System RAM - IRQ vector (low/high) used by CPU for IRQ entry
- $03A0-$03A1 - System RAM - saved original IRQ vector (indirect JMP target)
- $033C - System RAM - custom ISR entry point installed as IRQ handler
- $0091 - System RAM - source byte/character copied to screen ($91 shown as $0091)
- $0400 - VIC-II / Screen RAM - top-left screen character cell (first visible cell)
- $D800 - VIC-II (Color RAM) - color nybble table (one 4-bit entry per screen cell); update to ensure visible color

## References
- "using_irq_vector_and_masking_interrupts" — expands on setting vectors and preserving original via a saved indirect address
- "vic_and_c64_memory_extras" — expands on using $D800 color memory to fix visual artifacts