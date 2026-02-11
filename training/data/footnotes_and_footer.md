# Footnotes — An Introduction to Programming C-64 Demos

**Summary:** Footnotes covering pointer anecdotes, assembler-neutral code and monitor usage (labels, "* = $1000"), Turbo Assembler RESTORE caveat, size calculations ($03E8 bytes, $10, 8 sprite pointers), PAL vs NTSC refresh rates and raster behavior ($D012, VIC-II), VIC 14-bit addressing, bitmap-layout note (comparison to VGA mode X), and a 6502 branch cycle-count detail (last branch 11 cycles).

## Footnotes
1. Dangerous (pointer anecdote)
A couple of guys, who weren't all that good at C, were writing a toy operating system. They got all sorts of bugs and weird crashes, and didn't know what to do. After a while they came up with a solution: to re-write the whole kernel without using any pointers at all. Don't ask me how they did it, but they did get it to work. Morale of the story: code some C-64 demos, and you'll never run into problems like that. :-)

2. Assembler neutrality
This code should be pretty assembler neutral, i.e. you can use whichever assembler you want. You can't type this stuff into a monitor, though, as it uses labels. If you're going to use a monitor, you have to change the JMP instructions into jumps to absolute addresses, i.e. change JMP loop into JMP $1000. You also need to remove the line * = $1000, which just means that the code should begin at the address $1000.

3. Program placement / Tools
See the Tools section on how to do that.

4. Size clarification
Actually, if you do your math, you'll realize that it's only $03E8 bytes long. Then follows $10 bytes that you can use for whatever you want, and 8 bytes that are the sprite pointers.

5. Turbo Assembler RESTORE caveat
This doesn't work in all versions of Turbo Assembler. If your version doesn't support this, you can add some code to do it for you.

6. PAL vs NTSC refresh rates
On PAL systems, that is, on NTSC systems the screen is redrawn 60 times per second.

7. VIC addressing width
Why 14 bits? Because the VIC can only address 16 kB of memory, which is what you get with a 14 bit address space.

8. Bitmap layout note
Not as weird as mode X on VGA cards, though.

9. Cycle counting detail
Except the last one, which will only take 11 cycles, as the branch isn't performed.

## Key Registers
- $D012 - VIC-II - Raster register (affects raster line counts and PAL/NTSC timing)

## References
- "d012_raster_register" — expands on the PAL vs NTSC refresh rates and raster line counts referenced in footnote 6
- "bitmap_screen_layout" — expands on the bitmap layout note referenced in footnote 8
- "2004-07-24" — document timestamp (final footer)