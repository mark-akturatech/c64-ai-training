# BASIC ROM ($A000-$BFFF) — BASIC V2 overview and usage notes

**Summary:** Describes the C64 BASIC ROM at $A000-$BFFF (BASIC V2), its heritage from PET/VIC BASIC, limitations (no error trapping, no built‑in graphics/sound support), use of Jim Butterfield PET-style labels, and the recommendation to call routines via vectored entry points rather than hardcoding ROM addresses; notes BASIC can be bank‑switched out so VIC‑II may access RAM underneath (see $DD00).

## Overview
Locations $A000–$BFFF contain the Commodore 64 BASIC V2 interpreter when the BASIC ROM is selected (the default at power-up). BASIC is the main user environment — the READY prompt is produced by this ROM — and is executed whenever no autostart cartridge overrides it.

The C64 BASIC interpreter is closely related to the Microsoft BASIC used on the VIC‑20 and is a modified descendant of PET BASIC 2.0 (also called PET BASIC 3.0 or Upgrade BASIC). That heritage makes a large body of PET/VIC software largely compatible with the C64, but the ROM also carries the limitations of PET BASIC: notably, no structured error‑trapping and no inherent support for the C64’s dedicated graphics (VIC‑II) and sound (SID) hardware.

## Compatibility and limitations
- Functional parity with VIC‑20/Microsoft BASIC family eases program porting and reuse of PET/VIC programming techniques.
- Lacks modern conveniences (e.g., structured error trapping) and does not expose graphics or audio hardware directly — machine‑language entry is required for advanced use.
- Commodore provided a PET emulator for compatibility; the interpreter has been widely disassembled and documented by the community.

## Internal organization and labels
- The ROM contains many routines and dispatch tables used by the interpreter. The labels used in community disassemblies here follow Jim Butterfield’s PET memory map conventions to aid cross‑machine correlation.
- Common dispatch tables (examples referenced for later listings) include statement dispatch tables and token/function tables such as STMDSP, FUNDSP, OPTAB, etc. These will be shown in following sections/listings.

## Calling BASIC routines from machine code
- The ROM exposes many entry/exit points, but these are not absolute: routines are often entered from multiple places, and commands may be implemented as parts of other commands.
- Use vectored entry points (when available) rather than hardcoding absolute ROM addresses; vectored calls maintain better compatibility across ROM revisions.
- For detailed behavior of a particular routine, obtain and read a disassembly of that ROM region — entry/exit comments here are guideposts, not guarantees.

## Memory banking note
- BASIC ROM can be bank‑switched out so the VIC‑II can access the RAM beneath the ROM area; this behavior is controlled via system I/O (see $DD00 for the referenced bank‑switching control context).

## Source Code
(omitted — no code listings or register maps in this chunk)

## Key Registers
- $A000-$BFFF - BASIC ROM - BASIC V2 interpreter code and data area
- $DD00-$DD0F - CIA 2 - I/O region referenced for bank‑switching so VIC‑II can access RAM under the BASIC ROM

## References
- "statement_dispatch_table_and_tables" — expands on STMDSP, FUNDSP, OPTAB and other BASIC dispatch tables  
- "jim_butterfield_pet_maps" — correspondence of disassembly labels used in PET memory maps  
- "programming_the_pet_cbm" — Raeto West, descriptive reference for PET BASIC internals