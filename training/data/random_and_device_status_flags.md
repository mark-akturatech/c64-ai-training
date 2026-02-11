# Zero Page $008B-$0098 — RND state, device status, datasette & serial buffers

**Summary:** Zero-page memory locations $008B-$0098 hold the RND() state ($008B-$008F), the ST device-status variable ($0090), Stop key indicator ($0091), datasette timing and load/verify switches ($0092-$0093), serial output cache and previous byte ($0094-$0095), tape end-of-tape flag ($0096), saved I/O register ($0097), and number of open files ($0098).

**Description**
This zero-page block is used by the KERNAL and BASIC runtime for random-number state, device-status reporting, cassette (datasette) control, and simple serial-bus output caching. Entries are short, fixed-purpose single-byte fields used by system routines and should be treated as volatile system state.

- **$008B-$008F — RND state:** A 5-byte area storing the previous RND() result in floating-point format. This state is used to generate the next pseudo-random number in the sequence.

- **$0090 — ST variable:** Device status byte used for serial bus and datasette status reporting. The bit-level layout is as follows:

  - **Bit 0 (Value 1):** Serial bus write timeout.
  - **Bit 1 (Value 2):** Serial bus read timeout.
  - **Bit 2 (Value 4):** Datasette short block (less than 192 bytes).
  - **Bit 3 (Value 8):** Datasette long block (greater than 192 bytes).
  - **Bit 4 (Value 16):** Datasette unrecoverable read error or VERIFY mismatch.
  - **Bit 5 (Value 32):** Datasette checksum error.
  - **Bit 6 (Value 64):** End of file (EOF) reached.
  - **Bit 7 (Value 128):** Device not present.

- **$0091 — Stop key indicator:** Single-byte flag indicating Stop key status. Encoded as $7F when Stop is pressed, $FF when not pressed.

- **$0092 — Timing constant:** Datasette timing constant used by tape routines for bit timing.

- **$0093 — LOAD/VERIFY switch:** Datasette load vs. verify selection flag used by tape load/verify code paths.

- **$0094 — Serial cache:** Cache/status for serial-bus output (holds immediate output status).

- **$0095 — Serial previous byte:** Previously sent byte on the serial bus (for retransmit/handshaking or quick checks).

- **$0096 — Tape EOL:** Datasette end-of-tape indicator (set by tape routines when EOL reached).

- **$0097 — Register save:** Single-byte saved register value used during I/O (temporary register preservation by system routines).

- **$0098 — Files open:** Count of currently open files (range 0–10).

These locations are used internally by BASIC/KERNAL; user programs should avoid clobbering them unless deliberately interacting with the system I/O and cassette routines.

## Source Code
```text
$008B-$008F  RND State          Previous RND() result
$0090        ST Variable        Device status: serial bus and datasette
$0091        Stop Key           Stop key indicator ($7F pressed, $FF not)
$0092        Timing Const       Datasette timing constant
$0093        LOAD/VERIFY        Datasette load/verify switch
$0094        Serial Cache       Serial bus output cache status
$0095        Serial Prev        Previous byte sent to serial bus
$0096        Tape EOL           Datasette end-of-tape indicator
$0097        Register Save      Saved register value during I/O
$0098        Files Open         Number of open files (0-10)
```

## Key Registers
- $008B-$008F - Zero Page - RND() state / previous random values
- $0090 - Zero Page - ST device-status variable (serial & datasette)
- $0091 - Zero Page - Stop key indicator ($7F = pressed, $FF = not pressed)
- $0092-$0093 - Zero Page - Datasette timing constant and LOAD/VERIFY switch
- $0094-$0095 - Zero Page - Serial-bus output cache and previous byte
- $0096 - Zero Page - Datasette end-of-tape (EOL) indicator
- $0097 - Zero Page - Saved register value during I/O
- $0098 - Zero Page - Number of open files (0–10)

## References
- "datasette_and_serial_buffers" — expands on datasette and serial-related zero page fields
- "random_number_state" — expands on RND() state usage and implementation details

## Labels
- RND
- ST
- STOP
