# Section 9.2: Hardware method to permanently change device number (Model 1541 / 1541CR)

**Summary:** Permanent drive device-number change for Commodore 1541 and 1541CR by cutting on-board jumpers (jumpers 1/2 or A/B). Procedures include disassembly (screws, housing), jumper location (left board edge, middle when facing front), which jumper(s) to cut for device numbers 8–11, and reassembly steps.

## Procedure
Tools required: Phillips-head screwdriver and a knife (for cutting jumper traces).

Safety: Disconnect all cables, including power, before opening the drive.

Steps:
1. Disconnect all cables from the drive, including power.
2. Place the drive upside down on a flat, steady surface.
3. Remove the four screws holding the outer case together.
4. Carefully turn the drive right-side-up and remove the case top.
5. Remove the two screws on the side of the metal housing.
6. Remove the metal housing.
7. Locate the device-number jumpers on the PCB: when facing the front of the drive, they are at the left edge in the middle of the board. On a 1541 they are labeled 1 and 2; on a 1541CR they are labeled A and B.
8. For a permanent device-number change, cut either or both of the indicated jumper traces:
   - For Model 1541: cut jumper(s) labeled 1 and/or 2.
   - For Model 1541CR: cut jumper(s) labeled A and/or B.
9. Replace the metal housing and reinstall the two side screws, then replace the case top and reinstall the four case screws.
10. Reconnect cables and power up the drive; the new device number is permanent until the jumper trace is repaired.

## Source Code
```text
DEVICE# | JUMPER A / 1     | JUMPER B / 2
--------+------------------+-----------------
   8    | DON'T CUT        | DON'T CUT
   9    | CUT              | DON'T CUT
  10    | DON'T CUT        | CUT
  11    | CUT              | CUT
```

## References
- "changing_device_number_software_method" — software-based method for temporary device-number changes (alternative to cutting jumpers)