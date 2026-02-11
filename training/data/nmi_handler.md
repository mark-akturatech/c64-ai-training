# NMI handler (C64 ROM) — FE47..FEC1

**Summary:** NMI entry/exit code from the Commodore 64 ROM that saves A/X/Y, disables interrupts, manipulates CIA#2 ($DD00-$DD0F) ICR and port A ($DD00), checks/starts autostart ROM via ($8002), increments the real-time clock (JSR $F6BC), scans the STOP key (JSR $FFE1) and dispatches BRK/BASIC break and RS-232 related NMI handlers using RAM flag $02A1.

## Description
- Entry: pushes A, X, Y (PHA/TXA/PHA/TYA/PHA) and loads #$7F into A to "disable all interrupts" then STA $DD0D (CIA#2 ICR) to save/acknowledge interrupt state.
- The handler reads back CIA#2 ICR into Y (LDY $DD0D) and branches (BMI) to the RS-232 subroutine if the high bit (sign) is set; otherwise it continues to autostart detection.
- Autostart: JSR $FD02 scans for an autostart ROM signature at $8000; if found JMP ($8002) performs the autostart entry. If not found or skipped, execution continues.
- Housekeeping: JSR $F6BC increments the real-time clock; JSR $FFE1 scans the STOP key. If STOP is detected (BNE after JSR $FFE1), the code runs the "user-function default vector / BRK handler" sequence:
  - JSR $FD15 — restore default I/O vectors
  - JSR $FDA3 — initialise SID, CIA and IRQ
  - JSR $E518 — initialise screen and keyboard
  - JMP ($A002) — BASIC break entry (vectored)
- RS-232 handling (starts at FE72):
  - Restore A from Y (TYA), AND with $02A1 (RS-232 interrupt enable byte in RAM) then TAX. Tests bit0 to see if any RS-232 handling is requested.
  - If requested, the handler reads CIA#2 Port A ($DD00), clears the RS-232 Tx DATA bit (AND #$FB), ORs in the transmit data bit from $B5, and writes $DD00 back to update serial port/video address bits.
  - The routine re-reads $02A1 and re-saves CIA#2 ICR ($DD0D) before branching into various RS-232 servicing subroutines depending on enabled bits (calls to $FED6, $FF07, $EEBB, etc.).
  - The code masks and tests specific bits (AND #$12, AND #$02, AND #$10) and dispatches to handlers at $FED6, $FF07, $EEBB as appropriate, with jumps back to common exit points ($FEB6/$FE9D/$FEB6).
- Exit: restores Y/X/A with PLA/TAY/PLA/TAX/PLA and RTI.

**[Note: Source may contain an error — the text calls "VIA 2" while the code accesses $DD00..$DD0D which are CIA#2 (6526) registers on the C64. The assembly and addresses are correct for CIA#2.]**

## Source Code
```asm
                                *** NMI handler
.,FE47 48       PHA             save A
.,FE48 8A       TXA             copy X
.,FE49 48       PHA             save X
.,FE4A 98       TYA             copy Y
.,FE4B 48       PHA             save Y
.,FE4C A9 7F    LDA #$7F        disable all interrupts
.,FE4E 8D 0D DD STA $DD0D       save VIA 2 ICR
.,FE51 AC 0D DD LDY $DD0D       save VIA 2 ICR
.,FE54 30 1C    BMI $FE72       
.,FE56 20 02 FD JSR $FD02       scan for autostart ROM at $8000
.,FE59 D0 03    BNE $FE5E       branch if no autostart ROM
.,FE5B 6C 02 80 JMP ($8002)     else do autostart ROM break entry
.,FE5E 20 BC F6 JSR $F6BC       increment real time clock
.,FE61 20 E1 FF JSR $FFE1       scan stop key
.,FE64 D0 0C    BNE $FE72       if not [STOP] restore registers and exit interrupt

                                *** user function default vector
                                BRK handler
.,FE66 20 15 FD JSR $FD15       restore default I/O vectors
.,FE69 20 A3 FD JSR $FDA3       initialise SID, CIA and IRQ
.,FE6C 20 18 E5 JSR $E518       initialise the screen and keyboard
.,FE6F 6C 02 A0 JMP ($A002)     do BASIC break entry

                                *** RS232 NMI routine
.,FE72 98       TYA             
.,FE73 2D A1 02 AND $02A1       AND with the RS-232 interrupt enable byte
.,FE76 AA       TAX             
.,FE77 29 01    AND #$01        
.,FE79 F0 28    BEQ $FEA3       
.,FE7B AD 00 DD LDA $DD00       read VIA 2 DRA, serial port and video address
.,FE7E 29 FB    AND #$FB        mask xxxx x0xx, clear RS232 Tx DATA
.,FE80 05 B5    ORA $B5         OR in the RS232 transmit data bit
.,FE82 8D 00 DD STA $DD00       save VIA 2 DRA, serial port and video address
.,FE85 AD A1 02 LDA $02A1       get the RS-232 interrupt enable byte
.,FE88 8D 0D DD STA $DD0D       save VIA 2 ICR
.,FE8B 8A       TXA             
.,FE8C 29 12    AND #$12        
.,FE8E F0 0D    BEQ $FE9D       
.,FE90 29 02    AND #$02        
.,FE92 F0 06    BEQ $FE9A       
.,FE94 20 D6 FE JSR $FED6       
.,FE97 4C 9D FE JMP $FE9D       
.,FE9A 20 07 FF JSR $FF07       
.,FE9D 20 BB EE JSR $EEBB       
.,FEA0 4C B6 FE JMP $FEB6       
.,FEA3 8A       TXA             get active interrupts back
.,FEA4 29 02    AND #$02        mask ?? interrupt
.,FEA6 F0 06    BEQ $FEAE       branch if not ?? interrupt
                                was ?? interrupt
.,FEA8 20 D6 FE JSR $FED6       
.,FEAB 4C B6 FE JMP $FEB6       
.,FEAE 8A       TXA             get active interrupts back
.,FEAF 29 10    AND #$10        mask CB1 interrupt, Rx data bit transition
.,FEB1 F0 03    BEQ $FEB6       if no bit restore registers and exit interrupt
.,FEB3 20 07 FF JSR $FF07       
.,FEB6 AD A1 02 LDA $02A1       get the RS-232 interrupt enable byte
.,FEB9 8D 0D DD STA $DD0D       save VIA 2 ICR
.,FEBC 68       PLA             pull Y
.,FEBD A8       TAY             restore Y
.,FEBE 68       PLA             pull X
.,FEBF AA       TAX             restore X
.,FEC0 68       PLA             restore A
.,FEC1 40       RTI             
```

## Key Registers
- $DD00-$DD0F - CIA #2 (6526) - Port A (DRA) at $DD00, interrupt control register (ICR) at $DD0D, etc.
- $02A1 - RAM - RS-232 interrupt enable byte (used to mask/select RS-232 NMI subfunctions)
- $8000-$8002 - ROM area / autostart vector ($8002 used with JMP ($8002) to enter autostart ROM)

## References
- "scan_for_autostart_rom_and_signature" — autostart detection used by NMI
- "rs232_interrupt_and_timing_handlers" — RS232 NMI handling (FED6.. blocks)
- "restore_default_io_vectors" — user-function default vector invoked via $FD15