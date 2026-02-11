# READST ($FE07) — Read the I/O Status Word

**Summary:** Kernal routine at $FE07 (jump-table entry $FFB7) that returns the I/O status word in the A register; if the last I/O device was the RS-232, the device status register is read and cleared. See device-specific status code tables at $0090 and $0297.

## Description
READST is a documented KERNAL routine that returns the current I/O Status Word in the accumulator (A). Bits in this status word are set whenever an I/O error occurs to indicate the type of problem. When the routine is invoked and the active device is the RS-232 channel, READST also reads the RS-232 device status register and clears it to zero.

Entry:
- Primary vector/code entry point: $FE07
- Recommended entry via KERNAL jump table: $FFB7

For the meanings of the status-word bits and device-specific status codes, consult the status code tables at $0090 (decimal 144) for general device codes and $0297 (decimal 663) for the RS-232 device codes.

## Key Registers
- $FE07 - KERNAL - READST entry (Read I/O Status Word)
- $FFB7 - KERNAL - Jump-table entry for READST (vector to $FE07)
- $0090 - KERNAL/Data - Device-specific I/O status code table (meanings for status-word bits)
- $0297 - KERNAL/Data - RS-232 device status code entry/table (RS-232-specific meanings)

## References
- "rs232_receive_next_bit_nmi" — expands on RS-232 routines and status affected by NMI-driven RS-232 handling
- "setlfs_set_logical_file_device_secondary" — expands on READST usage after device file operations

## Labels
- READST
