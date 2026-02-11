# Getting Out of Trouble — Unscratching a File

**Summary:** Describes C64 file recovery for a scratched file: a scratched directory entry has its file-type byte set to $00 and its sectors freed in the BAM; recovery requires restoring the file-type byte and VALIDATING the disk. Uses VIRTUAL DIRECTORY and EDIT TRACK & SECTOR utilities; directory entries are shown in groups of eight that map to sectors on track 18.

**Unscratching a File**
When a file is scratched on a CBM (Commodore) diskette, two things occur:
- The file-type byte in the directory entry is set to $00.
- The sectors used by the file are marked free in the BAM.

To recover (unscratch) the file:
1. Restore the directory entry’s file-type byte to its original value.
2. VALIDATE the disk so the DOS will re-allocate the sectors listed in the file’s chain.

The supplied utilities VIRTUAL DIRECTORY and EDIT TRACK & SECTOR (listed in Appendix C of the original source) are used to locate the scratched directory entry and edit its byte directly.

Step 1 — locating the directory entry with VIRTUAL DIRECTORY:
- Run VIRTUAL DIRECTORY on the disk. The directory is displayed in groups of eight entries; scratched entries are shown in reverse video.
- Each group corresponds to one directory sector on track 18. Count groups to determine which sector contains the scratched entry.
- Also note whether the entry is in the first half (one of the first four entries) or the last half (one of the last four entries) of that group/sector — this identifies which quarter of the sector holds the directory slot.
- Use the Group → Track 18 sector mapping (below, in Source Code) to determine the sector number to edit with EDIT TRACK & SECTOR.

Step 2 — editing the file-type byte with EDIT TRACK & SECTOR:
- Load EDIT TRACK & SECTOR and navigate to the identified sector on track 18.
- Each directory entry is 32 bytes long. The file-type byte is the third byte (offset $02) in each entry.
- Calculate the byte offset within the sector:
  - For the first entry: $02
  - For the second entry: $22
  - For the third entry: $42
  - For the fourth entry: $62
  - For the fifth entry: $82
  - For the sixth entry: $A2
  - For the seventh entry: $C2
  - For the eighth entry: $E2
- Navigate to the appropriate offset and change the file-type byte from $00 to its original value (e.g., $82 for a PRG file).
- Save the changes and exit the editor.

Step 3 — validating the disk:
- Use the DOS VALIDATE command to update the BAM and re-allocate the sectors used by the file:
- After validation, the file should be accessible again.

## Source Code

  ```
  OPEN 15,8,15,"V":CLOSE 15
  ```

```text
Group  -  Sector

1    18,1
2    18,4
3    18,7
4    18,10
5    18,13
6    18,16

7    18,2
8    18,5
9    18,8
10   18,11
11   18,14
12   18,17

13   18,3
14   18,6
15   18,9
16   18,12
17   18,15
18   18,18
```

## References
- "copy_file_machine_code_listing" — expands on the machine-code examples referenced earlier in the manual.
- "copy_file_source_annotation_and_conclusion" — expands on the concluding remarks that directly precede this chapter.