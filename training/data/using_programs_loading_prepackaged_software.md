# Chapter 3.1: Loading Prepackaged Programs from Disk

**Summary:** Steps to load a prepackaged program from disk using the LOAD command (LOAD "PROGRAM NAME",8) and the expected DRIVE messages (SEARCHING / LOADING / READY) before running the program with RUN.

## Procedure
1. Insert the preprogrammed floppy disk into the drive (label up, notch toward the left).
2. Close the drive gate/lever.
3. At the BASIC prompt type:
   LOAD "PROGRAM NAME",8
   and press RETURN.
4. The drive will spin and the screen will show the drive messages indicating progress.
5. When the screen shows READY, type:
   RUN
   then press RETURN to start the program.

## Source Code
```basic
LOAD "PROGRAM NAME",8
```

```text
 SEARCHING FOR PROGRAM NAME
 LOADING

 READY
```

```basic
RUN
```

## References
- "load_command_syntax_and_examples" — expands on detailed LOAD command options and device numbers (command numbers)
