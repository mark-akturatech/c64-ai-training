# BASIC ROM ($A000-$BFFF)

**Summary:** $A000-$BFFF is the 8 KB BASIC interpreter ROM (or RAM when banked out/overlaid). Visibility is controlled by the processor port at $0001 (bits #0–#2).

## Description
$A000-$BFFF contains the BASIC interpreter (8192 bytes). This 8 KB region can be banked out or overlaid with RAM; whether the ROM or RAM is visible to the CPU is determined by the processor port $0001, specifically bits #0–#2.

## Key Registers
- $A000-$BFFF - Memory - BASIC ROM/RAM (BASIC interpreter or RAM, 8192 bytes)
- $0001 - CPU - processor port controlling memory bank visibility (bits #0-#2)

## References
- "zero_page_processor_port_and_defaults" — expands on processor port $0001 controls ROM visibility
