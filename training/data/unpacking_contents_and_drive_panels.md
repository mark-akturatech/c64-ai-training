# 1541 Disk Drive — Unpacking, Front & Rear Panel, Indicators

**Summary:** Contents and panel descriptions for the Commodore 1541 disk drive: included cables (gray grounded AC power cable, black 6‑pin DIN serial bus cable), front-panel indicators (power green LED, drive red LED — steady = active, flash = error), door lever and rear-panel items (power switch, AC input, serial bus ports, fuse/holder).

## Box contents
The drive package includes:
- Gray AC power cable with three-prong grounded plug (mates to the drive's AC input).
- Black serial bus cable (6‑pin DIN plugs, identical at both ends) for connection to the VIC‑20, Commodore 64, or another disk drive.
- This manual and a demonstration diskette.
(Do not connect any cables or devices until you have read the safety section of the manual.)

## Front panel — indicators and mechanical controls
- Power indicator (green LED): steady ON when power is present.
- Drive indicator (red LED): steady LIGHT = active disk operation; FLASH = error condition reported by the drive.
- Disk door and door lever: mechanical latch for inserting/removing 5.25" diskette; lever is shown on the front-panel diagram.
See the ASCII front-panel figures in Source Code (Fig 1.A and Fig 1.B) for placement and labeling.

## Rear panel — connectors and power
- AC input for the supplied power cable (grounded three-prong).
- Power switch.
- Serial bus ports (DIN connectors) for connecting to the computer and daisy-chaining additional drives.
- Fuse/holder accessible from the rear panel.
See the ASCII back-panel figure in Source Code (Fig 2) for layout and labels.

## Source Code
```text
Included with the 1541 disk drive unit, you should find a gray power
cable, black serial bus cable, this manual, and a demonstration
diskette.  The power cable has a connection for the back of the disk
drive on one end, and for a grounded (three-prong) electrical outlet
on the other.  The serial bus cable is exactly the same on both ends.
It has a 6-pin DIN plug which attaches to the VIC 20, Commodore 64 or
another disk drive.

Please, don't hook up anything until you've completed the following
section!

                                      Fig 1.A
 +------------------------------------------+
 |                                          |
 |  +------------------------------------+  |
 |  | C= commodore ========       1541   |  |
 |  +------------------------------------+  |
 |      +----------------------------+      |
 |      |                            |      |
 +------| ========================== |------+
 |      |          |      |          |      |
 |  O   |     O    +------+          |      |
 |  |   +-----|----------------------+      |
 +--|---------|-----------------------------+
    |         |
    |         +-- DRIVE INDICATOR (RED LED)
    |                             LIGHT: ACTIVE
    |                             FLASH: ERROR
    +-- POWER INDICATOR
        (GREEN LED) LIGHT: POWER ON

 Fig 1. Front Panel

                                      Fig 1.B
 +------------------------------------------+
 |                                          |
 |  +------------------------------------+  |
 |  | C= commodore ========       1541   |  |
 |  +------------------------------------+  |
 |      +----------------------------+      |
 |      |     O----+------+          |      |
 +------| ====|===================== |------+
 |      |     |    |      |          |      |
 |  O   |   ==|    |      |          |      |
 |  |   +---|--\---+------+----------+      |
 +--|-------|---|---------------------------+
    |       |   |
    |       |   +-- DOOR LEVER
    |       |
    |       +---- DRIVE INDICATOR (RED LED)
    |                             LIGHT: ACTIVE
    |                             FLASH: ERROR
    +-- POWER INDICATOR
        (GREEN LED) LIGHT: POWER ON

                    +-- POWER SWITCH
 Fig 2. Back Panel  |
                    |       +------+-- SERIAL BUS
 +------------------|-------|------|--------+
 |                  |      _|_    _|_       |
 |                  |     / _ \  / _ \      |
 |      +-----------+    | |_| || |_| |     |
 |      |                 \___/  \___/      |
 |    __|__   ________     ___              |
 |    |+-+|  / ______ \   / _ \             |
 +----|| ||-|--|    |--|-|-|_|-|------------+
 |    |+-+| |  |____|  |  \___/             |
 |    +---+ +----|-----+    |               |
 |               |          |               |
 +---------------|----------|---------------+
                 |          |
      AC INPUT --+          +-- FUSE/HOLDER
```

## References
- "connection_of_cables_and_serial_chain" — expands on how to attach the supplied cables and daisy-chain multiple devices; continuation of setup steps.
