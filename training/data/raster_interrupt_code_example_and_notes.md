# Sprite multiplexing raster interrupt (Ocean-style example)

**Summary:** Example VIC-II raster interrupt code for sprite multiplexing that writes sprite registers ($D000, $D001, $D010, $D027) from tables, manipulates $D010 MSB via OR/AND tables (ortbl/andtbl), and shows common inefficiencies (double-writing frame pointers to $C3F8/$C7F8, multiplying X by 2 with ASL losing 1-pixel accuracy).

## The raster interrupt code
This code is a compact but inefficient example typical of some Ocean games. It takes a "virtual" sprite number in Y, derives the physical sprite (TYA / AND #$07), and uses table lookups to write the VIC-II sprite registers and sprite pointer/frame entries:

- Converts the virtual sprite number in Y into a physical sprite index with TYA / AND #$07 and moves it to X.
- Uses the physical sprite index (unmultiplied) to fetch a sortsprc (sprite color/pointer?) and writes it to $D027,X (sprite pointer/personal register area in VIC space).
- Fetches a frame/pointer byte from sortsprf,Y and writes it to two memory locations ($C3F8,X and $C7F8,X) — this duplicates the write to both double-buffer screens (unnecessary).
- Converts the physical sprite index into an index suitable for accessing interleaved sprite X/Y registers by shifting X left (ASL) to multiply by two. This loses 1-pixel horizontal accuracy because sprite X low byte is multiplied by 2.
- Writes sprite Y and (shifted) sprite X values into $D001,X and $D000,X respectively (VIC-II interleaved X/Y register block).
- Updates $D010 (the high-X/MSB and control register) using lookup tables ortbl/andtbl: tests the ASL's carry (BCC msb_low), and either ORs in the MSB bit or ANDs a mask to clear it, selecting the MSB for the current physical sprite.
- Increments Y (the virtual sprite index) and continues.

Key inefficiencies noted in the source:
- Writing frame pointers to both $C3F8 and $C7F8 (double-buffer frames) — redundant.
- Using the ASL/TAX multiply-by-2 approach for X index — loses 1-pixel accuracy.
- Per-sprite code could be faster than generic loop (the source hints at per-physical-sprite routines and precalculating $D010 values).
- $D010 reads/writes per-sprite are expensive; precalculation or per-sprite direct writes reduce overhead.

The included ortbl/andtbl tables contain byte masks for setting/clearing the $D010 bits corresponding to each sprite's X MSB (bitwise OR masks and AND masks).

## Source Code
```asm
                tya
                and #$07                    ;Get physical spritenum
                tax                         ;to X
                lda sortsprc,y
                sta $d027,x
                lda sortsprf,y
                sta $c3f8,x                 ;Write frame to both screens of the
                sta $c7f8,x                 ;doublebuffered screen (unnecessary!)
                txa
                asl
                tax
                lda sortspry,y
                sta $d001,x
                lda sortsprx,y              ;Multiply sprite X-coord by 2; does
                asl                         ;not allow 1-pixel accuracy
                sta $d000,x
                bcc msb_low
msb_high:       lda $d010
                ora ortbl,x
                sta $d010
                jmp nextsprite
msb_low:        lda $d010
                and andtbl,x
                sta $d010
nextsprite:     iny
                ...

ortbl:          dc.b 1
andtbl:         dc.b 255-1
                dc.b 2
                dc.b 255-2
                dc.b 4
                dc.b 255-4
                dc.b 8
                dc.b 255-8
                dc.b 16
                dc.b 255-16
                dc.b 32
                dc.b 255-32
                dc.b 64
                dc.b 255-64
                dc.b 128
                dc.b 255-128
```

## Key Registers
- $D000-$D02E - VIC-II - Sprite X/Y interleaved registers, sprite enable/MSB/control bits, sprite pointer area (used here: $D000/$D001 per-sprite X/Y low bytes, $D010 MSB/control, $D027 sprite pointer writes)

## References
- "raster_interrupt_optimizations_and_unrolled_code" — faster unrolled code variants and per-sprite routines
- "eliminating_flicker_in_raster_interrupts" — discussion of flicker caused by late/overlapping raster IRQs and handling techniques