# Kick Assembler: LoadSid (HVSC .sid import)

**Summary:** LoadSid imports HVSC-format .sid files (SID chip music) into Kick Assembler, extracting init/play addresses and SID metadata. Use to get song/init/play pointers and header information for embedding or auto-initialization.

**Description**
`LoadSid("path/to/file.sid")` reads a SID file (PSID/RSID format) and returns a data structure with the file's initialization and play addresses plus header metadata. Typical uses:
- Retrieve the init (setup) and play routine addresses from the SID header for calling from assembly.
- Access SID metadata fields (title, author, released, and other header fields) for display or selection.
- Read header flags and paging information (startpage, pagelength) used with memory-mapped SID code (see PSID/RSID specification).

The loader does not modify the SID binary; it extracts header fields and pointers so your assembly can call the init and play routines at the correct addresses. For details of flag meanings, memory paging, and exact header layout, consult the SID file format specification (PSID/RSID/HVSC).

**Returned Structure Fields**
The `LoadSid` function returns a structure with the following fields:

- `header`: The SID file type (PSID or RSID).
- `version`: The header version.
- `location`: The location of the song.
- `init`: The address of the init routine.
- `play`: The address of the play routine.
- `songs`: The number of songs.
- `startSong`: The default song.
- `name`: A string containing the name of the module.
- `author`: A string containing the name of the author.
- `copyright`: A string containing copyright information.
- `speed`: The speed flags (consult the SID format for details).
- `flags`: Flags (consult the SID format for details).
- `startpage`: Start page (consult the SID format for details).
- `pagelength`: Page length (consult the SID format for details).
- `size`: The data size in bytes.
- `getData(n)`: Returns the nth byte of the module. Use this function together with the `size` variable to store the module's binary data into memory.

**Example Usage**

In this example:
- The SID file is loaded using `LoadSid`, and its metadata is printed.
- The SID data is placed at memory location `$1000`.
- A BASIC stub is created to start the program.
- The program initializes the SID with the `init` address and sets up an interrupt to call the `play` routine.

## Source Code

```asm
; Load a SID file
.var music = LoadSid("path/to/file.sid")

; Access metadata
.print "Title: " + music.name
.print "Author: " + music.author
.print "Copyright: " + music.copyright

; Initialize and play the SID
* = $1000 "Music"
.fill music.size, music.getData(i)

* = $0801 "Basic Program"
BasicUpstart2(start)

* = $0810 "Program"
start:
    lda #music.startSong - 1
    jsr music.init
    sei
    lda #<irq1
    sta $0314
    lda #>irq1
    sta $0315
    lda #$7f
    sta $dc0d
    sta $dd0d
    lda #$81
    sta $d01a
    lda #$1b
    sta $d011
    lda #$80
    sta $d012
    lda $dc0d
    lda $dd0d
    asl $d019
    cli
    jmp *

irq1:
    asl $d019
    jsr music.play
    jmp $ea81
```

## References
- "sid_file_properties_and_usage" — expands on SID properties and how to use them
- Kick Assembler Manual: [https://www.theweb.dk/KickAssembler/webhelp/content/index.html](https://www.theweb.dk/KickAssembler/webhelp/content/index.html)
