# Common Pitfalls

**Summary:** A reference checklist for Commodore 64 (C-64) demo programmers to consult when encountering mysterious bugs or unexpected behavior; intended for quick lookup near the end of the document.

**Reference Area**

This section serves as a reference checklist to consult when you encounter errors that seem mysterious or behavior that shouldn't happen while programming C-64 demos. It is placed near the end of the document and meant for quick lookup: when you encounter a problem, check the entries here to see which common cause might be responsible.

- **Final Cartridge Issues:** If you're using a Final Cartridge, it can sometimes interfere with your demos. Always test your demos with the cartridge removed. If the behavior changes, the cartridge may be the cause. ([odd.blog](https://odd.blog/wp-content/uploads/2008/01/intro-to-programming-c64-demos.html?utm_source=openai))

- **Graphics Data at $1000 or $9000:** Placing sprite, bitmap, or character set data in memory areas $1000–$1FFF or $9000–$9FFF can cause the VIC-II to display the standard CBM character set instead of your custom graphics. Avoid using these memory regions for graphics data. ([odd.blog](https://odd.blog/wp-content/uploads/2008/01/intro-to-programming-c64-demos.html?utm_source=openai))

- **Garbage in Vertical Border or Behind FLD:** If you observe black garbage in the top and bottom borders or on the screen while implementing Flexible Line Distance (FLD) effects, clear the last byte of the current VIC bank (e.g., $3FFF for the first bank, $7FFF for the second, etc.). Be cautious, as clearing this byte without consideration may lead to other issues if it contains code or data. ([odd.blog](https://odd.blog/wp-content/uploads/2008/01/intro-to-programming-c64-demos.html?utm_source=openai))

- **Unexpected Bugs After Packing:** If your demo exhibits strange bugs after being packed or compressed, consider the following:
  - **Buggy Packer:** The packer or cruncher you're using might have bugs. Try using a different one and see if the behavior changes.
  - **Uninitialized Memory:** Your code might be relying on memory locations that are not properly initialized. After packing, these locations may contain different values, leading to unexpected behavior. Ensure all variables and memory areas are explicitly initialized. ([odd.blog](https://odd.blog/wp-content/uploads/2008/01/intro-to-programming-c64-demos.html?utm_source=openai))

- **Unstable Raster Interrupts:** If your raster interrupts are unstable, causing jittery or inconsistent effects, ensure that your interrupt routines are precisely timed and account for variations in instruction execution times. Using stable raster techniques, such as synchronizing with sprite fetches or triggering bad lines, can help achieve consistent timing. ([antimon.org](https://www.antimon.org/code/Linus/?utm_source=openai))

- **Memory Conflicts with I/O Registers:** Be aware that certain memory addresses are mapped to I/O registers. Writing to these addresses without caution can inadvertently alter hardware states. Consult the C-64 memory map to avoid conflicts. ([antimon.org](https://www.antimon.org/code/Linus/?utm_source=openai))

- **Cross-Platform Compatibility:** Demos developed on PAL systems may not function correctly on NTSC systems due to differences in timing and screen resolution. Test your demos on both systems to ensure compatibility. ([antimon.org](https://www.antimon.org/code/Linus/?utm_source=openai))

## References

- "An Introduction to Programming C-64 Demos" by Puterman
- "Common Pitfalls" section from "An Introduction to Programming C-64 Demos"
- "Unleashing the Unexpected – How the VIC-II’s Quirks Powered the C-64 Demo Scene" by Paul Scarlett