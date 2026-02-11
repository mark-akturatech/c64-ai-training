# Poll STOP key and abort handler (JSR $FFE1)

**Summary:** Calls KERNAL stop-key scan at $FFE1, tests the result and, on STOP, restores state via $FC93, sets a stopped flag (SEC), and pops the return address bytes (PLA PLA) so control returns to the original caller. Search terms: $FFE1, $FC93, SEC, CLC, PLA, BNE, stack return address manipulation.

## Description
This short routine polls the STOP key (JSR $FFE1). The called routine leaves processor flags arranged so the following branch (BNE) can determine whether a STOP occurred. If no STOP is detected the code clears a status flag (CLC) and branches out. If a STOP is detected the routine performs a full restore (JSR $FC93), sets the stopped flag (SEC), and pulls two bytes from the stack (PLA twice) to remove the return address for the current JSR so that execution will return to the caller that originally initiated the operation.

Notes:
- The JSR $FFE1 call performs the stop-key scan and sets processor flags tested by the subsequent BNE. (Exact flag usage is from the scanned routine.)
- CLC and SEC here are used as local markers: CLC before the BNE indicates "no stop" while SEC marks "stopped" after restore.
- The two PLAs remove the saved return address bytes from the stack (low then high).

## Source Code
```asm
.,F8D0 20 E1 FF JSR $FFE1       ; scan stop key
.,F8D3 18       CLC             ; flag no stop
.,F8D4 D0 0B    BNE $F8E1       ; exit if no stop
.,F8D6 20 93 FC JSR $FC93       ; restore everything for STOP
.,F8D9 38       SEC             ; flag stopped
.,F8DA 68       PLA             ; dump return address low byte
.,F8DB 68       PLA             ; dump return address high byte
```

## References
- "tape_write_loop_check_and_irq_reenable" — expands on called from the tape write loop to detect user abort
- "clear_saved_irq_address_and_return" — expands on subsequent cleanup after STOP detection