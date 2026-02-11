# VIC 1540 / 1541 — Technical specifications (Section 1.2)

**Summary:** Specifications for the Commodore VIC 1540/1541 5.25" single-sided floppy drive: storage geometry (35 tracks, 17–21 sectors/track, 256 bytes/sector, 174,848 bytes total), directory entries (144), onboard DOS/firmware (16K ROM, 2K RAM buffer), CPU and I/O chips (6502, two 6522 VIA), pipeline DOS behavior, and serial-bus daisy-chain compatibility with other Commodore drives.

**Specifications overview**
The VIC 1540/1541 is an intelligent single-drive floppy unit containing its own microprocessor and Disk Operating System (DOS). The drive's onboard 6502 CPU and two 6522 VIAs handle disk control and communication over Commodore's proprietary serial bus. The DOS uses a "pipeline" software model allowing the drive to process commands while the host computer runs other tasks, improving apparent throughput.

Compatibility:
- Read/write compatible media with Commodore 4040 and 2031 drives; can read programs from older 2040 drives.
- The drive's serial interface is a 1-bit-per-wire, IEEE-488–like protocol allowing daisy-chaining: up to five disk drives plus one printer can share the bus simultaneously.

Memory and firmware:
- Onboard firmware/OS: 16K ROM.
- Buffer RAM: 2K (implemented with four 2114 RAM chips providing the 2K buffer).

Mechanical and electrical notes:
- Uses standard 5.25" mini floppy diskettes, single-sided, single-density.
- Physical dimensions and power requirements are specified below.

Pipeline behavior:
- The drive's internal "pipeline" allows it to accept and queue commands while performing IO, reducing host CPU wait time and increasing effective throughput.

## Source Code
```text
Figure 1.1 Specifications VIC 1540/1541 Single Drive Floppy Disk

STORAGE

    Total capacity       174848 bytes per diskette
    Sequential           168656 bytes per diskette
    Relative             167132 bytes per diskette
                         65535 records per file
    Directory entries    144 per diskette
    Sectors per track    17 to 21
    Bytes per sector     256
    Tracks               35
    Blocks               683 (664 blocks free)

IC's:

    6502                 microprocessor
    6522 (2)             I/O, internal timers

    Buffer
      2114 (4)           2K RAM

PHYSICAL:

    Dimensions
      Height              97 mm
      Width               200 mm
      Depth               374 mm

Electrical:

Power Requirements
      Voltage            100, 120, 220, or 240 VAC
      Frequency          50 or 60 Hertz
      Power              25 Watts

MEDIA:

Diskettes                Standard mini 5 1/4", single sided,
                         single density
```

## References
- "general_description_introduction" — broader context for these specifications
- "random_files_overview_and_disk_structure" — relationship between disk geometry (tracks/blocks) and random file access