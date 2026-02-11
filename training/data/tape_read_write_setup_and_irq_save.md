# Kernel ROM: Common tape read/write setup and IRQ handling ($F875-$F8A8)

**Summary:** Disassembly of the Commodore 64 kernel routine at $F875–$F8A8 that performs common tape read/write startup: disables interrupts (LDY #$7F / STY $DC0D), programs VIA-1 control registers and timers ($DC0E/$DC0F / $02A2 shadow), blanks the screen via VIC-II $D011, saves and replaces the IRQ vector ($0314/$0315 → $029F/$02A0), sets the kernel tape IRQ vector (JSR $FCBD), and initializes the copy count ($BE=2) before calling tape-byte setup (JSR $FB97).

## Sequence and behavior
- LDY #$7F / STY $DC0D: Load Y with $7F and store to VIA-1 ICR ($DC0D). This disables all VIA interrupts (writes $7F), ensuring IRQs are masked while the tape setup proceeds.
- STA $DC0D (later): A is stored to $DC0D to enable interrupts as specified by A (the code saves then restores the VIA ICR).
- VIA-1 CRA/CRB programming:
  - LDA $DC0E / ORA #$19 / STA $DC0F — reads VIA-1 CRA ($DC0E), ORs in $19 to configure Timer B (load timer B, single-shot, start timer B), and writes to CRA/CRB as VIA control is split between CRA/CRB semantics.
  - AND #$91 then STA $02A2 — masks bits (x00x 000x) to select TOD clock, load timer A, and start timer A, then saves a shadow copy of VIA-1 CRB at zero page $02A2.
- JSR $F0A4: Performs an RS-232/serial idle check before tape traffic.
- VIC-II vertical fine scroll/control:
  - LDA $D011 / AND #$EF / STA $D011 — reads the VIC-II $D011 (vertical fine scroll and control), clears bit 4 (mask AND #$EF) to blank the screen, and writes it back.
- IRQ vector save:
  - LDA $0314 / STA $029F and LDA $0315 / STA $02A0 — saves the current IRQ vector low/high bytes from $0314/$0315 into zero page storage at $029F/$02A0 so the original IRQ handler can be restored later.
- JSR $FCBD: Installs the kernel tape IRQ vector (sets the tape IRQ handler).
- Copies count:
  - LDA #$02 / STA $BE — sets zero page $BE to 2 (first copy = load, second copy = verify).
- JSR $FB97: Calls the routine that performs new tape byte setup to begin the tape transfer.

This routine is the common entry shared by both tape read and tape write initialization paths; subsequent branches call routines that start the motor, perform motor spinup delay, or continue read/write state setup.

## Source Code
```asm
.,F875 A0 7F    LDY #$7F        ; disable all interrupts
.,F877 8C 0D DC STY $DC0D       ; save VIA 1 ICR, disable all interrupts
.,F87A 8D 0D DC STA $DC0D       ; save VIA 1 ICR, enable interrupts according to A
                                ; check RS232 bus idle
.,F87D AD 0E DC LDA $DC0E       ; read VIA 1 CRA
.,F880 09 19    ORA #$19        ; load timer B, timer B single shot, start timer B
.,F882 8D 0F DC STA $DC0F       ; save VIA 1 CRB
.,F885 29 91    AND #$91        ; mask x00x 000x, TOD clock, load timer A, start timer A
.,F887 8D A2 02 STA $02A2       ; save VIA 1 CRB shadow copy
.,F88A 20 A4 F0 JSR $F0A4       
.,F88D AD 11 D0 LDA $D011       ; read the vertical fine scroll and control register
.,F890 29 EF    AND #$EF        ; mask xxx0 xxxx, blank the screen
.,F892 8D 11 D0 STA $D011       ; save the vertical fine scroll and control register
.,F895 AD 14 03 LDA $0314       ; get IRQ vector low byte
.,F898 8D 9F 02 STA $029F       ; save IRQ vector low byte
.,F89B AD 15 03 LDA $0315       ; get IRQ vector high byte
.,F89E 8D A0 02 STA $02A0       ; save IRQ vector high byte
.,F8A1 20 BD FC JSR $FCBD       ; set the tape vector
.,F8A4 A9 02    LDA #$02        ; set copies count (load + verify)
.,F8A6 85 BE    STA $BE         ; save copies count
.,F8A8 20 97 FB JSR $FB97       ; new tape byte setup
```

## Key Registers
- $DC0D - VIA-1 - Interrupt Control Register (ICR) (used to disable/enable VIA interrupts)
- $DC0E - VIA-1 - Control Register A (CRA) (read-modify for timer B settings)
- $DC0F - VIA-1 - Control Register B (CRB) (written to start/configure timers)
- $02A2 - Zero Page - Shadow copy of VIA-1 CRB
- $D011 - VIC-II ($D000 base) - Vertical fine scroll and control register (bit 4 cleared to blank screen)
- $0314-$0315 - RAM - Current IRQ vector low/high (saved)
- $029F-$02A0 - Zero Page - Saved IRQ vector low/high (backup storage)
- $BE - Zero Page - Copies count (set to $02 for load+verify)

## References
- "initiate_tape_read" — expands branches here to continue read startup
- "initiate_tape_write" — expands branches here for write startup
- "tape_motor_and_spinup_delay" — motor start and delay that follow this setup to stabilise tape speed