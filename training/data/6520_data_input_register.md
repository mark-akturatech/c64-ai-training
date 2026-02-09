# MACHINE - 6520 Data Input Register behavior

**Summary:** Describes the 6520 (PIA) Data Input Register latching behavior: on a CPU write the data bus is latched into the Data Input Register and then transferred into one of six internal registers to produce glitch‑free peripheral output transitions.

## Data Input Register
When the CPU writes to the 6520, the value present on the data bus is first latched into the Data Input Register. That latched value is then transferred into one of the six internal registers inside the 6520 (PIA). This two-stage mechanism prevents direct, asynchronous driving of peripheral output lines by the bus during the write, ensuring output lines change state smoothly (no "glitches") and that line voltages remain stable except during the intentional transition between polarities. The behavior applies to all writes that update the peripheral outputs through these internal registers.