# CIA 2 Data Port B ($DD01 / CI2PRB) — RS-232 / User Port mapping

**Summary:** CIA 2 Data Port B ($DD01, CI2PRB) maps RS-232 signals (SIN, RTS, DTR, RI, DCD, CTS, DSR) onto the User Port physical pins and provides Timer A/B toggle/pulse output capability on bits 6/7.

## Description
$DD01 is the Data Port B register of CIA #2 (CI2PRB). On a stock C64 the bits of this port are wired to the User Port and to the RS-232 connector signals, so reading or writing CI2PRB accesses those physical lines. Bits 6 and 7 additionally serve as alternate outputs for Timer A and Timer B (toggle or pulse output capability, depending on CIA timer configuration).

The precise bit-to-signal mapping and the User Port pin letters are contained in the reference mapping below (moved to Source Code to preserve exact phrasing and layout).

## Source Code
```text
$DD01        CI2PRB       Data Port B

                     0    RS-232 data input (SIN)/ Pin C of User Port
                     1    RS-232 request to send (RTS)/ Pin D of User Port
                     2    RS-232 data terminal ready (DTR)/ Pin E of User Port
                     3    RS-232 ring indicator (RI)/ Pin F of User Port
                     4    RS-232 carrier detect (DCD)/ Pin H of User Port
                     5    Pin J of User Port
                     6    RS-232 clear to send (CTS)/ Pin K of User Port
                          Toggle or pulse data output for Timer A
                     7    RS-232 data set ready (DSR)/ Pin L of User Port
                          Toggle or pulse data output for Timer B
```

## Key Registers
- $DD01 - CIA 2 - Data Port B (CI2PRB) — RS-232 <> User Port bit mapping; Timer A/B toggle/pulse on bits 6/7

## References
- "user_port_pinout" — which User Port pins correspond to Port B bits
- "dd04_dd07_timers_overview" — Timer outputs (A/B) toggle/pulse behavior on Port B bits 6/7

## Labels
- CI2PRB
