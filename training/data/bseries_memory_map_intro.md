# MACHINE - B-Series memory map changes (post-April 1983)

**Summary:** B-series machines (revised machine language monitor) change CHRGOT relocation, introduce "split" BASIC vectors and three-byte vectors (including bank byte), keep an accessible VIC/monitor jump table at the top of memory, and recommend program placement strategies such as using $0400-$07FF or installing RAM/ROM in bank 15 or placing code in other banks (preferably bank 3).

## Memory map changes and implications
This applies to B systems released after April 1983 containing the revised machine language monitor (test: POKE 6,0:SYS 6 should bring up a monitor with a "." prompt; if not, the system is incompatible).

- CHRGOT relocation
  - CHRGOT is no longer resident in RAM. Wedge-style code (a small loader/modification) must be inserted at the two link addresses $029E and $02A0 to restore equivalent behavior or hook code into the monitor.

- BASIC vectors "split"
  - BASIC vectors are split into more discrete entries than in earlier machines: there are separate vectors for "start of variables" and "end of variables" that are distinct from the end-of-BASIC and the start-of-arrays vectors. This affects any code that relied on the previous, coarser vector layout.

- Three-byte vectors
  - Three-byte vectors (low-byte, high-byte, and bank-number byte) are commonly used; vector follow-up code must handle the extra bank byte when constructing absolute pointers (banked addressing).

- Jump table accessibility
  - The monitor/jump table at the top of memory remains accessible and is reasonably consistent with earlier Commodore products; existing techniques that call through that jump table should remain usable, but watch for three-byte/vector-bank behavior.

- Program placement strategies
  - Small/simple machine language programs can fit into the spare 1K of RAM at $0400-$07FF.
  - Large programs require either:
    - Plug-in memory (RAM or ROM) installed in bank 15, or
    - Placement in another bank (bank 3 is preferred).
  - Supplementary code is usually required to manage bank-switching and to make all code/data components fit across banks.

## Key Registers
- $029E - Link address — insert wedge-type coding here (CHRGOT relocation)
- $02A0 - Link address — insert wedge-type coding here (CHRGOT relocation)
- $0400-$07FF - RAM - spare 1K suitable for small machine language programs

## References
- "bseries_zero_page_overview" — expands on zero-page details and caution areas
