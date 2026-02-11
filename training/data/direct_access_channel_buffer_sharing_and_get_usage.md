# Direct-access channels and GET# buffer retrieval

**Summary:** Direct-access data channels (OPEN ... buffer#) cannot share the same DOS buffer — attempting to do so returns a NO CHANNEL error (70). After a memory-read (M-R) command use GET# on the command channel to fetch the selected buffer; fetched bytes must be compared to "" and converted to CHR$(0) when necessary.

## Description
- Two or more direct-access data channels may not open to the same DOS buffer area. If a program attempts to OPEN a direct-access data channel specifying a buffer already in use, the DOS will return NO CHANNEL (error 70).
- The GET# command is used after issuing a memory-read (M-R) command to retrieve the contents of the buffer selected by the M-R. Note that the bytes are fetched over the command channel (the channel used to send the M-R to the device), not over the logical file number used in the OPEN file#,device#,channel#,buffer# statement.
- Bytes returned by GET# must be tested for equality with the empty string ""; when a zero-byte is represented as "", convert it to CHR$(0) if the program logic requires an actual zero character value.

## References
- "selecting_dos_buffer_open_syntax_and_buffer_table" — buffer selection with OPEN and its effect on GET# retrieval  
- "indexed_memory_read_example_code" — example program showing GET# usage to pull a buffer to the C64 side
