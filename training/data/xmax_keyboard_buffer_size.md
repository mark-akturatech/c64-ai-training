# XMAX (location 649 / $0289) — Maximum Keyboard Buffer Size

**Summary:** XMAX at $0289 (decimal 649) holds the maximum keyboard buffer size used by the KERNAL keyboard routine; compared against the current buffer length at $00C6 (decimal 198) to decide whether new keystrokes are accepted. Default is 10, can be increased (up to 15) with risk of overwriting nearby OS pointers at $0281-$0284 and $0037.

## Description
XMAX (location 649 / $0289) contains the maximum number of characters the keyboard buffer may hold. The keyboard buffer itself begins at location 631 (decimal) / $0277. The KERNAL checks the current buffer length stored at location 198 / $00C6; when that value equals XMAX, further keypresses are ignored until space becomes available.

Typical defaults:
- XMAX = 10 (usual keyboard buffer length).
- The value may be increased up to 15 by changing $0289, but increasing it risks overwriting adjacent Operating System pointer variables at locations 641–644 (decimal) / $0281–$0284 and location 55 (decimal) / $0037. The source notes this may not cause serious harm but is potentially unsafe.

This location is part of the KERNAL/OS workspace and should be modified only with full awareness of the memory layout and effects on OS pointers.

## Key Registers
- $0289 - RAM (KERNAL workspace) - XMAX: maximum keyboard buffer size (decimal 649)
- $00C6 - RAM - Current keyboard buffer length (compared against XMAX)
- $0277 - RAM - Keyboard buffer start (decimal 631)
- $0281-$0284 - RAM - OS pointers to bottom/top of memory (decimal 641-644) — may be overwritten if XMAX increased
- $0037 - RAM - location 55 (decimal) — mentioned as at-risk pointer in source

## References
- "keyboard_repeat_and_delay_flags" — related keyboard timing, repeat and delay behavior (RPTFLAG / KOUNT / DELAY)

## Labels
- XMAX
