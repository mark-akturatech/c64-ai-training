# C64 I/O Map — DATA table order and mapping to VIC-II interrupts

**Summary:** Explains how BASIC DATA table entries determine VIC-II raster interrupts and which scan lines they schedule (raster register $D012), notes that some DATA values are stored/used in reverse order for certain registers, and gives concrete examples of how changing specific DATA values (e.g., 170 → 210, 20 → 22, 8 → 24) affects screen areas and graphics modes.

## How DATA entries map to interrupts and affected VIC-II registers
- DATA statements in the example are used to schedule when each raster interrupt will occur. Each DATA item represents the scan line at which the *next* interrupt will be generated.
- The ordering can be non‑intuitive: a DATA entry may be listed as the third interrupt's value in the table, yet be the next value used when an interrupt sequence begins. Concretely, the first item in line 49264 is 49 — although that item belongs to the third interrupt in the table ordering, it is the next value consumed when the interrupt sequence starts (the first interrupt at the top of the screen).
- The DATA list is effectively circular: the last DATA item for the sequence is used during the first interrupt to schedule the next interrupt (example: the last item 129 is used during the first interrupt to start the next one at scan line 129).
- Some DATA values are stored/used in reverse order for particular registers (the source notes this behavior; verify the exact byte-order per-register when mapping DATA entries to POKEs).
- Practical effect on layout and modes:
  - Scan lines map to character/text rows (8 scan lines per character row). Example: changing a DATA value from 170 to 210 shifts a boundary by 40 scan lines = 5 character rows, thereby increasing the text area by five lines.
  - Changing mode/control DATA entries changes how the VIC renders the region between raster interrupts. Examples from the source:
    - Change the DATA value 20 → 22 (in line 49276): produces lowercase text in the middle of the screen.
    - Change the first 8 → 24 (in line 49273): produces multicolor text in the center window.
  - Any DATA table item may be treated like the corresponding VIC register: used to set background color, switch text vs bitmap graphics, enable regular or multicolor modes, perform screen blanking, or enable extended background color mode.
- When experimenting, remember:
  - You are altering the raster timing and the VIC register values that are POKEd at each interrupt; small numeric changes move boundaries by scan lines (and thus by character rows).
  - Because some tables/orderings are shifted or reversed for certain registers, verify which DATA element actually POKEs to which $D0xx register before making assumptions.

## Key Registers
- $D000-$D02E - VIC-II - VIC-II register block (graphics, raster, control registers)
- $D012 - VIC-II - Raster register / raster compare (raster IRQ timing)

## References
- "sample_program_registers_and_data_locations" — expands on which registers the DATA table values are POKEd into
- "raster_interrupt_example_basic_and_data_listing" — expands on the example BASIC program and the DATA values to experiment with
