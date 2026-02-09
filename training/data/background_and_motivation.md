# Sprite Multiplexing — Introduction and Background (Cadaver / Lasse Oorni)

**Summary:** Motivation and context for sprite multiplexing on the C64: techniques to display more than 8 hardware sprites (free placement, any colors/frames) as used in games like Green Beret, Ghosts'n Goblins, and Midnight Resistance; author reverse-engineered sprite sorting/multiplexing routines and found a simple bubble sort too slow, motivating faster scheduling/sorting algorithms.

## Background
Full sprite multiplexing (re-using the VIC-II's 8 hardware sprites to display many more objects) enables "free" usage of over 8 sprites anywhere on the screen with any colors and frames, as demonstrated in titles such as Green Beret, Ghosts'n Goblins, and Midnight Resistance. Magazine coverage typically treats only basic sprite reuse or the simpler "zone split" technique.

The author (Cadaver / Lasse Oorni) resumed C64 development using cross-development tools and required more-than-8-sprite capability for a prospective game. Public documentation was scarce; programmer diaries (e.g., Andrew Braybrook's Morpheus diary) provided only cryptic hints. To understand practical implementations, the author reverse-engineered sprite sorting and multiplexing routines from existing games.

Initial attempts used a bubble sort for sprite scheduling/assignment, but it proved too slow for the needed per-frame multiplexing performance, prompting investigation of faster sorting/assignment methods used in released games.

## References
- "zone_split_technique" — simple multiplexing method (zone split)
- "continuous_insertion_sort_ocean_algorithm" — faster sorting algorithms used in games