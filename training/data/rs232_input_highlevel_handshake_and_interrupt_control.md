# RS-232 input path / handshake checks (C64 ROM)

**Summary:** High-level logic for taking input from the RS-232 buffer: saves input device number, reads pseudo-6551 command register ($0294) to determine 3-line vs full-duplex and handshake/duplex bits, probes CIA2 Port B ($DD01) for DSR/RTS/DTR lines, polls RS-232 interrupt-enable byte ($02A1) for timer flags, and sets the VIA/CIA FLAG interrupt (ICR) as needed.

## Description
This code fragment implements the ROM path that decides whether an RS-232 receive is allowed and configures/raises the CIA flag interrupt when bus/handshake conditions permit.

Behavior (step-by-step):
- Save the input device number to zero page ($0099).
- Read the pseudo-6551 command byte at $0294:
  - LSR shifts the handshake bit into carry; BCC branches if the 3-line interface path is selected (carry clear).
  - If not 3-line, AND #$08 masks the duplex bit (pseudo-6551 command is right-shifted once). BEQ branches if full-duplex path is selected.
- For the non-3-line, non-full-duplex path (RTS/handshake path):
  - Prepare bit mask (#$02) for RTS.
  - BIT $DD01 reads CIA2 Port B (RS-232 port). The following BPL $F00D branch handles the case where DSR = 0 (no DSR) and exits accordingly.
  - If RTS = 0 (BEQ $F084 path) simply exit (flag ok).
  - Otherwise, read the RS-232 interrupt-enable byte at $02A1 and loop while Timer A interrupt-enable bit is set (LSR and BCS $F062). This waits for Timer A interrupt enable to be cleared before proceeding.
  - Clear RTS output by reading $DD01, AND #$FD (clear bit), and STA $DD01.
  - Poll DTR input by re-reading $DD01 and AND #$04 (DTR bit); loop while DTR is low (BEQ $F070).
  - When DTR is high, load #$90 and jump to the routine that writes A into CIA2 ICR to enable the FLAG interrupt and return.
- For the 3-line or full-duplex paths:
  - Read $02A1 and AND #$12 to test FLAG/timer-B related bits; if either bit is set branch to enable the FLAG interrupt (LDA #$90).
  - Otherwise clear carry (CLC) and return (RTS).

Notes on signals and masks used:
- $0294 — pseudo-6551 command; LSR used to move handshake bit into carry. AND #$08 isolates the duplex bit (command >> 1 semantics).
- $02A1 — RS-232 interrupt-enable byte in RAM; code inspects Timer A and Timer B / FLAG enable bits by shifting/masking.
- $DD01 — CIA 2 Port B (PRB) is used for RS-232 control lines: DSR, RTS, DTR (masks and interpretation are as used in code).
- #$02 mask targets RTS bit (cleared via AND #$FD).
- #$04 mask tests DTR input (loops until DTR high).
- #$90 is the value loaded to enable the FLAG interrupt before jumping to the ICR write routine.

This fragment relies on a separate routine (JMP $EF3B) to actually write A into the CIA2 ICR and return; the fragment itself prepares the value in A and transfers control.

## Source Code
```asm
.,F04D 85 99    STA $99         save the input device number
.,F04F AD 94 02 LDA $0294       get pseudo 6551 command register
.,F052 4A       LSR             shift the handshake bit to Cb
.,F053 90 28    BCC $F07D       if 3 line interface go ??
.,F055 29 08    AND #$08        mask the duplex bit, pseudo 6551 command is >> 1
.,F057 F0 24    BEQ $F07D       if full duplex go ??
.,F059 A9 02    LDA #$02        mask 0000 00x0, RTS out
.,F05B 2C 01 DD BIT $DD01       test VIA 2 DRB, RS232 port
.,F05E 10 AD    BPL $F00D       if DSR = 0 set no DSR and exit
.,F060 F0 22    BEQ $F084       if RTS = 0 just exit
.,F062 AD A1 02 LDA $02A1       get the RS-232 interrupt enable byte
.,F065 4A       LSR             shift the timer A interrupt enable bit to Cb
.,F066 B0 FA    BCS $F062       loop while the timer A interrupt is enabled
.,F068 AD 01 DD LDA $DD01       read VIA 2 DRB, RS232 port
.,F06B 29 FD    AND #$FD        mask xxxx xx0x, clear RTS out
.,F06D 8D 01 DD STA $DD01       save VIA 2 DRB, RS232 port
.,F070 AD 01 DD LDA $DD01       read VIA 2 DRB, RS232 port
.,F073 29 04    AND #$04        mask xxxx x1xx, DTR in
.,F075 F0 F9    BEQ $F070       loop while DTR low
.,F077 A9 90    LDA #$90        enable the FLAG interrupt
.,F079 18       CLC             flag ok
.,F07A 4C 3B EF JMP $EF3B       set VIA 2 ICR from A and return
.,F07D AD A1 02 LDA $02A1       get the RS-232 interrupt enable byte
.,F080 29 12    AND #$12        mask 000x 00x0
.,F082 F0 F3    BEQ $F077       if FLAG or timer B bits set go enable the FLAG inetrrupt
.,F084 18       CLC             flag ok
.,F085 60       RTS             
```

## Key Registers
- $0099 - Zero Page - saved input device number
- $0294 - System RAM - pseudo-6551 command register (handshake/duplex bits)
- $02A1 - System RAM - RS-232 interrupt-enable byte (Timer A / Timer B / FLAG enable bits)
- $DD00-$DD0F - CIA 2 (base $DD00) - Port/timers/TOD/SDR/ICR/CRA/CRB; PRB is $DD01 (RS-232 Port B), ICR is $DD0D (interrupt control register)

## References
- "rs232_get_byte_from_rx_buffer" — expands on fetching a byte from the Rx buffer when conditions allow
- "rs232_check_bus_idle_and_interrupt_clear" — expands on bus-idle checks and clearing RS-232 interrupt enables
- "rs232_tx_timer_setup_and_start" — expands on timer-driven transmit setup (transmit control)