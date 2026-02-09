# KERNAL CLOSE — Logical File Close (JLTLK, JZ100, CLN232, CASOUT/WBLK/TAPEH)

**Summary:** The KERNAL CLOSE routine locates a logical file entry (via JLTLK/JZ100), dispatches device-specific close operations (RS-232: CLN232; cassette: CASOUT/WBLK/TAPEH; serial secondary-close: CLSEI), deallocates I/O buffers (RIBUF/ROBUF), and updates top-of-memory via MEMTCF/GETTOP if buffers are freed.

**Description**

This disassembly fragment implements the KERNAL CLOSE logical-file operation. The file number is passed in the accumulator (A). High-level flow:

- **JLTLK** is called to find the table entry for the logical file.
- If the file is not open, the routine returns immediately.
- **JZ100** extracts table fields used to determine device type and table index; the table index is saved on the stack.
- The device number is read from FA ($BA). Keyboard (0) and screen (3) return without further action.
- If the device type indicates a serial device (BCS), the routine branches to serial close handling (**JX120**); serial secondary-address closes send a close-file command (**CLSEI**).
- **RS-232 close** (device number $02):
  - Remove the file from file tables (JSR **JXRMV**).
  - Call **CLN232** to clean up RS-232 state and resources.
  - Deallocate buffers: call **GETTOP** to obtain MEMSIZ, then check RIBUF+1 ($F8). If allocated, adjust stack/index/flags and eventually restore top-of-memory.
- **Error handling:** If the device does not respond during some device operations, JMP **ERROR5** ($F707) is used to report "device not present".
- **Cassette write close:** Cassette write paths (**CASOUT/WBLK/TAPEH**) are used to finalize cassette writes (writing EOF markers or final blocks).

Important symbols referenced in this fragment:

- **JLTLK** — Logical-file lookup
- **JZ100** — Extract table data for file
- **JXRMV** — Routine to remove file from tables
- **CLN232** — Clean up RS-232 state on close
- **GETTOP** — Retrieve current top-of-memory (MEMSIZ)
- **RIBUF/ROBUF** (variables): Buffer pointers checked for deallocation (RIBUF+1 at $F8 in this listing)
- **ERROR5** ($F707) — Device not present error
- **CASOUT / WBLK / TAPEH** — Cassette finalization routines

This fragment focuses on the RS-232 close path and the initial file lookup/dispatch logic; serial secondary close and cassette-finalization code paths are included here.

## Source Code
