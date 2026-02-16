# C64 / 6502 Development Project

## Environment
- **Target**: Commodore 64
- **CPU**: MOS 6502
- **Assembler**: KickAssembler v5.25 (`kickass`)
- **Compile**: `kickass filename.asm` produces `.prg` files

## Knowledge Base (Qdrant)
**IMPORTANT**: Before writing any C64 code, ALWAYS query the Qdrant knowledge base first:

1. List available collections: `mcp__qdrant-local__list_collections()`
2. Search each relevant collection: `mcp__qdrant-local__semantic_search(collection="<name>", query="...", limit=8)`

Collections contain comprehensive 6502/C64 documentation:
- Complete 6502 instruction set with all addressing modes
- Full C64 memory map ($0000-$FFFF)
- Commented ROM disassembly (BASIC, KERNAL)
- VIC-II graphics chip registers and usage
- SID sound chip programming (3 voices, filters, envelopes)
- KickAssembler manual (macros, directives, syntax)
- Programmer's Reference Guide
- Sprite, character, and bitmap graphics

Query examples:
- "custom character set VIC-II $D018" for character graphics
- "sprite registers VIC-II collision" for sprite programming
- "SID envelope attack decay" for sound programming

## Key Memory Locations
- Screen RAM: $0400
- Color RAM: $D800
- VIC-II: $D000-$D3FF
- SID: $D400-$D7FF
- KERNAL ROM: $E000-$FFFF
- BASIC ROM: $A000-$BFFF

## Code Style
- Use KickAssembler syntax (`.const`, `!label+`, `BasicUpstart2()`)
- Zero page ($00-$FF) for frequently accessed variables
- Comment VIC/SID register usage
- When writing code with no filename specified, save to `test/` directory

## Git Safety
- **NEVER** run `git revert`, `git checkout .`, `git restore`, `git reset`, `git stash`, or any destructive git command
- There are often many uncommitted changes in progress — destructive git operations risk losing work

## Plans
- Always save implementation plans to `plans/` directory
