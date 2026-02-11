# Expansion Port I/O Region ($DF00–$DFFF)

**Summary:** The $DF00–$DFFF address range is designated for external I/O operations via the Commodore 64's Expansion Port, specifically utilizing pin 10. This region can mirror CIA #2 registers, allowing external devices to interface with the system. Commodore suggested potential applications, such as implementing a parallel disk drive to achieve higher data transfer rates compared to the standard serial bus.

**Description**

The $DF00–$DFFF memory range is not utilized by the C64's internal hardware but is accessible through the Expansion Port's pin 10. This setup enables external cartridges or modules to implement I/O operations within this address space.

In this configuration, the CIA #2 registers, originally mapped at $DD00–$DD0F, are mirrored into the $DF00–$DFFF range. This mirroring occurs every 16 bytes within the 256-byte block, meaning each 16-byte segment in this range is a duplicate of the others. For example, the register at $DD00 is mirrored at $DF00, $DF10, $DF20, and so on. ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))

Accessing these mirrored registers through the expansion port allows external devices to interact with the C64's internal CIA #2 registers. Reads and writes to these addresses affect the internal CIA #2 registers directly, facilitating seamless integration between the C64 and external hardware.

Commodore highlighted a specific application for this I/O region: the development of an inexpensive parallel disk drive connected via the expansion port. Such a device could potentially offer faster data transfer rates than the standard serial IEC bus, enhancing the system's performance for disk operations. ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))

In summary, the $DF00–$DFFF range serves as a reserved expansion I/O window, allowing external devices connected through the expansion port to interface with the C64's internal hardware, particularly the CIA #2 registers.

## Source Code

The following ASCII diagram illustrates the mirroring of CIA #2 registers into the $DF00–$DFFF range:

```text
$DF00–$DFFF: Expansion Port I/O Region

Address Range | Mirrored Register
--------------|------------------
$DF00–$DF0F   | $DD00–$DD0F
$DF10–$DF1F   | $DD00–$DD0F
$DF20–$DF2F   | $DD00–$DD0F
...           | ...
$DFF0–$DFFF   | $DD00–$DD0F
```

This diagram shows that each 16-byte block within the $DF00–$DFFF range mirrors the CIA #2 registers located at $DD00–$DD0F.

## Key Registers

- $DF00–$DFFF: Expansion Port I/O – CIA #2 register mirrors

## References

- "Mapping the Commodore 64" – Detailed memory mapping and I/O descriptions ([cx16.dk](https://cx16.dk/mapping_c64.html?utm_source=openai))
- "Commodore 64 Programmer's Reference Guide" – Expansion port and I/O details ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_6/page_368.html?utm_source=openai))