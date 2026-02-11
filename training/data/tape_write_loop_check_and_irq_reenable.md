# Tape write loop (end): IRQ compare, stop-key check, RTC increment ($F8BB–$F8CD)

**Summary:** End of the tape write polling loop at $F8BB–$F8CD: re-enable interrupts (CLI), compare saved IRQ high byte at $02A0 with current IRQ high byte at $0315 to detect completion, call stop-key scanner ($F8D0) and real-time clock incrementer ($F6BC), then loop back. Contains JSRs to scan-stop-key and increment RTC and a BEQ to clear saved IRQ address when write is finished.

## Operation
This code is the tail of the tape write loop. It assumes a previous comparison or flag set the Z/N flags used by the initial BNE. The steps:

- BNE $F8B5: if the previous test indicates "more to do", branch back (loop).
- CLI: clear the interrupt-disable flag to re-enable tape (and other) interrupts so the IRQ-driven tape state can progress while we poll.
- LDA $02A0: load the saved IRQ high byte (stored by the tape write routine).
- CMP $0315: compare the saved IRQ high byte with the current IRQ high byte (location holding the system's current IRQ high byte).
- CLC: clear carry (used here as a general "flag OK" instruction as in the original listing).
- BEQ $F8DC: if the two high bytes are equal the tape write is done — branch to the routine that clears the saved IRQ address and returns.
- JSR $F8D0: call the stop-key scanner/handler (scan stop key and flag abort if pressed). Note: if STOP was pressed, the handler may return to the caller of this routine rather than here.
- JSR $F6BC: call the routine that increments the real-time clock.
- JMP $F8BE: unconditional jump back into the loop to re-evaluate (reload saved IRQ, compare again, etc.).

Behavioral notes derived from listing:
- The loop continually re-enables interrupts so IRQ-driven tape I/O can update the current IRQ byte; the comparison of saved vs current IRQ high bytes is the completion condition.
- Stop-key scanning is polled each loop via JSR $F8D0; its abort behavior can transfer control away from this routine.
- The real-time clock is incremented every loop via JSR $F6BC.

## Source Code
```asm
.,F8BB D0 F8    BNE $F8B5       ; loop if more to do
.,F8BD 58       CLI             ; enable tape interrupts
.,F8BE AD A0 02 LDA $02A0       ; get saved IRQ high byte
.,F8C1 CD 15 03 CMP $0315       ; compare with the current IRQ high byte
.,F8C4 18       CLC             ; flag ok
.,F8C5 F0 15    BEQ $F8DC       ; if tape write done go clear saved IRQ address and exit
.,F8C7 20 D0 F8 JSR $F8D0       ; scan stop key and flag abort if pressed
                                ; note if STOP was pressed the return is to the
                                ; routine that called this one and not here
.,F8CA 20 BC F6 JSR $F6BC       ; increment real time clock
.,F8CD 4C BE F8 JMP $F8BE       ; loop
```

## Key Registers
- $02A0 - RAM - saved IRQ high byte (tape routine saved value used to detect completion)
- $0315 - RAM - current IRQ high byte (compared against saved high byte)

## References
- "scan_stop_key_handler" — expands on stop-key scanning and abort handling called from the loop
- "clear_saved_irq_address_and_return" — expands on clearing the saved IRQ address when tape write is finished