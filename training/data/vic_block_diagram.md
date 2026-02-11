# MOS 6567/6569 (VIC-II) — Block diagram overview and internal units

**Summary:** Overview of VIC-II internal function units: clock generator, refresh counter, raster counter (X/Y), VC/RC logic, 40×12 video matrix / color line buffer, 8×24 sprite data buffers, sprite/graphics sequencers, priority MUX with sprite priorities and collision detection, sync & color generation, border unit, and lightpen unit. Mentions related registers controlling VC/RC and sprite pointers ($D018, $D011–$D012).

**Block diagram overview and unit roles**

The VIC-II is organized into independent functional units that together implement video timing, memory access, and pixel/sprite output. The raster counter (X/Y) is the central timing source: screen generation and all VIC bus accesses are synchronized to it.

Principal units (as shown in the diagram):

- **Clock generator / refresh counter** — Provides internal clocks, DRAM RAS/CAS timing, and refresh cycles. Also feeds the raster/VC timing logic.
- **Raster counter (X/Y)** — Drives screen position timing; synchronizes memory fetches and display sequencing.
- **VC/RC logic** — Converts raster X/Y into Video Matrix Counter (VC) and Row Counter (RC) values used by the display sequencer and memory pointer logic.
- **40×12 video matrix / color line buffer** — The display-side buffer holding character/bitmap data and color bytes for the current line (display unit separated from memory access unit).
- **8×24 sprite data buffers** — Per-sprite display buffers (hold fetched sprite data while display unit consumes them).
- **Sprite data sequencer and sprite sequencers** — Read sprite data into sprite buffers (memory access side) and shift/format it for display.
- **Graphics data sequencer** — Reads and formats character/bitmap graphics into the video matrix/color line buffer.
- **MC0–7 (MOB data counters)** — Counters used for sprite memory access sequencing (fetch offsets/pointers).
- **Priority MUX (including sprite priorities and collision detection)** — Combines background and sprites, resolves sprite priority/overlay, and detects sprite-sprite or sprite-background collisions.
- **Border unit** — Generates display borders and blanking regions.
- **Sync generation and color generation** — Produce S/LUM (luma/luminance) and COLOR signals for video output.
- **Lightpen unit** — Handles lightpen input and generates corresponding interrupts.

Separation of memory access and display:

- Memory-access logic (fetch side) and display logic are distinct and connected by data buffers. Read graphics/sprite data is fetched into buffers (MC side), and the display unit consumes buffered data independently.
- Because of buffering, it is possible (with careful programming) to decouple fetches from display — e.g., the VIC can continue to display data already in the buffer even if no new memory reads occur.

Behavioral note:

- The raster counter is central: all fetches and display timing are synchronized to it. VC (Video Matrix Counter) and RC (Row Counter) are derived values used across sequencers and address generation.
- Sprite fetch/format pipeline uses separate buffers and counters (MC0–7) so sprite memory access does not directly block the display sequencer.

## Source Code

```text
IRQ <---------------------------------+
                                       |
            +---------------+ +-----------------+
            |Refresh counter| | Interrupt logic |<----------------------+
            +---------------+ +-----------------+                       |
        +-+    |               ^                                        |
  A     |M|    v               |                                        |
  d     |e|   +-+    +--------------+  +-------+                        |
  d     |m|   |A|    |Raster counter|->| VC/RC |                        |
  . <==>|r|   |d| +->|      X/Y     |  +-------+                        |
  +     |y|   |d| |  +--------------+      |                            |
  d     | |   |.|<--------+----------------+ +------------------------+ |
  a     |i|   |g|===========================>|40×12 bit video matrix-/| |
  t     |n|<=>|e| |     |   |                |       color line       | |
  a     |t|   |n| |     |   |                +------------------------+ |
        |e|   |e| |     |   |                            ||             |
        |r|   |r| |     |   | +----------------+         ||             |
 BA  <--|f|   |a|============>|8×24 bit sprite |         ||             |
        |a|   |t|<----+ |   | |  data buffers  |         ||             |
 AEC <--|c|   |o| |   | v   | +----------------+         ||             |
        |e|   |r| | +-----+ |         ||                 ||             |
        +-+   +-+ | |MC0-7| |         \/                 \/             |
                  | +-----+ |  +--------------+   +--------------+      |
                  |         |  | Sprite data  |   |Graphics data |      |
        +---------------+   |  |  sequencer   |   |  sequencer   |      |
 RAS <--|               |   |  +--------------+   +--------------+      |
 CAS <--|Clock generator|   |              |         |                  |
 φ0  <--|               |   |              v         v                  |
        +---------------+   |       +-----------------------+           |
                ^           |       |          MUX          |           |
                |           |       | Sprite priorities and |-----------+
 φIN -----------+           |       |  collision detection  |
                            |       +-----------------------+
   VC: Video Matrix Counter |                   |
                            |                   v
   RC: Row Counter          |            +-------------+
                            +----------->| Border unit |
   MC: MOB Data Counter     |            +-------------+
                            |                   |
                            v                   v
                    +----------------+  +----------------+
                    |Sync generation |  |Color generation|<-------- φCOLOR
                    +----------------+  +----------------+
                                   |      |
                                   v      v
                                 Video output
                               (S/LUM and COLOR)
```

## Key Registers

- $D011–$D012 — VIC-II — VC/RC control and raster register (control bits / raster counter)
- $D018 — VIC-II — Memory control / bank and sprite pointer high-bits (registers controlling VC/RC and sprite pointers)

## References

- "vic_registers_table" — Expands on registers controlling VC/RC and sprite pointers ($D018, $D011–$D012)
- "sprite_memory_access_and_display" — Expands on sprite data buffers, MC/MCBASE, and sprite memory-access/display scheme

## Labels
- $D011
- $D012
- $D018
