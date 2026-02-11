# KERNAL $FFE7 — Close all channels and files

**Summary:** KERNAL vector $FFE7 closes all open files, resets the pointers into the open-file table, and restores I/O channels to their default assignments.

**Description**
This KERNAL routine closes every file currently open by the system. When invoked, it resets the internal pointers into the open-file table, effectively closing all files, and it restores I/O channel assignments to their default state. Specifically, the default input device is set to 0 (keyboard), and the default output device is set to 3 (screen). ([www1.cx16.dk](https://www1.cx16.dk/c64-kernal-routines/clrchn.html?utm_source=openai))

Typical usage is to call the routine at its KERNAL vector:
- `JSR $FFE7`  (invoke the Close All routine)

No parameters are required, and no file-specific cleanup (such as per-file status returns) is provided by this vector—it is a global close/reset operation.

## References
- "ffcc_close_input_and_output_channels" — expands on closing individual I/O channels

## Labels
- CLRCHN
