# IEC Serial Bus — Talker/Listener Rules

**Summary:** Talker/Listener rules for the Commodore IEC serial bus: only one TALKER may transmit at a time, multiple LISTENERs may receive simultaneously, and the CONTROLLER broadcasts TALK/LISTEN/UNTALK/UNLISTEN commands that are heard by every device on the bus.

## Talker/Listener rules
- Only one talker may transmit at a time on the IEC serial bus. Simultaneous transmissions from multiple talkers are not permitted.
- Multiple listeners may receive the same transmission concurrently; a single talker can address multiple listeners.
- The controller (bus master) orchestrates role changes by broadcasting commands. Role changes (e.g., assigning TALK/LISTEN or revoking them with UNLISTEN/UNTALK) are performed only via controller-issued commands.
- All commands sent on the bus are broadcast and heard by every device on the bus. Devices monitor the command stream and act only when addressed or when the command affects global bus state.

## References
- "command_codes" — expands on how TALK/LISTEN/UNTALK/UNLISTEN are encoded
- "practical_command_sequences" — examples illustrating these rules and common command sequences
