# Turbo Loader Fundamentals (C64 tape)

**Summary:** Describes how C64 turbo tape loaders increase throughput by using shorter pulse lengths, a timer threshold to classify pulses (short vs long), interrupt-flag sampling on falling edges, bit rotation into bytes (MSb-first or LSb-first), and sync via repeated pilot bytes (e.g. $40). Includes where loader code is stored/installed ($033C-$03FB, $0326/$0327).

## Operation and placement
A Turbo Loader is a small loader routine that must be loaded into C64 RAM before execution (it replaces the standard KERNAL tape LOAD). Commercial turbo loaders are normally stored as a Standard CBM-encoded "boot" file so the initial portion of the loader is read by the standard tape loader into the cassette buffer ($033C-$03FB). Parts of the turbo code (or pointers to it) may also be placed in the CBM file header.

Common installation technique:
- The CBM loader writes data into RAM (often into the tape buffer at $033C-$03FB) and may overwrite a low-RAM KERNAL vector so the turbo routine autostarts at the end of the standard LOAD.  
- Example vector overwritten: $0326/$0327 (two-byte little-endian pointer). If overwritten with the turbo start address, the KERNAL will jump there instead of executing the normal post-load print routine.

(Any 16-bit address is stored little-endian: low byte then high byte.)

## Pulse encoding, timing and classification
Turbo loaders achieve higher data density by using shorter physical pulse lengths on tape. The encoding commonly uses just two pulse lengths:
- Short pulse → bit 0 (usually)
- Long pulse → bit 1 (usually)

Detection scheme (widely used pattern):
1. A falling (negative) edge of the tape signal sets the relevant interrupt flag (edge-detected flag).
2. The loader runs with interrupts globally disabled to avoid external interference.
3. For each expected bit interval the routine:
   - Starts a timer set to a threshold interval (value chosen between the short and long pulse lengths).
   - After starting the timer it samples the interrupt flag (or checks it after the timer expires) to determine whether a falling edge occurred before timeout.
   - If the flag was set before the timer expired → classify as short pulse (bit 0). If not → long pulse (bit 1).
4. The interrupt flag is cleared/prepared for the next bit.

This method turns pulse length detection into a simple “did an edge come before/after the threshold?” decision which is robust and cheap in code.

## Bit ordering and byte assembly
- Bits read by the above method are shifted/rotated into an 8-bit storage until 8 bits are assembled into one byte.
- Rotation direction determines byte bit-ordering:
  - MSb-first (most-significant bit first)
  - LSb-first (least-significant bit first)
- The loader must use the same bit order as the writer on tape.

## Synchronization (sync/pilot/header)
Before meaningful bytes are read the loader must align bit and byte boundaries. Common approach:
- The tape writer writes a pilot/header consisting of a repeated known byte pattern at every byte interval (example: $40 / binary 01000000).
- The loader reads consecutive bytes and looks for multiple repeats of the expected sync byte value. Only after detecting that byte several times consecutively does the loader assume it is synchronized and begin reading program data.
- This repeated-pilot method reduces alignment errors caused by jitter or byte-boundary drift.

## Implementation notes (concise)
- The loader is executed after the standard CBM LOAD completes by redirecting a KERNAL vector (e.g. $0326/$0327) to the loader entry address.
- The tape buffer $033C-$03FB commonly holds parts of the loader and header data.
- Threshold selection and timer usage are critical (see referenced material for measuring/setting thresholds with CIA timers).

## Key Registers
- $0326/$0327 - KERNAL vector - On‑screen print routine / post-LOAD vector; commonly overwritten to autostart turbo loader (two-byte little-endian pointer).
- $033C-$03FB - RAM (tape buffer) - Standard CBM cassette buffer; initial turbo loader code/data and header are often loaded here.

## References
- "figuring_out_threshold_value" — How thresholds are chosen and measured with CIA timers