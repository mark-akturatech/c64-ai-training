# Tracks and Sectors (1541 — tracks 1–35)

**Summary:** The Commodore 1541 disk drive formats disks with 35 concentric tracks, numbered 1 (outermost) to 35 (innermost). The number of sectors per track varies by zone to optimize storage capacity. Each sector holds 256 bytes, resulting in a total of 683 sectors (174,848 bytes) per disk, with 664 sectors (169,984 bytes) available for user data after accounting for the directory and Block Availability Map (BAM).

**Layout of Tracks and Sectors**

- **Tracks:** 35 physical tracks numbered 1–35. Track 1 is the outermost; track 35 is the innermost. The outward position is fixed by a mechanical stop. The stepper motor can select many more physical positions (>70), but only 35 tracks are used because head-positioning accuracy and magnetic track width make "phantom" tracks unreliable.

- **Sectors per track:** Each track is subdivided into sectors (blocks). On Commodore drives, the number of sectors per track depends on the track number: outer (lower-numbered) tracks are longer and hold more sectors than inner tracks.

- **Sector size:** Standard Commodore sector size is 256 bytes (note: some manufacturers use 512 or 1024 byte sectors).

- **Zones and variable clocking:** The 1541 divides the disk into four zones with different numbers of sectors per track. To fit more sectors on outer tracks while the disk spins at a constant 300 rpm, Commodore varies the data clock rate per zone (zone bit rates).

- **Totals:**
  - 683 sectors are written during initial formatting.
  - After accounting for directory and BAM, the effective usable sectors are 664, totaling 169,984 bytes.

- **Sector numbering:** Sectors on a track are numbered starting at 0 up to (N−1) where N is sectors per track in that zone.

## Source Code

```text
Organization of Tracks and Sectors on a 1541 Formatted Diskette

Zone  Track Range    Sectors Per Track    Total Sectors    Total Bytes
1     1 to 17        21                   357             91,392
2     18 to 24       19                   133             34,048
3     25 to 30       18                   108             27,648
4     31 to 35       17                   85              21,760

Totals:
- Sectors written during initial formatting: 683
- Effective usable sectors after directory/BAM: 664 (169,984 bytes)
- Disk rotation speed: 300 rpm (zone bit rates used to vary bits/rotation)
```

## References

- "zone_clock_rates_and_capacity" — expands on clock rates and bits/rotation per zone
- "sector_structure_overview" — expands on sector format (header + data blocks)