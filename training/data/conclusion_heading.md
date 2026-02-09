# Sprite Multiplexing Techniques — Conclusion (Cadaver / Lasse Oorni)

**Summary:** This chunk presents the concluding section of "Sprite Multiplexing Techniques" by Cadaver (Lasse Öörni), summarizing key insights and providing recommendations for further study. It also includes references to example multiplexer sources and game source archives for practical implementation.

**Conclusion**

To see actual whole multiplexers written in ASM, I recommend the following:

- **An example general multiplexer**: This implementation utilizes the "Ocean" sorting method and includes handling for the $d010 register.

In the following games, the source code files concerning sprite multiplexing are `sprite.s` and `raster.s`:

- **Metal Warrior 3 source code**: Features double buffering, an inaccurate "Y divided by 8" sorting method, and precalculation of raster interrupts.

- **The Freedirectional Scrolling test program**: Incorporates double buffering and radix sorting of Y-coordinates.

- **BOFH source code**: Includes double buffering, radix sorting of Y-coordinates, and a priority mechanism to ensure standing characters display over bodies and items.

Additionally, you can try reverse-engineering your favorite game that you know uses more than 8 sprites. In a machine language monitor, you can search for bytes `$01 $d0` (writes to the first sprite's Y coordinates) or other sprite registers, or examine the code at the IRQ address, where multiplexing code is usually nearby.

When you look at the indexed accesses made in the sprite display interrupt code, you'll often notice one memory access whose result doesn't go into any sprite I/O register but is used as an index (either in the X or Y register) for accesses into other sprite arrays. This is likely the sprite order array, and by examining memory references to it, you'll find the sort routine.

Good luck in your multiplexer experiments! Remember, when you get your multiplexer running, stress-test it with abnormal amounts of sprites.

Lasse Öörni - loorni@student.oulu.fi

## References

- "conclusion_bibliography_ignored" — expands on lists: example multiplexer sources and game source archives.