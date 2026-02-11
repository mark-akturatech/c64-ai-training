# GETIN - KERNAL keyboard input ($FFE4)

**Summary:** GETIN ($FFE4) is the KERNAL keyboard-input entry that reads one character from the keyboard input buffer (not the screen) and returns ASCII (or $00 if none) in A; non-blocking, may clobber X/Y and change status flags. Commonly followed by CHROUT ($FFD2) to echo input.

## Description
GETIN provides a non-blocking single-character read from the current input channel (by default the keyboard input buffer), similar to the BASIC GET statement:
- Reads from the keyboard buffer, not from screen memory.
- If a key is held down, it is detected only once.
- The routine returns immediately (does not wait for a key).
- If no key is available, A is set to binary zero ($00).
- If a key is available, its ASCII (PET ASCII) code is returned in A.
- Special keys (RETURN, RVS, color codes and other control/special key codes) are detected and returned as their corresponding codes.

Register and status effects:
- A is defined on return (ASCII or $00).
- X and Y are not guaranteed to be preserved — assume they are clobbered and save them if needed.
- Processor status flags may be changed. On the VIC/Commodore 64, the C (carry) flag can indicate a problem with output (see device-specific documentation).

Typical use:
- Call with JSR $FFE4.
- If you want the character to appear on-screen, follow GETIN with a call to CHROUT ($FFD2) so the received character is printed to the current output device.

Example (minimal):
- JSR $FFE4  ; GETIN — A = key ASCII or $00
- BNE print  ; branch if non-zero
- ...        ; no key waiting
- print: JSR $FFD2  ; CHROUT to echo A (if desired)

## Key Registers
- $FFE4 - KERNAL (ROM) - GETIN subroutine entry: read one character from keyboard/input buffer; returns ASCII in A or $00 if none; clobbers X/Y; status flags may change (carry used on C64/VIC for output problems).
- $FFD2 - KERNAL (ROM) - CHROUT subroutine entry: write character in A to current output device (commonly used to echo GETIN results).

## References
- "stop_subroutine_runstop_key" — expands on STOP subroutine checks RUN/STOP key (related input handling)
- "numeric_key_waiting_subroutine_project" — example program using GETIN to read numeric keys

## Labels
- GETIN
- CHROUT
