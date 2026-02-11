# VIC‑II (6566/6567) — display window, scrolling, light‑pen, raster and interrupt behavior

**Summary:** Details for VIC‑II registers and features: row/column select (RSEL/CSEL) for 24/25 rows and 38/40 columns, horizontal/vertical fine scroll bits (X2..X0, Y2..Y0), light‑pen latches (LPX, LPY) and resolution, raster register and visible raster window ($033–$0FB), interrupt latches and enable bits (raster, MOB‑DATA, MOB‑MOB, light‑pen), and dynamic RAM refresh behavior.

## Row / Column select (RSEL / CSEL)
RSEL switches the display between 24 and 25 text rows; CSEL switches between 38 and 40 character columns. No change to character format — content that would lie in the exterior border is simply covered by the border when using the smaller window.

Mapping provided by the chip:
- RSEL = 0 → 24 rows; RSEL = 1 → 25 rows.
- CSEL = 0 → 38 columns; CSEL = 1 → 40 columns.

RSEL is located in VIC register 17 ($11) and CSEL is located in VIC register 22 ($16). The larger (25×40) window is the standard display; the smaller (24×38) window is commonly used for smooth scrolling.

## Scrolling (fine scroll bits)
The VIC provides fine scrolling up to one character in both axes using three bits per axis:

- Horizontal fine scroll X2,X1,X0 in VIC register 22 ($16).
- Vertical fine scroll Y2,Y1,Y0 in VIC register 17 ($11).

Use the fine scroll bits together with the smaller display window to pan display memory smoothly and only update character rows/columns in memory when a full character shift is required.

## Light pen (LPX / LPY)
- A low‑going transition on the light‑pen input latches the current screen position into two registers (LPX, LPY).
- LPX (VIC register 19 / $13) contains the upper 8 bits of the X position at latch time. The internal X counter is 9 bits (512 states), so LPX provides 8 MSB and thus a resolution of 2 horizontal dots.
- LPY (VIC register 20 / $14) contains 8 bits of Y (vertical) position (single raster resolution) at latch time.
- The light‑pen latch is effective only once per frame: subsequent transitions in the same frame are ignored. Multiple samples before activating the pen are recommended (3+ samples) to average out timing/pen characteristics.

## Raster register and raster interrupt behavior
- VIC register 18 ($12) read returns the lower 8 bits of the current raster line. The 9th bit (RC8 / MSB) is located in VIC register 17 ($11).
- Visible display raster window: raster lines 51 through 251 (decimal) — $033 through $0FB.
- Writing to the raster register bits (including RC8) latches the written value for an internal raster compare. When the current raster matches the latched value, the raster interrupt latch is set.
- The raster register can be polled or written to manage display changes outside the visible area to avoid flicker.

## Interrupt register, sources, latching and clearing
- An interrupt latch register in VIC register 25 ($19) contains latched status bits for the four interrupt sources. When a source generates an interrupt request its corresponding latch bit is set to 1.
- The four interrupt sources (latch bit name / enable bit name):
  - IRST / ERST — raster interrupt (set when raster count = stored raster count)
  - IMDC / EMDC — MOB‑DATA collision (set on first collision only)
  - IMMC / EMMC — MOB‑MOB collision (set on first collision only)
  - ILP  / ELP  — light‑pen negative transition (set once per frame)
- To drive the /IRQ line low, the corresponding enable bit in VIC register 26 ($1A) must be set to 1 for that source; an interrupt latch set plus the enable bit set will assert IRQ.
- Once an interrupt latch has been set, it can be cleared only by writing a 1 to the corresponding bit in the interrupt register (register 25 / $19). This allows selective clearing/handling of interrupts without software having to remember which sources were active.
- Collision interrupt latches for MOB‑DATA and MOB‑MOB are sticky for the first collision (first collision only) until explicitly cleared as above.

## Dynamic RAM refresh
- 6566/6567 includes a DRAM refresh controller: five 8‑bit row addresses are refreshed every raster line.
- Refresh guarantees a maximum delay of 2.02 ms between refreshes of any single row in a 128‑address refresh scheme (3.66 ms maximum delay in a 256‑address scheme).
- Refresh is transparent to the system and occurs during Phase 1 of the system clock. The 6567 generates both /RAS and /CAS; /RAS and /CAS are generated for every Phase‑2 and every video data access (including refresh), so external clock generation is not required.

## Source Code
```text
VIC-II register references (chip base $D000; offsets in parentheses):

Register 17 ($11) -> $D011:
  - Contains: vertical fine scroll bits Y2,Y1,Y0; RSEL (row select); RC8 (raster MSB)
  - Functions: vertical position fine scroll; 24/25 rows select; MSB of raster counter

Register 18 ($12) -> $D012:
  - Contains: lower 8 bits of current raster position (read)
  - Write: latched for internal raster compare (together with RC8)

Register 19 ($13) -> $D013:
  - LPX (light‑pen X) — 8 MSB of 9‑bit X counter (resolution = 2 horizontal dots)

Register 20 ($14) -> $D014:
  - LPY (light‑pen Y) — 8‑bit Y (raster) position at latch time (single raster resolution)

Register 22 ($16) -> $D016:
  - Contains: horizontal fine scroll bits X2,X1,X0; CSEL (column select)
  - Functions: horizontal position fine scroll; 38/40 columns select

Register 25 ($19) -> $D019:
  - Interrupt latch register: bits set when interrupt sources generate requests.
  - Sources (latch names): IRST (raster), IMDC (MOB‑DATA), IMMC (MOB‑MOB), ILP (light‑pen)
  - Clearing: write '1' to latch bit to clear

Register 26 ($1A) -> $D01A:
  - Interrupt enable register: enable bits ERST, EMDC, EMMC, ELP correspond to the latches above
  - When a latch is set and its enable bit = 1, /IRQ is driven active low.

Visible raster window:
  - Visible raster lines: 51..251 decimal (hex $033..$0FB)

Row/column sizes:
  - RSEL (reg 17 / $D011): 0 => 24 rows; 1 => 25 rows
  - CSEL (reg 22 / $D016): 0 => 38 columns; 1 => 40 columns

Fine scroll bits:
  - Vertical: Y2,Y1,Y0 in reg 17 ($D011)
  - Horizontal: X2,X1,X0 in reg 22 ($D016)

Light pen behavior:
  - Latch on negative edge (low‑going) of pen input
  - One latch per frame only; subsequent triggers ignored until next frame
  - LPX holds 8 MSB of 9‑bit X counter; LPY holds 8‑bit raster Y
```

## Key Registers
- $D011 - VIC‑II - vertical fine scroll (Y2..Y0), RSEL (24/25 rows), raster MSB (RC8)
- $D012 - VIC‑II - raster low 8 bits (read); raster compare latch (write)
- $D013 - VIC‑II - LPX (light‑pen X, 8 MSB)
- $D014 - VIC‑II - LPY (light‑pen Y, 8 bits)
- $D016 - VIC‑II - horizontal fine scroll (X2..X0), CSEL (38/40 columns)
- $D019 - VIC‑II - interrupt latch/status register (raster, MOB‑DATA, MOB‑MOB, light‑pen)
- $D01A - VIC‑II - interrupt enable register (enable bits for the above)

## References
- "6566_vicii_bitmap_and_mob_overview" — MOB collision details and MOB‑related interrupt behavior
- "6566_vicii_theory_of_operation_and_memory_interface" — implementation details via bus/memory timing and refresh

## Labels
- LPX
- LPY
- RC8
- RSEL
- CSEL
