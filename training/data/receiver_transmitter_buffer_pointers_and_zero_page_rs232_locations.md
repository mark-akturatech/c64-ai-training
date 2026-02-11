# RS-232: KERNAL-managed receiver/transmitter buffer base pointers and zero-page temporaries

**Summary:** Describes the two-byte KERNAL buffer base pointers at $00F7/$00F8 (REBUF) and $00F9/$00FA (ROBUF), how OPEN initializes them and CLOSE deallocates them (CLOSE zeros the high bytes $00F8/$00FA), and lists zero-page temporaries $00A7-$00B6 (INBIT, BITCI, RINONE, RIDATA, RIPRTY, BITTS, NXTBIT, RODATA) used internally by the RS-232 routines.

## Zero-page RS-232 pointers and temporaries
The KERNAL RS-232 interface uses dedicated zero-page locations for two purposes:

- Two 2-byte base pointers point at receiver and transmitter buffers:
  - REBUF — low byte at $00F7, high byte at $00F8 (two-byte base pointer).
  - ROBUF — low byte at $00F9, high byte at $00FA (two-byte base pointer).

- OPEN (KERNAL device-open) sets up these base pointers for the device when allocating RS-232 buffers. CLOSE deallocates the buffers by zeroing the high-order bytes ($00F8 and $00FA) — leaving the low bytes unchanged but the pointer effectively cleared when the high byte is zero.

- Manual allocation warning: If you allocate RS-232 buffer space yourself (bypassing the KERNAL OPEN), you must ensure the system’s top-of-memory and buffer bookkeeping remain correct. Failure to adjust the memory/top-of-heap pointers appropriately can break other KERNAL routines that expect the KERNAL-managed allocation state.

## Zero-page temporaries (internal to RS-232 routines)
These zero-page locations are used as internal temporaries by the built-in RS-232 receive/transmit code. They are not public, not stable for general BASIC/KERNAL-level use, and should not be relied on by user programs — use the official RS-232 OPEN/CLOSE/CHROUT/CHRIN (or KERNAL device calls) instead.

- $00A7 — INBIT — Receiver input bit temporary storage.
- $00A8 — BITCI — Receiver bit count in.
- $00A9 — RINONE — Receiver flag for Start-bit check.
- $00AA — RIDATA — Receiver byte buffer / assembly location.
- $00AB — RIPRTY — Receiver parity bit storage.
- $00B4 — BITTS — Transmitter bit count out.
- $00B5 — NXTBIT — Transmitter next bit to be sent.
- $00B6 — RODATA — Transmitter byte buffer / disassembly location.

## Key Registers
- $00A7-$00B6 - Zero Page - RS-232 internal temporaries (INBIT, BITCI, RINONE, RIDATA, RIPRTY, BITTS, NXTBIT, RODATA)
- $00F7-$00F8 - Zero Page - REBUF two-byte base pointer (low byte $00F7, high byte $00F8)
- $00F9-$00FA - Zero Page - ROBUF two-byte base pointer (low byte $00F9, high byte $00FA)

## References
- "rs232_simple_bidi_basic_echo_program" — expands on BASIC programs that rely on OPEN/CLOSE buffer behavior
- "rs232_true_ascii_send_receive_basic" — example BASIC program depending on proper KERNAL buffer allocation
- "nonzero_page_rs232_memory_locations_and_fifo_status" — complements these zero-page temporaries with non-zero-page RS-232 storage and FIFO status information

## Labels
- REBUF
- ROBUF
- INBIT
- BITCI
- RINONE
- RIDATA
- RIPRTY
- BITTS
- NXTBIT
- RODATA
