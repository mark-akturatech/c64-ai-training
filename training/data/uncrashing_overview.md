# Uncrashing (Appendix G)

**Summary:** Discusses using the 6502 BRK (break) instruction as a breakpoint technique to locate faults, and defines "uncrashing" as last‑resort recovery methods to restore a crashed machine (varies by PET/CBM, VIC/Commodore 64, etc.) when unsaved work would otherwise be lost.

## Uncrashing overview
Insert BRK instructions at strategic points in a program so execution will stop at those points and the programmer can inspect state (registers, memory, return addresses) to confirm correct behavior and narrow faults. This breakpoint technique helps pin down bugs by dividing execution into verifiable segments.

"Uncrashing" refers to a set of recovery techniques used only after normal debugging fails and when a crash threatens unsaved work. These techniques are machine dependent and are intended as a last resort; they are never entirely satisfactory. Available approaches depend on hardware and monitor/diagnostic features provided by the machine (for example, a diagnostic sense switch and reset pushbutton on some PET/CBM models, or RUN/STOP + RESTORE and reset switch techniques on some VIC/Commodore 64 variants).

## References
- "pet_cbm_uncrashing" — PET/CBM uncrash procedure using diagnostic sense switch and reset pushbutton  
- "vic64_uncrashing" — VIC/Commodore 64 uncrash tips using RUN/STOP + RESTORE or reset switch