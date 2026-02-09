# 256‑Byte Autostart Fast Loader (stack‑placed loader, $01ED-$01F7 / $0203 catch)

**Summary:** Autostart fast loader that places executable code into the stack area ($01ED-$01F7) and relies on a jump at $0203 to catch execution when the ROM loader returns; intervening bytes are filled with $02 for compatibility with modified ROMs.

## Autostart Mechanism
The loader avoids modifying BASIC vectors by installing itself into the stack region ($01ED-$01F7). When the ROM sector loader (the ROM code that returns to BASIC after loading) executes its return sequence, a jump placed at $0203 transfers execution into the code stored on the stack. To improve compatibility with systems whose ROMs were patched or modified, the bytes between the standard return path and the loader entry are filled with $02 (JMP absolute opcode high byte pattern), ensuring the return lands predictably and does not execute stray values in patched ROMs.

Key points preserved:
- Loader code resides in RAM stack area $01ED-$01F7.
- Execution is intercepted by a jump located at $0203 (ROM return catch).
- Intervening bytes are set to $02 to accommodate modified ROMs and ensure predictable control transfer.
- This layout supports a single‑sector autostart flow without changing BASIC vector tables.

## Source Code
(omitted — no assembly or data listings provided in source)

## Key Registers
- $01ED-$01F7 - RAM (stack area) - region used to place loader code and padding bytes
- $0203 - ROM/KERNAL (system return path) - address used to catch execution when ROM loader returns

## References
- "code_assembly" — linker mapping and VECTOR segment used for stack protection bytes  
- "implementation_details" — single‑sector layout and autostart flow details