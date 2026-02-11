# Kick Assembler: .print / .printnow and .error / .errorif (console output & pass timing)

**Summary:** Describes Kick Assembler console-output directives .print and .printnow (timing differences between passes, unresolved-label placeholders), and error directives .error and .errorif (abort assembly with messages); includes examples including a page-crossing check.

## Console output behavior
- .print prints its text during the output pass only. Use it for normal, final assembler messages.
- .printnow prints immediately in every pass (parsing / pass 1 / pass 2 / output). Because passes run before all labels/expressions are resolved, .printnow output can be incomplete or contain unresolved-value placeholders (e.g. <<Invalid String>>).
- Unresolved labels or expressions in early passes will typically be shown as invalid placeholders in .printnow output and will be resolved in later passes.

## Error directives
- .error emits an error and aborts assembly when the directive is executed (commonly placed under a conditional .if).
- .errorif takes a boolean expression and a message; if the expression evaluates true, assembly is aborted with that message.
- .errorif is more flexible than writing .if <cond> .error "..." because standard .if is usually decided in the first pass and may raise unwanted errors when comparing unresolved labels. .errorif lets you write checks that will only trigger when the required values are available or when the condition evaluates true.

## Page-boundary / page-crossing check
- To detect a page crossing (i.e., a branch that jumps to a different 256-byte page), compare the high byte of the current PC (>) and the target label: if they differ, a page boundary has been crossed. Example pattern shown below uses .errorif to abort if the branch target is on a different page.

## Source Code
```asm
; Example: .print (output during output pass)
.print "Hello world"
.var x=2
.print "x="+x
```

```text
; Assembler output (simplified)
parsing
flex pass 1
Output pass
Hello world
x=2.0
```

```asm
; Example: .printnow (prints each pass; unresolved label in first pass)
.printnow "loop=$" + toHexString(loop)
*=$1000
loop: jmp loop
```

```text
; Assembler output (illustrative)
parsing
flex pass 1
loop=$<<Invalid String>>
flex pass 2
loop=$1000
Output pass
```

```asm
; Example: .error via conditional .if
.var width = 45
.if (width>40) .error "width can't be higher than 40"
```

```asm
; Example: .errorif (preferred concise form)
.var width = 45
.errorif width>40, "width can't be higher than 40"
```

```asm
; Example: detect page crossing after a branch and abort if crossed
beq label1
.errorif (>*) != (>label1), "Page crossed!"
nop
nop
label1:
```

## References
- "testing_asserts_and_tools" — expands on testing and assertion features (see Chapter 16)
