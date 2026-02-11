# Hashtable Values (Kick Assembler)

**Summary:** Hashtable() creates a mapping of keys to values with put/get/keys/containsKey/remove operations. put() is chainable (returns the table); get() returns null for missing keys; key equality uses the value's string representation (e.g., ht.get("1.0") and ht.get(1) refer to the same entry). Keys() returns a List value suitable for iteration.

## Description
A Hashtable in Kick Assembler maps arbitrary keys to values. Create one with Hashtable(). Use ht.put(key, value) to add or update entries; put(...) is chainable and also accepts multiple key/value pairs in a single call. Retrieve values with ht.get(key) — missing keys return null. Use ht.keys() to obtain a List of all keys (iterate with List methods). containsKey(key) tests presence and remove(key) deletes the mapping.

Important behavioral detail:
- Keys are compared by the string representation of the value used as the key. Therefore ht.get("1.0") and ht.get(1) are equivalent if the string representations match.
- put(key, value) overwrites an existing mapping for the key.
- put(key,value,key,value,...) lets you initialize multiple mappings in one expression.

## Source Code
```text
.define ht {
    // Define the table
    .var ht = Hashtable()
    // Enter some values (put(key,value))
    .eval ht.put("ram", 64)
    .eval ht.put("bits", 8)
    .eval ht.put(1, "Hello")
    .eval ht.put(2, "World")
    .eval ht.put("directions", List().add("Up","Down","Left","Right"))
    // Brief ways of initialising tables
    .var ht2 = Hashtable().put(1, "Yes").put(2, "No")
    .var ht4 = Hashtable().put(1,"a", 2,"b", 3,"c")
}
// Retrieve the values
.print ht.get(1)
// Prints Hello
.print ht.get(2)
// Prints World
.print "ram = " + ht.get("ram") + "kb"

// Prints ram=64kb

// Print all the keys
.var keys = ht.keys()
.for (var i=0; i<keys.size(); i++) {
    .print keys.get(i)
    // Prints "ram", "bits", 1, 2, directions
}

When a value is used as a key then it is the values string representation that is used. This means that ht.get("1.0")
and ht.get(1) returns the same element. If you try to get an element that isn't present in the table, null is returned.
```

```text
Table 6.3. Hashtable Values
Function                       Description

put(key,value)                 Maps 'key' to 'value'. If the key is previously mapped to
                               a value, the previous mapping is lost. The table itself is
                               returned.

put(key,value,key,value,...)   Maps several keys to several values. The table itself is
                               returned.

get(key)                       Returns the value mapped to 'key'. A null value is returned if no value has been mapped to the key.

keys()                         Returns a list value of all the keys in the table.

containsKey(key)               Returns true if the key is defined in the table, otherwise false.

remove(key)                    Removes the key and its value from the table.
```

## References
- "list_values" — expands on keys() returns a List value to iterate over