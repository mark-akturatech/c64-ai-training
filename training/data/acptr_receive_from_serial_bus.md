# ACPTR ($FFA5) — Receive from Serial Bus

**Summary:** KERNAL ACPTR entry ($FFA5) implements serial-bus byte receive using CIA#1 timer B ($DC07/$DC0F) as a ~65 ms one-shot timeout, reads bits from the serial port at $DD00 into zero-page temp $A4 with an 8-bit countdown in $A5, and updates the I/O status word (ST) on read-timeout or EOI.

## Operation
- Entry: SEI disables interrupts. Zero-page $A5 (CNTDN) is initialized to #$00 and CLK is forced high (JSR $EE85).
- Clock/wait primitives: JSR $EEA9 samples serial-clock/clock-edges (used repeatedly to wait for clock = 1/0). The routine spins until CLK=1 before configuring the timer.
- Timer setup: Writes #$01 to $DC07 (CIA#1 timer B high byte) and #$19 to $DC0F (timer B low/control) to start a one-shot timer (~65 ms).
- Timeout check: The CIA interrupt-control register $DC0D is polled (read twice) and ANDed with #$02 to test Timer B underflow. If Timer B fired, CNTDN is tested; if zero the status word ST is set to #$02 (read timeout) via JMP/JSR $EDB2.
- EOI handling / countdown loop: If no timeout, routine uses JSRs to set data/CLK lines and increments CNTDN ($A5); it loops until CNTDN reaches the value used to begin bit reception (see below).
- Bit receive loop:
  - CNTDN is set to #$08 (receive 8 bits).
  - Wait for serial bus to settle by reading $DD00 until two consecutive reads match.
  - Wait for the data-in condition (tested via ASL + branch).
  - ROR $A4 to roll the sampled bit into the temporary ($A4). The sampling sequence repeats (bus-settle → sample → bus-settle → sample) to detect bit edges and build 8 bits LSB-first into $A4.
  - After each bit, $A5 is decremented; loop until eight bits received.
  - (The code uses ASL to create a branchable sign flag from the read byte — ASL affects N flag which is then tested with BPL/BMI.)
- Post-receive:
  - Data handshake (JSR $EEA0) then BIT $90 tests the I/O status word for EOI. If EOI is set, JSR $EE06 performs a handshake and the routine exits without transferring the byte (ST set to #$40 by JSR $FE1C earlier).
  - If no EOI, LDA $A4 transfers the received byte to A, CLI re-enables interrupts, CLC clears carry (indicating no error), and RTS returns to caller.

## Source Code
```asm
.,EE13 78       SEI
.,EE14 A9 00    LDA #$00
.,EE16 85 A5    STA $A5         CNTDN, counter
.,EE18 20 85 EE JSR $EE85       set CLK 1
.,EE1B 20 A9 EE JSR $EEA9       get serial in and clock
.,EE1E 10 FB    BPL $EE1B       wait for CLK = 1
.,EE20 A9 01    LDA #$01
.,EE22 8D 07 DC STA $DC07       setup CIA#1 timer B, high byte
.,EE25 A9 19    LDA #$19
.,EE27 8D 0F DC STA $DC0F       set 1 shot, load and start CIA timer B
.,EE2A 20 97 EE JSR $EE97       set data 1
.,EE2D AD 0D DC LDA $DC0D
.,EE30 AD 0D DC LDA $DC0D       read CIA#1 ICR
.,EE33 29 02    AND #$02        test if timer B reaches zero
.,EE35 D0 07    BNE $EE3E       timeout
.,EE37 20 A9 EE JSR $EEA9       get serial in and clock
.,EE3A 30 F4    BMI $EE30       CLK 1
.,EE3C 10 18    BPL $EE56       CLK 0
.,EE3E A5 A5    LDA $A5         CNTDN
.,EE40 F0 05    BEQ $EE47
.,EE42 A9 02    LDA #$02        flag read timeout
.,EE44 4C B2 ED JMP $EDB2       set I/O status word
.,EE47 20 A0 EE JSR $EEA0       set data 1
.,EE4A 20 85 EE JSR $EE85       set CLK 1
.,EE4D A9 40    LDA #$40        flag EOI
.,EE4F 20 1C FE JSR $FE1C       set I/O status word
.,EE52 E6 A5    INC $A5         increment CNTDN, counter
.,EE54 D0 CA    BNE $EE20       again
.,EE56 A9 08    LDA #$08        set up CNTDN to receive 8 bits
.,EE58 85 A5    STA $A5
.,EE5A AD 00 DD LDA $DD00       serial bus I/O port
.,EE5D CD 00 DD CMP $DD00       compare
.,EE60 D0 F8    BNE $EE5A       wait for serial bus to settle
.,EE62 0A       ASL
.,EE63 10 F5    BPL $EE5A       wait for data in =1
.,EE65 66 A4    ROR $A4         roll in received bit in temp data area
.,EE67 AD 00 DD LDA $DD00       serial bus I/O port
.,EE6A CD 00 DD CMP $DD00       compare
.,EE6D D0 F8    BNE $EE67       wait for bus to settle
.,EE6F 0A       ASL
.,EE70 30 F5    BMI $EE67       wait for data in =0
.,EE72 C6 A5    DEC $A5         one bit received
.,EE74 D0 E4    BNE $EE5A       repeat for all 8 bits
.,EE76 20 A0 EE JSR $EEA0       set data 1
.,EE79 24 90    BIT $90         STATUS, I/O status word
.,EE7B 50 03    BVC $EE80       not EOI
.,EE7D 20 06 EE JSR $EE06       handshake and exit without byte
.,EE80 A5 A4    LDA $A4         read received byte
.,EE82 58       CLI             enable interrupts
.,EE83 18       CLC             clear carry, no errors
.,EE84 60       RTS
```

## Key Registers
- $DC00-$DC0F - CIA1 - Timer B and ICR/control ($DC07 high byte, $DC0D ICR, $DC0F low/control used)
- $DD00 - CIA2 - Serial bus I/O port (Port A)
- $FFA5 - KERNAL vector/entry - ACPTR (receive-from-serial-bus)
- $A4 - Zero page - temporary shift/storage for incoming byte
- $A5 - Zero page - CNTDN (bit/countdown)
- $0090 - Zero page ($90) - I/O status word (tested with BIT $90)

## References
- "flag_errors" — expands on setting I/O status word (ST) on read timeout or EOI
- "wait_for_clock" — expands on serial clock/data primitives (set CLK/data routines)

## Labels
- ACPTR
- CNTDN
- ST
