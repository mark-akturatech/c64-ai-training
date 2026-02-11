# Final post-write cleanup (BASIC fragment)

**Summary:** CBM BASIC fragment that reads the final drive status packet from channel 15 using INPUT#15 (EN*, EM*, ET*, ES*), closes channel 15 with CLOSE 15, prints a completion message, and exits (END). Searchable terms: INPUT#15, CLOSE 15, channel 15, EN*, EM*, ET*, ES*, BASIC.

## Description
This 4-line BASIC sequence performs the final cleanup after a successful disk write:
- INPUT#15,EN*,EM*,ET*,ES* — reads the drive's final status packet from channel 15 (command/status channel to the disk drive).
- CLOSE 15 — closes the open serial channel to the drive.
- PRINT" CDOWNJDONE ! " — prints a completion string (appears in source as shown).
- END — terminates the BASIC program.

**[Note: Source may contain an error — the printed string "CDOWNJDONE !" appears garbled or mistyped in the original.]**

## Source Code
```basic
850  INPUT#15,EN*,EM*,ET*,ES* 
860  CLOSE 15 

870  PRINT" CDOWNJDONE ! " 

880  END 
```

## References
- "write_modified_bytes_back_and_commit" — expands on normal continuation after a successful U2 write
- "error_and_close_handlers" — expands on alternate paths for error handling and channel closing