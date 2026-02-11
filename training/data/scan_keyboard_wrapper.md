# Keyboard scan wrapper JMP $EA87 at $FF9F

**Summary:** ROM wrapper at $FF9F that JMPs to $EA87 to perform a keyboard scan; same routine used by the IRQ handler to place ASCII codes into the keyboard queue for CHRIN/GETIN.

## Description
This is a one-instruction KERNAL ROM wrapper located at $FF9F. It transfers execution to the keyboard-scan routine at $EA87, which scans the keyboard matrix, detects pressed keys, and places the corresponding ASCII code into the keyboard queue. The same scanning routine is invoked by the interrupt handler (IRQ); queued ASCII bytes are consumed by CHRIN/GETIN.

## Source Code
```asm
; scan the keyboard
; this routine will scan the keyboard and check for pressed keys. It is the same
; routine called by the interrupt handler. If a key is down, its ASCII value is
; placed in the keyboard queue.
.,FF9F 4C 87 EA JMP $EA87       scan keyboard
```

## References
- "keyboard_scan_interrupt_routine" — expands on keyboard scanning performed by IRQ handler (external)
