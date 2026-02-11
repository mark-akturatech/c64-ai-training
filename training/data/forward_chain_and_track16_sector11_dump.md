# Forward-chain continuation — start of file block at Track 16, Sector 11

**Summary:** This section presents the forward-link bytes from the preceding block and the initial raw byte/ASCII dump for Track 16, Sector 11, illustrating the disk forward-chain and sector header. The author notes that "nothing of particular interest appears in this block."

**Description**

This chunk records the forward-link block (.00: line) from the prior block and follows that forward link to Track 16, Sector 11. It contains the header "TRACK 16 - SECTOR 11" and the first three data lines of that sector in mixed hex and ASCII dump form. The author notes that "nothing of particular interest appears in this block."

Be aware the dump contains OCR/artifact errors (misread hex bytes and ASCII characters). Treat the raw values in the Source Code section as the original scanned text; validate against the disk image if exact bytes are required.

## Source Code

```text
.    00:    10  0B  01  04  0D  04  04  00 
**  **  »»  ** 


Let's  follow  the  forward  chain  to  track  16,  sector  11  and  take  a  look  at  the 
start  of  the  second  block  in  our  file. 


TRACK  16  -  SECTOR  11 

.    00:    10  02  31  30  00  1C  05  78  . . 10  

.    08:    00  A1  23  31  2C  42  24  3A  ..#1,B$: 

.    10:    8B  20  42  24  B2  C7  25  33  .  B$..%3 
```

## References

- "track_sector_links_and_load_address_explanation" — explains the meaning of the forward-link bytes that point to this block
- "track16_sector02_dump_and_notes" — continues chaining from this block to the next block (track 16, sector 02) and shows its contents