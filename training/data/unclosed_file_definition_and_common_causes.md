# Unclosed file type ('*' prefix) — causes and brief description

**Summary:** Files whose type byte begins with '*' (for example *SEQ, *PRG) are unclosed file entries on disk; common causes include disk-full during save, bad sector during write, program aborts (RUN/STOP, RUN/STOP+RESTORE) without CLOSE, or a BASIC syntax error returning to immediate mode. See Chapter 8 for recovery procedures.

## Description
An unclosed file on Commodore disk media is indicated by the file-type byte beginning with an asterisk (*) — e.g. *SEQ, *PRG. This means the directory entry records a file that was not properly closed and therefore may have incomplete allocation or corrupt metadata.

Common causes:
1. Disk-full during a save/write operation — the disk reached physical capacity while writing the file.
2. A bad sector encountered during a write — the write failed partway through due to a bad track/sector.
3. File left open after writing because the program did not CLOSE the file or the program was aborted (RUN/STOP, or RUN/STOP + RESTORE).
4. The program contained a BASIC syntax error which caused the interpreter to return to immediate mode while a file was still open.

Unclosed files require recovery procedures (see Chapter 8). They should be handled carefully (for example, avoid scratching them until validated) — see referenced recovery and scratch-command documents for more detail.

## References
- "Chapter 8" — recovery procedures for unclosed files
- "scratch_command_overview_and_basic_syntax" — defines unclosed files in the context of the scratch command
- "warnings_consequences_and_recovery_after_scratch" — explains why unclosed files must not be scratched and how to validate/recover them
