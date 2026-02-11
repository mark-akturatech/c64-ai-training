# Character decode table pointers and decode tables ($EB79 - $EC43)

**Summary:** Table-address pointers at $EB79 and three keyboard decode tables in ROM: standard ($EB81..$EBC1), shifted ($EBC2..$EC02), and CBM-key/commodore ($EC03..$EC43). Each table maps keyboard-matrix counts to PETSCII/scan codes and ends with $FF; pointers are stored as 16-bit little-endian words.

## Description
This ROM data block provides the pointer table and three key-decode tables used by the C64 keyboard routine. The 4-word pointer block at $EB79 gives the 16-bit addresses (low byte first) for the tables in this order: standard, shift, commodore, control. Each decode table is a sequence of bytes mapping keyboard matrix count values (index produced by the scan routine) to PETSCII/scan codes used by the keyboard handler; each table is terminated with $FF.

Usage notes from related routines (cross references):
- The keyboard scan routine uses the pointer words (via $F5/$F6) to select and read these tables when converting a key count into a character (see "keyboard_scan_entry_ea87_to_eb47").
- The shift/control evaluation routine selects which table to use (standard / shifted / commodore / control) — see "evaluate_shift_ctrl_c_keys_eb48_to_eb76".
- Some decoded codes are post-processed by the special-character handler (case switching, SHIFT+C = etc.) — see "special_character_codes_ec44_to_ec5e".

The tables contain raw byte codes (many values are PETSCII or internal scan codes). Each table ends with $FF as an end marker.

## Source Code
```text
                                *** table addresses
.:EB79 81 EB                    standard
.:EB7B C2 EB                    shift
.:EB7D 03 EC                    commodore
.:EB7F 78 EC                    control

                                *** standard keyboard table
.:EB81 14 0D 1D 88 85 86 87 11
.:EB89 33 57 41 34 5A 53 45 01
.:EB91 35 52 44 36 43 46 54 58
.:EB99 37 59 47 38 42 48 55 56
.:EBA1 39 49 4A 30 4D 4B 4F 4E
.:EBA9 2B 50 4C 2D 2E 3A 40 2C
.:EBB1 5C 2A 3B 13 01 3D 5E 2F
.:EBB9 31 5F 04 32 20 02 51 03
.:EBC1 FF
                                *** shifted keyboard table
.:EBC2 94 8D 9D 8C 89 8A 8B 91
.:EBCA 23 D7 C1 24 DA D3 C5 01
.:EBD2 25 D2 C4 26 C3 C6 D4 D8
.:EBDA 27 D9 C7 28 C2 C8 D5 D6
.:EBE2 29 C9 CA 30 CD CB CF CE
.:EBEA DB D0 CC DD 3E 5B BA 3C
.:EBF2 A9 C0 5D 93 01 3D DE 3F
.:EBFA 21 5F 04 22 A0 02 D1 83
.:EC02 FF
                                *** CBM key keyboard table
.:EC03 94 8D 9D 8C 89 8A 8B 91
.:EC0B 96 B3 B0 97 AD AE B1 01
.:EC13 98 B2 AC 99 BC BB A3 BD
.:EC1B 9A B7 A5 9B BF B4 B8 BE
.:EC23 29 A2 B5 30 A7 A1 B9 AA
.:EC2B A6 AF B6 DC 3E 5B A4 3C
.:EC33 A8 DF 5D 93 01 3D DE 3F
.:EC3B 81 5F 04 95 A0 02 AB 83
.:EC43 FF
```

## Key Registers
- $EB79-$EB7F - KERNAL ROM - pointer table (4 little-endian words) to decode tables: standard, shift, commodore, control
- $EB81-$EBC1 - KERNAL ROM - standard key decode table (terminator $FF at $EBC1)
- $EBC2-$EC02 - KERNAL ROM - shifted key decode table (terminator $FF at $EC02)
- $EC03-$EC43 - KERNAL ROM - CBM-key (commodore) decode table (terminator $FF at $EC43)

## References
- "keyboard_scan_entry_ea87_to_eb47" — how the decode tables are used via pointers at $F5/$F6
- "evaluate_shift_ctrl_c_keys_eb48_to_eb76" — selection logic for which table to use
- "special_character_codes_ec44_to_ec5e" — special handling for some decoded codes (case switching, SHIFT+C, etc.)