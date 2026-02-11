# KERNAL $FFC9 — Open channel for output

**Summary:** The KERNAL routine at $FFC9, CHKOUT, designates an already-open logical file (opened via $FFC0) as the current output channel for CHROUT ($FFD2). If omitted, the screen (device 3) remains the default output. For serial devices, this routine sends the LISTEN command and any secondary address specified during OPEN.

**Description**

JSR $FFC9 sets an existing logical file, previously opened with the OPEN routine ($FFC0), as the output channel. The device assigned to that logical file must be output-capable; otherwise, the routine will abort with an error.

Behavior notes:

- Must be called before sending characters with CHROUT ($FFD2) when the destination is anything other than the screen.
- If output is to the screen and no other output channels are open, neither OPEN ($FFC0) nor this routine are required.
- For devices on the serial bus, this routine automatically transmits the LISTEN command and any secondary address specified during OPEN ($FFC0).

**How to Use:**

1. Use the KERNAL OPEN routine to specify a logical file number, a LISTEN address, and a secondary address (if needed).
2. Load the X register with the logical file number used in the OPEN statement.
3. Call this routine (by using the JSR instruction).

**Example:**


Possible error returns (KERNAL error codes):

- 3 — File not open
- 5 — Device not present
- 7 — Not an output file

## Source Code

```assembly
LDX #3
JSR CHKOUT ; Define logical file 3 as an output channel
```


## References

- "ffd2_output_character_to_channel" — CHROUT: send characters to the current output channel
- "ffba_set_logical_first_and_second_addresses" — SETLFS: prepare device number, logical file number, and secondary address for OPEN ($FFC0)

## Labels
- CHKOUT
