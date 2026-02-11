# NMIs and Disabling the RESTORE NMI on the C64

**Summary:** Explains how to neutralize the RESTORE key's Non-Maskable Interrupt (NMI) by installing a trivial NMI handler at $0318/$0319 (CPU NMI vector) that immediately returns (RTI). Mentions CIA‑2 ($DD00-$DD0F) as the usual NMI source and contrasts with the IRQ vector at $0314/$0315.

**Overview**

Non‑Maskable Interrupts (NMIs) on the C64 cannot be disabled by a mask; instead, you must ensure any NMI is handled benignly. A common technique is to point the NMI vector ($0318/$0319) to a handler that executes RTI, so a RESTORE key press (or other NMI source) does not disrupt program execution.

You can also configure CIA‑2 (the CIA that can generate NMIs) to be the NMI source and have its periodic NMI serviced by the trivial handler—this keeps NMIs from causing any side effects. The key is: set the NMI vector to a safe handler; do not rely on "turning off" NMIs because the 6502 does not provide a mask for NMI.

**Implementation Notes**

- NMI vector is stored at absolute addresses $0318 (low byte) and $0319 (high byte). Install a handler there.
- The simplest handler is a single RTI instruction; when the CPU jumps to it on NMI, it immediately returns, causing no state change.
- For automated/continuous neutralization, you can configure CIA‑2 to generate NMIs while the vector points to RTI. The CPU will service the NMI and immediately return; user presses of RESTORE then become harmless.
- For comparison, the IRQ (maskable interrupt) vector is at $0314/$0315.

## Source Code

```asm
; Minimal example: install NMI handler that does nothing (RTI)

        ; load low byte of handler address
        LDA #<nmi_rti
        STA $0318        ; NMI vector low
        ; load high byte of handler address
        LDA #>nmi_rti
        STA $0319        ; NMI vector high

        ; ... continue program ...

nmi_rti:
        RTI
```

```basic
10 REM Install NMI handler address (example: $C000)
20 POKE 792,0: POKE 793,192  : REM $0318 = 0, $0319 = 192  (low=0, high=192 -> $C000)
```

(Above examples show the mechanism; you must ensure the handler address is within RAM/ROM you control.)

## Key Registers

- $0318-$0319 - CPU - NMI vector (address of NMI handler)
- $0314-$0315 - CPU - IRQ vector (maskable IRQ handler)
- $DD00-$DD0F - CIA2 - CIA registers (CIA‑2 is the CIA that can generate NMIs)

## References

- "how_to_implement_interrupts_example" — expands on IRQ vs NMI vectors ($0314/$0315 vs $0318/$0319)