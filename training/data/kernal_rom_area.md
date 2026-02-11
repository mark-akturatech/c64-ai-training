# KERNAL ROM ($E000-$FFFF)

**Summary:** $E000-$FFFF — 8 KB KERNAL ROM/RAM region containing the Commodore 64 operating system kernel, OS service routines, and default IRQ/NMI/Reset handlers; visibility is controlled by processor port $0001 bits #0-#2.

## Description
$E000-$FFFF (8192 bytes) is the KERNAL region of the C64 address space. By default this region contains the operating system kernel ROM which provides OS service routines used by BASIC and machine code, and the default IRQ/NMI/Reset handlers referenced via hardware vectors. The ROM may be banked out to expose RAM in that area; visibility and banking are controlled by the processor port at $0001 (bits #0–#2). For processor-port defaults and bit polarity, see the zero_page_processor_port_and_defaults reference. For details of the vectors and the handlers stored here, see hardware_vectors.

## Key Registers
- $E000-$FFFF - Memory - 8 KB KERNAL ROM/RAM: Operating system kernel, OS service routines, default IRQ/NMI/Reset handlers; banked visibility controlled by $0001 bits #0-#2.
- $0001 - Processor port - controls memory mapping and KERNAL visibility (bits #0-#2); see zero_page_processor_port_and_defaults for defaults and bit definitions.

## References
- "zero_page_processor_port_and_defaults" — expands on processor port $0001 that controls KERNAL visibility
- "hardware_vectors" — expands on KERNAL contains the default IRQ/NMI/Reset handlers referenced by vectors