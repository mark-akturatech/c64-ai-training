# Chapter 7 — Technical Information (VIC-II & SID, SYSDEF, Macros)

**Summary:** Covers detailed programming information for the VIC‑II and SID chips, register naming conventions (SYSDEF), and the provided assembly macros (Appendix B; source Listing C‑1). All register addresses in this chapter are hexadecimal unless otherwise noted.

## Chapter scope and conventions
This chapter provides the low‑level details needed to program the VIC‑II graphics chip and the SID sound chip for the Commodore 64. Use this chapter as the primary reference when implementing raster effects, sprite handling, sound voices, and other hardware‑level features.

Conventions used in the chapter:
- Addresses are in hexadecimal by default.
- Register names follow the SYSDEF hardware definition listing (Listing C‑2, Appendix C). These names are assembler‑friendly (6 characters or fewer) and are intended to be used directly in assembly source.
- Macros implementing common routines are described in Appendix B; their source is provided in Listing C‑1 (Appendix C). The macros may use extra instructions compared with hand‑crafted code but improve readability and maintainability by exposing a recognisable name for a function.

No register maps or code listings are included in this section — consult the SYSDEF listing (Appendix C, Listing C‑2) for the full register names/addresses and Appendix B / Listing C‑1 for macro descriptions and sources.

## References
- "appendix_b_macros" — descriptions of provided assembly macros (Appendix B)
- "listing_c1" — source code for the macros (Listing C‑1, Appendix C)
- "listing_c2_sysdef" — SYSDEF hardware definition listing (Listing C‑2, Appendix C)
- "graphics_memory_locations_and_vic_bank_selection" — VIC‑II graphics memory mapping and bank selection
- "color_memory" — color RAM and how graphics modes use it