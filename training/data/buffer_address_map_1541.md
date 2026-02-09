# 1541 Buffer Address Organization (Buffers 0–3, unavailable ranges)

**Summary:** The Commodore 1541 disk drive's internal RAM is organized into specific regions, with certain areas reserved for system use and others available as user buffers. The following address ranges are designated:

- **Unavailable internal areas:**
  - $0000–$00FF — Zero page (not available)
  - $0100–$01FF — Stack (not available)
  - $0200–$02FF — Command buffer (not available)
  - $0700–$07FF — Block Availability Map (BAM) (not available)

- **User buffers (each 256 bytes):**
  - Buffer 0: $0300–$03FF — selectable as "#0"
  - Buffer 1: $0400–$04FF — selectable as "#1"
  - Buffer 2: $0500–$05FF — selectable as "#2"
  - Buffer 3: $0600–$06FF — selectable as "#3"

To select a buffer from the host (BASIC), use the `OPEN` command targeting the 1541 and specify the buffer number. For example, `OPEN 2,8,2,"#0"` selects Buffer 0.

## Source Code
```text
1541 buffer organization table:

Address Range      Status / Use                Example / Selection
$0000 - $00FF      Not available (ZERO PAGE)
$0100 - $01FF      Not available (STACK)
$0200 - $02FF      Not available (COMMAND BUFFER)

$0300 - $03FF      Buffer 0                    OPEN 2,8,2,"#0"
$0400 - $04FF      Buffer 1                    OPEN 2,8,2,"#1"
$0500 - $05FF      Buffer 2                    OPEN 2,8,2,"#2"
$0600 - $06FF      Buffer 3                    OPEN 2,8,2,"#3"

$0700 - $07FF      Not available (BAM)
```

```text
Example OPEN commands (host BASIC):
OPEN 2,8,2,"#0"    ; attach logical file to 1541 buffer #0
OPEN 2,8,2,"#1"    ; buffer #1
OPEN 2,8,2,"#2"    ; buffer #2
OPEN 2,8,2,"#3"    ; buffer #3
```

## References
- "buffer_selection_and_direct_access_open" — expands on how to select one of these buffers with the OPEN statement
- "buffer_sharing_and_get_usage" — describes sharing limitations and how to retrieve buffer contents after M-R