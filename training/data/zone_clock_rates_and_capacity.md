# 1541 Zone Clocking and Disk Capacity (divisor per zone)

**Summary:** Describes how the Commodore 1541 varies the data clock rate per radial zone by dividing a high-speed clock (divisor N) to pack more sectors on outer tracks; lists zone-to-track ranges, divisors, resulting bit rates and bits-per-rotation, and formatted vs. usable disk capacities.

## Zone clocking and purpose
The 1541 uses a single high-speed clock whose output is divided by a zone-dependent integer N to produce the effective data clock. Lower divisors (smaller N) give a higher bit clock on outer tracks so more bits — and therefore more sectors — can be recorded where the linear track length is greater. The drive is divided into four radial zones; each zone uses a specific divisor to set the bits/second and bits per physical rotation.

This produces a recording density that varies across the disk (quoted as roughly 4000 bits/inch on outer tracks up to almost 6000 bits/inch on inner tracks). The scheme increases total raw bit capacity compared with a single uniform clock.

If all recorded bits could be used for payload data, the disk would hold 2,027,676 bits (≈253,459 bytes). Practical formatted capacity on a 1541 is lower due to sector headers, gaps, sync marks, and the directory: total formatted storage is 174,848 bytes and the effective usable data after directory overhead is 169,984 bytes (256 bytes * 664 sectors).

## Source Code
```text
Zone  Tracks   Divisor   Clock Rate        Bits/Rotation
1     1 to 17  13        307,692 bits/sec  61,538.4
2     18 to 24 14        285,714 bits/sec  57,142.8
3     25 to 30 15        266,667 bits/sec  53,333.4
4     31 to 35 16        250,000 bits/sec  50,000.0

Recording density varies from about 4000 bits/inch (outer) to almost 6000 bits/inch (inner).

Total possible bits (if all used for data): 2,027,676 bits = 253,459 bytes
Total storage capacity (formatted on 1541): 174,848 bytes
Effective usable capacity after directory overhead: 169,984 bytes (256 bytes * 664 sectors)
```

## References
- "layout_of_tracks_and_sectors" — expands on zone concept and sector counts per track
