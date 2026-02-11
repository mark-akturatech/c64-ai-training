# The Machine Language Monitor

**Summary:** Machine Language Monitor (MLM) availability and entry points for PET/CBM, VIC-20, Commodore 64 and PLUS/4; common delivery methods (built-in, cartridge, RAM load), acquisition sources (retail, user clubs), and the BASIC commands to invoke monitors (SYS 4, SYS 8, MONITOR).

## Description
Most PET/CBM machines include a simple built-in machine language monitor (MLM). Monitors may be extended with extra commands; the Commodore PLUS/4 ships with a powerful built-in MLM. The VIC-20 and Commodore 64 do not include a built-in monitor by default, but an MLM can be added to those machines either by loading into RAM or by plugging in a cartridge.

Monitors are available commercially or can be obtained through user clubs. To use a monitor you must first get it into the machine (use the built-in monitor, plug in a cartridge, or load it into memory and run it). After the monitor is present, invoke it with the machine-specific command listed below.

## Entry commands (machine-specific)
- PET / CBM: SYS 4 — typically switches to the built-in monitor.  
- VIC-20 / Commodore 64: SYS 8 — commonly used after a monitor has been added.  
- Commodore PLUS/4: MONITOR — BASIC command to enter the built-in monitor.

## References
- "monitors_overview" — expands on context and machine-specific entry points  
- "monitor_register_display" — example register display shown when entering an MLM
