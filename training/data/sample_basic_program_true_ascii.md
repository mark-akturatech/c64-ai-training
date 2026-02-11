# C64 BASIC — RS-232 true ASCII send/receive (tok64 page357.prg)

**Summary:** Sample Commodore 64 BASIC program demonstrating RS-232 communication using `OPEN 5,2,3,CHR$(6)`. It creates translation tables (`t%` and `f%`) to map between terminal and computer character sets, handles input/output via `GET#` and `PRINT#`, and includes logic to build reverse lookup for received characters.

**Program purpose and overview**
This BASIC listing implements a simple RS-232 terminal that:
- Opens channel 5 to the RS-232 device with `OPEN 5,2,3,CHR$(6)`.
- Builds a forward translation table `t%(0..255)` mapping terminal/input ASCII to the C64/display ASCII (used when sending).
- Builds an inverse table `f%(0..255)` so incoming serial bytes map to appropriate display characters (used when receiving).
- Main loop: polls `GET#5` (serial input) and checks `ST` (GET# status). If input is present, translates via `f%` and prints; otherwise, reads keyboard input (`GET`) and sends the translated character via `PRINT#5` using `t%`.

The program uses simple range mappings and special-case translations. It also maps both low and high-bit variants when building `f%` (`f%(k)` and `f%(k+128)` set to the source value).

**Mapping-table construction**
- `t%(j)` is initialized for known ranges:
  - 32–64: identity (`t%(j)=j`)
  - 13 → 13, 20 → 8 (CR and control mapping)
  - 65–90: mapped to lowercase by adding 32 (`k=j+32`)
  - 91–95: identity
  - 193–218: mapped to low-bit equivalents by subtracting 128 (`k=j-128`)
  - Special entries: `t%(146)=16` and `t%(133)=16`
- `f%` is built as the inverse mapping of `t%`:
  - For all `j=0..255`, if `k=t%(j)` is nonzero, then set `f%(k)=j` and `f%(k+128)=j`
  - This ensures incoming bytes (including high-bit variants) translate back to original values.

**Main I/O loop**
Receiving path:
- `GET#5,a$` — read from channel 5 into `a$` (serial input)
- If `a$` is non-empty and `ST=0` (status indicates valid data), print `CHR$(157); CHR$(f%(ASC(a$)))`
  - If the translated value equals 34, executes `POKE 212,0` (special-case handling present in source)
- Loop back to `GET#5`

Sending path (when no serial input is available or `ST<>0`):
- Prints `CHR$(rv);" "CHR$(157);CHR$(146)` then `GET a$` — displays prompt/control then gets keyboard input
- If `a$<>""` then `PRINT#5, CHR$(t%(ASC(a$)))` — send mapped character to the RS-232 device
- Maintains a counter `ct` incrementing per sent character; every 8 chars `ct` resets and `rv` toggles (`rv = 164 - rv`). `rv` is initially set to 18.

**Variables and control values**
- `t%(0..255)` — forward mapping table used for outgoing characters (keyboard→serial)
- `f%(0..255)` — inverse mapping table used for incoming characters (serial→display)
- `rv` — a small integer used to print a control character before keyboard prompt; toggled every 8 sent characters
- `ct` — character counter for sent characters (wraps every 8)
- `ST` — BASIC `GET#` status flag checked after `GET#5` (used to determine whether incoming data is valid)
- `a$` — single-character buffer used both for `GET#5` reads and `GET` from keyboard

**Notes on program behavior**
- The program specially maps certain control/high-bit characters into lower equivalents and ensures received high-bit characters are translated back to expected display codes via `f%`.
- `POKE 212,0` is performed when the translated incoming character equals 34 (quote); the purpose is preserved as in the source (the code performs that poke), but the listing does not explain the intent of that poke.
- `OPEN 5,2,3,CHR$(6)` is used to open the serial channel as in the source (parameters are left exactly as in the listing).

## Source Code
```basic
10 rem this program sends and receives true ascii data
100 open 5,2,3,chr$(6)
110 dim f%(255),t%(255)
200 for j=32 to 64:t%(j)=j:next
210 t%(13)=13:t%(20)=8:rv=18:ct=0
220 for j=65 to 90:k=j+32:t%(j)=k:next
230 for j=91 to 95:t%(j)=j:next
240 for j=193 to 218:k=j-128:t%(j)=k:next
250 t%(146)=16:t%(133)=16
260 for j=0 to 255
270 k=t%(j)
280 if k<>0then f%(k)=j:f%(k+128)=j
290 next
300 print" "chr$(147)
310 get#5,a$
320 if a$=""or st<>0 then 360
330 print" "chr$(157);chr$(f%(asc(a$)));
340 if f%(asc(a$))=34 then poke212,0
350 goto310
360 printchr$(rv)" "chr$(157);chr$(146);:get a$
370 if a$<>""then print#5,chr$(t%(asc(a$)));
380 ct=ct+1
390 if ct=8 thenct=0:rv=164-rv
410 goto310
```

## Key Registers
- **212**: Horizontal cursor position.

## References
- "rs232_status_register_bits_and_usage" — expands on checking `ST` (GET# status) to determine when input is available and valid
- "rs232_nonzero_page_control_and_fifos" — expands on nonzero page control words (baud, bit count, RSSTAT) used by the system routines the program relies on