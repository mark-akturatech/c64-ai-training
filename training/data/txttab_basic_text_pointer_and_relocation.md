# TXTTAB ($2B-$2C)

**Summary:** TXTTAB ($2B-$2C) is the two‑byte little‑endian pointer to the start of BASIC program text (default $0801). Used for BASIC relocation, emulating PET/CBM layouts, creating a low‑memory safe area (e.g., for hi‑res screen, sprites, custom charsets), keeping multiple BASIC programs in memory, and as the SAVE start pointer when saving arbitrary memory regions.

**Description**
TXTTAB is a two‑byte pointer (low byte at $002B, high byte at $002C) that tells BASIC where program text begins. The C64 default is 2049 ($0801). Changing TXTTAB moves the BASIC program area — effects take place immediately for subsequent BASIC program storage and for SAVE (the start address used by SAVE is taken from TXTTAB).

Common uses described in the source:

1. **Emulate PET/CBM memory layout**
   - PET/CBM typically place screen at $8000 and BASIC text at $0401. By changing video pointers and TXTTAB, you can make the C64 behave like a PET for program transfer/testing. The source includes a short BASIC POKE program that:
     - Lowers TOP OF MEMORY to $8000,
     - Enables bank 2 via CIA register,
     - Moves text display memory to $8000 via VIC‑II,
     - Sets the OS print high‑byte so printed output goes to $8000,
     - Sets TXTTAB to $0401,
     - Disables RESTORE and clears the screen.
   - Note: The C64 will automatically relocate BASIC text when loading PET programs (so C64 can load/list PET programs despite different file start addresses), but PET does not relocate automatically; you must match start addresses or reconfigure one machine.

2. **Raise BASIC start to create a low‑memory safe area**
   - Move BASIC start up to reserve low RAM for large screen buffers (e.g., HIRES 8K at $2000 or larger custom areas), sprites, or user charsets.
   - Example: set TXTTAB to $4001 (16385) to move BASIC well above zero page and system vectors. After changing TXTTAB, use NEW so BASIC adopts the new start.

3. **Keep multiple BASIC programs in memory**
   - Store more than one BASIC program by placing each program at different start addresses and switching TXTTAB between them.
   - Offshoots:
     a) Append two programs in memory (line numbers must not overlap).
     b) Use a small stub program at the default TXTTAB that sets TXTTAB to the higher program address and then RUNs it — effectively a launcher that preserves a low memory area.

4. **Using TXTTAB with SAVE**
   - TXTTAB is the address used as the first byte to SAVE. The pointer described in the source at decimal locations 45–46 ($2D–$2E) is used to indicate the byte after the last byte to be saved; together, you can SAVE arbitrary memory ranges by adjusting TXTTAB and that end pointer before issuing SAVE.

Practical note (from source): TXTTAB uses little‑endian storage — low byte first at $2B, high byte at $2C. To set TXTTAB to address A, you POKE $002B with A AND 255 (low byte) and POKE $002C with INT(A/256) (high byte); then use NEW where appropriate to have BASIC adopt the change.

## Source Code
```basic
10 POKE 55,0:POKE 56,128:CLR:REM LOWER TOP OF MEMORY TO 32768
20 POKE 56576,PEEK(56576) AND 253:REM ENABLE BANK 2
30 POKE 53272,4:REM TEXT DISPLAY MEMORY NOW STARTS AT 32768
40 POKE 648,128:REM OPERATING SYSTEM PRINTS TO SCREEN AT 32768 (128*256)
50 POKE 44,4:POKE 1024,0:REM MOVE START OF BASIC TO 1025 (4*256+1)
60 POKE 792,193:REM DISABLE RESTORE KEY
70 PRINT CHR$(147);"NOW CONFIGURED LIKE PET":NEW
80 REM ALSO SEE ENTRIES FOR LOCATION 55, 56576, AND 648
```

Additional minimal example (move BASIC start to $4001 = 16385):
```basic
POKE 43,1    :REM TXTTAB low byte = $01
POKE 44,64   :REM TXTTAB high byte = $40 (64 decimal)
NEW
```

(Above BASIC listings are verbatim/reference material from the source.)

## Key Registers
- $002B-$002C - BASIC - TXTTAB (two‑byte little‑endian pointer to start of BASIC program text; default $0801)
- $002D-$002E - BASIC - pointer used to indicate the byte after the last byte to SAVE (per source; used with TXTTAB to SAVE arbitrary memory ranges)
- $D000-$D02E - VIC‑II - video registers (source example uses $D018 / decimal 53272 to relocate text display)
- $DD00-$DD0F - CIA 2 - I/O and bank control (source example uses decimal 56576 / $DD00 in bank enabling operation)

## References
- "index_and_resho_work_areas" — expands on nearby work area variables referenced by relocation techniques
- "channl_current_io_channel" — expands on I/O redirection techniques that relate to program relocation and buffers

## Labels
- TXTTAB
