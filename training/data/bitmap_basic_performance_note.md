# C64 I/O Map — BASIC Hi‑Res Plotting Note

**Summary:** This note highlights that using BASIC for plotting in the Commodore 64's high-resolution bitmap mode is inefficient and cumbersome. It recommends implementing machine language routines for bit plotting to achieve better performance. For detailed guidance and sample code, refer to Paul F. Schatz's article "Hi‑Res Graphics Made Simple" in *COMPUTE!'s First Book of Commodore 64 Sound and Graphics*.

**Overview**

This annotation addresses the limitations of using BASIC for high-resolution graphics on the Commodore 64:

- **Performance Issues:** BASIC's lack of specialized graphics commands makes pixel plotting slow and complex.
- **Recommendation:** Utilize machine language routines to enhance plotting speed and efficiency.
- **Reference:** Paul F. Schatz's "Hi‑Res Graphics Made Simple" provides programs that replace certain BASIC commands with more efficient high-resolution drawing routines.

**Commodore 64 I/O Map**

The Commodore 64's memory map includes specific regions allocated for Input/Output (I/O) operations, which are crucial for interfacing with hardware components. Below is a detailed breakdown of the I/O address space:

| Address Range | Size  | Description                                                                 |
|---------------|-------|-----------------------------------------------------------------------------|
| $D000-$D3FF   | 1 KB  | VIC-II (Video Interface Controller) registers                               |
| $D400-$D7FF   | 1 KB  | SID (Sound Interface Device) registers                                      |
| $D800-$DBFF   | 1 KB  | Color RAM (controls screen character colors)                                |
| $DC00-$DCFF   | 256 B | CIA 1 (Complex Interface Adapter 1) registers                               |
| $DD00-$DDFF   | 256 B | CIA 2 (Complex Interface Adapter 2) registers                               |
| $DE00-$DEFF   | 256 B | I/O 1 (Reserved for user-defined hardware extensions)                       |
| $DF00-$DFFF   | 256 B | I/O 2 (Reserved for user-defined hardware extensions)                       |

These addresses are mapped to specific hardware registers, allowing the CPU to communicate with peripheral devices through memory-mapped I/O. For instance, writing to the VIC-II registers at $D000-$D3FF controls video output, while accessing the SID registers at $D400-$D7FF manages sound generation. Understanding this I/O map is essential for efficient programming, especially when developing machine language routines for tasks like high-resolution plotting.

## References

- Paul F. Schatz, "Hi‑Res Graphics Made Simple," in *COMPUTE!'s First Book of Commodore 64 Sound and Graphics*.
- Commodore 64 Programmer's Reference Guide: BASIC to Machine Language - Introduction.
- Commodore 64 Service Manual: I/O, ROM, Expansion Port.
- Memory Map - C64-Wiki.