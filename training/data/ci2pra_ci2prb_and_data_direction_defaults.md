# CIA #2 Data Ports A/B and Data Direction Registers ($DD00-$DD03)

**Summary:** CIA #2 Data Port A ($DD00) and Data Port B ($DD01) map VIC-II bank select bits, the serial bus lines, and the User Port / RS-232 signals; Data Direction Registers at $DD02-$DD03 control port directions (DDR A default = %00111111 = 63, DDR B default = 0). Terms: CIA-II, $DD00-$DD03, VIC-II bank select, User Port, RS-232, serial bus.

**Data Port Register A (CI2PRA $DD00)**

CI2PRA is the CIA #2 Port A data register. Its bits are used for VIC-II memory bank selection and for driving/reading the serial bus and User Port RS-232 output.

Bit assignments:
- Bits 0-1: VIC-II 16K memory bank select (two-bit bank select; example mapping given: 11 = bank 0, 00 = bank 3).
- Bit 2: RS-232 data output (SOUT) — User Port pin M.
- Bit 3: Serial bus ATN (output).
- Bit 4: Serial bus CLOCK out (pulse).
- Bit 5: Serial bus DATA out.
- Bit 6: Serial bus CLOCK in (input).
- Bit 7: Serial bus DATA in (input).

Use the Data Direction Register A ($DD02) to configure which CI2PRA bits are inputs vs outputs. Default DDR A = 63 (binary 00111111), meaning bits 0–5 are outputs and bits 6–7 are inputs.

**Data Port Register B (CI2PRB $DD01)**

CI2PRB maps the User Port pins and RS-232 control/status signals; bits may also be used as toggle/pulse outputs driven by Timer A/B.

Bit assignments:
- Bit 0: RS-232 data input (SIN) — User Port pin C.
- Bit 1: RS-232 RTS (Request To Send) — User Port pin D.
- Bit 2: RS-232 DTR (Data Terminal Ready) — User Port pin E.
- Bit 3: RS-232 RI (Ring Indicator) — User Port pin F.
- Bit 4: RS-232 DCD (Carrier Detect) — User Port pin H.
- Bit 5: User Port pin J (general purpose).
- Bit 6: RS-232 CTS (Clear To Send) — User Port pin K; also used as toggle/pulse data output for Timer A.
- Bit 7: RS-232 DSR (Data Set Ready) — User Port pin L; also used as toggle/pulse data output for Timer B.

Default DDR B = 0 (all inputs). When an RS-232 device is opened by the system, bits 1 and 2 of Port B are changed to outputs.

**Data Direction Registers (CI2DDRA/CI2DDRB $DD02-$DD03)**

- $DD02 ($DD02) — CI2DDRA: Data Direction Register for Port A. Default = 63 (binary 00111111): bits 0–5 outputs, bits 6–7 inputs.
- $DD03 ($DD03) — CI2DDRB: Data Direction Register for Port B. Default = 0 (all inputs). System opens of the RS-232 device flip bits 1 and 2 to outputs.

These DDRs control the direction of each corresponding data port bit; consult the CIA #1 DDR documentation for behavioral details referenced in system documentation (behavior and side-effects are consistent between CIA #1 and CIA #2).

## Source Code

```text
56576         $DD00          CI2PRA
Data Port Register A

Bits 0-1:  Select the 16K VIC-II chip memory bank (11=bank 0, 00=bank 3)
Bit 2:  RS-232 data output (Sout)/Pin M of User Port
Bit 3:  Serial bus ATN signal output
Bit 4:  Serial bus clock pulse output
Bit 5:  Serial bus data output
Bit 6:  Serial bus clock pulse input
Bit 7:  Serial bus data input

56577         $DD01          CI2PRB
Data Port B

Bit 0:  RS-232 data input (SIN)/ Pin C of User Port
Bit 1:  RS-232 request to send (RTS)/ Pin D of User Port
Bit 2:  RS-232 data terminal ready (DTR)/ Pin E of User Port
Bit 3:  RS-232 ring indicator (RI)/ Pin F of User Port
Bit 4:  RS-232 carrier detect (DCD)/ Pin H of User Port
Bit 5:  Pin J of User Port
Bit 6:  RS-232 clear to send (CTS)/ Pin K of User Port
        Toggle or pulse data output for Timer A
Bit 7:  RS-232 data set ready (DSR)/ Pin L of User Port
        Toggle or pulse data output for Timer B

Location Range: 56578-56579 ($DD02-$DD03)
CIA #2 Data Direction Registers A and B

These Data Direction registers control the direction of data flow over
Data Ports A and B.  For more details on the operation of these
registers, see the entry for the CIA #1 Data Direction Registers at
56322 ($DC02).

The default setting for Data Direction Register A is 63 (all bits
except 6 and 7 are outputs), and for Data Direction Register B the
default setting is 0 (all inputs).  Bits 1 and 2 of Port B are changed
to output when the RS-232 device is opened.
```

## Key Registers

- $DD00-$DD01 - CIA #2 - Data Port A (CI2PRA) and Data Port B (CI2PRB) with bit-level mappings to VIC-II bank select, serial bus, and User Port / RS-232 pins.
- $DD02-$DD03 - CIA #2 - Data Direction Registers A/B (CI2DDRA/CI2DDRB); DDR A default = 63, DDR B default = 0.

## References

- "serial_bus_rs232_and_user_port_overview" — expands how Port A/B map to the serial bus and RS-232 signals.
- "CIA #1 Data Direction Registers ($DC02)" — referenced for additional DDR operation details.