# Expansion Port — Serial CLK/DATA and 44‑pin Expansion Connector Pinout

**Summary:** Documents SERIAL CLK IN/OUT and SERIAL DATA IN/OUT for the C64 serial bus, and provides a complete Commodore 64 expansion port description, including the 44‑pin female edge connector location, cautionary notes, ASCII connector diagram, and a full 44‑pin signal table with per‑pin descriptions and buffering/load notes.

**Serial CLK / Serial DATA**

**SERIAL CLK IN/OUT:**
- Used to time the bit‑serial transfers on the C64 serial bus, in conjunction with ATN and SRQ sequences.

**SERIAL DATA IN/OUT:**
- Carries the bit‑serial data for the IEC/C64 serial peripheral bus; data is transmitted one bit at a time, synchronized by the serial clock (SERIAL CLK).

The timing of these signals is critical for proper communication on the serial bus. The following table outlines the key timing parameters:

| Description                         | Symbol | Min.  | Typ.  | Max.    |
|-------------------------------------|--------|-------|-------|---------|
| ATN RESPONSE (REQUIRED)             | T_AT   | —     | —     | 1000 µs |
| LISTENER HOLD-OFF                   | T_H    | 0     | —     | ∞       |
| NON-EOI RESPONSE TO RFD             | T_NE   | —     | 40 µs | 200 µs  |
| BIT SET-UP TALKER                   | T_S    | 20 µs | 70 µs | —       |
| DATA VALID                          | T_V    | 20 µs | 20 µs | —       |
| FRAME HANDSHAKE                     | T_F    | 0     | 20    | 1000 µs |
| FRAME TO RELEASE OF ATN             | T_R    | 20 µs | —     | —       |
| BETWEEN BYTES TIME                  | T_BB   | 100 µs| —     | —       |
| EOI RESPONSE TIME                   | T_YE   | 200 µs| 250 µs| —       |
| EOI RESPONSE HOLD TIME              | T_EI   | 60 µs | —     | —       |
| TALKER RESPONSE LIMIT               | T_RY   | 0     | 30 µs | 60 µs   |
| BYTE-ACKNOWLEDGE                    | T_PR   | 20 µs | 30 µs | —       |
| TALK-ATTENTION RELEASE              | T_TK   | 20 µs | 30 µs | 100 µs  |
| TALK-ATTENTION ACKNOWLEDGE          | T_DC   | 0     | —     | —       |
| TALK-ATTENTION ACK. HOLD            | T_DA   | 80 µs | —     | —       |
| EOI ACKNOWLEDGE                     | T_FR   | 60 µs | —     | —       |

**Notes:**
1. If the maximum time is exceeded, a device-not-present error occurs.
2. If the maximum time is exceeded, an EOI response is required.
3. If the maximum time is exceeded, a frame error occurs.
4. T_V and T_PR minimum must be 60 µs for an external device to be a talker.
5. T_EI minimum must be 80 µs for an external device to be a listener.

These timing parameters are essential for ensuring reliable data transfer over the C64 serial bus.

**Expansion Port Overview**

- **Connector:** 44‑pin (22/22) female edge connector (requires a 44‑pin male edge connector on cartridges/expansions).
- **Location:** Back of the Commodore 64, far right when the machine faces you.
- **Purpose:** Provides access to system address and data buses and other system signals for cartridges and expansion hardware.
- **Caution:** Devices attached to this bus may damage the C64 if they malfunction; observe buffering and load limits, and the +5V supply total draw limit for USER PORT and CARTRIDGE devices (see pin descriptions).

Connector layout (edge fingers are commonly labeled 1–22 on one side and 23–44 on the other; the source used letter labels A–Z for pins 23–44 — see Source Code for ASCII map and numeric mapping).

A complete pin signal table (pins 1–44, signal names and detailed descriptions, including buffering/load notes) is provided in the Source Code section below.
