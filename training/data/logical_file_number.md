# Logical file number (<file‑num>)

**Summary:** The `<file‑num>` is the logical file number (1–255) used by `OPEN`, `CLOSE`, `CMD`, `GET#`, `INPUT#`, and `PRINT#` to link I/O statements to a filename and the device (equipment) being used; conventionally prefer numbers below 128 (avoid ≥128).

**Description**
The `<file‑num>` is a numeric identifier that ties BASIC I/O statements together and associates them with a specific filename and peripheral device. When you `OPEN` a channel with a given `<file‑num>`, subsequent statements that reference that same `<file‑num>` (`CLOSE`, `CMD`, `GET#`, `INPUT#`, `PRINT#`, etc.) operate on the same logical connection.

Range and convention:
- Valid range: 1–255 (any value in this range may be assigned).
- Recommendation: File numbers over 128 were intended for other uses; it is good practice to use numbers below 128 for user-assigned file numbers. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_2/page_065.html?utm_source=openai))

Behavioral note:
- The `<file‑num>` is purely a BASIC-level logical channel identifier — it does not directly correspond to hardware registers. A single device or filename may be opened on multiple file numbers, and a file number may be reassigned after `CLOSE`.

## References
- "open_statement_overview_and_format" — expands on `OPEN` statement syntax and where `<file‑num>` appears  
- "open_examples" — example uses of logical file numbers
