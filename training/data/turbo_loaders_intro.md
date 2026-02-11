# Analyzing C64 Tape Loaders — Turbo Loaders

**Summary:** Describes Turbo Loaders on the Commodore 64: commercial tape titles typically used turbo loaders stored as a standard CBM-encoded boot file that may autostart and replace the standard LOAD routine; mentions pulse-encoding methods and autostart via IMAIN vector modification.

**Introduction**

Almost every commercial C64 cassette release used a "turbo loader"—a custom tape-loading routine shipped on tape as a standard CBM-encoded boot file that frequently autostarts and replaces the system LOAD routine. This chunk notes the existence of dedicated C64 I/O hardware interactions used by turbo loaders and points to further reading (Nick Hampshire, *The Commodore 64 Kernal and Hardware Revealed*) for an in-depth hardware-level treatment.

A detailed example of this technique is the "Cauldron" loader, which modifies the IMAIN vector to achieve autostart functionality.

**Turbo Loaders**

Turbo loaders are alternate cassette I/O routines that replace or bypass the stock Kernal tape routines to increase throughput or add integrity checks. They are commonly shipped as an initial CBM-format file which, on autostart, hooks or replaces the system LOAD routine. One mechanism for this is via vector modification, such as altering the IMAIN vector located at memory addresses $0302–$0303 (770–771 decimal). By default, this vector points to the main BASIC program loop at $A483. Modifying this vector allows the loader to redirect execution flow upon loading. For example, the "Cauldron" loader sets the IMAIN vector to point to $02AE, enabling the turbo loader to take control immediately after the CBM LOAD operation completes. ([luigidifraia.wordpress.com](https://luigidifraia.wordpress.com/articles/?utm_source=openai))

Pulse-based encoding schemes are a common technique used by turbo loaders to pack more bits into the tape signal; see the referenced cross-chunks for implementation details.

## References

- "turbo_loader_pulses"—expands on Pulse encoding method used by turbo loaders
- "nonirq_loader_autostart_i_main"—expands on Example of autostart via IMAIN vector modification

## Labels
- IMAIN
