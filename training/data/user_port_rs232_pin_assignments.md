# Commodore 64 — User Port / RS-232 pin assignments (CIA #2, 6526, $DD00-$DD0F)

**Summary:** CIA #2 (6526) user-port RS‑232 pin mapping for the C64 user port: lists DB‑25 connector pin IDs, 6526 port bits (PB0–PB7, PA2, FLAG2), EIA signal names/abbreviations (Sin/Sout, RTS, DTR, RI, DCD, CTS, DSR), input/output direction, and supported interface modes (3-line, X‑line, user-available). Includes note of lines held high during 3‑line mode.

## Pin mapping and interface modes
This chunk documents the C64 user-port/RS‑232 assignments implemented on CIA #2 (6526) at $DD00–$DD0F. The table (in Source Code) is the authoritative mapping; key points:

- Port bits used:
  - Port B bits PB0..PB7 map to RS‑232 signals including received data (Sin), RTS, DTR, RI, DCD, CTS, DSR and one unassigned.
  - FLAG2 and PA2 are also used: FLAG2 = received data (Sin) input, PA2 = transmitted data (Sout) output.
- Direction:
  - Sin (received data) is an input (PB0 and/or FLAG2).
  - Sout (transmitted data) is output on PA2.
  - RTS, DTR are outputs.
  - RI, DCD, CTS, DSR are inputs.
- Interface modes (as shown in table):
  1) 3‑LINE INTERFACE — uses Sin, Sout, GND.
  2) X‑LINE INTERFACE — uses the full modem control/status set (RTS, DTR, CTS, DSR, DCD).
  3) USER‑AVAILABLE ONLY — pins unused/unimplemented by standard ROM code (available for custom use).
- During 3‑LINE MODE the RTS and DTR lines (PB1 and PB2) are held high (marked with * in the table).
- Ground pins: table lists both protective ground and signal ground separately.

Refer to the Source Code section for the full DB‑25 pin/bit table and mode markings.

## Source Code
```text
  |PIN| 6526|      DESCRIPTION     | EIA  |  ABV  |  IN/  |     MODES     |
  | ID|  ID |                      |      |       |  OUT  |               |
  +---+-----+----------------------+------+-------+-------+---------------+
  | C | PB0 | RECEIVED DATA        | (BB) |  Sin  |  IN   |     1 2       |
  | D | PB1 | REQUEST TO SEND      | (CA) |  RTS  |  OUT  |     1*2       |
  | E | PB2 | DATA TERMINAL READY  | (CD) |  DTR  |  OUT  |     1*2       |
  | F | PB3 | RING INDICATOR       | (CE) |  RI   |  IN   |         3     |
  | H | PB4 | RECEIVED LINE SIGNAL | (CF) |  DCD  |  IN   |       2       |
  | I | PB5 | UNASSIGNED           | (  ) |  XXX  |  IN   |         3     |
  | K | PB6 | CLEAR TO SEND        | (CB) |  CTS  |  IN   |       2       |
  | L | PB7 | DATA SET READY       | (CC) |  DSR  |  IN   |       2       |
  |   |     |                      |      |       |       |               |
  | B |FLAG2| RECEIVED DATA        | (BB) |  Sin  |  IN   |     1 2       |
  | M | PA2 | TRANSMITTED DATA     | (BA) |  Sout |  OUT  |     1 2       |
  |   |     |                      |      |       |       |               |
  | A | GND | PROTECTIVE GROUND    | (AA) |  GND  |       |     1 2       |
  | N | GND | SIGNAL GROUND        | (AB) |  GND  |       |     1 2 3     |
  +---+-----+----------------------+------+-------+-------+---------------+
  | MODES:                                                                |
  | 1) 3-LINE INTERFACE (Sin,Sout,GND)                                    |
  | 2) X-LINE INTERFACE                                                   |
  | 3) USER AVAILABLE ONLY (Unused/unimplemented in code.)                |
  | * These lines are held high during 3-LINE mode.                       |
  +-----------------------------------------------------------------------+
```

## Key Registers
- $DD00-$DD0F - CIA 2 (6526) - Port A / Port B, data direction, timers and control registers; Port B bits PB0–PB7 and Port A bit PA2/FLAG2 are used for user-port RS‑232 signals.

## References
- "rs232_status_register_bits_and_usage" — RS‑232 status bits, reading and clearing (ST)
- "rs232_buffer_base_pointers" — Receiver/Transmitter buffer base pointers used by OPEN/CLOSE
- "sample_basic_program_pet_ascii" — Example BASIC program using the 3‑line RS‑232 interface

## Labels
- PB0
- PB1
- PB2
- PA2
- FLAG2
