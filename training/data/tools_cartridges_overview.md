# Cartridge recommendation for C‑64 demo development

**Summary:** Recommend using a cartridge with a fast loader and a machine-code monitor (e.g., Action Replay v6 or Final Cartridge) for C‑64 demo development; needed features include fast disk I/O (fast loader), memory movement routines, on‑cartridge monitor with disassembly and debugging capabilities, and tools for rapid development.

## Tools
There are many free development utilities available from public FTP sites and archives. For demo work you should ensure access to:
- A cartridge with a fast loader (accelerated disk I/O) to reduce load times during development and testing.
- A machine-code monitor for memory movement and debugging (view/disassemble memory, alter memory, set breakpoints, single-step, examine registers).
- Utilities for copying/moving memory blocks and for assembling/loading machine code quickly.

Avoid relying on slow tape/disk-only workflows during iteration; the cartridge fast loader and monitor greatly speed development.

## Cartridges
- Action Replay series (particularly v6) is the most recommended cartridge for demo development due to its robust fast loader and powerful monitor/debugger.
- Final Cartridge is a common alternative if Action Replay v6 is unavailable.
- The essential cartridge features are:
  - Fast loader (faster disk I/O routines to reduce load time).
  - Monitor for development: move memory blocks, inspect and modify memory, disassemble code, and debug routines interactively.

## References
- "using_a_monitor" — monitor features needed for debugging