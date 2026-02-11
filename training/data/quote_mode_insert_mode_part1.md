# COMMODORE 64 - Insert Mode (part 1)

**Summary:** Describes how spaces created by the INST/DEL key share characteristics with quote mode on the C64: cursor and color control codes appear as reversed characters; INST and DEL behave differently (INST performs normal insertion; DEL can produce a special character in quote-mode spaces). Provides examples demonstrating DEL and INST interactions, and includes a warning about editing lines containing these special characters.

**Insert Mode**

Spaces produced by pressing the INST/DEL key behave similarly to quote mode: control codes for the cursor and for color changes display as reversed characters when they occur inside those spaces. This means visual indicators (cursor-control and color-control bytes) inside insert-mode spaces will appear reversed, just as they do in quote mode.

The key behavioral difference compared with ordinary quote mode concerns the INST and DEL keys themselves:
- INST (insert) still performs its normal insertion function even when used inside these insert-mode/quote-like spaces.
- DEL (delete) does not always act identically to normal deletion when used in these spaces; it may create or reveal a special character when used in quote-mode-style insert spaces.

This behavior allows for the creation of PRINT statements containing DELETE characters, which isn't possible in standard quote mode. For example:


When the above line is listed, it appears as:


Running this program will display "HELP" because the DELETE characters remove the "LO" before the "P" is printed. This technique can be used to "hide" parts of a line of text. However, editing lines containing these special characters can be difficult, as the DELETE characters affect both the LIST and PRINT outputs, making modifications challenging. ([devili.iki.fi](https://www.devili.iki.fi/Computers/Commodore/C64/Programmers_Reference/Chapter_2/page_096.html?utm_source=openai))

## Source Code

```basic
10 PRINT"HELLO"<DEL><INST><INST><DEL><DEL>P"
```

```basic
10 PRINT"HELP"
```


## References

- "quote_mode_color_controls_list_and_example" — expands on color and cursor control codes appearing reversed inside insert-mode/quote-mode spaces
- "quote_mode_insert_mode_part2_and_warning" — contains continued behavior, DEL/INST examples, and the warning about editing lines containing these characters