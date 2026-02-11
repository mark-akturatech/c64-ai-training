# $FFD5 — LOAD (KERNAL) — Load RAM from a device

**Summary:** KERNAL vector $FFD5 loads bytes from an input device into RAM or verifies device data against RAM. Requires SETLFS ($FFBA) and SETNAM ($FFBD) beforehand; A=0 for load, A=1 for verify. Header handling depends on device secondary address (0 vs 1/2); returns the highest RAM address loaded.

## Description
This KERNAL routine reads data bytes from any input device into the computer's memory, or performs a verify-only operation that compares device data with the contents of RAM without modifying memory.

- Operation mode: set A = #$00 for a load (write device data into RAM), or A = #$01 for a verify (compare device data with RAM, leave RAM unchanged).
- Device addressing:
  - If the device was OPENed with secondary address 0, the device header is ignored and the XY register pair must contain the starting RAM address for the load.
  - If the device was OPENed with secondary address 1 or 2, the device-supplied header determines the starting load address.
- Return value: the routine returns the address of the highest RAM location that was loaded (address format per KERNAL conventions as documented elsewhere).
- Precondition: caller must set device and filename via SETLFS ($FFBA) and SETNAM ($FFBD) before calling this routine.

## References
- "ffba_set_logical_first_and_second_addresses" — expands on SETLFS for device selection
- "ffbd_set_the_filename" — expands on SETNAM for filename selection

## Labels
- LOAD
