# Copy a File — Source Annotation & Conclusion

**Summary:** This section provides an annotated machine-language routine that emulates the LOAD and SAVE operations, followed by a concluding commentary on advanced DOS protection programming techniques using Commodore's direct-access commands.

**Annotation**

"This routine emulates a LOAD and SAVE from machine language."

The following machine-language routine demonstrates how to perform file loading and saving operations directly from machine code, bypassing BASIC's built-in commands. This approach offers greater control and efficiency, particularly in scenarios requiring advanced disk operations or custom file handling.

## Source Code

```assembly
; Machine-language routine to emulate LOAD and SAVE operations

; Constants
DEVICE_NUMBER = $08       ; Default device number (8)
FILENAME_PTR  = $0200     ; Pointer to filename in memory
FILENAME_LEN  = $0201     ; Length of filename
LOAD_ADDRESS  = $0801     ; Address to load/save data
LOAD_FLAG     = $93       ; Flag to determine LOAD (0) or VERIFY (1)
STATUS        = $90       ; Status byte

; Open file for reading
LDX #DEVICE_NUMBER        ; Set device number
LDY #$00                  ; Set secondary address (0 for LOAD)
LDA #$00                  ; Set file number (0)
JSR $FFBA                 ; Call SETLFS routine

; Set filename
LDA FILENAME_LEN          ; Load filename length
LDX FILENAME_PTR          ; Load filename pointer (low byte)
LDY FILENAME_PTR+1        ; Load filename pointer (high byte)
JSR $FFBD                 ; Call SETNAM routine

; Load file
LDA #$00                  ; Set LOAD_FLAG to 0 (LOAD)
STA LOAD_FLAG
LDA #<LOAD_ADDRESS        ; Load address low byte
LDY #>LOAD_ADDRESS        ; Load address high byte
JSR $FFD5                 ; Call LOAD routine

; Check for errors
LDA STATUS                ; Load status byte
BEQ NoError               ; Branch if no error
; Handle error (e.g., display error message)
NoError:

; Open file for writing
LDX #DEVICE_NUMBER        ; Set device number
LDY #$01                  ; Set secondary address (1 for SAVE)
LDA #$00                  ; Set file number (0)
JSR $FFBA                 ; Call SETLFS routine

; Set filename
LDA FILENAME_LEN          ; Load filename length
LDX FILENAME_PTR          ; Load filename pointer (low byte)
LDY FILENAME_PTR+1        ; Load filename pointer (high byte)
JSR $FFBD                 ; Call SETNAM routine

; Save file
LDA #<LOAD_ADDRESS        ; Load address low byte
LDY #>LOAD_ADDRESS        ; Load address high byte
JSR $FFD8                 ; Call SAVE routine

; Check for errors
LDA STATUS                ; Load status byte
BEQ NoError               ; Branch if no error
; Handle error (e.g., display error message)
NoError:

; Routine complete
RTS
```

**Conclusion**

This chapter concludes by emphasizing the importance of studying the provided program listings. The DOS protection programming techniques demonstrated herein represent some of the most sophisticated uses of Commodore's direct-access commands. Readers are encouraged to examine these listings carefully to gain a deeper understanding of the methods employed.

## References

- "copy_file_machine_code_listing" — expands on the machine-language routines being annotated
- "getting_out_of_trouble_unscratching_file" — expands on the next chapter and troubleshooting/unscratching content

## Labels
- SETLFS
- SETNAM
- LOAD
- SAVE
