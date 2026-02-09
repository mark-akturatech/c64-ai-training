# CLOSE: CLOSE FILE, PART 2

**Summary:** KERNAL CLOSE continuation at $F2EE–$F30E. Calls serial UNLISTEN/UNTALK via $F642, updates LDTND ($98) (number of open files), and if the closed file is not the last, moves the last table entry (LAT $0259, FAT $0263, SAT $026D) into the freed slot. Clears carry (success) and returns.

## Description
This routine completes the CLOSE operation for an open file slot:

- JSR $F642 executes serial-device teardown (UNTALK/UNLISTEN) for the file's device.
- PLA / TAX pop the file-slot index from the stack into X (the slot being closed).
- DEC $98 decrements LDTND (zero-page $98), which holds the count/index of open files (the index of the last used table entry + 1).
- CPX $98 compares the closed-slot index (X) with the new LDTND:
  - If equal (BEQ), the closed slot was the last entry — nothing must be moved; the tables are still dense.
  - If not equal, the code moves the last table entry into the position X to keep the LAT/FAT/SAT tables contiguous.
    - LDY $98 uses the (decremented) LDTND as Y to index the last entry.
    - LDA $0259,Y / STA $0259,X moves that entry in LAT (active file numbers).
    - LDA $0263,Y / STA $0263,X moves the device number in FAT (active device numbers).
    - LDA $026D,Y / STA $026D,X moves the secondary address in SAT (active secondary addresses).
- CLC clears the carry flag (KERNAL convention: clear = success).
- RTS returns to the caller.

Indexing notes: X is the closed slot index (from stack), Y is set to the last-entry index after decrement. All table accesses use absolute indexed addressing (base + X or Y).

## Source Code
```asm
                                *** CLOSE: CLOSE FILE, PART 2
.,F2EE 20 42 F6 JSR $F642       UNTALK/UNLISTEN serial device
.,F2F1 68       PLA
.,F2F2 AA       TAX
.,F2F3 C6 98    DEC $98         decrement LDTND, number of open files
.,F2F5 E4 98    CPX $98         compare LDTND to (X)
.,F2F7 F0 14    BEQ $F30D       equal, closed file = last file in table
.,F2F9 A4 98    LDY $98         else, move last entry to position of closed entry
.,F2FB B9 59 02 LDA $0259,Y     LAT, active file numbers
.,F2FE 9D 59 02 STA $0259,X
.,F301 B9 63 02 LDA $0263,Y     FAT, active device numbers
.,F304 9D 63 02 STA $0263,X
.,F307 B9 6D 02 LDA $026D,Y     SAT, active secondary addresses
.,F30A 9D 6D 02 STA $026D,X
.,F30D 18       CLC
.,F30E 60       RTS             return
```

## Key Registers
- $0098 - Zero Page - LDTND: number of open files / index of next free slot (decremented on close)
- $0259 - RAM - LAT: active file numbers table (entries indexed by file-slot)
- $0263 - RAM - FAT: active device numbers table (entries indexed by file-slot)
- $026D - RAM - SAT: active secondary addresses table (entries indexed by file-slot)

## References
- "close_file_part1" — complements close operations and updates file tables