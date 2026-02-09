# 8-ROM Identifier at $FD10 (CBM80)

**Summary:** Five-byte 8-ROM identifier stored at $FD10 in the KERNAL ROM: bytes C3 C2 CD 38 30 (CBM ASCII "CBM80"). Used by autostart cartridges; compared with cartridge ROM bytes at $8004-$8008 by the KERNAL check_for_8rom routine and referenced from the autostart vector at $FD02.

## 8-ROM Identifier
The KERNAL contains a five-byte identifier at $FD10 that reads "CBM80" in Commodore/PET character encoding (CBM ASCII/PETSCII). Autostart-capable cartridges are identified by matching their ROM contents against these five bytes so the KERNAL can auto-execute cartridge code. The KERNAL routine check_for_8rom performs the comparison between $FD10 and the cartridge ROM at $8004-$8008. See also the autostart vector entry at $FD02.

## Source Code
```asm
.; $FD10 - 8-ROM identifier (CBM ASCII/PETSCII)
.:FD10  C3 C2 CD 38 30    ; "CBM80" (CBM ASCII)
```

## Key Registers
- $FD10 - KERNAL - 5-byte 8-ROM identifier ("CBM80")
- $FD02 - KERNAL - autostart cartridge vector (references autostart routine)
- $8004-$8008 - ROM - cartridge ROM bytes compared to $FD10 by check_for_8rom

## References
- "check_for_8rom" — compares $FD10 with ROM contents at $8004-$8008