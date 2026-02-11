# Expansion I/O Areas ($DE00-$DFFF)

**Summary:** Expansion I/O Areas at $DE00-$DEFF and $DF00-$DFFF are two 256‑byte I/O regions reserved for optional external device registers (I/O Area 1 and I/O Area 2) used by cartridges and expansion hardware.

**Description**
The C64 memory map includes two dedicated 256‑byte ranges for external device registers:

- $DE00-$DEFF — I/O Area 1: optional external device registers (256 bytes)
- $DF00-$DFFF — I/O Area 2: optional external device registers (256 bytes)

These ranges are intended for cartridges or expansion hardware to expose control/status registers and other I/O to the CPU. The source lists them as optional regions that cartridges/expansion hardware may populate; no register bit layouts or standard assignments are provided in this chunk.

**Cartridge Memory Mapping and Address Decoding**
Cartridges can map into the C64's memory space using the $DE00 and $DF00 I/O areas through specific control signals and address decoding mechanisms. The primary control lines involved are:

- **/EXROM**: Active-low signal that, when asserted (low), indicates the presence of an 8 KB cartridge ROM at $8000-$9FFF.
- **/GAME**: Active-low signal that, when asserted (low), indicates the presence of a 16 KB cartridge ROM spanning $8000-$BFFF.

The combination of these signals determines how the cartridge memory is mapped:

- **/EXROM = Low, /GAME = High**: Maps an 8 KB ROM to $8000-$9FFF.
- **/EXROM = Low, /GAME = Low**: Maps a 16 KB ROM to $8000-$BFFF.
- **/EXROM = High, /GAME = Low**: Maps an 8 KB ROM to $E000-$FFFF (Ultimax mode).

Address decoding within the cartridge hardware ensures that reads and writes to specific memory locations ($DE00-$DEFF for I/O 1 and $DF00-$DFFF for I/O 2) are correctly interpreted, allowing the cartridge to respond appropriately to CPU operations. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Service_Manual/Page_07.html?utm_source=openai))

**Control Signals and Cartridge Lines Interaction**
The C64's expansion port provides several control lines that interact with the I/O areas:

- **/ROML**: Active-low signal that enables the lower 8 KB of cartridge ROM, typically mapped to $8000-$9FFF.
- **/ROMH**: Active-low signal that enables the upper 8 KB of cartridge ROM, typically mapped to $A000-$BFFF or $E000-$FFFF in Ultimax mode.
- **I/O1**: Active-low signal that selects the I/O 1 area ($DE00-$DEFF).
- **I/O2**: Active-low signal that selects the I/O 2 area ($DF00-$DFFF).

When the CPU accesses addresses within the $DE00-$DFFF range, the corresponding I/O1 or I/O2 line is asserted, allowing the cartridge to detect and respond to these accesses. This mechanism enables cartridges to implement custom hardware registers or bank-switching logic within these address ranges. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Service_Manual/Page_07.html?utm_source=openai))

**Example Usage and Register Maps for Common Cartridge Types**
Cartridges often utilize the $DE00-$DFFF I/O areas for various purposes, such as bank switching or control registers. For example:

- **Ocean-type Cartridges**: These cartridges use a latch at $DE00 to control bank switching. Writing a value to $DE00 selects the corresponding 8 KB bank to be mapped into the $8000-$9FFF range. ([luigidifraia.wordpress.com](https://luigidifraia.wordpress.com/2021/05/08/commodore-64-cartridges-theory-of-operation-and-ocean-bank-switching-described/?utm_source=openai))

- **Magic Desk-compatible Cartridges**: These cartridges use the $DE00 register for bank switching, where writing a value to $DE00 selects the desired bank. Additionally, setting bit 7 of the latch high can disable the cartridge. ([blog.8bitchip.info](https://blog.8bitchip.info/328-c64-uni-cart/?utm_source=openai))

- **BackBit Pro Cartridge**: This cartridge interprets writes to the $DE00-$DFFF range as commands, with the lower 8 bits of the address specifying the command. Parameters are sent by writing to $DF00-$DFFF, and commands are executed by writing to $DE00-$DEFF. ([backbit.io](https://www.backbit.io/downloads/Docs/BackBit%20Cartridge%20Documentation.pdf?utm_source=openai))

These examples illustrate how cartridges can utilize the $DE00-$DFFF I/O areas for custom functionality, enhancing the capabilities of the C64 through hardware expansion.

## Key Registers
- $DE00-$DEFF - Expansion I/O - I/O Area 1: optional external device registers (256 bytes)
- $DF00-$DFFF - Expansion I/O - I/O Area 2: optional external device registers (256 bytes)

## References
- "cartridge_structure" — expands on how cartridges populate high memory and I/O spaces
- Commodore 64 Service Manual: I/O, ROM, Expansion Port
- Commodore 64 memory map
- Commodore C64 Cartridge · AllPinouts
- Commodore 64 cartridges: theory of operation and Ocean bank switching described
- Magic Desk and Ocean compatible cartridge for the Commodore 64 – 8bitchip's Retrocomputing Blog
- BackBit Pro Cartridge Documentation

## Labels
- EXROM
- GAME
- ROML
- ROMH
- IO1
- IO2
