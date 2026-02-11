# The Revenge of the Phoenix (Listing C-23) — Introduction

**Summary:** Includes load/run instructions for the example arcade-style game "Revenge of the Phoenix" (Listing C-23). Searchable terms: LOAD "PHOENIX V1.4N",8,1; SYS 32768; demo/intro mode; joystick selection; fire button.

**Description**

This chunk is the introductory text for the example game "Revenge of the Phoenix" (Listing C-23 in Appendix C). It states that the program demonstrates many C64 techniques covered in the book and gives the exact commands to load and start the program:

- To load: `LOAD "PHOENIX V1.4N",8,1`
- To start: `SYS 32768`

Behavior described:

- On start, the program enters an introduction/demo mode that will play automatically and eventually return to the intro.
- The demo/intro can be interrupted at any time by pressing one of the fire buttons.
- The game supports one- and two-player modes; the player selects the mode on the title page by moving the arrow with the joystick and pointing at the on-screen character that represents the desired mode. By pointing at the character that represents the mode that you wish to play and pressing the fire button, you can select between one-player and two-player modes.

This text identifies the listing (C-23) as a full example demonstrating many techniques from the book; the full source and extended gameplay/scoring details are referenced separately.

## References

- "phoenix_gameplay_mechanics" — expands on gameplay mechanics and objectives for Phoenix
- "phoenix_scoring_table" — expands on scoring specifics for Phoenix
