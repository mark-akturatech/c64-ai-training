# Interesting Effects — Intro to Demo Effects

**Summary:** This section outlines various Commodore 64 demo techniques, progressing from basic to advanced levels: text scrollers, raster bars, border opening (including side-border), sprite multiplexing, FLI/AFLI/IFLI picture formats, plasmas, bump mapping, and simple 3D effects. Key concepts include VIC-II raster timing and the raster counter at $D012.

**Overview**

This node catalogs example demo effects the author recommends programmers try, ordered from simpler to harder. The intent is inspirational rather than tutorial: the section names the effects and suggests the reader implement them from the basics already covered. Many of these effects rely on precise VIC-II raster timing (raster counter $D012) and cycle-exact code.

The list is intended as a progression:

- **Simple text scrollers and raster bars**: Entry-level effects using character graphics and raster interrupts.
- **Border opening (including side border open)**: Requires careful raster timing and sprite/character tricks to draw into the border area.
- **Sprite multiplexing**: Reusing sprite hardware multiple times per frame by changing sprite registers during raster lines.
- **FLI / AFLI / IFLI**: High-color bitmap picture formats (hardware and software techniques to increase on-screen color resolution).
- **Advanced visuals (plasmas, bump mapping, simple 3D)**: Algorithmic effects that combine math routines with cycle-timed display updates.

The author deliberately omits full source code for these effects, encouraging readers to implement them themselves and to consult magazines and reference documents mentioned for working examples.

## Key Registers

- **$D012**: Raster counter; used to synchronize effects with the screen drawing process.
- **$D016**: Horizontal fine scroll and control register; manipulation allows for side border effects.
- **$D021**: Background color register; changing this during raster interrupts creates raster bars.

## References

- **Commodore Hacking (early issues)**: Contains example source code and expanded articles on demo effects.
- **Coders World (all three issues)**: Provides tutorials and examples on various demo coding techniques.
- **"An Introduction to Programming C-64 Demos" by Linus Åkerlund**: Offers detailed explanations and examples of demo effects.
- **"C= Hacking"**: A magazine with in-depth articles on C64 programming and demo effects.
- **"Coders World"**: A disk magazine featuring tutorials and code examples for demo programming.

For further reading and examples, consult the above references, which provide in-depth discussions and code samples for these effects.

## Labels
- D012
- D016
- D021
