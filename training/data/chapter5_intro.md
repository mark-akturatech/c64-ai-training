# 5.1 Introduction to Direct-Access Programming

**Summary:** Describes C64 DOS direct-access commands and their role in low-level disk utilities; searchable terms include direct-access commands, BAM, directory, track/sector, scratch recovery, duplicate disk. Explains these commands enable maintenance utilities beyond housekeeping commands (NEW, SCRATCH, VALIDATE) and are prerequisites for later routines.

## Overview
Direct-access commands are DOS operations that let a program read, write, and manipulate disk structures at the block/sector level (beyond simple file-level housekeeping). They are not commonly used in typical application code but are essential for writing disk utilities that perform low-level maintenance, recovery, inspection, and copying tasks. A basic understanding of these commands is required to implement and use the routines described later.

Common utilities and operations made possible by direct-access programming include:
- Change a disk name or cosmetic ID
- Display a block availability map (the BAM)
- Display a directory
- Display a track and sector
- Chain through a directory entry
- Edit a track and sector
- Recover an inadvertently scratched file
- Recover a damaged diskette
- Duplicate a diskette
- Copy a file
- Catalog a disk library

## References
- "direct_access_command_list" — expands on list of direct-access commands and short descriptions
