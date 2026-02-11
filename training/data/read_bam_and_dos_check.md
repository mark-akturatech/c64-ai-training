# BAM read & DOS version check (BASIC - M-R disk read)

**Summary:** Reads the disk BAM (Block Availability Map) from device 15 using a DOS "M-R" memory-read command (PRINT#15 / GET#15), concatenates returned blocks into a BAM$ string, derives the DOS version via ASC(MID$(BAM$,3,1)), and prints status or "failed". Uses GET#15, PRINT#15, MID$, ASC(), string concatenation.

**Description**
This routine opens the CBM DOS device (device 15), issues a DOS memory-read ("M-R") command to fetch BAM blocks, then loops reading data with GET#15 and appending each returned block to BAM$. Empty GET# returns are normalized to CHR$(0) before concatenation. After collecting the BAM image, the code extracts a single byte from the assembled BAM$ (MID$(BAM$,3,1)) and converts it to a numeric DOS value with ASC(). That value is tested (IF DOS = 65 THEN GOTO 460 in the source) and on failure, the code closes the channel and prints a status/failure line before END.

This stored BAM image is later used/restored elsewhere (see referenced chunks "buffer_init_certify_loop_and_restore_bam" and "annotated_line_range_summary"). The listing below is the provided BASIC routine; the original text contains OCR corruption in several literals and numeric tokens which have been corrected where the intended meaning was clear.

## Source Code
```basic
320 REM BAM

' -- Interpreted / cleaned (best-effort) version --
330 PRINT#15,"M-R" + CHR$(0) + CHR$(2) + CHR$(0) + CHR$(192)
340 FOR I = 0 TO 191
350   GET#15, B$
360   IF B$ = "" THEN B$ = CHR$(0)
370   BAM$ = BAM$ + B$
380 NEXT I
390 DOS = ASC(MID$(BAM$, 3, 1))
400 IF DOS = 65 THEN GOTO 460
410 CLOSE 15
420 PRINT "<:down: 73, CBM DOS V2-6 1541,00,00"   ' original string garbled; shown as best-effort
430 PRINT "CDOWNJ <:rvs>failed<:roff>"           ' original string garbled; shown as-is
440 END

' -- Original OCR source (verbatim, kept for provenance) --
320  REM  BAM 

330  PR I NT# 15," M-R " CHR* ( O ) CHR*  <  7 ) CHR$  < 1 92 
) 

340  FOR I =070191 

350  GET#15,B$ 

360   I FB*= " " THENB*=CHR*  <  O ) 

370  BAM*=BAM*+B* 

380  NEXTI 

390  DOS= ABC ( M I D* ( BAM* ,3,1)) 
400  IFD0S=65G0T0460 
410  CL0SE15 

420  PRINT"  <: down:  73,  CBM  DOS  V2- 6  1541,00, 
00" 

430  PRINT" CDOWNJ <:rvs>failed<:roff> " 

440  END 
```

## References
- "user_prompts_and_drive_check" — expands on invoked after the initial DOS drive query
- "buffer_init_certify_loop_and_restore_bam" — expands on this stored BAM image is later used/restored to work around a block-allocate bug
- "annotated_line_range_summary" — explains why the BAM is stored (lines 330-380) and restored (800-890)
