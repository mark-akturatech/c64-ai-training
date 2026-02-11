# VIC-II (6566/6567) — System Interface & Theory of Operation

**Summary:** Describes VIC-II memory arbitration with the 6502 family: Phase 1/Phase 2 timing, AEC (Address Enable Control) active‑low behavior, BA/RDY bus arbitration, the 500 ns effective memory cycle (1 MHz Phase‑2), character-pointer fetch timing (every 8th raster, 40 consecutive Phase‑2 accesses), and MOB/sprite fetch sequencing.

**Theory of Operation**

The 6566/6567 (VIC‑II) video controller time‑shares system memory with a 65XX CPU by using opposite clock phases:

- **Normal operation:** VIC‑II performs its system memory accesses during Phase 1 (clock low), leaving the 65XX processor free to use Phase 2 (clock high). This makes character fetches and refreshes transparent to the CPU and preserves processor throughput.

- **AEC (Address Enable Control):** AEC is active‑low and is used to disable the processor address‑bus drivers so the VIC‑II can drive the address bus. Because AEC is active‑low, it can be directly connected to the AEC input on 65XX family CPUs. AEC is normally asserted during Phase 1 so the processor is not affected by VIC accesses.

- **Effective memory cycle:** The VIC‑II provides the system Phase‑2 clock at 1 MHz. Therefore, a full memory cycle (address setup, data access, data setup for the reading device) must complete within 500 ns (one Phase‑2 period).

- **BA / RDY arbitration:** When the VIC needs data during Phase‑2 (i.e., cannot complete from only Phase‑1 accesses), it uses BA (Bus Available) to request the bus:
  - BA is normally high. During Phase‑1, the VIC pulls BA low to indicate it will require subsequent Phase‑2 accesses.
  - After BA goes low, the CPU is given three Phase‑2 times to finish ongoing memory activity. On the fourth Phase‑2 following BA low, the VIC forces AEC low during Phase‑2 so the VIC performs its Phase‑2 access and the CPU is inhibited.
  - The BA line is typically connected to the 65XX RDY input so the CPU can be stalled when BA indicates bus takeover.

- **Character pointer fetches:** Occur every 8th raster line during the display window. These pointer loads require a block of consecutive Phase‑2 accesses (40 consecutive Phase‑2 cycles are required to fetch the video matrix pointers).

- **MOB (sprite) fetches:** MOB pointer and sprite data accesses occur at a higher rate and use a small multi‑phase sequence. MOB pointers are fetched every other Phase‑1 at the end of each raster line; additional cycles are used for MOB data fetches when required.

## Source Code

```text
MOB (sprite) fetch sequence (Phase vs Data vs Condition):

PHASE |     DATA    |                    CONDITION
------+-------------+--------------------------------------------------
  1   | MOB Pointer |  Every raster
  2   | MOB Byte 1  |  Each raster while MOB is displayed
  1   | MOB Byte 2  |  Each raster while MOB is displayed
  2   | MOB Byte 3  |  Each raster while MOB is displayed
```

(Original source contains the above table describing the 4‑cycle MOB fetch sequence and when each access occurs.)

```text
Timing diagram for AEC, BA, PH0, and PH1 signals:

        |<-- Phase 1 -->|<-- Phase 2 -->|<-- Phase 1 -->|<-- Phase 2 -->|
PH0     ________________/                \________________/                \____
PH1     ________________/                \________________/                \____
AEC     ________________/                \________________/                \____
BA      ----------------\________________/                \________________/    
```

This diagram illustrates the timing relationships between the PH0, PH1, AEC, and BA signals during normal operation.

## References

- "vicii_memory_interface_address_output_6566_6567" — expands on memory access details and differences between 6566/6567 (addresses, RAS/CAS)
- "vicii_bus_activity_summary_table" — quick reference of AEC/PH0/CS/RW actions summarized in a table
- "vicii_processor_interface_register_access" — how the processor accesses VIC registers when AEC and PH0 permit
