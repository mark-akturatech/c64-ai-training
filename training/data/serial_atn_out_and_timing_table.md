# SERIAL ATN OUT (Serial Attention Out) — C64 IEC Serial Bus

**Summary:** Serial ATN (Attention) is the C64's signal to start an IEC serial-bus command sequence: the C64 pulls ATN low, all devices listen for an address, and the addressed device must respond within the preset timing (Tat etc.) or the C64 reports device-not-present. Includes SERIAL BUS TIMING symbols (Tat, Th, Tne, Ts, Tv, Tf, Tr, Tbb, Tye, Tei, Try, Tpr, Ttk, Tdc, Tda, Tfr) and notes on error conditions and minimum timing requirements for external talkers/listeners.

**Description**
When the Commodore 64 asserts SERIAL ATN OUT (pulls the ATN line LOW), it signals all devices on the IEC serial bus to listen for an address byte. The addressed device must respond within the ATN-response limit; failure to respond within that time causes the C64 to assume the device is absent and set a device-not-present error in the STATUS WORD.

The serial-bus timing is specified by a set of named timing symbols (Tat, Th, Tne, Ts, Tv, Tf, Tr, Tbb, Tye, Tei, Try, Tpr, Ttk, Tdc, Tda, Tfr). The timing table (below) gives minimum, typical, and maximum values where defined, and a set of numbered notes explain error conditions and required minimums for external devices:
- Note 1: exceeding Tat → device-not-present error.
- Note 2: exceeding Tne → EOI response required.
- Note 3: exceeding Tf → frame error.
- Note 4: Tv and Tpr minimum must be 60 µs for an external device to function as a talker.
- Note 5: Tei minimum must be 80 µs for an external device to function as a listener.

This chunk contains the official SERIAL BUS TIMING table and the accompanying notes. The referenced figure showing ATN operation (Figure 6-4) is missing from the source.

## Source Code
```text
                          SERIAL BUS TIMING
+-----------------------------+-------+-------+-------+-----------------+
|     Description             | Symbol|  Min. |  Typ. |       Max.      |
+-----------------------------+-------+-------+-------+-----------------+
| ATN RESPONSE (REQUIRED) (1) |  Tat  |   -   |   -   |     1000µs      |
| LISTENER HOLD-OFF           |  Th   |   0   |   -   |    infinite     |
| NON-EOI RESPONSE TO RFD (2) |  Tne  |   -   |  40µs |      200µs      |
| BIT SET-UP TALKER (4)       |  Ts   |  20µs |  70µs |        -        |
| DATA VALID                  |  Tv   |  20µs |  20µs |        -        |
| FRAME HANDSHAKE (3)         |  Tf   |   0   |  20   |     1000µs      |
| FRAME TO RELEASE OF ATN     |  Tr   |  20µs |   -   |        -        |
| BETWEEN BYTES TIME          |  Tbb  | 100µs |   -   |        -        |
| EOI RESPONSE TIME           |  Tye  | 200µs | 250µs |        -        |
| EOI RESPONSE HOLD TIME (5)  |  Tei  |  60µs |   -   |        -        |
| TALKER RESPONSE LIMIT       |  Try  |   0   |  30µs |       60µs      |
| BYTE-ACKNOWLEDGE (4)        |  Tpr  |  20µs |  30µs |        -        |
| TALK-ATTENTION RELEASE      |  Ttk  |  20µs |  30µs |      100µs      |
| TALK-ATTENTION ACKNOWLEDGE  |  Tdc  |   0   |   -   |        -        |
| TALK-ATTENTION ACK. HOLD    |  Tda  |  80µs |   -   |        -        |
| EOI ACKNOWLEDGE             |  Tfr  |  60µs |   -   |        -        |
+-----------------------------+-------+-------+-------+-----------------+

Notes:
1. If maximum time exceeded, device not present error.
2. If maximum time exceeded, EOI response required.
3. If maximum time exceeded, frame error.
4. Tv and Tpr minimum must be 60µs for external device to be a talker.
5. Tei minimum must be 80µs for external device to be a listener.
```
