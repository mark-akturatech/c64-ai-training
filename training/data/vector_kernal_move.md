# VECTOR: KERNAL MOVE ($FD1A)

**Summary:** KERNAL routine at $FD1A copies 0x20 bytes (vectors $0314-$0333) between the KERNAL vector table and a RAM area pointed to by the zero-page pointer in $C3/$C4 (typically $FD30). Uses indirect-indexed addressing ((zp),Y), LDY/DEY loop (Y counts 31→0), and LDA/STA; direction is chosen by the CPU carry flag.

## Description
This ROM routine (entered via VECTOR / $FF8D) moves the 32-byte KERNAL vector table at $0314-$0333 to or from a RAM area whose address is supplied in X/Y and saved in zero page $C3/$C4 (MEMUSS). Operation summary:

- Entry: X = low byte, Y = high byte of the target/source address; routine saves them to $C3/$C4.
- LDY #$1F and loop: Y is used as the index from $0314+$1F down to $0314+0 (31 down to 0). DEY/BPL repeats the loop 32 times.
- Addressing used:
  - Direct absolute indexed: LDA $0314,Y / STA $0314,Y — accesses the kernel vector table.
  - Indirect indexed: LDA ($C3),Y / STA ($C3),Y — accesses the RAM area pointed to by $C3/$C4 plus Y.
- Carry semantics:
  - Carry set (C = 1): routine loads from $0314,Y and stores to ($C3),Y — copies vectors out of the kernel table into the RAM area (write out).
  - Carry clear (C = 0): routine loads from ($C3),Y and stores to $0314,Y — copies vectors from the RAM area into the kernel table (read in).
- Note on the two STA instructions: the code stores to both the indirect address and $0314,Y in every iteration; depending on carry the source of A differs (either $0314,Y or ($C3),Y), producing the intended copy direction.
- Typical usage: X/Y commonly point to $FD30 (RAM under ROM). Because the RAM under ROM may initially contain the ROM image, copying when that RAM still mirrors ROM can lead to the RAM getting the ROM contents copied (see remarks about RAM under ROM behavior).

## Source Code
```asm
                                *** VECTOR: KERNAL MOVE
                                The KERNAL routine VECTOR ($ff8d) jumps to this routine.
                                It reads or sets the vectors at $0314-$0333 depending on
                                state of carry. X/Y contains the address to read/write
                                area, normally $fd30. See $fd15.
                                A problem is that the RAM under the ROM at $fd30 always
                                gets a copy of the contents in the ROM then you perform
                                the copy.
.,FD1A 86 C3    STX $C3         MEMUSS - c3/c4 temporary used for address
.,FD1C 84 C4    STY $C4
.,FD1E A0 1F    LDY #$1F        Number of bytes to transfer
.,FD20 B9 14 03 LDA $0314,Y
.,FD23 B0 02    BCS $FD27       Read or Write the vectors
.,FD25 B1 C3    LDA ($C3),Y
.,FD27 91 C3    STA ($C3),Y
.,FD29 99 14 03 STA $0314,Y
.,FD2C 88       DEY
.,FD2D 10 F1    BPL $FD20       Again...
.,FD2F 60       RTS
```

## Key Registers
- $0314-$0333 - KERNAL vectors table (32 bytes) — source/destination for the copy
- $C3-$C4 - Zero Page - MEMUSS temporary pointer (low/high) used for indirect addressing ((C3),Y)
- $FD30 - Typical RAM-under-ROM start address used as the target/source for copies (X/Y normally point here)

## References
- "restor_kernal_reset" — expands on RESTOR calls VECTOR to copy kernel vectors
- "kernal_reset_vectors" — expands on VECTOR copies to/from this table region

## Labels
- VECTOR
- MEMUSS
