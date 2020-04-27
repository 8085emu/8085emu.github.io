/*
** Define the messages as a dict of functions with the name as the messages which return stuff.
*/

var mesg = {
	language: 'en_gb',
	type: 'verbose',
	multipleForSingleError: true
};

/*
** The different errors are listed below:
*/

/*
ASM_PE_CANTEXPANDMACRO: 			extension processor cannot exapand macros
ASM_PE_CANTRESOLVECOND: 			extension processor cannot expand an IF/ELIF/ELSE block
ASM_DEF_INVALIDVALUE: {value}		invalid value for def statement
ASM_ORG_INVALIDVALUE: {value}		invalid value for org statement
ASM_REF_INVALIDKEYWORD: {value}		invalid keyword encountered while searching for reference 
ASM_ASM_INVALIDKEYWORD: {value}		invalid keyword encountered while assembling
ASM_ASM_WRONGNOOFARGS: {needs, has}	invalid number of arguments for keyword
ASM_ASM_MALFORMEDINSTR: {format:[]} invalid format for instruction
ASM_ASM_NOLABELMATCH: {value}		no label with value name exists
ASM_ASM_NOLABELADDR: {value, references} the referenced line is not found INTERNAL ERROR
ASM_TRAP_COMPILERERROR: {stack}		compiler high-priority error, compilation stops
AMCOND_NOEND: 						EndIf not found for block
AMDUP_NOEND: 						ENDD not found for block
AMDUP_IMPROPERVAL: 					Improper value for DUP statement
AMMACRO_NOEND: 						ENDM not found for block
AMMACRO_NONAME: 					No name supplied for macro
AMMACRO_ARGMISMATCH: {needs, has}	Number of arguments not matched
AMSYM_INVALIDVALUE:  				Invalid value assigned to symbol
*/


/*
** The different warnings are listed below
*/

/*
ASM_PE_EMPTYBODY: 					Empty body returned by conditional
ASM_PE_CANTEXPANDDUP: 				DUP expansion failed
ASM_DEF_TOOLONG8: {value}			Too long value for DEF (1byt expected)
ASM_DEF_TOOLONG16: {value}			Too long value for DEF (1byt expected)
ASM_ORG_TOOLONG16: {value}			Too long value for ORG (1byt expected)
ASM_ASM_TOOLONG8: {value}			Too long value for instruction (1byt expected)
ASM_ASM_TOOLONG16: {value}			Too long value for instruction (1byt expected)
AMSYM_NOLABEL: {value}				No label for Def statement
*/

mesg["ASM_PE_CANTEXPANDMACRO"] 	= (at, context) => 'Cannot expand macro';
mesg["ASM_PE_CANTRESOLVECOND"] 	= (at, context) => 'Cannot resolve IF/ELIF/ELSE block';
mesg["ASM_DEF_INVALIDVALUE"] 	= (at, context) => "Invalid value " + context.value + " for DEF statement";
mesg["ASM_DEF_OVERWRITES"] 		= (at, context) => "Def statement at this line overwrites preassembled memory at " + context.address;
mesg["ASM_ORG_INVALIDVALUE"] 	= (at, context) => "Invalid value " + context.value + " for ORG statement";
mesg["ASM_REF_INVALIDKEYWORD"] 	= (at, context) => 'Keyword "' + context.value + '" unexpected here';
mesg["ASM_ASM_INVALIDKEYWORD"] 	= (at, context) => '"' + context.value + '" is not an instruction';
mesg["ASM_ASM_WRONGNOOFARGS"] 	= (at, context) => "Wrong number of arguments, expected " + context.needs + ", got " + context.has;
mesg["ASM_ASM_MALFORMEDINSTR"] 	= (at, context) => 'The instruction "' + context.keyword + '" is not properly formed, it requires ' + context.format.length + ' arguments, namely: ' + context.format.join(', ');
mesg["ASM_ASM_NOLABELMATCH"] 	= (at, context) => 'The label "' + context.value + '" isn\'t present in the program';
mesg["ASM_ASM_NOLABELADDR"] 	= (at, context) => 'The label "' + context.value + '" is present in the program but the assembler failed to assign an address to it.';
mesg["ASM_ASM_OVERWRITES"] 		= (at, context) => "The line overwrites preassembled memory at " + context.address;
mesg["ASM_TRAP_COMPILERERROR"] 	= (at, context) => 'The compiler has experienced a general failure, at ' + context.stack;
mesg["AMCOND_NOEND"] 			= (at, context) => 'The conditional block starting at this line has no corresponding ENDIF statement';
mesg["AMDUP_NOEND"] 			= (at, context) => 'The duplication block starting at this line has no corresponding ENDD';
mesg["AMDUP_IMPROPERVAL"]		= (at, context) => 'Cannot duplicate "' + context.expression + '" times as it is not a parsable number'
mesg["AMMACRO_NOEND"] 			= (at, context) => 'The macro starting at this line has no corresponding ENDM statement';
mesg["AMMACRO_NONAME"] 			= (at, context) => 'The macro starting at this line has no name.';
mesg["AMMACRO_ARGMISMATCH"] 	= (at, context) => 'Incorrect number of arguments for the macro beginning at this line. Expecting ' + context.needs + ' arguments, got ' + context.has;
mesg["AMSYM_INVALIDVALUE"] 		= (at, context) => 'Couldn\'t parse the symbol defined at line ';
mesg["AMSYM_LABELISNAME"]	    = (at, context) => 'Label for this symbol is a name for a register.';

mesg["ASM_PE_EMPTYBODY"] 		= (at, context) => 'The conditional returned an empty body to replace'
mesg["ASM_PE_CANTEXPANDDUP"] 	= (at, context) => 'The duplication statement at this line could not be processed.';
mesg["ASM_DEF_TOOLONG8"] 		= (at, context) => 'The DEF or DEFARR statement expects a value of size 1 byte. Truncating ' + context.value + ' to ' + context.value.slice(-2);
mesg["ASM_DEF_TOOLONG16"] 		= (at, context) => 'The DDEF statement expects a value of size 2 bytes. Truncating ' + context.value + ' to ' + context.value.slice(-4);
mesg["ASM_ORG_TOOLONG16"] 		= (at, context) => 'The ORG statement expects a value of size 2 bytes. Truncating ' + context.value + ' to ' + context.value.slice(-4);
mesg["ASM_ASM_TOOLONG8"] 		= (at, context) => '8-bit operand expected, truncating ' + context.value + ' to ' + context.value.slice(-2);
mesg["ASM_ASM_TOOLONG8"] 		= (at, context) => '16-bit operand expected, truncating ' + context.value + ' to ' + context.value.slice(-2);
mesg["AMSYM_NOLABEL"] 			= (at, context) => 'The define statement has no label, and will not be usable';