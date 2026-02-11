# set filename (BASIC → KERNAL)

**Summary:** Routine called by BASIC parameter parsers that evaluates an expression and a string, reads the BASIC string pointer from zero page ($0022/$0023), and calls the KERNAL filename setter at $FFBD to copy the filename into the KERNAL buffer (uses JSR $AD9E, JSR $B6A3, JMP $FFBD).

## Description
This small helper is invoked by BASIC parameter-parsing routines when a user-supplied filename must be placed into the KERNAL filename buffer. Sequence:

- JSR $AD9E — evaluate an expression (caller supplies context).
- JSR $B6A3 — evaluate a string expression (this sets up the BASIC string pointer).
- LDX $22 / LDY $23 — load the low/high bytes of the BASIC string pointer from zero page ($0022/$0023).
- JMP $FFBD — jump to the KERNAL filename setter which copies the NUL-terminated string pointed to by $22/$23 into the KERNAL filename buffer and returns to the caller.

This routine does not itself manipulate the filename buffer; it only prepares the pointer and transfers control to the KERNAL routine at $FFBD which performs the copy. It is used by higher-level parsers such as those handling LOAD/SAVE and OPEN/CLOSE to move the parsed filename into the KERNAL buffer.

## Source Code
```asm
                                *** set filename
.,E257 20 9E AD JSR $AD9E       ; evaluate expression
.,E25A 20 A3 B6 JSR $B6A3       ; evaluate string
.,E25D A6 22    LDX $22         ; get string pointer low byte
.,E25F A4 23    LDY $23         ; get string pointer high byte
.,E261 4C BD FF JMP $FFBD       ; set the filename and return
```

## Key Registers
- $0022 - Zero Page - BASIC string pointer (low byte)
- $0023 - Zero Page - BASIC string pointer (high byte)
- $FFBD - KERNAL - filename setter routine (copies filename from BASIC string pointer into KERNAL buffer)

## References
- "get_params_for_load_save" — expands on how this is invoked to place the user-supplied filename into the KERNAL buffer
- "get_params_for_open_close" — OPEN/CLOSE parser also sets filenames using this routine

## Labels
- SETNAM
