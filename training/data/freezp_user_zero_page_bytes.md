# FREEZP ($FB-$FE) — Four free zero-page bytes reserved for user programs

**Summary:** $FB-$FE (decimal 251–254) are four zero-page bytes labeled FREEZP reserved for user machine-language routines; BASIC is guaranteed not to alter these locations, making them safe for zero-page addressing use.

## Description
Locations $FB–$FE (251–254) in the zero page are explicitly set aside as FREEZP: four free bytes intended for user-written machine-language routines that require zero-page addressing. While other zero-page locations may be used on a non-interference basis, BASIC does not alter $FB–$FE and therefore those four bytes are safe for storing state, pointers, or small routines that depend on stable zero-page storage.

## Key Registers
- $FB-$FE - Zero Page - FREEZP: four bytes reserved for user ML routines; BASIC guaranteed not to alter

## References
- "lstx_last_key_matrix_coordinate" — expands on example of zero-page use in OS keyboard/state handling

## Labels
- FREEZP
