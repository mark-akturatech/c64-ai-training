# MACHINE — Do-It-Yourself Supermon listing omitted (6 pages of raw bytes)

**Summary:** The book omits the full raw Supermon monitor listing (six pages of raw bytes) and instead directs readers to download machine-code monitors from the internet and use common C64 file-transfer methods. Searchable terms: Supermon, monitor, raw bytes, C64, machine-code monitor.

**Description**

The source contains an editorial note refusing to include a six-page raw numeric listing of a "Do-It-Yourself" Supermon monitor. The author directs readers to obtain ready-made monitors from internet archives and mentions that there are many options for transferring files from "more internet-enabled platforms" to a C64. The original quoted line: "I am NOT about to type in 6 pages of raw numbers. Many monitors are available for download from the internet, and many options are available for transferring files from more internet-enabled platforms to the C64. -wf"

No monitor code, listing, or transfer examples are included in the source text.

**Supermon Monitor Listing**

The Supermon machine language monitor is a tool for the Commodore 64 that allows users to inspect and modify memory, disassemble code, and perform other low-level operations. While the book omits the full six-page raw byte listing, the Supermon code is available through various online archives. One such source is the "Tricks und Tips zum SMON" article from the 64'er Magazin, which provides detailed information and code listings for the Supermon monitor. ([64er-magazin.de](https://www.64er-magazin.de/8512/smon.html?utm_source=openai))

**Transferring Monitor Binaries to a Real C64**

To transfer downloaded monitor binaries onto a real Commodore 64, several methods can be employed:

1. **Using a Commodore 1541 Disk Drive with a PC:**
   - **OpenCBM Software:** OpenCBM is a suite of command-line utilities that facilitate communication between a PC and a Commodore 1541 disk drive. By connecting the 1541 drive to a PC using an XM or XA 1541 cable, users can transfer disk images (.d64 files) to and from the C64. Detailed instructions for setting up and using OpenCBM are available. ([retro64.altervista.org](https://retro64.altervista.org/blog/sharing-data-between-pc-and-c64-my-pc-setup-using-opencbm/?utm_source=openai))

2. **Using a Datasette Tape Interface:**
   - **C2N232 Adapter:** The C2N232 is an RS-232 interface that connects to the cassette port of the C64, allowing for the transfer of tape images (.TAP files) between a PC and the C64. This method is particularly useful for systems without a disk drive. ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_64_disk_and_tape_emulation?utm_source=openai))

3. **Using a Serial Connection:**
   - **XMODEM Protocol:** By connecting the C64 to a PC via a null-modem cable and using terminal software that supports the XMODEM protocol, users can transfer files directly. This method requires compatible software on both the C64 and the PC. ([atarimagazines.com](https://www.atarimagazines.com/compute/issue80/xmodem_file_transfer.php?utm_source=openai))

4. **Using Modern Storage Solutions:**
   - **SD2IEC Devices:** These devices emulate a Commodore disk drive and allow the C64 to read from SD cards. Users can copy monitor binaries onto an SD card, insert it into the SD2IEC device connected to the C64, and load the files directly.

Each of these methods has its own setup requirements and compatibility considerations. Users should choose the method that best fits their available hardware and technical proficiency.

## References

- ([64er-magazin.de](https://www.64er-magazin.de/8512/smon.html?utm_source=openai))
- ([retro64.altervista.org](https://retro64.altervista.org/blog/sharing-data-between-pc-and-c64-my-pc-setup-using-opencbm/?utm_source=openai))
- ([en.wikipedia.org](https://en.wikipedia.org/wiki/Commodore_64_disk_and_tape_emulation?utm_source=openai))
- ([atarimagazines.com](https://www.atarimagazines.com/compute/issue80/xmodem_file_transfer.php?utm_source=openai))