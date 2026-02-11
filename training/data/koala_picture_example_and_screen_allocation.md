# Kick Assembler: LoadBinary with Koala / FLI / Doodle formats and LoadSid examples

**Summary:** Examples and format notes for Kick Assembler's `LoadBinary()` with `KOALA_TEMPLATE`, `BF_KOALA`, `BF_FLI`, `BF_DOODLE` constants; shows `BasicUpstart` usage, reserving/reallocating destination blocks with `*=` and `.fill`, and copying picture bytes via `picture.getScreenRamSize()`, `picture.getScreenRam(i)` (and analogous getters). Also notes `LoadSid()` usage to import HVSC SID files and extract init/play addresses.

**LoadBinary and Koala-format pictures**

Kick Assembler can import binary picture formats using `LoadBinary(filename, FORMAT_CONSTANT)`. For the Koala format, the format layout (order of stored data) is:

- Bitmap, ScreenRam, ColorRam, BackgroundColor

You can call:

The returned value represents the loaded file and exposes functions to query sizes and fetch individual bytes. The available methods are:

- `getBitmapSize()`: Returns the size of the bitmap data.
- `getBitmap(i)`: Returns the byte at index `i` from the bitmap data.
- `getScreenRamSize()`: Returns the size of the screen RAM data.
- `getScreenRam(i)`: Returns the byte at index `i` from the screen RAM data.
- `getColorRamSize()`: Returns the size of the color RAM data.
- `getColorRam(i)`: Returns the byte at index `i` from the color RAM data.
- `getBackgroundColor()`: Returns the background color byte.

Use `BasicUpstart` to create a BASIC loader stub if you need a BASIC-started program.

Tip: you can print the numeric value of format constants at assemble time:

Note: Timanthes-produced Koala files do not store the background color; attempting to import a Timanthes Koala with an importer that expects `BackgroundColor` may produce an overflow/error. To handle this, you can check if the `getBackgroundColor()` method exists and provide a default value if it doesn't:

**Other supported binary picture formats**

The import constants and their internal ordering are:

- `BF_FLI` (Blackmail's FLI editor) — ColorRam, ScreenRam, Bitmap
- `BF_DOODLE` (Doodle) — ColorRam, Bitmap

The formats were chosen to cover common editors/outputs (Timanthes, Blackmail FLI, Doodle). For format constants and other binary-file constants, see the referenced constants documentation.

**Importing SID files**

Kick Assembler knows SID file structure and provides `LoadSid(path)`, which returns an object representing the SID file. Example:

From the returned SID value, you can extract metadata and runtime info (init address, play address, song info, raw song data). The `SIDFileValue` properties are:

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
- `startpage`: Startpage (consult the SID format for details).
- `pagelength`: Pagelength (consult the SID format for details).
- `size`: The data size in bytes.
- `getData(n)`: Returns the `n`'th byte of the module. Use this function together with the `size` variable to store the module's binary data into memory.

**Reallocation and copying strategy**

The original examples demonstrate two common tasks when placing imported picture data into C64 memory with Kick Assembler:

- Reserve or reallocate destination storage using the `*=` operator together with `.fill` to size an existing label/area to the number of bytes required by the imported file.
- Copy individual bytes out of the loaded object using getters like `picture.getScreenRam(i)`, `picture.getColorRam(i)`, `picture.getBitmap(i)` and writing them into the destination (using `.byte`, `.db` or `.fill` loops).

The `*=` operator sets the program counter to a new value, effectively reallocating memory. When used with `.fill`, it reserves a block of memory of the specified size. For example:

This sets the program counter to `$2000` and reserves 1024 bytes, initializing them to 0. If the memory at `$2000` already contains data, it will be overwritten. Ensure that the new allocation does not overlap with existing code or data to prevent unintended side effects.

The Source Code block below contains an assembled example combining these ideas.

## Source Code

```asm
.var picture = LoadBinary("picture.prg", KOALA_TEMPLATE)
```

```asm
.print "Koala format=" + BF_KOALA
```

```asm
.var bgColor = picture.getBackgroundColor ? picture.getBackgroundColor() : DEFAULT_BG_COLOR
```

```asm
.var music = LoadSid("C:/c64/HVSC_44-all-of-them/C64Music/Tel_Jeroen/Closing_In.sid")
```

```asm
*=$2000
.fill 1024, 0
```

```asm
; Kick Assembler example: load a Koala picture and place it into reserved areas
; (fragments adapted from original examples)

; load Koala-format picture into an assembler value
.var picture = LoadBinary("picture.prg", KOALA_TEMPLATE)

; create a BASIC upstart stub (Kick macro)
BasicUpstart(usr)      ; (assumes BasicUpstart macro is available in your include files)

; --- reserve / reallocate destination blocks ---
; Use *= together with .fill to size existing labels/areas to the required byte counts
screenData *= .fill picture.getScreenRamSize()
colorData  *= .fill picture.getColorRamSize()
bitmapData *= .fill picture.getBitmapSize()

; --- copy bytes from the imported picture into these blocks ---
; The imported value exposes getters like getScreenRam(i), getColorRam(i), getBitmap(i)
.for i = 0; i < picture.getScreenRamSize(); i++
    .byte picture.getScreenRam(i)
.endfor

.for i = 0; i < picture.getColorRamSize(); i++
    .byte picture.getColorRam(i)
.endfor

.for i = 0; i < picture.getBitmapSize(); i++
    .byte picture.getBitmap(i)
.endfor

; You can also emit the background color if present:
; .byte picture.getBackgroundColor()   ; if the format provides it
```

```text
; Example: other formats (informational)
; BF_KOALA  -> Bitmap,ScreenRam,ColorRam,BackgroundColor
; BF_FLI    -> ColorRam,ScreenRam,Bitmap
; BF_DOODLE -> ColorRam,Bitmap
```

## References

- "binary_file_constants" — expands on use constants for formats like BF_KOALA
- (Original source excerpt) — Koala/BF_FLI/BF_DOODLE examples and LoadSid mention
