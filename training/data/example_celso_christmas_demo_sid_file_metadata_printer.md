# Example: SID File Metadata Printer

**Project:** celso_christmas_demo - Christmas demo with falling snow sprites, dual bitmap screens, scrolling text, and SID music

## Summary
Assembly-time diagnostic that extracts and prints SID music file metadata using KickAssembler's LoadSid function. Outputs location, init/play addresses, song count, size, name, author, copyright, header version, speed flags, and memory layout during compilation for debugging. No runtime code is generated.

## Techniques
- SID file parsing
- assembly-time printing
- metadata extraction

## Hardware
SID

## Source Code
```asm
// print the music info while assembling
// this is only used at assembling time
// comment this if you don't need it
// play special attention to the location and size of the sid file, if you're planning to use a different one

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
.print "flags="+toBinaryString(music.flags)
.print "speed="+toBinaryString(music.speed)
.print "startpage="+music.startpage
.print "pagelength="+music.pagelength
```
