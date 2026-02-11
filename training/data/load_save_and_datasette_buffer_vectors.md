# Memory Map: Vectors $032E-$03FF (LOAD/SAVE vectors and Datasette Buffer)

**Summary:** System-area vectors and datasette buffer addresses: vectors at $0330-$0333 contain LOAD/SAVE routine entry addresses (defaults $F4A5 / $F5ED), $033C-$03FB is the 192-byte Datasette I/O buffer, with a few unused bytes around them. Also includes nearby vector $032E-$032F (default $FE66).

## Description
This chunk documents the C64 memory area from $032E through $03FF that holds a few system vectors and the datasette (tape) I/O buffer:

- $032E-$032F: an unused system vector with a documented default value $FE66 (listed for completeness).
- $0330-$0331: two-byte vector holding the entry address of the File LOAD routine (default $F4A5).
- $0332-$0333: two-byte vector holding the entry address of the File SAVE routine (default $F5ED).
- $0334-$033B: eight unused bytes reserved in this area.
- $033C-$03FB: Datasette I/O buffer (192 bytes) used by the cassette routines for data transfer.
- $03FC-$03FF: trailing unused bytes to align the page.

These vectors are used by KERNAL cassette/file routines; the defaults point into ROM routines. For more on how the datasette buffer pointers are referenced from zero page and system area, see the referenced "datasette_and_serial_buffers" chunk.

## Source Code
```text
$032E-$032F  Unused             (default: $FE66)
$0330-$0331  LOAD               File load routine (default: $F4A5)
$0332-$0333  SAVE               File save routine (default: $F5ED)
$0334-$033B  Unused             (8 bytes)
$033C-$03FB  Datasette Buffer   Datasette I/O buffer (192 bytes)
$03FC-$03FF  Unused             (4 bytes)
```

## Key Registers
- $032E-$032F - System vectors - unused (documented default $FE66)
- $0330-$0331 - System vectors - LOAD routine address (default $F4A5)
- $0332-$0333 - System vectors - SAVE routine address (default $F5ED)
- $033C-$03FB - Memory buffer - Datasette I/O buffer (192 bytes)

## References
- "datasette_and_serial_buffers" — expands on datasette buffer pointers in zero page and system area

## Labels
- LOAD
- SAVE
