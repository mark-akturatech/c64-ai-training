# Command Channel (Secondary Address 15)

**Summary:** The 1541 command channel (channel / secondary address 15) is the disk-drive control link used to monitor drive error status, send DOS housekeeping commands (format, scratch, rename), and instruct DOS to read or write specific disk areas.

## Overview
The command channel (channel number 15) is a dedicated communication channel between the host computer and the Commodore 1541 disk drive's DOS. Its primary roles are:

- Monitor drive error status to check whether the drive and DOS operations completed successfully.
- Send DOS housekeeping commands for disk management tasks such as FORMAT, SCRATCH (delete file), and RENAME.
- Instruct DOS to read from or write to specific disk areas (detailed read/write procedures are covered elsewhere).

This section (source chapter) concentrates on the first two roles — error monitoring and housekeeping commands. Reading and writing sectors/tracks are handled in Chapter 5 (detailed disk I/O procedures).

(From BASIC: the command channel is typically accessed via OPEN/PRINT#/GET#/CLOSE for text commands and responses.)

## Source Code
<!-- No code/listings included in the source. -->

## Key Registers
<!-- Omitted: this chunk does not describe specific C64/1541 hardware registers. -->

## References
- "using_command_channel_steps" — expands on using the command channel from BASIC (OPEN/PRINT#/GET#/CLOSE)