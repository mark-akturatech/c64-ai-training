# SCINIT ($FF81 / $FF5B)

**Summary:** KERNAL vector SCINIT at $FF81 (real entry $FF5B) — initializes VIC-II, clears display, restores keyboard/screen I/O, sets PAL/NTSC mode and interrupt timer. No input/output parameters; destroys registers A, X, Y.

## Description
SCINIT is the KERNAL initialization routine responsible for basic screen and video hardware setup. Its documented actions:
- Initialize VIC-II (VIC chip) state to default values suitable for system startup.
- Restore keyboard and screen I/O vectors to their KERNAL defaults.
- Clear the visible display (screen memory and character output state).
- Select and configure PAL or NTSC video mode.
- Set the interrupt timer used by the system (raster/timing-related setup).

Calling convention and side effects:
- No parameters passed (no stack or memory-based inputs expected).
- No return values.
- Registers A, X, and Y are used and overwritten by the routine; callers should preserve them if their values must be retained.
- Typically invoked as part of higher-level initialization (see IOINIT) or when the system needs to reinitialize display/keyboard state.

Cross-references:
- SCREEN ($FFED) — related routine that returns/handles screen dimensions and parameters.
- IOINIT — broader hardware initialization sequence that also calls or arranges for SCINIT.

## Key Registers
- $FF81 - KERNAL vector - SCINIT (vector address pointing to the real entry)
- $FF5B - KERNAL - SCINIT real entry point (initializes VIC-II, restores keyboard/screen I/O, clears display, sets PAL/NTSC mode and interrupt timer)

## References
- "screen" — expands on screen dimensions returned by SCREEN ($FFED)
- "ioinit" — expands on overall hardware initialization performed by IOINIT

## Labels
- SCINIT
