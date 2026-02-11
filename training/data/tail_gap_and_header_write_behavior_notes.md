# Disk tail gap and header/data rewrite behavior (sectors/tracks)

**Summary:** Notes on sector gap layout and write behavior: the tail gap (gap after the highest-numbered sector to sector 0) can be much longer than ordinary inter-sector gaps (observed >100 bytes); header blocks are never rewritten after formatting while data blocks (including sync) are rewritten on each sector write; the DOS uses the eight-byte header gap to locate the start of the data block.

**Tail gap behavior**

- The inter-sector gap between consecutive sectors is typically 4 to 12 bytes long. ([pagetable.com](https://www.pagetable.com/docs/Inside%20Commodore%20DOS.pdf?utm_source=openai))
- The gap between the highest-numbered sector and sector 0 (the tail gap) is usually much longer than normal inter-sector gaps; tail gaps in excess of 100 bytes have been observed. ([pagetable.com](https://www.pagetable.com/docs/Inside%20Commodore%20DOS.pdf?utm_source=openai))

**Header vs data block rewrite**

- A header block is never rewritten after formatting is complete.
- The data block of a sector—including the sync character—is completely rewritten every time data is written to that sector.
- The DOS counts off the eight-byte header gap to determine where to start writing the data block. ([pagetable.com](https://www.pagetable.com/docs/Inside%20Commodore%20DOS.pdf?utm_source=openai))
