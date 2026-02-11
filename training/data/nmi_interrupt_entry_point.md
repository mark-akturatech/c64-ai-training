# NMI Interrupt Entry ($FFFA -> $FE43)

**Summary:** NMI entry at $FFFA ($FFFA -> $FE43) — sets the Interrupt Disable flag, jumps through the RAM continuation vector at $0318, checks for RS-232 vs RESTORE key, performs cartridge/STOP/BRK branching, and (for RS-232 NMIs) proceeds to RS-232 bit-timing handling.

**NMI Handler Behavior**

This chunk documents the KERNAL NMI entry point used on the C64. When an NMI occurs, the processor vector at $FFFA is used (points to $FE43). The handler immediately sets the Interrupt Disable (I) flag, then JMPs through a RAM-stored continuation vector at $0318 (this lets RAM override/extend the standard handler).

The standard continuation does these checks in sequence:

- Test whether the NMI originated from the RS-232 device. If yes, bypass most keyboard/cartridge checks and continue to RS-232 bit-timing processing (send/receive bit timing).
- If not an RS-232 NMI, assume the RESTORE key was involved:
  - Check for a cartridge; if a cartridge is present, exit via the cartridge warm-start vector at $8002.
  - If no cartridge is present, check the STOP key; if STOP is depressed, execute the BRK warm-start routine.
  - If no STOP key/BRK condition, continue normal NMI/RESTORE handling as implemented by the continuation routine.

RS-232-caused NMIs skip the cartridge and STOP-key BRK checks and instead proceed to code that handles RS-232 bit timing (sending/receiving serial bits).

## Source Code

```assembly
; NMI Handler Entry Point at $FE43
FE43   SEI             ; Set Interrupt Disable flag
FE44   JMP ($0318)     ; Jump through RAM vector at $0318

; Default NMI Continuation Routine at $FE47
FE47   PHA             ; Push Accumulator onto stack
FE48   TXA             ; Transfer X to Accumulator
FE49   PHA             ; Push Accumulator onto stack
FE4A   TYA             ; Transfer Y to Accumulator
FE4B   PHA             ; Push Accumulator onto stack
FE4C   LDA $DD0D       ; Load CIA #2 Interrupt Control Register
FE4F   AND #$10        ; Test for RS-232 NMI (FLAG line)
FE51   BEQ RESTORE     ; Branch if not RS-232 NMI

; RS-232 NMI Handling
FE53   JSR $FF07       ; Start Timer B for RS-232 bit timing
FE56   JMP $FEAD       ; Continue with RS-232 bit processing

; RESTORE Key Handling
RESTORE:
FE59   LDA $8004       ; Check for cartridge presence
FE5C   CMP #$C3
FE5E   BNE NO_CARTRIDGE
FE60   JMP ($8002)     ; Jump to cartridge warm-start vector

NO_CARTRIDGE:
FE63   LDA $DC01       ; Load CIA #1 Data Port A (Keyboard Matrix)
FE66   AND #$10        ; Test STOP key (Bit 4)
FE68   BEQ NO_STOP
FE6A   JMP $FE66       ; Execute BRK warm-start routine

NO_STOP:
FE6D   PLA             ; Restore Y from stack
FE6E   TAY
FE6F   PLA             ; Restore X from stack
FE70   TAX
FE71   PLA             ; Restore Accumulator from stack
FE72   RTI             ; Return from Interrupt
```

## Key Registers

- $FFFA - Vector - NMI vector (points to NMI entry $FE43)
- $FE43 - ROM - NMI handler entry point (standard KERNAL entry)
- $0318 - RAM - RAM continuation vector used by NMI handler (JMP through this address)
- $8002 - ROM - Cartridge warm-start vector (used when cartridge present on RESTORE/NMI)

## References

- "nmi_rs232_handler" — expands on continuation of NMI processing for RS-232 bit timing
- "power_on_reset_routine" — expands on cartridge/keyboard checks similar to RESET behavior
- "brk_warm_start_routine" — expands on BRK routine invoked in some NMI conditions (STOP+RESTORE)