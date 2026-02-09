# Connecting Power and Serial Bus Cables; Daisy‑Chaining Drives and Printer (VIC 1541)

**Summary:** Step‑by‑step connection procedure for the VIC‑1541 floppy drive: power cable orientation and safety warnings, serial (IEC) bus cable hookup to Commodore 64/VIC‑20, daisy‑chaining additional disk drives and a printer (Fig 3), and the recommendation to power up one drive at a time.

**Connection procedure**
- Insert the power cable into the back of the disk drive. The connector is keyed and will not seat if inserted upside down — do not force it.
- After seating the drive power connector, plug the other end into the mains outlet.
- If the drive makes any sound immediately after applying power, switch the drive off at the rear power switch and investigate before connecting data cables.
- Do not plug any serial or other data cables into the drive while its power is on.

**Serial bus (IEC) cable hookup**
- Connect the serial bus cable to either serial bus socket on the rear of the drive.
- Turn off the computer before connecting the other end of the serial cable; then plug the cable into the computer’s serial/IEC port.
- For first‑time users: use only one drive until you are familiar with its operation.

**Daisy‑chaining additional drives and a printer**
- To add a second drive or a printer, connect the next device into the second serial bus socket on the rear of the first drive (see Fig 3).
- For detailed instructions on using multiple drives at once (device numbers, software usage), see chapter 9 or the device‑number configuration reference.
- Recommendation: power up one drive at a time and use a single drive during initial familiarization.

## Source Code
```text
                                   +--------+
 +---------------------------+     |  +-----|---+
 |  ============= O O        |     |  |     O O----+
 |                  | == === |     |  | #[]o    |  |
 +------------------|--------+     |  +---------+  |
  Commodore 64 or   |              |  VIC 1541     |
  VIC20 Personal    | Serial cable |  Single Drive |
     Computer       +--------------+  Floppy Disk  |
                                                   |
                                                   |
                                   Serial cable    |
                           +-----------------------+
                           |
                           |       +---------------+
 Fig 3. Floppy Disk        |       |               |
        Hookup             |       +-+-------------+
                           |         |  Printer
                           +---------+
```

```text
+-------------------+
|                   |
|   Power Socket    |
|                   |
+-------------------+
        |
        |  Power Cable
        v
+-------------------+
|                   |
|   Power Plug      |
|                   |
+-------------------+
```
*Figure 2: Illustration of power cable insertion.*

## References
- "powering_on_and_diskette_insertion_figure" — correct power‑up sequencing and initial LED behavior  
- "changing_device_number_hardware_method_and_jumper_table" — how to change device number when using multiple drives