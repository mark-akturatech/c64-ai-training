# 6520 Peripheral I/O Ports — Data Direction Register (DDR) operation

**Summary:** 6520 Peripheral I/O lines are individually programmable as inputs or outputs via the Data Direction Register (DDR); a DDR bit of '1' configures the corresponding line as an output and '0' configures it as an input. DDRs are typically initialized at reset but can be changed dynamically for device control.

## Operation
Each peripheral I/O line on the 6520 is controlled by a corresponding bit in the Data Direction Register (DDR). Setting a DDR bit to 1 programs that physical I/O line as an output; setting the bit to 0 programs it as an input. This direction is applied on a per-line (bit) basis, allowing mixed input/output usage on a single port.

## Programming and usage
- DDR bits are normally set during system reset (initial port directions).
- DDR bits can be changed at any time during program execution to reconfigure lines for different tasks (dynamic control of devices).
- Changes to DDR affect only the direction (input vs output); the programmer must write or read the port registers as appropriate for the configured direction.

## Notes
- Data Direction Register (DDR) controls direction only; the exact behavior of read/write operations on the port registers depends on the specific 6520 implementation and system wiring.