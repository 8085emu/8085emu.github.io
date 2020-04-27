The Neutrino 8085 assembler
===

Neutrino is a simple 8085 assembler written in plain ol' JavaScript. The goal while creating neutrino was to provide high level functionality but in a simple to use format, so that almost anyone can use it, while still allowing advanced use cases. Since the 8085 does not support any native support for relocatable code, neither does neutrino. However it does have other features to make up for it:
+ Symbols, in the form of EQUs
+ Multiple ways to EQU
+ Full parsing and expression solving, even at instruction level
+ Duplication using DUP
+ Conditional Assembly
+ A fully featured Macro system, with proper name mangling and recursion.
+ A simple, understandable language based on popular microprocessor texts on 8085, with duck-typing and automatic conversion from decimal numbers.
<a href="therdas://neutrinoRuntime">Open App</a>

## Table of Contents
1. [Basic Syntax](#syntax)
  a. [Labels](#labels)
  b. [Keywords](#keywords)
  c. [Numbers](#numbers)
  d. [org](#org)
2. [An Example](#examplemain)
3. [Slightly Advanced Stuff](#sadvanced)
  a. [DUP](#dup)
  b. [DEF](#def)
  	i.[DEF](#defdef)
  	ii. [DDEF](#ddef)
  	iii.[DEFARR](#defdefarr)
4. [Advanced stuff]
  a. [EQU](#equ)
    i. [EQU and Arrays](#equarr)
    ii. [EQU and Strings](#equstr)
    iii. [EQU and Expressions](#equexpr)
    iv. [An Example using EQU](#equexample)
  b. [Conditionals](#if)
  c. [Macros](#macro)
    i.[Macro Format](#macroformat)
    ii. [Passing Names to Macros](#macropassname)
    iii. [Local Mangling](#macromangle)
    iv. [Locals](#macrolocal)
    v. [Hoisting Macros](#macrohoist)
    vi. [Nested Macros](#macronest)
    vii. [Recursive Macros](#macrorecur)


<a name="syntax"></a>
## Basic Syntax

Every instruction in neutrino is of the form
`[label:]keyword [<number|name>[,<number|name]]`. This simply means that there may be a label, which should always be followed by a colon, followed by a keyword to which this label points. The keyword may be any valid 8085 instruction, or any neutrino directive (which are discussed later).

<a name="labels"></a>
### Labels
Labels should always be followed by a colon:
```assembly
MyLabel: …
```
Labels can generally be anything, and include anything, including numbers. However, some restrictions appply: 
+ Lables are case-sensitive, that is, `MyLabel: …` is different from `mylabel: …`
+ A label must not be entirely made of numbers and the letters A, B, C, D, E or F (case-insensitive), as that might be confused with a number, due to neutrino's duck-typing.

For best practises, it is recommended that you follow the same naming rule as is used in naming C variables, along with not using any proper `name`s, that is, the names of the registers (namely, a, b, c, d, e, h, l, sp, psw, pc)

<a name="keywords"></a>
### Keywords
Every documented 8085 instruction is included in neutrino. In addition, keywords are not case-sensitive (unlike labels). That is, these are roughly equivalent:
```assembly
INR
Inr
inr
```

<a href="numbers"></a>
### Numbers
Neutrino does two things that are different from a regular 8085 assembler, and both of these are to be more compatible with microprocessor textbooks (well, one of them is. The other is for convinience of people getting used to assembly for the first time.)
1. It assumes that any hexadecimal number is suffixed with a `h` or a `H`
2. Any number that is
  a. not suffixed with a `H`, and
  b. able to be parsed as a decimal number (contains only the digits `0-9`)
  Is parsed as a decimal number, and is then converted into hexadecimal
3. If a number does _not_ have a trailing `H` and cannot be parsed as decimal, will be treated as hexadecimal, if possible.
4. Otherwise neutrino throws an error.

Example
```assembly
mvi a, 100	;Moves 64 into a, as 100 base 10 is 64 base 16
mvi a, 26h 	;Moves 0x26 (or 26 in hexadecimal) into a
mvi a, 3	;Moves 0x3f (or 3F in hexadecimal) into a
mvi a, 2q 	;Error, 2q is not a number
mvi a, 2qh	;Error, 2q is not hexadecimal either
mvi a, 500h	;Warning, as 500H is too large to fit into A register
```

<a href="org"></a>
### The ORG directive
The `ORG` directive simply starts writing the following code from whatever address it is called with. It is not necessary, but in case it is not included, the program will be located starting from address `0000H`. It is recommended you choose a higher address for `ORG` as many kits will not allow writing in lower addresses which, usually, is occupied by monitor ROM.

Keep in mind that you can write two programs one after the other, with a `ORG` directive with the same addresses. In that case, ORG will simply overwrite the previous contents, with a simple warning. The _Listing with Code_ produced by your frontend will probably show duplicates, however, the actual listing will only have the part that overwrote the previous one.

<a href="examplemain"></a>
## Example Programs

This is a simple example program to loop 100 times, and output the count to port 85h
```assembly
	MVI A, 64H
  LOOP: OUT 85h 
	DCR A
	JNZ LOOP
```

This is another fully valid way to write the same program, albeit in a way that adheres less strictly to texts on the topic, utilizing neutrino's features:
```assembly
	mvi a, 100
  LOOP: out 85h 
	dcr a
	jnz LOOP
```

<a href="sadvanced"></a>
## Slightly advanced features of neutrino

<a href="dup"></a>
### DUP

The `DUP` directive does exactly what its name suggests: _DUP_ licate a block of code. The block below:
```assembly
DUP 4
RAL
ENDD
```
will be expanded into
```assembly
RAL
RAL
RAL
RAL
```
`ENDD` marks the end of a `DUP` block. `DUP`s also support an expression as their count, which we'll encounter later. Both `DUP` and `ENDUP` are equivalent to their lowercase counterparts, which is common to all directives. These can be used as simple looping constructs with the help of variables LINK section EQU and strings.

<a href="def"></a>
### DEF, DDEF and DEFARR

The `DEF`, `DDEF` and `DEFARR` directives are used to place data in memory _at assemble time_. That is, when you say initialize a emulator with the listing produced by neutrino, these data will be present in the memory along with the instructions. `DEF` and co. do not take any arguments, that is, it isn't possible to place them anywhere you want in memory by just using this directive. You must use `ORG` in conjunction with this directive to directly modify memory. You can, however, attach a label to the `DEF` statement and use that as an address to the data:
```assembly
	org f500
  data: def 50
…
	org f000
	lxi h, data
…
```
which produces the code
|Address|Instruction|Data|
|-------|-----------|---:|
|F500||32|
|…|…|…|
|F000|LXI H, F500|21|
|F001||00|
|F002||F5|

Keep in mind however, if you overwrite any memory previously occupied by instructions, neutrino will warn you, but will __not__ throw an error. This is (currently) by arbitrary design.  

<a href="defdef"></a>
#### DEF
This simply creates a byte with the given data (or whatever the expression passed to it resolves to) in memory at the point where the Address Pointer is at that line. That is, if a byte `XX` is used, it will insert `XX` into memory at the location where, if there was instead a one byte instruction like `MOV`, an instruction would go.

<a href="defddef"></a>
#### DDEF
Same as `DEF` but declares a double-word (two bytes) in little-endian fashion.

<a href="defdefarr"></a>
#### DEFARR
Same as `DEF` but takes a comma separated list, and places them one by one in memory.

<a href="advanced"></a>
## Advanced features of Neutrino

<a href="equ"></a>
### EQU/= or Symbols
```assembly
[label:] equ value ;or
label = value
```

A standard feature of most assemblers is to provide symbols, or what we generally call variables, to aid programming. For example: 
```assembly
  port: equ 86h
		…
	mvi a, 1 ;signal external device 
	out port
		…
```

Symbols can be declared only in two ways:
1. __Decimal__, in this case the value will be in decimal
  This mode allows full arithmetic and/or algebraic equations
2. __Hexadecimal__, in this case the value will be in hexadecimal
  No arithmetic is allowed _only in declaration_ of this kind. However, you can use these symbols for expressions in other places perfectly well.

For example, the following code is invalid:
```assembly
  port: equ f0 + 6	;invalid
		…
```
But the following is:
```assembly
  base: equ 80h
  port: equ base + 6
		…
```
This is a _general rule_ of the neutrino assembler: You cannot use hexadecimal and decimal in the same expression. Another _general rule_: You cannot do arithmetic with hexadecimal, period. You however, can push hexadecimal into variables and then use those variables.

Labels are optional in this form of `EQU`, however, you won't be able to use those variables.

Another form of the `EQU` statement is as follows:
```assembly
variableName = value
```
Both are equivalent

<a href="equarr"></a>
#### EQU and arrays
`EQU` handles arrays exactly like constant literal arrays in other C-like languages. Constant means no modification after you declare them, or insertion/deletion of values. They are there solely for P.O.D. reasons:
```assembly
    arr = [4,3,2,1]
	mvi a, arr[2]	;equivalent to mvi a, 3
```
A sharp symbol `#` signifies length, that is, saying `#arr` will give you the length of the array.
```assembly
    arr = [4,3,2,1]
	mvi a, #arr	;equivalent to mvi a, 4
```
Some general constraints for arrays are:
1. Arrays must have atleast a single element, or the `EQU` statement will fail.
2. Empty elements (just commas without values) are simply skipped over.
3. An array cannot contain of only empty elements(`[,,]` is invalid)

<a href="equstr"></a>
#### EQU and strings
`EQU` can easily handle strings. It first converts the string into an array of its ascii values and then uses that.
```assembly
    arr = "hello"
	mvi a, arr[2]	;equivalent to mvi a, 6CH
	mvi b, #arr 	;equivalent to mvi b, 05H
```
Unlike arrays, string literal arrays cannot be used in expressions. You have to separately declare them first.

<a href="equexpr"></a>
#### Expression format
The expression evaluation engine is [silentmatt](https://github.com/silentmatt/)'s excellent [expr-eval](https://github.com/silentmatt/expr-eval), and supports everything that supports, with the addition of strings as arrays.

<a href="equexample"></a>
#### An assemble-time string output program
The following program outputs a string to port `86H`:
```assembly
	port = 86H 			;We output to port 86H

	str = "hello"			;The string to output is hello
	i = 0				;This is our counter, or index, into the string
	
	;The following part does this:
	;First it outputs the current element in the string(array)
	;Then it increments the count
	;this works as arithmetic/algebraic equations are fully supported
	;in EQU statements *as long as* they do not contain any hexadecimal
	;literals
	DUP #str 			;Duplicate statements length of str times
	out str[i]			;Output the element
	i = i + 1			;increment index
	ENDD
	
	hlt					;and halt
 ```
 This generates the following code:
 |Address|Instruction|Data|
|-------|-----------|---:|
|0000|out 68H|D3|
|0001||68|
|0002|out 65H|D3|
|0003||65|
|0004|out 6CH|D3|
|0005||6C|
|0004|out 6CH|D3|
|0005||6C|
|0004|out 6FH|D3|
|0005||6F|
|0004|hlt|76|

<a href="if"></a>
### if-elif-else or Conditionals
Neutrino supports if-elif-else conditionals. The general format is as follows:
```assembly
	if <condition>
		<body>
	elif <condition>
		<body>
		…
	else
		<body>
	endif
```

The condition _must_ be a expression without any hexadecimal values, or a atomic hexadecimal value.
The assembler has some quirks, one being that the different keywords, while _within_ a `if`/`endif` block are distinguished on basis of their number of arguments, not the keyword, per se. That means a `elif` with no arguments will be treated as an `else`.

<a href="macro"></a>
### Macros
Neutrino includes a powerful macro subsystem with proper label/variable mangling, general argument substitution, nested macros, macro hoisting, and, with the help of the conditional directives, recursion.

<a href="macroformat"></a>
#### Format
The general format of a macro is:
```assembly
  name: macro arg1, arg2, …
	locals l1, l2, l3 …
	;body
/mangledLabel: ;body
	…
	endm
```
For example: 
```assembly
	l2: macro x, y, z
	locals q
	mvi a, x
/atmvb: mov b, y
	mov c, z
	q = 15
	mvi d, q
	endm

	l2 15, B, C
```
This is a nonsensical macro, but it illustrates how a macro may be used.

<a href="macropassname"></a>
#### Passing Names
As shown in the example, if you want to pass a name to an macro, pass the name of the register in UPPERCASE. This serves as an hint to the assembler to not parse it as an hexadecimal value. However, if used in a place where a hexadecimal value is to be used, it can and will be converted into one.

<a href="macromangle"></a>
#### Local Label Mangling
Notice the label `/atmvb:` in the previous example. It is a local label. As macros are just substituted, two conflicting labels, from say two invocations of the same macro, may overwrite each other and thus only the second label will be used in the final assembly. To solve this issue, macros have the ability to `mangle` labels. 
A mangled label is declared (within a macro) as `/labelname`, and is replaced with `/labelName_indLocInstNoXX` where `XX` is the current index of the macro. The index of a macro is initialized by 0 and increases by one every time a macro is called. However, this property is internal and cannot be referenced. It is recommended that you do not use labels of this form in your assembly code, to avoid conflicts.
The `/` is a hint to create a local. It is not used while actually using the label, that is, a local label declared `/abc` will be used as `abc`. 

<a href="macrolocal"></a>
#### `Locals`
The locals directive allows declaration of local symbols, that is, symbols that have their names mangled. This is useful when you do not want to pollute the global namespace with symbol names.

<a href="macrohoist"></a>
#### Macro Hoisting
Macros in neutrino are hoisted, that is, a macro can be defined anywhere in code, and be called from _everywhere_ in the code, even before the part in which the macro was defined. The same applies to labels, but not symbols.

<a href="macronest"></a>
#### Nesting Macros
Macros can be nested in one another. In addition, any macro may call any other macro, or declare another macro. However, it is not possible to conditionally define macros.

<a href="macrorecur"></a>
#### Recursive Macros
Macros can call themselves, and thus allow for primitive recursion:
```assembly
  ssum: macro n
	if n > 1
	ssum n - 1
	endif
	adi n
	endm

	ssum 5
	hlt
```
Note that the assembler will happily keep recurring till it runs out of memory. It is up to the user to control how deep the recursion is and the assembler will _*not* warn_ you if you do not control how deep your recursion goes. An infinite recursion _will_ crash the assembler 
