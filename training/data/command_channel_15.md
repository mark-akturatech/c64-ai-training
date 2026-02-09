# IEC Command Channel (15)

**Summary:** Command channel 15 (decimal) on the Commodore IEC serial bus accepts ASCII byte-stream commands with optional binary arguments; submissions are sent either by streaming to channel 15 (terminated by EOI or UNLISTEN) or by opening a named channel with the command supplied as the filename parameter.

## Command Channel (15) behavior
- Purpose: Channel 15 is the dedicated command/control channel on the IEC serial bus used to send disk drive commands (searchable term: channel 15, command channel).
- Data format: Commands are transmitted as ASCII byte streams. Commands may include optional binary arguments appended to the ASCII command.
- Submission methods:
  1. Stream method — send the command and any binary arguments by writing a data stream to channel 15; terminate the stream with EOI (End Of Information) or with an UNLISTEN bus sequence to indicate end-of-command.
  2. Named-file method — open a logical (named) channel where the command itself is supplied as the filename parameter when opening the channel; the drive interprets the filename string as the command.
- Termination semantics: The receiver (drive) uses the EOI/UNLISTEN end-of-stream condition (or the named-channel-open semantics) to know the command is complete and ready for processing.
- Return/status: Command responses and status reporting are returned over the IEC bus (see referenced material for detailed status codes and reporting behavior).

## Source Code
(omitted — no code or register maps in source)

## Key Registers
(omitted — this chunk documents IEC bus channel behavior, not memory-mapped registers)

## References
- "commodore_dos_channel_architecture" — expands on role and position of channel 15
- "status_reporting_and_error_codes" — expands on how drives return status via command channel