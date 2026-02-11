# System Area $0298-$02A0 — RS232 bytes/timers, buffers, ISR backup

**Summary:** System RAM locations $0298-$02A0 hold RS232 configuration (byte size $0298), a 16-bit RS232 input timer ($0299-$029A), RS232 input/output buffer offsets and current index pointers ($029B-$029E), and a 2‑byte ISR backup pointer ($029F-$02A0). Values spanning multiple addresses are stored little-endian.

## Description
These addresses are part of the C64 system area used by the built-in RS232 (user port) handling and for temporarily storing an original interrupt vector when the system replaces IRQ/BRK handlers.

- $0298 — RS232 Byte Size: number of data bits per RS232 byte (stored as a single byte).
- $0299-$029A — RS232 In Timer: default input-timer value for RS232 receive logic (16‑bit, little‑endian).
- $029B — RS232 In Offset: byte offset/index into the RS232 input ring buffer (single byte).
- $029C — RS232 In Ptr: current pointer/index within the RS232 input buffer (single byte).
- $029D — RS232 Out Offset: byte offset/index into the RS232 output buffer (single byte).
- $029E — RS232 Out Ptr: current pointer/index within the RS232 output buffer (single byte).
- $029F-$02A0 — ISR Backup: stored original interrupt routine pointer (2 bytes, little‑endian). This is used to restore the original vector after a temporary replacement; see hardware_vectors for expanded interrupt handling.

Notes:
- Multi-byte numeric fields are stored little-endian (low byte at the lower address).
- The In/Out Offset and Ptr entries are 8-bit indexes/offsets into buffers, not full 16-bit absolute addresses.
- These locations are in RAM (system area) and are used by ROM/firmware routines that manage RS232 and interrupt vectors.

## Source Code
```text
$0298   RS232 Byte Size         RS232 data bits per byte
$0299-$029A  RS232 In Timer     RS232 input timer default value
$029B   RS232 In Offset         RS232 input buffer byte offset
$029C   RS232 In Ptr            RS232 input buffer current pointer
$029D   RS232 Out Offset        RS232 output buffer byte offset
$029E   RS232 Out Ptr           RS232 output buffer current pointer
$029F-$02A0  ISR Backup         Original interrupt routine pointer backup
```

## Key Registers
- $0298 - System RAM - RS232 byte size (data bits per byte)
- $0299-$029A - System RAM - RS232 input timer default (16-bit, little-endian)
- $029B-$029E - System RAM - RS232 buffer offsets and current pointers (8-bit each)
- $029F-$02A0 - System RAM - ISR backup pointer (16-bit original interrupt routine pointer, little-endian)

## References
- "hardware_vectors" — expands on ISR backups and interrupt handling