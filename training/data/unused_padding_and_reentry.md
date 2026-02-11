# ROM: unused byte (0x03) then JMP to VIC/screen init ($FF80-$FF81)

**Summary:** Shows an unused/padding byte 0x03 at $FF80 followed by an absolute JMP instruction at $FF81 (4C 5B FF) to $FF5B, which re-runs VIC-II and screen-editor initialization (VIC/screen init, $FF5B).

## Description
This small ROM fragment contains one unused byte at $FF80 and an absolute JMP at $FF81 that branches to the VIC/screen initialization routine located at $FF5B. The single byte 0x03 appears to be padding or an unused value; execution begins at $FF81 and immediately jumps to re-run VIC-II and screen-editor setup.

- $FF80: single unused byte (03).
- $FF81-$FF83: JMP $FF5B (opcode 4C, low-byte 5B, high-byte FF) — absolute jump to initialization routine that sets up the VIC-II and screen editor state.

(No register-specific data in this chunk.)

## Source Code
```asm
.; $FF80
.:FF80 03

.; $FF81
.,FF81 4C 5B FF    JMP $FF5B       ; initialise VIC and screen editor
```

## References
- "initialise_vic_and_screen_editor" — expands on the JMP target $FF5B and the VIC/screen initialization routine