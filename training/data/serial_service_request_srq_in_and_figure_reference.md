# SERIAL SRQ IN (Serial Service Request In)

**Summary:** Serial SRQ IN (Serial Service Request In) is the serial-bus service-request line that any device on the C64 serial bus may pull LOW to request attention; the Commodore 64 will then service the device. Includes a reference to a serial bus timing figure (Figure 6-4).

**Description**
Serial SRQ IN is a single-wire service-request input on the Commodore 64 serial bus. Any device connected to the serial bus may assert the line by pulling it LOW to signal it requires attention from the C64; the computer will respond and service the requesting device. The original source references a timing diagram (Figure 6-4, "Serial Bus Timing") illustrating timing relationships for the serial bus, but the figure itself is not present in this chunk.

## Source Code
```text
+-----------------------------+-------+-------+-------+-----------------+
| Description                 | Symbol| Min.  | Typ.  | Max.            |
+-----------------------------+-------+-------+-------+-----------------+
| ATN RESPONSE (REQUIRED) (1) | T_AT  | -     | -     | 1000µs          |
| LISTENER HOLD-OFF           | T_H   | 0     | -     | infinite        |
| NON-EOI RESPONSE TO RFD (2) | T_NE  | -     | 40µs  | 200µs           |
| BIT SET-UP TALKER (4)       | T_S   | 20µs  | 70µs  | -               |
| DATA VALID                  | T_V   | 20µs  | 20µs  | -               |
| FRAME HANDSHAKE (3)         | T_F   | 0     | 20µs  | 1000µs          |
| FRAME TO RELEASE OF ATN     | T_R   | 20µs  | -     | -               |
| BETWEEN BYTES TIME          | T_BB  | 100µs | -     | -               |
| EOI RESPONSE TIME           | T_YE  | 200µs | 250µs | -               |
| EOI RESPONSE HOLD TIME (5)  | T_EI  | 60µs  | -     | -               |
| TALKER RESPONSE LIMIT       | T_RY  | 0     | 30µs  | 60µs            |
| BYTE-ACKNOWLEDGE (4)        | T_PR  | 20µs  | 30µs  | -               |
| TALK-ATTENTION RELEASE      | T_TK  | 20µs  | 30µs  | 100µs           |
| TALK-ATTENTION ACKNOWLEDGE  | T_DC  | 0     | -     | -               |
| TALK-ATTENTION ACK. HOLD    | T_DA  | 80µs  | -     | -               |
| EOI ACKNOWLEDGE             | T_FR  | 60µs  | -     | -               |
+-----------------------------+-------+-------+-------+-----------------+

Notes:
1. If maximum time exceeded, device not present error.
2. If maximum time exceeded, EOI response required.
3. If maximum time exceeded, frame error.
4. T_V and T_PR minimum must be 60µs for external device to be a talker.
5. T_EI minimum must be 80µs for external device to be a listener.
```

## References
- "serial_atn_out_and_timing_table" — expands on ATN signal and full serial bus timing table  
- "serial_clock_data_and_expansion_port_pinout" — expands on Serial clock/data signals and expansion port pinout