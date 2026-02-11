# PET / CBM ROM & Model Variants

**Summary:** Identification and behavioral differences between PET/CBM ROM families: Original ROM ("*** COMMODORE BASIC ***"), Upgrade ROM ("### COMMODORE BASIC ###") with garbage-collection pauses, and PET/CBM 4.0 ("*** COMMODORE BASIC 4.0 ***") introducing disk commands and removing garbage-collection delays; notes on 80-column, "fat 40", 8096 and SuperPET memory/bank-switching and 6809 co-processor.

## Machine variants and identification
- Original ROM: Power-up banner contains the string "*** COMMODORE BASIC ***". (This is the earliest PET/CBM ROM text.)
- Upgrade ROM: Power-up banner contains the string "### COMMODORE BASIC ###" (uses the number sign/octothorpe). Internal structure is cleaner and more like later 4.0 machines; zero page and overall architecture similar to PET/CBM 4.0, but it lacks the convenience disk commands introduced in 4.0.
  - Disk handling: Upgrade ROM machines do not include specialized BASIC disk commands such as CATALOG, SCRATCH, or DLOAD; these are convenience commands only — functionally the Upgrade ROM unit can perform equivalent disk operations by other means.
  - Garbage collection: Upgrade ROM implements automatic string-variable garbage collection; when triggered the machine will "freeze" for a period that can range from a few seconds up to half an hour or more (intermittent long pauses while collecting).
- PET/CBM 4.0 ROM (including 80-column and later 40-column "fat 40"): Power-up banner contains the string "*** COMMODORE BASIC 4.0 ***" (note the numeric version in the message).
  - New BASIC disk commands (e.g., CATALOG) are present.
  - Garbage-collection pauses are eliminated.
  - Later 80-column and updated 40-column machines added screen/keyboard features; most noticeable is automatic repeat on cursor movement keys.

## Memory-expanded models
- CBM 8096: Shipped with 96K RAM; the extra 64K is bank-switched into the address space as needed in 16K blocks.
- SuperPET: Includes an extra 64K RAM bank-switched in 4K blocks, and an additional Motorola 6809 microprocessor used primarily to implement high-level languages. Both 8096 and SuperPET can operate as conventional CBM 8032 systems with the extra memory ignored.

## Source Code
```text
Power-up banners / identification strings:

Original ROM:
*** COMMODORE BASIC ***

Upgrade ROM:
### COMMODORE BASIC ###

PET/CBM 4.0:
*** COMMODORE BASIC 4.0 ***
```

## References
- "pet_4_0_and_80column" — Details about 4.0 ROM and 80-column models
