# Kernal: Serial Bus (TALK/LISTEN/CIOUT/ACPTR) and Keyboard IRQ/Decode Routines

**Summary:** Documents Kernal serial-bus routines (TALK $ED09, LISTEN $ED0C, CIOUT $EDDD, ACPTR $EE13, UNTLK/UNLSN, SECOND/TKSA, timeout handler $EDB0) and the IRQ-driven keyboard scan/keyboard-decode flow (SCNKEY $EA87, decode/put-in-buffer $EAE0, decode-table selector $EB48, VIC-II $D018 character-set toggle). Includes routine addresses and kernel variable locations.

**Serial Bus Kernal Routines**

- **TALK (60681 / $ED09) and LISTEN (60684 / $ED0C):** Kernal entry points used to command devices on the IEEE-488-style serial bus.
- **Secondary-address/sequence helpers:**
  - **SECOND / TKSA** documented functions (60857 / $EDB9, 60871 / $EDC7) used to send secondary addresses.
- **Command/byte senders:**
  - Subroutines to send command codes and bytes at 60689 / $ED11 and 60736 / $ED40.
- **CIOUT (60893 / $EDDD):** Sends a byte over the serial bus; buffers bytes and sends the final byte with EOI when UNLISTEN is executed.
- **UNTLK (60911 / $EDEF) and UNLSN (60926 / $EDFE):** End a talk/listen session.
- **ACPTR (60947 / $EE13):** Accept a byte from a TALKer (receive path for serial bus).
- **Time-out / Error handler (60848 / $EDB0):** Handles device non-responses and timing-out devices on the bus.
- **Notes:** These Kernal routines provide the high-level protocol primitives (addressing, secondary addressing, byte transmit/receive, EOI handling). Low-level mapping of serial-bus signal lines to CIA #2 ports is documented separately ("serial_bus_rs232_and_user_port_overview").

**Keyboard IRQ, Scan, Decode Tables, and Character-Set Toggle**

- **IRQ frequency:** IRQ occurs every 1/60 second; the CINV vector at 788 ($0314) transfers execution to the IRQ handler.
- **IRQ handler responsibilities (high level):**
  - Update software clock (zero-page variables at $A0-$A2 — decimal 160-162).
  - Handle cursor flash and maintain cassette/tape interlock (cassette motor interlock when button pressed and interlock flag set).
  - Call keyboard scan routine to detect keypresses and enqueue characters.
- **SCNKEY (60039 / $EA87):** Reads the keyboard matrix via CIA #1 (see CIA1 $DC00); returns the keycode in zero-page $CB (203), sets shift/control flags, and jumps through vector at 655 ($028F) to select the keyboard decode table.
- **Decode and buffer (60128 / $EAE0):** Decodes keycode to PETSCII using the selected table, compares with last key for auto-repeat logic, and, if printable, appends the PETSCII to the keyboard buffer (keyboard buffer tail at zero-page $277 / 631).
- **Decode-table selector (60232 / $EB48):** Reads shift/control state from zero-page $28D (653) and sets the decode-table pointer at zero-page $F5 (245). Behavior:
  - Checks SHIFT + Commodore-logo toggle combination and, if toggle-enable at zero-page $291 (657) allows, changes the character set mapping by setting the VIC Memory Control Register at $D018 (53272) — switching lowercase/uppercase or uppercase/graphics. If a char-set switch occurs, no character is printed for that keypress.
  - Selects among four 64-entry decode tables (standard, SHIFT, Commodore-logo, CONTROL). CTRL has precedence over other modifier keys.
- **Decode table addresses and table locations:**
  - **Keyboard decode table vectors (60281 / $EB79):** Contains low/high addresses of the four decode tables.
  - **Standard decode table (60289 / $EB81):** 64 PETSCII values in keycode order; followed by a 65th byte $FF marking end (keycode 64 = no key).
  - **SHIFT decode table (60354 / $EBC2):** Same format for SHIFTed keys.
  - **Commodore-logo decode table (60419 / $EC03):** Same format for logo-key mappings.
  - **CONTROL decode table (60536 / $EC78):** Same format for CONTROL-key mappings.
- **Character-set setter (60484 / $EC44):** Subroutine used by CHROUT to detect nonprinting set-switch characters (CHR$(14) / CHR$(142)) and perform the character-set switch by writing to $D018. The exact store value is determined by the desired character set configuration.

## Source Code

```assembly
; Standard Keyboard Decode Table at $EB81
EB81: 14 0D 1D 88 85 86 87 11
EB89: 33 57 41 34 5A 53 45 01
EB91: 35 52 44 36 43 46 54 58
EB99: 37 59 47 38 42 48 55 56
EBA1: 39 49 4A 30 4D 4B 4F 4E
EBA9: 2B 50 4C 2D 2E 3A 40 2C
EBB1: 5C 2A 3B 13 01 3D 5E 2F
EBB9: 31 5F 04 32 20 02 51 03
EBC1: FF

; SHIFT Keyboard Decode Table at $EBC2
EBC2: 94 8D 9D 8C 89 8A 8B 91
EBCA: 23 D7 C1 24 DA D3 C5 01
EBD2: 25 D2 C4 26 C3 C6 D4 D8
EBDA: 27 D9 C7 28 C2 C8 D5 D6
EBE2: 29 C9 CA 30 CD CB CF CE
EBEA: 2B D0 CC 2D 2E 3A 40 2C
EBF2: 5C 2A 3B 13 01 3D 5E 2F
EBFA: 31 5F 04 32 20 02 D1 03
EC02: FF

; Commodore-logo Keyboard Decode Table at $EC03
EC03: 14 0D 1D 88 85 86 87 11
EC0B: 33 57 41 34 5A 53 45 01
EC13: 35 52 44 36 43 46 54 58
EC1B: 37 59 47 38 42 48 55 56
EC23: 39 49 4A 30 4D 4B 4F 4E
EC2B: 2B 50 4C 2D 2E 3A 40 2C
EC33: 5C 2A 3B 13 01 3D 5E 2F
EC3B: 31 5F 04 32 20 02 51 03
EC43: FF

; CONTROL Keyboard Decode Table at $EC78
EC78: FF FF FF FF FF FF FF FF
EC80: 1C 17 01 9F 1A 13 05 FF
EC88: 9C 12 04 1E 03 06 14 18
EC90: 1F 19 07 9E 02 08 15 16
EC98: 12 09 0A 92 0D 0B 0F 0E
ECA0: FF 10 0C FF FF 1B 00 FF
ECA8: 1C FF 1D FF FF 1F 1E FF
ECB0: 90 06 FF 05 FF FF 11 FF
ECB8: FF
```

## Key Registers

- **$D018** - VIC-II - Memory Control Register (selects character set bank; used to toggle lowercase/uppercase or uppercase/graphics).
- **$DC00** - CIA #1 - Keyboard matrix and keyboard-related port registers (SCNKEY reads the keyboard via CIA #1).
- **$DD00-$DD0F** - CIA #2 - Serial-bus / user-port lines mapping (serial-bus talk/listen signals are mapped to CIA #2 ports; see serial-bus overview).

## References

- "serial_bus_rs232_and_user_port_overview" — expands on Serial Bus signals and their mapping to CIA #2 ports.

## Labels
- TALK
- LISTEN
- CIOUT
- ACPTR
- UNTLK
- UNLSN
- SECOND
- SCNKEY
