# Kick Assembler: List() values (List, get/set, add, size, remove, shuffle, reverse, sort, addAll)

**Summary:** List() and List(n) create mutable list values (List is mutable) usable with get/set, add, addAll, size, remove, shuffle, reverse, and sort (numeric only); list elements can be accessed in data directives (e.g. .byte myList.get(0), .text myList.get(1)).

## Usage
List values hold ordered elements. Create a list with List(n) to allocate n elements (indexes start at 0) or List() for an empty list. Use get(n) to retrieve and set(n,value) to set an element. add(...) appends one or more values; addAll(otherList) appends all elements from another list. size() returns the element count and can be used directly in data directives or expressions. remove(n) deletes the element at index n. shuffle() randomizes element order, reverse() reverses it, and sort() sorts numerically (only numeric values supported).

Indexing: first element is index 0. add accepts multiple arguments. sort only supports numeric elements — attempting to sort mixed or non-numeric lists will not perform a meaningful numeric sort.

## Source Code
```asm
; Create a fixed-size list and set elements
.var myList = List(2)
.eval myList.set(0,25)
.eval myList.set(1, "Hello world")
.byte myList.get(0)
; Will emit: .byte 25
.text myList.get(1)
; Will emit: .text "Hello world"

; Create an empty list and add elements
.var greetingsList = List()
.eval greetingsList.add("Fairlight", "Booze Design", "etc.")
.byte listSize = greetingsList.size()
; emits .byte 3

; Compact fill
.var greetingsList = List().add("Fairlight", "Booze Design", "etc.")
```

```text
Table: List value functions
get(n)       - Gets the n'th element (first element starts at zero).
set(n,value) - Sets the n'th element (first element starts at zero).
add(...)     - Add elements to the end of the list (accepts multiple values).
addAll(list) - Add all elements from another list.
size()       - Returns the number of elements in the list.
remove(n)    - Removes the n'th element.
shuffle()    - Randomizes the order of elements.
reverse()    - Reverses the order of elements.
sort()       - Sorts elements numerically (only numeric values supported).
```

## References
- "hashtable_values" — using lists as values inside hashtables
- "working_with_mutable_values" — lists are mutable and require locking for cross-pass usage