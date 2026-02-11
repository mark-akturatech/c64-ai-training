# Text Editors and Scroll Text Writers

**Summary:** Text editors and scroll text writers for C-64 demos are tools to create and edit on-screen text and scroll texts; some editors let you set custom page sizes to support non-standard fonts or partial-screen displays.

## Text Editors and Scroll Text Writers
Text editors: tools used to edit the text that appears in demos (menu text, static captions, scroll buffers). Many editors allow configuring the page size (the text buffer dimensions — columns × rows) so the same text data can be prepared for non-standard font heights/widths or for rendering in only a portion of the screen.

Page size support is useful when:
- Using custom fonts whose character cell sizes differ from the standard PETSCII grid.
- Displaying text in a sub-region of the screen (partial-screen displays) so buffers and line lengths match the visible area.
- Preparing multi-page text where each page is a fixed buffer size.

Scroll text writers: specialized editors for producing scrolling text (scrollers). They are functionally similar to text editors but often provide features tailored to scrollers (linearizing text into a continuous buffer, handling line-wrapping for the scroller width, or exporting in scroller-friendly formats). These tools prepare text data suitable for the scroller routine to read and render.

## References
- "text_scroller_implementation" — expands on preparing text data for scrollers