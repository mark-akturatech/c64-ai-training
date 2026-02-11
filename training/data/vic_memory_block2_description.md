# VIC-II Bank / Block 2 (32768–49151)

**Summary:** Describes VIC-II bank Block 2 ($8000–$BFFF / 32768–49151): layout of 8K RAM + 8K BASIC ROM, the 4K Character ROM overlay seen by the VIC-II, and the implications for using this block for character/sprite/bitmap data and screen memory.

## Description
Block 2 is the $8000–$BFFF 16K window used by one VIC-II bank configuration. It contains 8K of RAM and an 8K BASIC ROM overlay; additionally, one 4K portion is overlaid by the character generator ROM as seen by the VIC-II.

Key behaviors and constraints:
- VIC-II reads character and bitmap data from the system bus independently of the 6510's ROM selection: the VIC-II reads from physical RAM (or ROM) at the addresses it is presented, so it can see RAM that the CPU treats as ROM.
- The 6510 CPU reads ROM when the BASIC ROM is switched in, but writes from the CPU always go to underlying RAM. Thus you can write graphics/sprite/charset data into the RAM beneath BASIC ROM and the VIC-II will display that data even while the CPU reads BASIC ROM.
- The CPU (BASIC/OS) cannot read that RAM region when BASIC ROM is mapped in — BASIC and the OS will read ROM contents, not the RAM you've written underneath. This prevents BASIC/OS from inspecting or relying on RAM-under-ROM contents.
- Practical effect for screen memory:
  - The Character ROM overlay removes one 4K page from available RAM in this block for general-purpose use by the VIC. With $9000–$9FFF (36864–40959) overlaid by the character generator, only 4K of genuine RAM in the block remains available for screen memory if you want the CPU and OS to work normally.
  - A full high-resolution bitmap requires 8K of contiguous RAM; therefore placing a complete hi-res bitmap in this block (with the character-ROM page overlaid) is not feasible without machine-language tricks (bank switches, temporarily disabling ROM, or forcing VIC reads elsewhere).
- Best uses:
  - Storing custom character sets and sprite data under BASIC ROM (VIC can display these).
  - Emulating PET-style screen layouts where the CPU/OS screen checks are not required or are handled in machine code.
- Caveat: OS routines (cursor movement, text updates) read the logical screen memory; if those routines encounter ROM instead of the expected RAM screen data, they will malfunction (e.g., cursor movement or typing may fail).

## Source Code
```text
Block 2 memory map (addresses shown in hex and decimal):

$8000 - $BFFF  (32768 - 49151)  — Block 2 (16K window)

$8000 - $8FFF  (32768 - 36863)  — RAM (4K)
$9000 - $9FFF  (36864 - 40959)  — RAM physically present but VIC-II sees Character ROM (4K)
$A000 - $BFFF  (40960 - 49151)  — BASIC ROM (8K) mapped for CPU reads; RAM exists underneath and is written by CPU but read-as-ROM by BASIC/OS

Notes:
- The VIC-II will read and display data written into the RAM underneath $A000-$BFFF even when the CPU reads BASIC ROM from that range.
- BASIC/OS cannot read the RAM under BASIC ROM without unmapping the ROM or using machine code.
- High-resolution bitmap requirements (8K) cannot be satisfied entirely within the RAM portion of this block if one page is taken by the Character ROM overlay.
```

## Key Registers
- $8000-$BFFF - VIC-II bank / Block 2 - $8000–$BFFF window containing 8K RAM + 8K BASIC ROM; VIC-II can read RAM under ROM
- $8000-$9FFF - RAM area (8K total across two 4K pages) — note: $9000-$9FFF is the Character ROM overlay as seen by VIC-II
- $9000-$9FFF - Character ROM overlay (4K) — VIC-II reads character generator here instead of RAM
- $A000-$BFFF - BASIC ROM (8K) — CPU reads ROM; CPU writes still go to underlying RAM which VIC-II can display

## References
- "vic_memory_block1_description" — trade-offs vs Block 1
- "character_generator_rom_overview_and_bit_values" — relation of character ROM and using RAM-under-ROM