# KERNAL NMI Entry Point ($FFFA vector) — FE43–FE6F

**Summary:** NMI handler entry (vectored at $FFFA) for the C64 KERNAL. Disables interrupts (SEI), follows indirect NMINV at $0318, pushes A/X/Y, writes/reads CIA#2 IRQ control ($DD0D) to detect RS232 NMI, tests for autostart cartridge at $8000 (JSR $FD02), and dispatches to warm-start code or RS232 handling; restores registers and returns with RTI. Contains the BASIC warm-start path that runs KERNAL reset/init then jumps to ($A002).

## NMI ENTRY POINT
On NMI entry this handler:
- Disables maskable IRQs with SEI.
- Performs an indirect JMP ($0318) — the NMINV pointer (normally points to $FE47).
- Pushes A, X, Y onto the stack (PHA/ TXA /PHA /TYA /PHA).
- Loads A with #$7F and stores to CIA#2 interrupt control ($DD0D) to set/mask the desired CIA2 IRQ bits.
- Reads $DD0D into Y and uses BMI to branch if bit7 (negative flag) is set — used here to detect an RS232-caused NMI and branch to RS232 handling.
- Calls $FD02 to check for an autostart cartridge at $8000; if $FD02 sets Z=0 (BNE) the handler continues; otherwise a JMP indirect ($8002) is used to vector to the warm-start vector supplied by cartridge/ROM.
- If no cartridge warm-start, scans keyboard matrix (JSR $F6BC) storing result in $91, then calls $FFE1 to check $91 for STOP key; branching if STOP not pressed to skip warm-start sequence.

Notes: register push/pop order is A then X then Y (PHA/TXA/PHA/TYA/PHA) so the stack contains A,X,Y in that sequence. The handler restores registers and returns with RTI at the end of the full NMI handling path (not shown in this excerpt).

## WARM START BASIC
If STOP was pressed the handler enters the BASIC warm-start sequence:
- JSR $FD15 — KERNAL reset (restore vectors etc).
- JSR $FDA3 — init I/O (device tables).
- JSR $E518 — additional I/O initialization.
- JMP ($A002) — jump to Basic warm start vector.

The NMI path at $FE72 (not fully included here) continues by checking RS232 in/out processing when appropriate.

## Source Code
```asm
.,FE43 78       SEI             disable interrupts
.,FE44 6C 18 03 JMP ($0318)     jump to NMINV, points normally to $fe47
.,FE47 48       PHA             store (A), (X), (Y) on the stack
.,FE48 8A       TXA
.,FE49 48       PHA
.,FE4A 98       TYA
.,FE4B 48       PHA
.,FE4C A9 7F    LDA #$7F        CIA#2 interrupt control register
.,FE4E 8D 0D DD STA $DD0D
.,FE51 AC 0D DD LDY $DD0D
.,FE54 30 1C    BMI $FE72       NMI caused by RS232? If so - jump
.,FE56 20 02 FD JSR $FD02       check for autostart at $8000
.,FE59 D0 03    BNE $FE5E
.,FE5B 6C 02 80 JMP ($8002)     Jump to warm start vector
.,FE5E 20 BC F6 JSR $F6BC       Scan 1 row in keymatrix and store value in $91
.,FE61 20 E1 FF JSR $FFE1       Check $91 to see if <STOP> was pressed
.,FE64 D0 0C    BNE $FE72       <STOP> not pressed, skip part of following routine

                                *** WARM START BASIC
.,FE66 20 15 FD JSR $FD15       KERNAL reset
.,FE69 20 A3 FD JSR $FDA3       init I/O
.,FE6C 20 18 E5 JSR $E518       init I/O
.,FE6F 6C 02 A0 JMP ($A002)     jump to Basic warm start vector
```

## Key Registers
- $FFFA-$FFFF - System Vectors - NMI/RESET/IRQ vector area (NMI vector at $FFFA)
- $0318 - RAM - NMINV indirect vector (jump target used by JMP ($0318); normally points to $FE47)
- $DD00-$DD0F - CIA 2 - CIA#2 registers (interrupt control/status; handler writes/reads $DD0D)
- $8000 - Cartridge ROM - autostart check location / cartridge entry
- $8002 - Cartridge vector - warm start vector used by JMP ($8002)
- $A002 - KERNAL/BASIC - Basic warm start vector (jumped to via JMP ($A002))

## References
- "warm_start_basic" — expands on NMI handler warm-start BASIC path and vector restoration
- "nmi_rs232_handling" — expands on RS232 detection and RS232 in/out handling invoked from NMI handler

## Labels
- NMINV
