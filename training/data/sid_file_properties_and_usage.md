# Kick Assembler: LoadSid SID-file properties and getData()/size usage

**Summary:** Describes Kick Assembler's LoadSid object properties (header PSID/RSID, version, location, init, play, songs, startSong, name, author, copyright, speed, flags, startpage, pagelength), and the binary extraction API: size (bytes) and getData(n) to read module bytes for embedding (.fill). Includes a complete assembly/example showing music.init/music.play usage and how to store the SID module bytes.

## Properties and usage
LoadSid("file.sid") returns an object exposing SID module metadata and accessors. Common properties available:
- header — PSID or RSID header identifier
- version — header version
- location — load address / relocation information
- init — initialization routine address (entry for init)
- play — play routine address (called each tick)
- songs — number of subsongs
- startSong — start song index
- name — module title string
- author — composer/author string
- copyright — copyright string
- speed — speed flags/timing from header
- flags — header flags
- startpage, pagelength — memory paging info (if present)
- size — the size of the SID module data in bytes
- getData(n) — returns the nth byte of the module binary (zero-based index)

size and getData(n) usage
- size is the total count of bytes returned by getData.
- Use getData together with size to copy the module data into the assembled output or to write it into memory at assembly time (example uses .fill to embed the bytes).
- Typical pattern: .fill music.size, music.getData(i) to emit the module's bytes into the assembled binary.

The example code below demonstrates:
- Loading a SID file into the music object (var music = LoadSid("Nightshift.sid"))
- Calling music.init with the chosen start song
- Calling music.play from an IRQ handler
- Embedding the SID module bytes via .fill using music.size and music.getData(i)
- Printing the SID metadata at assemble-time with .print lines

## Source Code
```asm
//--------------------------------------------------------
// SID Player
//--------------------------------------------------------
.var music = LoadSid("Nightshift.sid")
BasicUpstart2(start)
start:
    lda #$00
    sta $d020
    sta $d021
    ldx #0
    ldy #0
    lda #music.startSong-1
    jsr music.init
    sei
    lda #<irq1
    sta $0314
    lda #>irq1
    sta $0315
    asl $d019
    lda #$7b
    sta $dc0d
    lda #$81
    sta $d01a
    lda #$1b

    sta $d011
    lda #$80
    sta $d012
    cli
    jmp * 

//--------------------------------------------------------
irq1:
    asl $d019
    inc $d020
    jsr music.play
    dec $d020
    pla
    tay
    pla
    tax
    pla
    rti
//--------------------------------------------------------
*=music.location "Music"
.fill music.size, music.getData(i)
//--------------------------------------------------------
// Print the music info while assembling
.print ""
.print "SID Data"
.print "--------"
.print "location=$"+toHexString(music.location)
.print "init=$"+toHexString(music.init)
.print "play=$"+toHexString(music.play)
.print "songs="+music.songs
.print "startSong="+music.startSong
.print "size=$"+toHexString(music.size)
.print "name="+music.name
.print "author="+music.author
.print "copyright="+music.copyright
.print ""
.print "Additional tech data"
.print "--------------------"
.print "header="+music.header
.print "header version="+music.version
```

## Key Registers
- $D000-$D02E - VIC-II - VIC-II registers (used here: $D011 control, $D012 raster, $D019 IRQ/control, $D020 border color, $D021 background color, $D01A used in example)
- $DC00-$DC0F - CIA 1 - CIA-1 register block (example writes to $DC0D)
- $0314-$0315 - System vector - low/high bytes for IRQ handler pointer (example stores IRQ entry address here)

## References
- "sid_player_example" — expands on example player using LoadSid values