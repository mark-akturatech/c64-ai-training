# Kick Assembler: SID player example (LoadSid, music.init, music.play, IRQ wiring)

**Summary:** Example demonstrating Kick Assembler's usage of LoadSid to import a .sid file, print SID metadata at assembly time, place SID binary data into memory, and set up an IRQ handler to call music.play. Also includes examples of converting graphics to C64 charset data using LoadPicture.

**Example Overview**

This example illustrates:

- Loading a SID file into a Kick Assembler variable:
- Printing SID metadata during assembly:
- Placing the SID binary data into the assembled output:
- Setting up a startup routine and an IRQ handler to play the music:
- Demonstrating how to shorten HVSC paths using the `–libdir` option:
- Converting graphics to C64 charset data using LoadPicture:

**LoadSid and Music Object Fields**

The `LoadSid` function creates a `music` object with the following properties and methods:

- **Properties:**
  - `music.location`: Load address reported by the SID.
  - `music.init`: Init entry point (relative to `music.location`).
  - `music.play`: Play entry point (relative to `music.location`).
  - `music.songs`: Number of songs.
  - `music.startSong`: Start song.
  - `music.size`: Number of bytes of the SID binary data.
  - `music.name`: Name of the tune.
  - `music.author`: Author of the tune.
  - `music.copyright`: Copyright information.
  - `music.flags`: Flags.
  - `music.speed`: Speed.
  - `music.startpage`: Start page.
  - `music.pagelength`: Page length.
  - `music.header`: Header information (e.g., "PSID").
  - `music.version`: Version information (e.g., "2.0").

- **Methods:**
  - `music.getData(i)`: Returns the i-th byte of the SID binary data.

**SID Data Placement and IRQ Wiring**

- **Placing SID Data:**
  The SID binary data is placed into memory using:
  This writes `music.size` bytes starting from the current output location, fetching each byte via `music.getData(i)`.

- **Startup and IRQ Setup:**
  - The `BasicUpstart2(start)` macro sets up the startup routine labeled `start`.
  - The `start` routine initializes the SID player and sets up the IRQ handler:
  - The `irq1` handler calls `music.play` on each interrupt:

**Graphics Conversion Examples**

Kick Assembler's `LoadPicture` function is used to convert graphics into C64 charset data:

- **Single-Color Charset:**

- **Multi-Color Charset:**

## Source Code

  ```asm
  .var music = LoadSid("Nightshift.sid")
  ```

  ```asm
  .print "flags="+toBinaryString(music.flags)
  .print "speed="+toBinaryString(music.speed)
  .print "startpage="+music.startpage
  .print "pagelength="+music.pagelength
  ```

  ```asm
  .fill music.size, music.getData(i)
  ```

  ```asm
  BasicUpstart2(start)
  start:
      lda #$00
      sta $d020
      sta $d021
      lda #music.startSong-1
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

  ```asm
  .var music = LoadSid("Tel_Jeroen/Closing_In.sid")
  ```

  ```asm
  *=$2000
  .var logo = LoadPicture("CML_32x8.gif")
  .fill $800, logo.getSinglecolorByte((i>>3)&$1f, (i&7) | (i>>8)<<3)
  ```

  ```asm
  .fill music.size, music.getData(i)
  ```

    ```asm
    start:
        lda #$00
        sta $d020
        sta $d021
        lda #music.startSong-1
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
    ```

    ```asm
    irq1:
        asl $d019
        jsr music.play
        jmp $ea81
    ```

  ```asm
  *=$2000
  .var logo = LoadPicture("CML_32x8.gif")
  .fill $800, logo.getSinglecolorByte((i>>3)&$1f, (i&7) | (i>>8)<<3)
  ```

  ```asm
  *=$2800 "Logo"
  .var picture = LoadPicture("Picture_16x16.gif",
    List().add($444444, $6c6c6c, $959595, $000000))
  .fill $800, picture.getMulticolorByte(i>>7, i&$7f)
  ```


```asm
; Kick Assembler SID player example

; Load the SID and print metadata at assembly time
.var music = LoadSid("Nightshift.sid")

.print "flags="+toBinaryString(music.flags)
.print "speed="+toBinaryString(music.speed)
.print "startpage="+music.startpage
.print "pagelength="+music.pagelength

; Place SID data into output
.pc = music.location "Music"
.fill music.size, music.getData(i)

; Startup and IRQ setup
BasicUpstart2(start)
start:
    lda #$00
    sta $d020
    sta $d021
    lda #music.startSong-1
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

```text
SID Data
--------
location=$1000
init=$1d70
play=$1003
songs=1.0
startSong=1.0
size=$d78
name=Nightshift
author=Ari Yliaho (Agemixer)
copyright=2001 Scallop
header=PSID
version=2.0
flags=100100
speed=0
startpage=0.0
```

```asm
; HVSC path shortening example:
; If you use the –libdir option to point to your HVSC main directory, you can drop the full path:
.var music = LoadSid("Tel_Jeroen/Closing_In.sid")
```

```asm
; LoadPicture / graphic conversion examples

*=$2000
.var logo = LoadPicture("CML_32x8.gif")
.fill $800, logo.getSinglecolorByte((i>>3)&$1f, (i&7) | (i>>8)<<3)

*=$2800 "Logo"
.var picture = LoadPicture("Picture_16x16.gif",
  List().add($444444, $6c6c6c, $959595, $000000))
.fill $800, picture.getMulticolorByte(i>>7, i&$7f)
```

## Key Registers

- **$0314/$0315**: IRQ vector
- **$d012**: Raster line register
- **$d019**: VIC-II interrupt flag register
- **$d01a**: VIC-II interrupt enable register
- **$dc0d/$dd0d**: CIA interrupt control registers

## References

- [Kick Assembler Manual: An Example Interrupt](https://www.theweb.dk/KickAssembler/webhelp/content/ch02s02.html)
- [Kick Assembler Manual: Functions and Macros](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_FunctionsAndMacros.html)
- [Kick Assembler Manual: Data Structures](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_DataStructures.html)
- [Kick Assembler Manual: Value Types](https://www.theweb.dk/KickAssembler/webhelp/content/apas05.html)
- [Kick Assembler Manual: Assembler Directives](https://www.theweb.dk/KickAssembler/webhelp/content/apas04.html)
- [Kick Assembler Manual: Introducing the Script Language](https://www.theweb.dk/KickAssembler/webhelp/content/ch04s02.html)
- [Kick Assembler Manual: Quick Reference](https://www.theweb.dk/KickAssembler/webhelp/content/index.html)
- [Kick Assembler Manual: Configuring the Assembler](https://www.theweb.dk/KickAssembler/webhelp/content/ch02s03.html)
- [Kick Assembler Manual: Introduction](https://www.theweb.dk/KickAssembler/webhelp/content/cpt_Introduction.html)
- [Kick Assembler Manual: Preprocessor](https://www.theweb.dk/KickAssembler/webhelp/content/ch08.html)
- [Kick Assembler Manual: Scopes and Namespaces](https://www.theweb.dk/KickAssembler/webhelp/content/ch09.html)
- [Kick Assembler Manual: Getting Started](https://www.theweb.dk/KickAssembler/webhelp/content/ch02.html)
- [Kick Assembler Manual: Basic Assembler Functionality](https://www.theweb.dk/KickAssembler/webhelp/content/ch03.html)
- [Kick Assembler Manual: Branching and Looping](https://www.theweb.dk/KickAssembler/webhelp/content/ch05.html)
- [Kick Assembler Manual