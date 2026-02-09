# Chapter 10 — Some Arcade Games

**Summary:** Examines how popular arcade games (e.g. PAC-MAN, DONKEY-KONG) can be implemented on the Commodore 64; focuses on programming techniques, constraints, and differences caused by arcade machines' specialized hardware.

## Overview
This chapter surveys selected popular arcade titles to illustrate programming techniques and constraint-driven design choices when porting or re-creating arcade games on the Commodore 64. The descriptions show ways these games could be implemented on the C64 and may in some cases closely mirror how the originals were built. Readers should note that many arcade machines use specialized graphics and sound hardware not present in the C64, so reproductions typically require algorithmic or resource-trading approximations rather than one-to-one hardware mapping.

## Scope
- Purpose: learn practical techniques (sprite handling, tile maps, collision strategies, memory layout and timing compromises) by studying concrete arcade examples.
- Not covered here: full listings or step-by-step ports — see referenced chunks for expanded implementations of specific games.
- Caveat: Expect tradeoffs in graphics fidelity, input handling, and sound due to hardware differences between arcade boards and the VIC-II/SID-based C64.

## References
- "pac_man_overview_implementation" — expanded discussion and implementation strategies for PAC-MAN on the C64  
- "donkey_kong_translation" — expanded discussion and implementation strategies for DONKEY-KONG on the C64