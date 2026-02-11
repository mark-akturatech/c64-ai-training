# R6510 processor port — Cassette / Datasette bits (bits 3–5)

**Summary:** Describes R6510 processor-port register ($01) bits 3–5: Bit 3 = Cassette Data Output (write), Bit 4 = Cassette Switch Sense (read, requires DDR bit 4 = 0 at $00), Bit 5 = Cassette Motor Control (0 = motor allowed, 1 = motor disabled). Covers keyboard-scan interrupt motor interlock and how to POKE location 192 ($C0) to take manual control.

## Description
Bits 3–5 of the R6510 processor port control and monitor the Datasette (cassette recorder) functions:

- Bit 3 (Cassette Data Output): output line tied to the Cassette Data Write pin on the cassette port; used to send data to be written to tape.
- Bit 4 (Cassette Switch Sense): input reflecting whether a transport button (play/record/rewind etc.) is pressed; when the recorder switch is down this bit reads 1. For bit 4 to return the correct state, the corresponding bit in the R6510 Data Direction Register at location $00 (bit 4) must be configured as input (i.e., DDR bit 4 = 0).
- Bit 5 (Cassette Motor Control): controls whether the cassette motor may run. Setting this bit to 0 allows the motor to turn when a recorder button is pressed; setting it to 1 disables the motor from turning.

Keyboard-scan interrupt and interlock behavior:
- The system keyboard-scan interrupt runs every 1/60 second (the keyboard scan/IRQ routine). That routine normally controls the motor bit: if no cassette transport buttons are pressed the routine turns the motor off and writes zero to the interlock byte at memory location 192 (decimal) / $C0 (hex).
- When a recorder button is pressed, if the interlock byte at $00C0 is zero the keyboard-scan routine will clear Bit 5 of $01 (set it to 0) to turn the motor on.
- While the interlock byte contains zero, the key-scan routine prevents user programs from taking direct control of Bit 5; i.e., the routine will override user writes so long as the interlock remains zero and no button is pressed.
- To allow a program to control the motor manually, the user/program must first press a recorder button and then POKE a nonzero value into location 192 ($C0). Once a nonzero value is present in $C0 and a transport button remains pressed, the program may change Bit 5 of $01 to turn the motor on/off as desired until the button is released.

Practical notes preserved from source:
- The interlock is always set to zero by the key-scan routine when no recorder buttons are pressed.
- To gain manual control: press a recorder button, then POKE 192,<nonzero>. You may then manipulate Bit 5 of $01 while the button stays pressed.

## Key Registers
- $0001 - R6510 processor port - Data port (bits 3–5 control cassette functions)
- $0000 - R6510 Data Direction Register (DDR) - set bit 4 = 0 to read cassette switch sense correctly

## References
- "d6510_data_direction_register_at_0" — expands on setting DDR bit 4 (location $00) as input for cassette switch sense
- "r6510_internal_io_port_overview" — expands on processor-port bits including cassette-related functions
