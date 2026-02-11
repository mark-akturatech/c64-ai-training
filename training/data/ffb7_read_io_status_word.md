# C64 KERNAL $FFB7 — Read I/O status word (Lee Davison)

**Summary:** Returns the current I/O device status word in the accumulator (A). Used after serial-bus communication to obtain device status or error flags; searchable terms: $FFB7, KERNAL, I/O status, accumulator A, serial bus.

## Description
This KERNAL routine reads and returns the current status of the selected I/O device in the accumulator (A). It is typically called immediately after performing serial-bus communication (input or output) to determine whether the device reports any status conditions or errors that occurred during the I/O operation.

Calling convention (as documented): the routine places the device status/error byte in A on return. The caller inspects A to decide how to handle errors or report status.

## References
- "ffa5_input_byte_from_serial_bus" — expands on errors after serial input  
- "ffa8_output_byte_to_serial_bus" — expands on errors after serial output  
- "ffa2_set_timeout_on_serial_bus" — explains how the timeout flag affects status
