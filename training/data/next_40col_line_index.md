# $02A5 — Temporary Index to the Next 40-Column Line (Screen Scrolling)

**Summary:** $02A5 is a single-byte RAM location in the C64 RAM map used as a temporary index to the next 40‑column line for screen scrolling routines; referenced by the "register_storage_area" documentation and Kernal screen-positioning/formatting examples.

## Description
This RAM byte holds a temporary index used by screen-scrolling code when handling 40‑column (text) lines. It is intended as transient workspace for routines that compute or step to the "next" text line during vertical or horizontal scrolling. Programs should treat $02A5 as volatile temporary storage (may be overwritten by system/Kernal routines) and consult the register_storage_area examples for typical usage patterns with Kernal routines.

## Key Registers
- $02A5 - RAM - Temporary index to the next 40-column line used by screen scrolling routines

## References
- "register_storage_area" — expands on examples of using Kernal routines to position/format screen output