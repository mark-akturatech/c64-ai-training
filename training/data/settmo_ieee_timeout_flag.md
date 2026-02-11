# SETTMO — Set Time-Out Flag for IEEE Bus

**Summary:** KERNAL routine SETTMO (entered via jump table $FFA2) sets or clears the IEEE-488 (Commodore IEEE add-on) time-out flag; A < $80 (decimal 128) enables time-outs (64 ms device wait), A >= $80 disables them.

**Description**
SETTMO is a documented KERNAL entry that controls whether the Commodore will time out when waiting for an IEEE device response. When time-outs are enabled, the system waits approximately 64 ms for a device to respond; if no response arrives, a time-out error is generated.

Call convention:
- Enter via the KERNAL jump table vector at $FFA2.
- Load the Accumulator (A) before calling:
  - A < $80 (0..127) — enable time-outs
  - A >= $80 (128..255) — disable time-outs

Intended usage: for use with the Commodore IEEE add-on card (IEEE-488 bus). The routine is part of the KERNAL I/O control set and affects device I/O behavior when communicating over the IEEE bus.

**Note:** The original line "65057 $E21" is inconsistent with standard KERNAL/vector listings; use $FFA2 (decimal 65442) as the documented jump-table entry for SETTMO.

## References
- "setlfs_set_logical_file_device_secondary" — expands on SETLFS and SETTMO and how they affect device I/O behavior

## Labels
- SETTMO
