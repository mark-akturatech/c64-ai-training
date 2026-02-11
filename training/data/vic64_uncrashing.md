# VIC/Commodore 64 Uncrash Notes

**Summary:** Recovery methods for a locked/unresponsive C64 using RUN/STOP+RESTORE, a cartridge-port reset switch, and nondestructive reset behavior (RAM preserved). If the machine-language monitor entry address is known, restore it with a SYS command.

**Uncrash methods**

- **Quick attempt:** Hold RUN/STOP and tap RESTORE to attempt to recover the system state.

- **If that fails:** Use a reset switch provided by some cartridge-port interfaces to perform a hardware reset. These commercial interfaces often wire a reset button to the C64 reset line.

- **Important behavior:** The C64 performs a nondestructive memory test during reset—RAM contents are preserved across such resets. The machine restarts execution from the reset entry point.

- **Restoring the monitor:** If you have previously recorded the entry address of a machine-language monitor, restore the monitor by executing the appropriate BASIC `SYS <address>` command after reset.

## References

- "uncrashing_overview"—expands on general uncrashing strategies