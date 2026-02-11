# 6566/6567 VIC‑II Bus Activity Summary (AEC / PH0 /CS R/W)

**Summary:** Concise mapping of VIC‑II control signals AEC and PH0 plus /CS and R/W to permitted bus actions (Phase‑1/Phase‑2 fetches, register READ/WRITE, or no action). Searchable terms: AEC, PH0, /CS, R/W, VIC‑II, 6566, 6567, Phase‑1, Phase‑2, bus arbitration.

## Bus activity and permitted operations
This chunk summarizes the exact combinations of AEC and PH0 (VIC‑II signals that indicate whether the video chip or CPU controls the bus phases) together with device chip‑select (/CS) and R/W that determine whether a bus fetch/refresh occurs, or a processor register read/write is allowed. Wildcard X means "don't care" for that bit in the condition.

- AEC=0: VIC holds access (CPU is not driving); PH0 determines the VIC fetch phase:
  - PH0=0 (AEC=0): Phase‑1 fetch / DRAM refresh.
  - PH0=1 (AEC=0): Phase‑2 fetch (processor off).
- AEC=1 (CPU has bus access): no action on PH0=0; on PH0=1 CPU register accesses are gated by /CS and R/W:
  - AEC=1 PH0=1 /CS=0 R/W=0 → WRITE to selected register (device selected, write cycle).
  - AEC=1 PH0=1 /CS=0 R/W=1 → READ from selected register (device selected, read cycle).
  - AEC=1 PH0=1 /CS=1 → No action (no device selected).

This mapping is the authoritative, compact reference used for VIC‑II / CPU bus arbitration and permitted operations (register access vs. VIC fetches).

## Source Code
```text
                      SUMMARY OF 6566/6567 BUS ACTIVITY
  +-----+-----+-----+-----+-----------------------------------------------+
  | AEC | PH0 | /CS | R/W |                    ACTION                     |
  +-----+-----+-----+-----+-----------------------------------------------+
  |  0  |  0  |  X  |  X  |  PHASE 1 FETCH, REFRESH                       |
  |  0  |  1  |  X  |  X  |  PHASE 2 FETCH (PROCESSOR OFF)                |
  |  1  |  0  |  X  |  X  |  NO ACTION                                    |
  |  1  |  1  |  0  |  0  |  WRITE TO SELECTED REGISTER                   |
  |  1  |  1  |  0  |  1  |  READ FROM SELECTED REGISTER                  |
  |  1  |  1  |  1  |  X  |  NO ACTION                                    |
  +-----+-----+-----+-----+-----------------------------------------------+
```

## References
- "vicii_system_interface_bus_sharing_and_phases" — detailed Phase‑1/Phase‑2 fetches, AEC, BA behavior  
- "vicii_processor_interface_register_access" — conditions required for processor register reads/writes (/CS, R/W, AEC, PH0)
