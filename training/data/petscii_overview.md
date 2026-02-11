# PETSCII (C64) — PET Standard Code of Information Interchange

**Summary:** PETSCII is the 256-code character encoding used by the Commodore 64 and other Commodore machines; the canonical table lists all 256 codes with decimal and hex values and character descriptions, showing both uppercase/graphics (up/gfx) and lowercase/uppercase (lo/up) display variants. Related topics: control-code ranges, unused codes, and mapping from PETSCII to screen codes used in video memory ($0400-$07E7).

**Overview**
PETSCII (PET Standard Code of Information Interchange) is the character set used on Commodore computers including the C64. The standard reference presents every code 0–255 with:
- decimal and hexadecimal values,
- a short character description,
- the rendered character shown for the two relevant display modes: uppercase/graphics (up/gfx) and lowercase/uppercase (lo/up), separated by a slash where the glyphs differ.

The canonical table is the authoritative mapping for PETSCII-to-screen-code conversion and for interpreting control codes and unused/reserved slots. Details and special cases (control ranges, unused codes) are covered in the petscii_notes reference; conversion rules for placing characters into video memory are in petscii_to_screen_conversion and screen_codes_intro.

**PETSCII Character Set Table**

The following table lists all 256 PETSCII codes, including their decimal and hexadecimal values, character descriptions, and representations in both uppercase/graphics (up/gfx) and lowercase/uppercase (lo/up) display modes. For characters that differ between the two modes, both representations are shown separated by a slash.
