# ca65: sweet16 mode (SWEET 16 pseudo-16-bit interpreter)

**Summary:** ca65 supports a SWEET16 assembly mode (pseudo 16-bit interpreter) that reserves identifiers R0..R15 and repurposes the '@' character for indirect addressing; the assembler does not supply the SWEET16 interpreter, zero-page register locations, or call stubs. Use .LOCALCHAR to change the local-label lead character when needed.

## Description
SWEET16 is a pseudo 16-bit interpreter written by Steve Wozniak (Apple II ROM). ca65 can generate SWEET16-style code when switched into sweet16 mode. This mode alters token meanings in the assembler so the source can express SWEET16 semantics (register names, indirect addressing), but ca65 does not provide the runtime interpreter or the zero-page locations required by SWEET16 — your program must supply those.

## Assembler effects
- '@' is treated as the indirect-addressing operator for SWEET16 and is no longer available for use as the cheap local-label lead character. (Use .LOCALCHAR to choose a different lead character for local labels.)
- Identifiers R0 .. R15 are reserved words in sweet16 mode and cannot be used as labels or normal symbols.
- ca65 does not supply:
  - the SWEET16 interpreter binary/stub,
  - the zero page locations used by the SWEET16 register file,
  - any code to call or initialize the interpreter.
  All of the above must be provided by your program or runtime environment (Apple II programmers typically provide these).

## Macros and character translation
- Macro code or naming conventions that rely on '@' as a local-label lead will break in sweet16 mode because '@' is reserved for indirect addressing. Switch the local-label lead character with .LOCALCHAR before assembling code that uses cheap local labels.
- Other assembler macro and character-translation features remain as in normal ca65 modes unless they conflict with the two changes above (R0..R15 reserved, '@' repurposed).

## References
- "http://www.6502.org/source/interpreters/sweet16.htm" — SWEET16 interpreter reference (Steve Wozniak / 6502.org)
- "cpu_modes_and_features" — expands on other ca65 CPU modes and features
