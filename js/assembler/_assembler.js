











/**************************************************************
*msgparser-en_gb
**************************************************************/
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
mesg["ASM_DEF_OVERWRITES"] 		= (at, context) => "Def statement at line " + at + " overwrites preassembled memory at " + context.address;
mesg["ASM_ORG_INVALIDVALUE"] 	= (at, context) => "Invalid value " + context.value + " for ORG statement";
mesg["ASM_REF_INVALIDKEYWORD"] 	= (at, context) => 'Keyword "' + context.value + '" unexpected here';
mesg["ASM_ASM_INVALIDKEYWORD"] 	= (at, context) => '"' + context.value + '" is not an instruction';
mesg["ASM_ASM_WRONGNOOFARGS"] 	= (at, context) => "Wrong number of arguments, expected " + context.needs + ", got " + context.has;
mesg["ASM_ASM_MALFORMEDINSTR"] 	= (at, context) => 'The instruction "' + context.keyword + '" is not properly formed, it requires ' + context.format.length + ' arguments, namely: ' + context.format.join(', ');
mesg["ASM_ASM_NOLABELMATCH"] 	= (at, context) => 'The label "' + context.value + '" isn\'t present in the program';
mesg["ASM_ASM_NOLABELADDR"] 	= (at, context) => 'The label "' + context.value + '" is present in the program but the assembler failed to assign an address to it.';
mesg["ASM_ASM_OVERWRITES"] 		= (at, context) => "The line " + at + " overwrites preassembled memory at " + context.address;
mesg["ASM_TRAP_COMPILERERROR"] 	= (at, context) => 'The compiler has experienced a general failure, at ' + context.stack;
mesg["AMCOND_NOEND"] 			= (at, context) => 'The conditional block starting at ' + at +' has no corresponding ENDIF statement';
mesg["AMDUP_NOEND"] 			= (at, context) => 'The duplication block starting at ' + at + ' has no corresponding ENDD';
mesg["AMDUP_IMPROPERVAL"]		= (at, context) => 'Cannot duplicate "' + context.expression + '" times as it is not a parsable number'
mesg["AMMACRO_NOEND"] 			= (at, context) => 'The macro starting at ' + at + ' has no corresponding ENDM statement';
mesg["AMMACRO_NONAME"] 			= (at, context) => 'The macro starting at ' + at + ' has no name.';
mesg["AMMACRO_ARGMISMATCH"] 	= (at, context) => 'Incorrect number of arguments for the macro beginning at ' + at + '. Expecting ' + context.needs + ' arguments, got ' + context.has;
mesg["AMSYM_INVALIDVALUE"] 		= (at, context) => 'Couldn\'t parse the symbol defined at line ' + at;

mesg["ASM_PE_EMPTYBODY"] 		= (at, context) => 'The conditional returned an empty body to replace'
mesg["ASM_PE_CANTEXPANDDUP"] 	= (at, context) => 'The duplication statement at line ' + at + ' could not be processed.';
mesg["ASM_DEF_TOOLONG8"] 		= (at, context) => 'The DEF or DEFARR statement expects a value of size 1 byte. Truncating ' + context.value + ' to ' + context.value.slice(-2);
mesg["ASM_DEF_TOOLONG16"] 		= (at, context) => 'The DDEF statement expects a value of size 2 bytes. Truncating ' + context.value + ' to ' + context.value.slice(-4);
mesg["ASM_ORG_TOOLONG16"] 		= (at, context) => 'The ORG statement expects a value of size 2 bytes. Truncating ' + context.value + ' to ' + context.value.slice(-4);
mesg["ASM_ASM_TOOLONG8"] 		= (at, context) => '8-bit operand expected, truncating ' + context.value + ' to ' + context.value.slice(-2);
mesg["ASM_ASM_TOOLONG8"] 		= (at, context) => '16-bit operand expected, truncating ' + context.value + ' to ' + context.value.slice(-2);
mesg["AMSYM_NOLABEL"] 			= (at, context) => 'The define statement has no label, and will not be usable';










/**************************************************************
*asm
**************************************************************/
/*
*/

var assembler = {
    codeOf: {"LXI":{"length":3,"H":{"16-bit":{"code":"21"}},"SP":{"16-bit":{"code":"31"}},"B":{"16-bit":{"code":"01"}},"D":{"16-bit":{"code":"11"}}},"STAX":{"length":2,"D":{"code":"12"},"B":{"code":"02"}},"INX":{"length":2,"D":{"code":"13"},"H":{"code":"23"},"SP":{"code":"33"},"B":{"code":"03"}},"INR":{"length":2,"D":{"code":"14"},"H":{"code":"24"},"M":{"code":"34"},"A":{"code":"3C"},"B":{"code":"04"},"C":{"code":"0C"},"E":{"code":"1C"},"L":{"code":"2C"}},"DCR":{"length":2,"D":{"code":"15"},"H":{"code":"25"},"M":{"code":"35"},"A":{"code":"3D"},"B":{"code":"05"},"C":{"code":"0D"},"E":{"code":"1D"},"L":{"code":"2D"}},"MVI":{"length":3,"D":{"8-bit":{"code":"16"}},"H":{"8-bit":{"code":"26"}},"M":{"8-bit":{"code":"36"}},"A":{"8-bit":{"code":"3E"}},"B":{"8-bit":{"code":"06"}},"C":{"8-bit":{"code":"0E"}},"E":{"8-bit":{"code":"1E"}},"L":{"8-bit":{"code":"2E"}}},"RAL":{"length":1,"code":"17"},"DAD":{"length":2,"D":{"code":"19"},"H":{"code":"29"},"SP":{"code":"39"},"B":{"code":"09"}},"RIM":{"length":1,"code":"20"},"SHLD":{"length":2,"16-bit":{"code":"22"}},"DAA":{"length":1,"code":"27"},"SIM":{"length":1,"code":"30"},"STA":{"length":2,"16-bit":{"code":"32"}},"STC":{"length":1,"code":"37"},"MOV":{"length":3,"B":{"A":{"code":"47"},"B":{"code":"40"},"C":{"code":"41"},"D":{"code":"42"},"E":{"code":"43"},"H":{"code":"44"},"L":{"code":"45"},"M":{"code":"46"}},"C":{"M":{"code":"4E"},"B":{"code":"48"},"C":{"code":"49"},"A":{"code":"4F"},"D":{"code":"4A"},"E":{"code":"4B"},"H":{"code":"4C"},"L":{"code":"4D"}},"D":{"A":{"code":"57"},"B":{"code":"50"},"C":{"code":"51"},"D":{"code":"52"},"E":{"code":"53"},"H":{"code":"54"},"L":{"code":"55"},"M":{"code":"56"}},"E":{"M":{"code":"5E"},"B":{"code":"58"},"C":{"code":"59"},"A":{"code":"5F"},"D":{"code":"5A"},"E":{"code":"5B"},"H":{"code":"5C"},"L":{"code":"5D"}},"H":{"A":{"code":"67"},"B":{"code":"60"},"C":{"code":"61"},"D":{"code":"62"},"E":{"code":"63"},"H":{"code":"64"},"L":{"code":"65"},"M":{"code":"66"}},"L":{"M":{"code":"6E"},"B":{"code":"68"},"C":{"code":"69"},"A":{"code":"6F"},"D":{"code":"6A"},"E":{"code":"6B"},"H":{"code":"6C"},"L":{"code":"6D"}},"M":{"A":{"code":"77"},"B":{"code":"70"},"C":{"code":"71"},"D":{"code":"72"},"E":{"code":"73"},"H":{"code":"74"},"L":{"code":"75"}},"A":{"M":{"code":"7E"},"B":{"code":"78"},"C":{"code":"79"},"A":{"code":"7F"},"D":{"code":"7A"},"E":{"code":"7B"},"H":{"code":"7C"},"L":{"code":"7D"}}},"HLT":{"length":1,"code":"76"},"ADD":{"length":2,"B":{"code":"80"},"C":{"code":"81"},"D":{"code":"82"},"E":{"code":"83"},"H":{"code":"84"},"L":{"code":"85"},"M":{"code":"86"},"A":{"code":"87"}},"ADC":{"length":2,"B":{"code":"88"},"C":{"code":"89"},"A":{"code":"8F"},"D":{"code":"8A"},"E":{"code":"8B"},"H":{"code":"8C"},"L":{"code":"8D"},"M":{"code":"8E"}},"SUB":{"length":2,"B":{"code":"90"},"C":{"code":"91"},"D":{"code":"92"},"E":{"code":"93"},"H":{"code":"94"},"L":{"code":"95"},"M":{"code":"96"},"A":{"code":"97"}},"SBB":{"length":2,"B":{"code":"98"},"C":{"code":"99"},"A":{"code":"9F"},"D":{"code":"9A"},"E":{"code":"9B"},"H":{"code":"9C"},"L":{"code":"9D"},"M":{"code":"9E"}},"ACI":{"length":2,"8-bit":{"code":"CE"}},"ADI":{"length":2,"8-bit":{"code":"C6"}},"ANA":{"length":2,"A":{"code":"A7"},"B":{"code":"A0"},"C":{"code":"A1"},"D":{"code":"A2"},"E":{"code":"A3"},"H":{"code":"A4"},"L":{"code":"A5"},"M":{"code":"A6"}},"ANI":{"length":2,"8-bit":{"code":"E6"}},"CALL":{"length":2,"16-bit":{"code":"CD"}},"CC":{"length":2,"16-bit":{"code":"DC"}},"CM":{"length":2,"16-bit":{"code":"FC"}},"CMA":{"length":1,"code":"2F"},"CMC":{"length":1,"code":"3F"},"CMP":{"length":2,"A":{"code":"BF"},"B":{"code":"B8"},"C":{"code":"B9"},"D":{"code":"BA"},"E":{"code":"BB"},"H":{"code":"BC"}, "L":{"code":"BD"},"M":{"code":"BE"}},"CNC":{"length":2,"16-bit":{"code":"D4"}},"CNZ":{"length":2,"16-bit":{"code":"C4"}},"CP":{"length":2,"16-bit":{"code":"F4"}},"CPE":{"length":2,"16-bit":{"code":"EC"}},"CPI":{"length":2,"8-bit":{"code":"FE"}},"CPO":{"length":2,"16-bit":{"code":"E4"}},"CZ":{"length":2,"16-bit":{"code":"CC"}},"DCX":{"length":2,"B":{"code":"0B"},"D":{"code":"1B"},"H":{"code":"2B"},"SP":{"code":"3B"}},"DI":{"length":1,"code":"F3"},"EI":{"length":1,"code":"FB"},"IN":{"length":2,"8-bit":{"code":"DB"}},"JC":{"length":2,"16-bit":{"code":"DA"}},"JM":{"length":2,"16-bit":{"code":"FA"}},"JMP":{"length":2,"16-bit":{"code":"C3"}},"JNC":{"length":2,"16-bit":{"code":"D2"}},"JNZ":{"length":2,"16-bit":{"code":"C2"}},"JP":{"length":2,"16-bit":{"code":"F2"}},"JPE":{"length":2,"16-bit":{"code":"EA"}},"JPO":{"length":2,"16-bit":{"code":"E2"}},"JZ":{"length":2,"16-bit":{"code":"CA"}},"LDA":{"length":2,"16-bit":{"code":"3A"}},"LDAX":{"length":2,"B":{"code":"0A"},"D":{"code":"1A"}},"LHLD":{"length":2,"16-bit":{"code":"2A"}},"NOP":{"length":1,"code":"00"},"ORA":{"length":2,"A":{"code":"B7"},"B":{"code":"B0"},"C":{"code":"B1"},"D":{"code":"B2"},"E":{"code":"B3"},"H":{"code":"B4"},"L":{"code":"B5"},"M":{"code":"B6"}},"ORI":{"length":2,"8-bit":{"code":"F6"}},"OUT":{"length":2,"8-bit":{"code":"D3"}},"PCHL":{"length":1,"code":"E9"},"POP":{"length":2,"B":{"code":"C1"},"D":{"code":"D1"},"H":{"code":"E1"},"PSW":{"code":"F1"}},"PUSH":{"length":2,"B":{"code":"C5"},"D":{"code":"D5"},"H":{"code":"E5"},"PSW":{"code":"F5"}},"RAR":{"length":1,"code":"1F"},"RC":{"length":1,"code":"D8"},"RET":{"length":1,"code":"C9"},"RLC":{"length":1,"code":"07"},"RM":{"length":1,"code":"F8"},"RNC":{"length":1,"code":"D0"},"RNZ":{"length":1,"code":"C0"},"RP":{"length":1,"code":"F0"},"RPE":{"length":1,"code":"E8"},"RPO":{"length":1,"code":"E0"},"RRC":{"length":1,"code":"0F"},"RST":{"0":{"code":"C7"},"1":{"code":"CF"},"2":{"code":"D7"},"3":{"code":"DF"},"4":{"code":"E7"},"5":{"code":"EF"},"6":{"code":"F7"},"7":{"code":"FF"},"length":2},"RZ":{"length":1,"code":"C8"},"SBI":{"length":2,"8-bit":{"code":"DE"}},"SPHL":{"length":1,"code":"F9"},"SUI":{"length":2,"8-bit":{"code":"D6"}},"XCHG":{"length":1,"code":"EB"},"XRA":{"length":2,"A":{"code":"AF"},"B":{"code":"A8"},"C":{"code":"A9"},"D":{"code":"AA"},"E":{"code":"AB"},"H":{"code":"AC"},"L":{"code":"AD"},"M":{"code":"AE"}},"XRI":{"length":2,"8-bit":{"code":"EE"}},"XTHL":{"length":1,"code":"E3"}},
	format: {"LXI":["name","16-bit"],"STAX":["name"],"INX":["name"],"INR":["name"],"DCR":["name"],"MVI":["name","8-bit"],"RAL":[],"DAD":["name"],"RIM":[],"SHLD":["16-bit"],"DAA":[],"SIM":[],"STA":["16-bit"],"STC":[],"MOV":["name","name"],"HLT":[],"ADD":["name"],"ADC":["name"],"SUB":["name"],"SBB":["name"],"ACI":["8-bit"],"ADI":["8-bit"],"ANA":["name"],"ANI":["8-bit"],"CALL":["16-bit"],"CC":["16-bit"],"CM":["16-bit"],"CMA":[],"CMC":[],"CMP":["name"],"CNC":["16-bit"],"CNZ":["16-bit"],"CP":["16-bit"],"CPE":["16-bit"],"CPI":["8-bit"],"CPO":["16-bit"],"CZ":["16-bit"],"DCX":["name"],"DI":[],"EI":[],"IN":["8-bit"],"JC":["16-bit"],"JM":["16-bit"],"JMP":["16-bit"],"JNC":["16-bit"],"JNZ":["16-bit"],"JP":["16-bit"],"JPE":["16-bit"],"JPO":["16-bit"],"JZ":["16-bit"],"LDA":["16-bit"],"LDAX":["name"],"LHLD":["16-bit"],"NOP":[],"ORA":["name"],"ORI":["8-bit"],"OUT":["8-bit"],"PCHL":[],"POP":["name"],"PUSH":["name"],"RAR":[],"RC":[],"RET":[],"RLC":[],"RM":[],"RNC":[],"RNZ":[],"RP":[],"RPE":[],"RPO":[],"RRC":[],"RST":["integer"],"RZ":[],"SBI":["8-bit"],"SPHL":[],"SUI":["8-bit"],"XCHG":[],"XRA":["name"],"XRI":["8-bit"],"XTHL":[]}
}

function AssemblerException(code, at) {
    const error = new Error('');
    error.code = code;
    error.at = at;
    return error;
}

assembler.isLabelledKeyword = (keyword) => ['RET', 'JMP', 'CALL'].includes(keyword) || (keyword.length == 2 && ['R', 'J', 'C'].includes(keyword.slice(0,1))) || (keyword.length == 3 && ['RN', 'CN', 'JN'].includes(keyword.slice(0,2))) 
AssemblerException.prototype = Object.create(Error.prototype);

//This uses the fact that if there is a immidiate address or operand
//The operand will always be the last argument to a keyword
//and futher returns false if it cannot find the keyword in its OPCODE table
assembler.sizeOf = (keyword) => {
	var format = assembler.format[keyword];
	if(format == undefined)
		return false;
	var last = format.slice(-1);
	
	if(last == '8-bit')
		return 2;
	else if(last == '16-bit')
		return 3;
	else
		return 1;
	return false;
}











/**************************************************************
*parser
**************************************************************/
var exprEval = require("./expr-eval");
assembler.parser = {
	exprParser: new exprEval.Parser({
		operators: {
			logical: true,
			comparison: true,
			'in': true,
			assignment: false
		}
	})
}

assembler.parser.exprParser.consts = {};

/*
	functions in this module:
		isHexWithoutSuffix(string)		without H suffix
		isHex(string)					with H suffix
		isDec(string)
		type(string)
		isPreprocessorDirective(string)
		incrementHex(string)
		tokenize(documentString)
		parseExpr(string: expression, dictionary: decSymTab)	<-- Don't use this
		hexFromDec(string)
		decFromHex(string)
		parseVal(string: value, dictionary: decSymTab)  <-- Always use this
		getAccessor(string)
*/

assembler.parser.isHexWithoutSuffix = function (token) {
	return /^[A-Fa-f0-9]+$/.test(token);
}

assembler.parser.isHex = function(token) {
	return assembler.parser.isHexWithoutSuffix(token) || 
		   (assembler.parser.isHexWithoutSuffix(token.slice(0,-1)) && (token.slice(-1) == 'H'));
}

assembler.parser.isDec = function (token) {
	return /^[0-9]+$/.test(token);
}

assembler.parser.type = function(token) {
    token = token + '';

	if(['A', 'B', 'C', 'D', 'E', 'H', 'L', 'SP', 'PC', 'M', 'PSW'].includes(token))
		return('name');
	else if(token.length == 4 && assembler.parser.isHex(token, 16))
		return '16-bit';
	else if(token.length == 2 && assembler.parser.isHex(token, 16))
		return '8-bit';
	else
		return 'label';
}

assembler.parser.isPreprocessorDirective = function(token) {
	if(['ORG', 'EQU', 'DEFMEM', 'DEFMEMWS', 'BRK'].includes(token))
		return true;
	return false;
}

assembler.parser.incrementHex = function (hex){
	if(hex == 'FFFF')
		return '0000';

	return assembler.parser.pad((parseInt(hex, 16) + 1).toString(16), 4).toUpperCase();
}

/*Splitter*/
assembler.parser.splitter = function(s) {
	var lst = [];
	var i = 0;
	var hasLabel = s.indexOf(':') == -1 ? false : true;
	if(hasLabel) {
		lst[i] = s.substring(0, s.indexOf(':') + 1);
		console.log("LABEL ", s, "::", lst[i]);
		s = s.substring(s.indexOf(':') + 1).trim();
		lst[i] = lst[i].trim();
		++i;		
	}
	console.log("THEN ", s);

	var keywordIndex = s.indexOf('=');
	if(keywordIndex == -1 || (keywordIndex != -1 && s.substring(0, keywordIndex).indexOf(' ') != -1))
		keywordIndex = s.indexOf(' ');

	lst[i] = s.substring(0, keywordIndex).trim();
	var primary = s.substring(0, keywordIndex).trim();
	console.log(s, keywordIndex);
	s = s.substring(keywordIndex).trim();
	++i;

	/*Handle case of =*/
	var temp = s.trim();
	var hasEqu = temp.indexOf('=') != -1 && s.substring(0, temp.indexOf('=')).indexOf(' ') == -1 ? true : false;

	if(hasEqu) {
		lst[i] = s.substring(0, s.indexOf('=') + 1).trim();
		s = s.substring(s.indexOf('=') + 1).trim();
		++i;
	}
	
	if(['if', 'IF', 'else', 'ELSE', 'elif', 'ELIF'].includes(primary))
		lst = lst.concat(s.split(/[ ,]/)).map(n => n.trim());
	else
		lst = lst.concat(s.split(',').map(n => n.trim()));

	return lst;
}

/*NO SPLIT AT {...} for evaluation purposes.*/
assembler.parser.tokenize = function(string) {
	var lines = string.split('\n');
	var tokens = [];
	for(var i in lines) {
		tokens[i] = [];
		tokens[i][1] = assembler.parser.splitter(lines[i].trim());
		tokens[i][1] = tokens[i][1].filter(n => n);
		tokens[i][0] = i;
	}

	tokens = tokens.filter(n => n[1].length == 0 ? false : true);	
	return tokens;
}

assembler.parser.parseExpr = function(string, decimalNamespace) {
	try {
		var result = assembler.parser.exprParser.evaluate(string, decimalNamespace);
		return result;
	} catch (err) {
		return false;
	}
}

assembler.parser.hexFromDec = function(value) {
	return parseInt(value, 10).toString(16).toUpperCase();
}

assembler.parser.decFromHex = function(value) {
	return parseInt(value, 16);
}

/*Returns a simplified version of the expression*/
/* symtab contains symbols with decimal values
** ssymtab contains symbols with literal values (as in string lit.)
*/
assembler.parser.simplify = function(expr, symtab, ssymtab) {
	var fin;
	try {
		fin = assembler.parser.exprParser.parse(expr).simplify(symtab).toString();
		for(var symbol in ssymtab) {
			fin = assembler.parser.exprParser.parse(fin).substitute(symbol, ssymtab[symbol]).toString();
		}
	} catch(err) {
		fin = false;
	}
	return fin;
}

/*Returns the hexadecimal value of a string as per following rules:
	If value is like '%h' or '%H', returns is as is without suffix. Otherwise:
		If value can be decimal, convert to hex and return
		If value can be hex, return
		If value can be a expression, parse, then return
		If value is none of the above, return false.
	Always returns either a hex value or false.
*/
assembler.parser.twosComplement = function(str, base) {
	var digitsPer = Math.ceil(Math.log2(base));
	var padTo = str.length;
	if(str.length > 0 && str.length < 4)
		padTo = 2;
	else if(str.length >= 4)
		padTo = 4;
	str = assembler.parser.pad(parseInt(str, base).toString(2), padTo * digitsPer);
	var ret = "";
	console.log("CONVERTING", str);
	var oneEncountered = false;
	for(var i = str.length - 1; i >= 0; --i) {
		if(oneEncountered) {
			ret = (str[i] == '1' ? '0' : '1') + ret;
		} else {
			ret = str[i] + ret;
			if(str[i] == '1')
				oneEncountered = true;
		}
	}
	return parseInt(ret, 2).toString(base).toUpperCase();
}

assembler.parser.parseVal = function(value, decSymbolTable, returnDecimal) {
    if(value == undefined) return false;
    if(returnDecimal == undefined) returnDecimal = false;
    if(assembler.parser.type(value) == 'name') return false;
	
	var isNeg = false;
    //check for negative
    if(value[0] == '-'){
    	console.log("ISNEGATIVE");
    	value = value.slice(1);
    	isNeg = true;
     }

	var isHex = false;
	if (value.slice(-1) == 'H' || value.slice(-1) == 'h') {
		isHex = true;
		value = value.slice(0,-1);
	}

	if(!isHex) {
		if(assembler.parser.isDec(value)){
			var ret = assembler.parser.hexFromDec(value).toUpperCase();
			ret = isNeg ? assembler.parser.twosComplement(ret, 16): ret;
			console.log("ISDEC", ret, assembler.parser.twosComplement(ret, 16));
			return returnDecimal ? value: ret;
		}
		else if(assembler.parser.isHex(value)){
			var ret = value.toUpperCase();
			ret = isNeg ? assembler.parser.twosComplement(ret, 16): ret;
			console.log("ISHEX", ret);
			return returnDecimal ? parseInt(value, 16) : ret;
		}
		else {
			console.log("ISNEITHER");
			var res = assembler.parser.parseExpr(value, decSymbolTable);
            
            if(!returnDecimal)
                res = res.toString(16).toUpperCase();

            if(isNeg && !returnDecimal && res != 'FALSE')
            	res = isNeg ? assembler.parser.twosComplement(res, 16): res;

            return res == 'FALSE' ? false : res;
        }
	} else {
		if(assembler.parser.isHexWithoutSuffix(value)){
			console.log("ISHEXPROPER");
			var res = returnDecimal ? assembler.parser.decFromHex(value).toString() : value.toUpperCase();
			if(!returnDecimal && isNeg) {
				res = assembler.parser.twosComplement(res, 16);
			}
			return res;
        } else
			return false;
	}
}

assembler.parser.getAccessor = function(value) {
	var type = assembler.parser.type(value);
	
	if(value == 'M')
		return 'M'; 										//EG MOV A, M 
	else if(type == 'integer')
		return value;										//EG RST 1 
	else if(type == 'name')
		return value;										//EG MOV A, B
	else if(type == '16-bit' || type == 'label')
		return '16-bit';									//EG LXI F500H
	else if(type == '8-bit')	
		return '8-bit';										//EG MVI A, F5H
	
	return false;
}

//Pad a number with `z`
/* If less than width
//   Create a new array of length of missing number of padding elements
//   Join that with `z`
//		Since array contained `undefined` joining results in only `z`'s
//	 Append n to it
*/
assembler.parser.pad = function (n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}











/**************************************************************
*assembler
**************************************************************/
//Directly augment assembler namespace.
//To Do! Fix RST's accessors

assembler.stateObject = {
    document: [],
    rawDocument: "",
    macroTable: [],
    macroLookupTable: {},
    symbolTable: {
        decimal: {},
        hexadecimal: {}
    },
    referenceTable: {},
    codePointTable: {},
	listing: {},
    cwlisting: [],
    errors: [],
    defbuffers: {},             //line -> buffer
    warnings: [],
    breakPointTable: [],
    breakPointLineAt: []
};

assembler.stateObject.reset = function () {
    assembler.stateObject.document = [];
    assembler.stateObject.macroTable = [];
    assembler.stateObject.macroLookupTable = {};
    assembler.stateObject.symbolTable.decimal = {};
    assembler.stateObject.symbolTable.hexadecimal = {};
    assembler.stateObject.referenceTable = {};
    assembler.stateObject.codePointTable = {};
    assembler.stateObject.listing = {};
    assembler.stateObject.cwlisting = [];
    assembler.stateObject.errors = [];
    assembler.stateObject.warnings = [];
    assembler.stateObject.defbuffers = {};
    assembler.stateObject.breakPointTable = [];
}

assembler.stateObject.addError = (message, line, info) => assembler.stateObject.errors.push({body: message, at: line, context: info == undefined ? false : info});
assembler.stateObject.addWarning = (message, line, info) => assembler.stateObject.warnings.push({body: message, at: line, context: info == undefined ? false: info});
assembler.stateObject.isMacro = (token) => assembler.stateObject.macroLookupTable.hasOwnProperty(token);
assembler.stateObject.isDup = (token) => (token == 'dup' || token == 'DUP');
assembler.stateObject.isCond = (token) => (token == 'if' || token == 'IF');
assembler.stateObject.isEqu = (token) => (token == 'equ' || token == 'EQU' || token == '=');
assembler.stateObject.isOrg = (token) => (token == 'org' || token == 'ORG');
assembler.stateObject.isDef = (token) => (token == 'def' || token == 'DEF');
assembler.stateObject.isDefarr = (token) => (token == 'defarr' || token == 'DEFARR');
assembler.stateObject.isDdef = (token) => (token == 'ddef' || token == 'DDEF');
assembler.stateObject.isBrk = (token) => (token == 'brk' || token == 'BRK');

assembler.tokenize = function() {
    assembler.stateObject.document = assembler.parser.tokenize(assembler.stateObject.rawDocument);
}

/*
    The assembler has three prepasses:
        1) Remove comments from code and tokenize
    The assembler has four passes:
        1) Macro Gathering and definition cleanup
        3) Processing of conditional statements, expansion of macros, expansion of DUPs, symbol gathering
        4) Gathering of references
        5) Assembling
*/

/*Preprocessing Pass*/
assembler.preprocess = function() {
    assembler.comment.removeCommentsFromRaw();
    console.log("TOKENIZING ", assembler.stateObject.rawDocument);
    assembler.tokenize();
    console.log("TOKENIZED TO ", assembler.stateObject.document);
}

/*Pass 1: Get and Delete from raw Macro definitions*/
assembler.getMacrosAndClean = function() {
    console.log("PROCESSING FOR MACROS DOCUMENT", assembler.stateObject.document);
    var ret = assembler.macro.populateMacroTables()
    assembler.macro.removeMacrosFromDoc();
    return ret;
}

/*Pass 2: Process IF/ELIF/ELSE/ENDIF, MACRO calls, DUP/ENDD, EQU, EQU replacement, BRK*/
assembler.processExtensions = function() {
    var doc = assembler.stateObject.document;
    var line = 0;
    var tokens = 1;

    while(line < doc.length) {
        var hasLabel = false;
        var lineAt = doc[line][0];
        if(doc[line][tokens][0].slice(-1) == ':')
            hasLabel = true;

        var primary = hasLabel ? doc[line][tokens][1] : doc[line][tokens][0];
        console.log(">>>", line, doc[line][tokens]);
        if(primary == undefined){
            ++line;
            continue;
        }

        console.log(primary.toUpperCase(), ':::":":');
        var fmt = assembler.format[primary.toUpperCase()];
        console.log(hasLabel, assembler.stateObject.isEqu(doc[line][tokens]), assembler.stateObject.isEqu(primary));
        if(assembler.stateObject.isEqu(primary) || (!hasLabel && assembler.stateObject.isEqu(doc[line][tokens][1])) || 
           assembler.stateObject.isDef(primary) || assembler.stateObject.isDdef(primary) || assembler.stateObject.isDefarr(primary))
            ;
        else {
            console.log("REPLACING", doc[line][tokens], "WRT", assembler.stateObject.symbolTable.decimal);
            for(var token = hasLabel ? 2 : 1; token < doc[line][tokens].length; ++token) {
                console.log(fmt == undefined ? false : fmt[token], assembler.parser.type(doc[line][tokens][token]));
                if(fmt != undefined && fmt[hasLabel ? token - 2: token - 1] == 'name')
                    continue;
                if(assembler.parser.type(doc[line][tokens][token].toUpperCase()) == 'name')
                    continue;
                doc[line][tokens][token] = assembler.symbol.processToken(doc[line][tokens][token]);
                console.log("REPL", doc[line][tokens][token]);
            }
        }

        if(assembler.stateObject.isBrk(primary)) {
            assembler.stateObject.breakPointLineAt.push(line);
            var temp = doc.slice(0, line);
            temp.push.apply(temp, doc.slice(line+1));
            assembler.stateObject.document = temp;
            doc = assembler.stateObject.document;
        } else if (assembler.stateObject.isMacro(primary)) {
            var macroBody = assembler.stateObject.macroTable[assembler.stateObject.macroLookupTable[primary]];
            //TODO this is akin to hitting the object with a hammer and then 
            //tryna superglue it back together. Oh Well. Fix this.
            var macroBodyCopy = JSON.parse(JSON.stringify(macroBody));
            var expanded = assembler.macro.expandMacro(
                macroBodyCopy,
                hasLabel ? doc[line][tokens].slice(2) : doc[line][tokens].slice(1),
                assembler.stateObject.macroTable[assembler.stateObject.macroLookupTable[primary]].index++
            );

            if(expanded == false){
                assembler.stateObject.addError('ASM_PE_CANTEXPANDMACRO', lineAt);
                ++line; continue;
            }

            if(hasLabel)
                expanded[0][1].unshift(doc[line][tokens][0]);

            var temp = doc.slice(0, line);
            temp.push.apply(temp, expanded);
            temp.push.apply(temp, doc.slice(line+1));
            assembler.stateObject.document = temp;
            doc = assembler.stateObject.document;
            console.log("AFTER CLEANING", doc);
        } else if (assembler.stateObject.isCond(primary)) {
            var dtree = assembler.conditional.constructDTree(line);

            console.log(">>>>>>>INIF", doc[line]);
            if(dtree == false) {
                assembler.stateObject.addError('ASM_PE_CANTRESOLVECOND', lineAt);
                ++line; continue;
            }

            var end = assembler.conditional.getIfEndLine(line);
            if(end == false) {
                assembler.stateObject.addError('ASM_PE_CANTRESOLVECOND', lineAt);
                ++line; continue;
            }

            var resolved = assembler.conditional.processDTree(dtree, assembler.stateObject.symbolTable.decimal);
            if(resolved == false) {
                assembler.stateObject.addWarning('ASM_PE_EMPTYBODY', lineAt);
                var temp = doc.slice(0, line);
                temp.push.apply(temp, doc.slice(end + 1));
                assembler.stateObject.document = temp;
                doc = assembler.stateObject.document;
            } else {
                var temp = doc.slice(0, line);
                temp.push.apply(temp, resolved);
                temp.push.apply(temp, doc.slice(end + 1));
                assembler.stateObject.document = temp;
                doc = assembler.stateObject.document;
                console.log("RESOLVED", resolved, "DOC", doc);
            }
        } else if (assembler.stateObject.isDup(primary)) {
            var end = assembler.dup.getEndLine(line);
            var toReplace = assembler.dup.expand(line, assembler.stateObject.symbolTable.decimal);
            
            if(end == false || toReplace === false)  {
                assembler.stateObject.addWarning('ASM_PE_CANTEXPANDDUP', lineAt);
                ++line; continue;
            }

            var temp = doc.slice(0, line);
            temp.push.apply(temp, toReplace);
            temp.push.apply(temp, doc.slice(end + 1));
            assembler.stateObject.document = temp;
            doc = assembler.stateObject.document;
        } else if (assembler.stateObject.isEqu(primary) || !hasLabel && assembler.stateObject.isEqu(doc[line][tokens][1])) {
            assembler.symbol.registerSymbol(line, assembler.stateObject.symbolTable.decimal);
            var temp = doc.slice(0,line);
            temp.push.apply(temp, doc.slice(line+1));
            assembler.stateObject.document = temp;
            doc = assembler.stateObject.document;
            console.log("EVALED", assembler.stateObject.symbolTable.decimal);
        } else 
            ++line;
    }
}

assembler.getDefBuffers = function () {
    var tokens = 1;
    var doc = assembler.stateObject.document;
    
    for(var line in doc) {
        var hasLabel = false;
        var lineInCode = doc[line][0];
        
        if(doc[line][tokens][0].slice(-1) == ':')
            hasLabel = true;
        
        var keyword = doc[line][tokens][ hasLabel ? 1:0];
        var args = doc[line][tokens].slice(hasLabel ? 2 : 1);

        if(assembler.stateObject.isDef(keyword)){
            if(args.length == 0)
                assembler.stateObject.defbuffers[line] = ["00"];
            else {
               var value = assembler.parser.parseVal(args.join(" "), assembler.stateObject.symbolTable.decimal);
                if(value === false){
                    assembler.stateObject.addError("ASM_DEF_INVALIDVALUE", lineInCode, {value: args.join(" ")});
                    continue
                }
                if(value.len > 2) {
                    assembler.stateObject.addWarning("ASM_DEF_TOOLONG8", lineInCode, {value: value});
                }
                value = assembler.parser.pad(value, 2).slice(-2);
                assembler.stateObject.defbuffers[line] = [value];
            }
        } else if (assembler.stateObject.isDdef(keyword)) {
            if(args.length == 0)
                assembler.stateObject.defbuffers[line] = ["00", "00"];
            else {
               var value = assembler.parser.parseVal(args.join(" "));
                if(value === false){
                    assembler.stateObject.addError("ASM_DEF_INVALIDVALUE", lineInCode, {value: args.join(" ")});
                    continue;
                }
                if(value.len > 4) {
                    assembler.stateObject.addWarning("ASM_DEF_TOOLONG16", lineInCode, {value: value});
                }
                value = assembler.parser.pad(value, 4).slice(-4);
                assembler.stateObject.defbuffers[line] = [value.slice(-2), value.slice(0,-2)];
            }
        } else if (assembler.stateObject.isDefarr(keyword)) {
            if(args.length == 0)
                continue;
            else {
                assembler.stateObject.defbuffers[line] = [];
                var length = args.length;
                for(var arg in args){
                    var value = assembler.parser.parseVal(args[arg]);
                    if(value === false){
                        assembler.stateObject.addError("ASM_DEF_INVALIDVALUE", lineInCode, {value: args[arg]});
                        break;
                    }
                    if(value.length > 2)
                        assembler.stateObject.addWarning("ASM_DEF_TOOLONG8", lineInCode, {value: args[arg]});
                    assembler.stateObject.defbuffers[line].push(assembler.parser.pad(value, 2).slice(-2));
                }
            }
        }
    }
}

assembler.gatherReferences = function () {
    var doc = assembler.stateObject.document;
    var tokens = 1;
    var currentPoint = '0000';
    
    for(var line in doc) {
        var hasLabel = false;
        var isOrg = false;
        var isDef = false;
        var lineInCode = doc[line][0];

        if(doc[line][tokens][0].slice(-1) == ':')
            hasLabel = true;
        
        var keyword = doc[line][tokens][hasLabel ? 1 : 0].toUpperCase();
        if(assembler.stateObject.isOrg(keyword)) {
            isOrg = true;
            var next = assembler.parser.parseVal(
                doc[line][tokens].slice(hasLabel ? 2 : 1).join(' '),
                assembler.stateObject.symbolTable.decimal
            );

            next = assembler.parser.pad(next, 4);

            if(next === false || next === 'false') {
                assembler.stateObject.addError('ASM_ORG_INVALIDVALUE', lineInCode, {value: doc[line][tokens].slice(hasLabel ? 2 : 1).join(" ")});
                continue;
            }
            
            if(next.length > 4) {
                assembler.stateObject.addWarning('ASM_ORG_TOOLONG16', lineInCode, {value: next});
                next = next.slice(-4);
            }
        
            currentPoint = next;

        } else if (assembler.stateObject.isDef(keyword) || assembler.stateObject.isDdef(keyword) ||
                   assembler.stateObject.isDefarr(keyword))
            isDef = true;
        
        var size = assembler.sizeOf(keyword);
        if(size == false && !isOrg && !isDef) {
            assembler.stateObject.addError('ASM_REF_INVALIDKEYWORD', lineInCode, {value: keyword});
            continue;
        }

        if(hasLabel) {
            var label = doc[line][tokens][0].slice(0,-1);     
            assembler.stateObject.referenceTable[label] = line;
        }
        
        if(isDef) {
            var buffer = assembler.stateObject.defbuffers[line];
            if(buffer == undefined)
                continue;
            assembler.stateObject.codePointTable[line] = currentPoint;
            var size = buffer.length;
            for(var _pt = 0; _pt < size; ++_pt)
                currentPoint = assembler.parser.incrementHex(currentPoint);
        } else if(isOrg) {
            continue;
        } else {
            assembler.stateObject.codePointTable[line] = currentPoint;
            for(var _pt = 0; _pt < size; ++_pt)
                currentPoint = assembler.parser.incrementHex(currentPoint);
        }
    }
}

assembler.assembleCode = function (){
	var current = '0000';
	var doc = assembler.stateObject.document;
	var tokens = 1;
	for(var line in doc) {
        var lineAtCode = doc[line][0];
        var current = assembler.stateObject.codePointTable[line];

		var hasLabel = false;

		if(doc[line][tokens][0].slice(-1) == ':')
			hasLabel = true;

		var keyword = doc[line][tokens][hasLabel ? 1 : 0];
            keyword = keyword.toUpperCase();
		var fmt = assembler.format[keyword];
        
        //Ignore line if line is ORG, DEF, DDEF or DEFARR

        if(assembler.stateObject.isOrg(keyword) || assembler.stateObject.isDef(keyword) ||
           assembler.stateObject.isDdef(keyword) || assembler.stateObject.isDefarr(keyword))
            continue;

		if(fmt == undefined) {
			assembler.stateObject.addError('ASM_ASM_INVALIDKEYWORD', lineAtCode, {value: keyword});
			continue;
		}

		var args = doc[line][tokens].slice(hasLabel ? 2 : 1);
		if(args.length != fmt.length) {
			assembler.stateObject.addError('ASM_ASM_WRONGNOOFARGS', lineAtCode, {needs: fmt.length, has: args.length});
			continue;
		}
		console.log("original", args);

		var accessors = [];

        //Type upgrading 
        //If RST1 then argument _is_ as it should be
        if(keyword == 'RST') {
            if(args[0].slice(-1) == 'H')
                args[0] = args[0].slice(0,-1);
        } else    
            for(var i in args)
                if(fmt[i] == '8-bit' || fmt[i] == '16-bit') {
                    var res = assembler.parser.parseVal(args[i], assembler.stateObject.symbolTable.decimal);
                    console.log("RESULT", res, "of", args[i]);
                    args[i] = res === false ? args[i] : res;
                    console.log(args);
                } else if(fmt[i] == 'name') {
                    args[i] = args[i].toUpperCase();
                }

        //Padding and width checking
        for(var i in args) {
            if(fmt[i] == '8-bit' && assembler.parser.isHex(args[i])){
                if(args[i].length > 2) {
                    assembler.stateObject.addWarning('ASM_ASM_TOOLONG8', lineAtCode, {value: args[i]});
                    args[i] = args[i].slice(-2);
                } else {
                    args[i] = assembler.parser.pad(args[i], 2);
                }
            } else if(fmt[i] == '16-bit' && assembler.parser.isHex(args[i])) {
                if(args[i].length > 4) {
                    assembler.stateObject.addWarning('ASM_ASM_TOOLONG16', lineAtCode, {value: args[i]});
                    args[i] = args[i].slice(-4);
                } else {
                    args[i] = assembler.parser.pad(args[i], 4);
                }
            }
        }

        //Get accessors
        //If RST # then # _is_ accessor
        if(keyword == 'RST') 
            for(var arg in args)
                accessors.push(args[arg]);
        else
            for(var arg in args)
                accessors.push(assembler.parser.getAccessor(args[arg]));

        var code;
        try {
            if(accessors.length === 0)
                code = assembler.codeOf[keyword].code;
            else if(accessors.length == 1)
                code = assembler.codeOf[keyword][accessors[0]].code;
            else
                code = assembler.codeOf[keyword][accessors[0]][accessors[1]].code;
        } catch(err) {
            assembler.stateObject.addError('ASM_ASM_MALFORMEDINSTR', lineAtCode, {keyword: keyword, format: fmt});
            continue;
        }
        var size = assembler.sizeOf(keyword);
        
        if(keyword == 'RST')
            ; //Skip parsing as RST's arguments are accessors NOT arguments
        else
            for(var arg in args){
                if(assembler.parser.type(args[arg]) == 'label') {
                    var lineAt = assembler.stateObject.referenceTable[args[arg]];
                    if(lineAt == undefined) {
                        assembler.stateObject.addError('ASM_ASM_NOLABELMATCH', lineAtCode, {value: args[arg]});
                        continue;
                    }
                    var replaceWith = assembler.stateObject.codePointTable[lineAt];
                    if(replaceWith == undefined) {
                        assembler.stateObject.addError('ASM_ASM_NOLABELADDR', lineAtCode, {value: args[arg], references: lineAt});
                        continue;
                    }
                    args[arg] = replaceWith;
                    //At this point we need to recheck the width of the replaced address
                    //It is garunteed to be in hex 4-hexdigits long but never hurts to check
                    //The main thing with this is that the compiler may issue an error, imperial to check in this case
                    //the error used is ASM_TRAP_COMPILERERROR at which point compilation stops completely
                    if(args[arg].length > 4) {
                        assembler.stateObject.addError('ASM_TRAP_COMPILERERROR', lineAtCode, {stack: '@replacedlencheck@label-replace@assembler'});
                        return false;
                    }
                }
            }
            
        var cwl = {};
        //Arglist is complete at this time, begin creation of code
        if(current in assembler.stateObject.listing) {
            assembler.stateObject.addWarning('ASM_ASM_OVERWRITES', lineAtCode, {address: current});
        }
        assembler.stateObject.listing[current] = code;
        cwl["line"] = doc[line][tokens].slice(0, hasLabel ? 2 : 1).join(" ") + " " + doc[line][tokens].slice(hasLabel? 2: 1).join(", ");
        cwl["codes"] = {};
        cwl["codes"][current] = code;
        current = assembler.parser.incrementHex(current, 4);
        if(keyword == 'RST'){
            ; //Skip, args are not ARGS
        } else {
            for(var type in fmt) {
                if(fmt[type] == '8-bit') {
                    if(current in assembler.stateObject.listing) {
                        assembler.stateObject.addWarning('ASM_ASM_OVERWRITES', lineAtCode, {address: current});
                    }

                    assembler.stateObject.listing[current] = args[type];
                    cwl.codes[current] = args[type];
                    current = assembler.parser.incrementHex(current, 4);
                } else if(fmt[type] == '16-bit') {
                    if(current in assembler.stateObject.listing) {
                        assembler.stateObject.addWarning('ASM_ASM_OVERWRITES', lineAtCode, {address: current});
                    }
                    assembler.stateObject.listing[current] = args[type].slice(-2);
                    cwl.codes[current] = args[type].slice(-2);
                    current = assembler.parser.incrementHex(current, 4);

                    if(current in assembler.stateObject.listing) {
                        assembler.stateObject.addWarning('ASM_ASM_OVERWRITES', lineAtCode, {address: current});
                    }

                    assembler.stateObject.listing[current] = args[type].slice(0,-2);
                    cwl.codes[current] = args[type].slice(0,-2);
                    current = assembler.parser.incrementHex(current, 4);
                }
            }
        }
        assembler.stateObject.cwlisting.push(cwl);
	}
}

assembler.addDefBuffers = function() {
    for(var buffer in assembler.stateObject.defbuffers) {
        //buffer = {sourceLine: ['HH', 'HH', 'HH', ...]}
        //starting address from each buffer = assembler.stateObject.codePointTable[sourceLine]
        //then keep incrementHex-ing it till len(buffer[sourceLine])
        var currentBuffer = assembler.stateObject.defbuffers[buffer];
        var sourceLine = buffer;
        var address = assembler.stateObject.codePointTable[sourceLine];
        for(var word in currentBuffer) {
            if(address in assembler.stateObject.listing) {
                assembler.stateObject.addWarning('ASM_DEF_OVERWRITES', buffer, {address: address});
            }
            assembler.stateObject.listing[address] = currentBuffer[word];
            address = assembler.parser.incrementHex(address, 4);
        }
    }
}

assembler.resolveBreakpoints = function() {
    for(var breakpoint in assembler.stateObject.breakPointLineAt) {
        var line = assembler.stateObject.breakPointLineAt[breakpoint];
        while(!(--line in assembler.stateObject.codePointTable)){
            if(line < 0)
                break;
            console.log(line, line in assembler.stateObject.codePointTable);
        }
        if(line < 0)
            continue;
        else {
            assembler.stateObject.breakPointTable.push(assembler.stateObject.codePointTable[line]);
        }
    }
}

assembler.compile = function(str) {
    assembler.stateObject.reset();
    assembler.stateObject.rawDocument = str;
    assembler.preprocess();
    assembler.getMacrosAndClean();
    assembler.processExtensions();
    assembler.getDefBuffers();
    assembler.gatherReferences();
    assembler.assembleCode();
    assembler.addDefBuffers();
    assembler.resolveBreakpoints();
    return JSON.parse(JSON.stringify(assembler.stateObject));
}











/**************************************************************
*macro
**************************************************************/
assembler.macro = {}

assembler.macro.isMacro = function(at) {
	var doc = assembler.stateObject.document;
	var tokens = 1;
	if(doc[at][tokens][0].slice(-1) == ':')
		return doc[at][tokens][1] == 'macro' || doc[at][tokens][1] == 'MACRO';
	else 
		return doc[at][tokens][0] == 'macro' || doc[at][tokens][0] == 'MACRO';
}
assembler.macro.getMacroEndLine = function(at, lines) {
	at = parseInt(at);
	var tokens = 1;

	var doc;

	if(lines == undefined){ 
		doc = assembler.stateObject.document;
	} else {
		doc = lines;
	}

	var i = at + 1;
	var sp = 1;
	var step = 0;

	while(i < doc.length && sp != 0) {
		if(doc[i][tokens].includes('MACRO') || doc[i][tokens].includes('macro'))
			++sp;
		else if(doc[i][tokens].includes('ENDM') || doc[i][tokens].includes('endm'))
			--sp;
		
		if(sp == 0)
			return i;
		
		++i;
	}

	if(sp != 0) assembler.stateObject.addError('AMMACRO_NOEND', at);
	return false;
}
//@FALSES AT: AMMACRO_NONAME, 
assembler.macro.getMacroFromLine = function(at) {
	at = parseInt(at);
	var tokens = 1;
	var end = assembler.macro.getMacroEndLine(at);

	if(end == false)
		return false;

	var doc = assembler.stateObject.document;
	var body = [];
	var localsDirectory = [];

	var i = parseInt(at) + 1;
	while(i < end) {
		if(doc[i][tokens][0][0] == '/')	
			localsDirectory.push(doc[i][tokens][0].slice(1,-1));
		if(doc[i][tokens][0].toUpperCase() == 'LOCALS'){
			console.log('GOTLOCALSYEAH-------------------------')
			localsDirectory.push.apply(localsDirectory, doc[i][tokens].slice(1));
			++i;
			continue;
		}
		body.push(doc[i]); 		//Append line to body.
        console.log("APPENDED ", doc[i], "TO MACRO");
		++i;
	}

	var definition = doc[at];

	if(definition[tokens][0].slice(-1) != ':'){
		assembler.stateObject.addError('AMMACRO_NONAME', at);
		return false;
	}

	var macroObject = {
		definition: definition,
		name: definition[tokens][0].slice(0, -1),
		args: definition[tokens].slice(2),
		body: body,
		locals: localsDirectory,
		index: 0
	};
    console.log("IT IS", macroObject);

	assembler.stateObject.macroTable.push(macroObject);
	assembler.stateObject.macroLookupTable[definition[tokens][0].slice(0, -1)] = assembler.stateObject.macroTable.length - 1;
	return true;
}

assembler.macro.cleanMacros = function() {
	var tokens = 1;
	var macroTable = assembler.stateObject.macroTable;
	for(var macro in macroTable) {
		var line = 0;
		while(line < macroTable[macro].body.length) {
			if(
				macroTable[macro].body[line][tokens].includes('macro') ||
				macroTable[macro].body[line][tokens].includes('MACRO')
			  ) {
				var end = assembler.macro.getMacroEndLine(line, macroTable[macro].body);

				if(end == false)
					return false;

				var cleaned = macroTable[macro].body.slice(0, line);
				cleaned.push.apply(cleaned, macroTable[macro].body.slice(end + 1));

				macroTable[macro].body = cleaned;
			}
			++line;
		}
	}
	return true;
}

assembler.macro.populateMacroTables = function() {
	var doc = assembler.stateObject.document;
	var tokens = 1;
	var ok = true;

	//Clean Macro Table
	assembler.stateObject.macroTable = [];
	assembler.stateObject.macroLookupTable = {	};

	//Create macros
	for(var line in doc){
		console.log("GATHERING AT " + line);
		if(doc[line][tokens].includes('MACRO') || doc[line][tokens].includes('macro')){
			var current = assembler.macro.getMacroFromLine(line);
            console.log("GATHERED", current);
			ok = ok ? current: false;
		}
	}

	if(ok){
		assembler.macro.cleanMacros();
		return true;
	}
	else
		return false;
}

assembler.macro.removeSingleMacro = function(at) {
	at = parseInt(at);
	var doc = assembler.stateObject.document;

	var final = doc.slice(0, at);
	var end = assembler.macro.getMacroEndLine(at);

	if(end == false) {
		console.log("CLEANED AT " + at);
		return false;
	}

	final.push.apply(final, doc.slice(end + 1));

	assembler.stateObject.document = final;
	return true;
}

assembler.macro.removeMacrosFromDoc = function() {
	var i = 0;
	var tokens = 1;
	while(i < assembler.stateObject.document.length) {
		console.log("removing at " + i + assembler.stateObject.document[i]);
		if(
			assembler.stateObject.document[i][tokens].includes('macro') ||
			assembler.stateObject.document[i][tokens].includes('MACRO')
		  ){
			i = assembler.macro.removeSingleMacro(i) ? i : i + 1;
		}
		else
			++i;
	}
}

assembler.macro.mangleLocal = function(local, index) {
	return local + "_indLocInstNo" + index;
}

assembler.macro.mangleLocals = function(body, locals, index) {
	var modlines = [];
	var tokens = 1;

	/*Create substitution symbol table*/
	var SUBSYMTAB = {};
	for(var x in locals)
		SUBSYMTAB[locals[x]] = assembler.macro.mangleLocal(locals[x], index);

	for(var i in body) {
		var line = body[i].slice();
		//First check if the line is labelled,
		if(line[tokens][0].slice(-1) == ':') {
			//and if label is the same as any of the locals,
			if(locals.includes(line[tokens][0].slice(1,-1))) {
				//mangle it.
				line[tokens][0] = assembler.macro.mangleLocal(line[tokens][0].slice(1,-1), index) + ":";
			}
		}

		for(var token in line[tokens]) {
			var temp = assembler.parser.simplify(line[tokens][token], {}, SUBSYMTAB);
			console.log("MANGLING LOCALS AT ", SUBSYMTAB, "========================= ", temp)
			if(temp !== false)
				line[tokens][token] = temp;
		}

		/*for(var token in line[tokens]) {
			if(locals.includes(line[tokens][token])) {
				line[tokens][token] = assembler.macro.mangleLocal(line[tokens][token], index);
			}
		}*/
		modlines.push(line);
	}
	return modlines;
}

assembler.macro.expandArgs = function(body, arglist, values) {
	if(arglist.length != values.length){
		assembler.stateObject.addError('AMMACRO_ARGMISMATCH', body[0][0], {needs: arglist.length, has: values.length});
		return false;
	}

	/*Process arguments*/
	var SYMTAB = {};
	var SSYMTAB = {};
	for(var i = 0; i < arglist.length; ++i){
		var val = parseInt(assembler.parser.parseVal(values[i], {}, true));
		if(!isNaN(val))
			SYMTAB[arglist[i]] = val;
		else
			SSYMTAB[arglist[i]] = values[i];
	}

   	var modlines = [];
	var tokens = 1;
	for(var lines in body) {
		var line = body[lines].slice();

		for(var token in line[tokens]) {
			var temp = assembler.parser.simplify(line[tokens][token], SYMTAB, SSYMTAB);
			console.log(line[tokens][token], SYMTAB, SSYMTAB);
			if (temp === false)
				;
			else
				line[tokens][token] = temp.toString();
		}

		//LabelReplacement 
		/* ONLY useful if mangling is disabled
		*/
		for(var arg in arglist) {
			if(line[tokens][0].slice(0,-1) == arglist[arg])
				line[tokens][0] = values[arg] + ':';
		}
		modlines.push(line);
	}

	return modlines;
}

assembler.macro.expandMacro = function(macro, arglist, index) {
	var body = macro.body;
	var afterMangling = assembler.macro.mangleLocals(body, macro.locals, index);
	var afterExpansion = assembler.macro.expandArgs(afterMangling, macro.args, arglist);
    console.log("MACRORETURNSTHISAFTEREXPANSION:", afterExpansion);
	return afterExpansion;
}











/**************************************************************
*conditional
**************************************************************/
/* Conditional Assembly module.
** Quirks: Treats empty IF or ELIF statements as ELSE statements and arg-containing ELSEs
**         as IF or ELIF, i.e., function of IF ELSE and ELIF are equivalent. The number of
**         tokens as the conditional determines what it will be parsed as.
**     and All values must be decimal for it to work properly.
*/

assembler.conditional = {} //register module.

assembler.conditional.isConditional = function(at) {
    var doc = assembler.stateObject.document;
	var tokens = 1;
	if(doc[at][tokens][0].slice(-1) == ':')
		return doc[at][tokens][1] == 'if' || doc[at][tokens][1] == 'IF';
	else 
		return doc[at][tokens][0] == 'if' || doc[at][tokens][0] == 'IF';
}

assembler.conditional.getIfEndLine = function(at, lines) {
	at = parseInt(at);
	var tokens = 1;

	var doc;

	if(lines == undefined){ 
		doc = assembler.stateObject.document;
	} else {
		doc = lines;
	}


	var i = at + 1;
	var sp = 1;

	while(i < doc.length && sp != 0) {
		if(doc[i][tokens].includes('IF') || doc[i][tokens].includes('if'))
			++sp;
		if(doc[i][tokens].includes('ENDIF') || doc[i][tokens].includes('endif'))
			--sp;
		if(sp == 0)
			return i;
		++i;
	}

	if(sp != 0) {
        assembler.stateObject.addError('AMCOND_NOEND', at);
        return false;
    }
}

assembler.conditional.constructDTree = function(at) {
    at = parseInt(at);
    var tokens = 1;
    var doc = assembler.stateObject.document;
    var end = assembler.conditional.getIfEndLine(at);

    if(end == false)
        return false;

    var i = at;
    var dtree = [];

    /* The decision tree is constructed as follows:
    ** [
    **      {
    **          condition: 'conditionstring',
    **          body: [[n1, 'line1'], [n2, 'line2'], ...]
    **      }, ...
    ** ]
    */

    //First line is garunteed to be the beginning of a IF statement
    //(one of the assumptions)
    var currentNode = {};
    while(i < end) {
        if(
            doc[i][tokens].includes('IF') ||
            doc[i][tokens].includes('if') ||
            doc[i][tokens].includes('ELIF') ||
            doc[i][tokens].includes('elif') ||
            doc[i][tokens].includes('ELSE') ||
            doc[i][tokens].includes('else')
          ) {
            dtree.push(currentNode);
            currentNode = { body: [] };

            var hasLabel = false;
            var condition = '';
            if(doc[i][tokens][0].slice(-1) == ':')
                hasLabel = true;
            
            if(hasLabel)
                condition = doc[i][tokens].slice(2);
            else
                condition = doc[i][tokens].slice(1);
            
            currentNode.condition = condition;
        } else {
            currentNode.body.push(doc[i]);
        }
        ++i;
    }
    dtree.push(currentNode);
    dtree = dtree.slice(1);
    return dtree;
}

//Returns the body of the node whose condition is truthy, if none, returns false
assembler.conditional.processDTree = function(dtree, symtab) {
    if(dtree == false)
        return false;

    console.log(dtree);
    for(var node in dtree) {
        var condition = dtree[node].condition;
        for(var token = 0; token < condition.length; ++token) {
            console.log(">>>>>>>>", condition[token]);
            var temp = assembler.parser.parseVal(condition[token], symtab, true).toString();
            console.log("::::::::", temp)
            if(temp === "false")
                continue;
            else
                condition[token] = temp;
        }
        var finalCondition = condition.join("");
        console.log("CORRECTED CONDITION ", condition);
        var evaluated = assembler.parser.parseExpr(finalCondition, symtab);
        console.log(finalCondition, "EVALUATES TO", evaluated);

        if(evaluated == false && condition != '')
            continue;

        if(condition == '' || evaluated == true || (evaluated != false && evaluated != 0)) {
            return dtree[node].body;
        }
    }
    return false;
}

__TESTSYMTAB = {
    A: 5,
    B: 7,
    C: 9,
    D: false
}











/**************************************************************
*dup
**************************************************************/
/*

** Quirks: All values should be in decimal.
*/

/* Module communicates with assembler with exceptions to reduce code module-side
** Thrown errors: CMDUP_NOEND: Dup end line not found  
** These errors MUST be implemented in any module implementing macros.     
*/

assembler.dup = { }

assembler.dup.getEndLine = (at) => {
    var sp = 1;
    var doc = assembler.stateObject.document;

    var i = parseInt(at) + 1;
    var tokens = 1;
	while(i < doc.length && sp != 0){
		if(doc[i][tokens].includes('dup')||doc[i][tokens].includes('DUP'))
			++sp;
		if(doc[i][tokens].includes('endd') || doc[i][tokens].includes('ENDD'))
			--sp;
		if(sp == 0){
			return i;
		}
		++i;
    }
    
    if(sp != 0) {
        assembler.stateObject.addError('AMDUP_NOEND', at);
        return false;
    }
}

assembler.dup.expand = (from, symtab) => {
    from = parseInt(from);
    var to = assembler.dup.getEndLine(from);
    var condition = '';
    var doc = assembler.stateObject.document;
    var tokens = 1;
    var toReturn = [];

    if(doc[from][tokens][0].slice(-1) == ':')
        condition = doc[from][tokens].slice(2).join(' ');
    else 
        condition = doc[from][tokens].slice(1).join(' ');
    
    times = assembler.parser.parseVal(condition, symtab, true).toString();
    if(times === false || assembler.parser.isDec(times) === false){
        assembler.stateObject.addError('AMDUP_IMPROPERVAL', from, {expression: condition});
        return false;
    }
    
    var times = parseInt(times);
    var toCopy = JSON.stringify(doc.slice(from+1, to));
    
    for(var i = 0; i < times; ++i)
        toReturn.push.apply(toReturn, JSON.parse(toCopy));

    return toReturn;
}











/**************************************************************
*comment
**************************************************************/
assembler.comment = {}

assembler.comment.removeCommentsFromRaw = () => {
    var rawDoc = assembler.stateObject.rawDocument;
    var final = '';
    var inComment = false;

    for(var i in rawDoc) {
		if(rawDoc[i] == ';' && !inComment)
			inComment = true;
		else if(rawDoc[i] == '\n' && inComment)
			inComment = false;

		if(!inComment)
            final += rawDoc[i];
    }
    
    assembler.stateObject.rawDocument = final;
}










/**************************************************************
*symbol
**************************************************************/
assembler.symbol = {}

assembler.symbol.registerSymbol = function (at, symtab) {
    var line = assembler.stateObject.document[at];
    var tokens = 1;
    console.log("CALLED REGISTRAR AT ", at, line);
    var keyword = line[tokens][1];

    if(line[tokens][0].slice(-1) != ':' && keyword != '=') {
        assembler.stateObject.addWarning('AMSYM_NOLABEL', at);
        return false;
    }
    
    var label = line[tokens][0].slice(0,keyword == '=' ? undefined: -1);
    var arg = line[tokens].slice(2).join(' ');
    console.log("Calling with" , assembler.stateObject.symbolTable.decimal, "To evaluate", arg);
    var value = assembler.parser.parseVal(arg, assembler.stateObject.symbolTable.decimal);
    console.log("Evaluated to ", value);
    if(value === false) {
        console.log(arg[0] == '"' && arg.slice(-1) == '"', at);
        if(arg[0] == '"' && arg.slice(-1) == '"' || arg[0] == "'" && arg.slice(-1) == "'"){
            arg = arg.slice(1,-1);
            assembler.stateObject.symbolTable.decimal[label] = [];
            assembler.stateObject.symbolTable.hexadecimal[label] = [];
            for(var i in arg) {
                var code = arg[i].charCodeAt(0);
                assembler.stateObject.symbolTable.decimal[label].push(code);
                assembler.stateObject.symbolTable.hexadecimal[label].push(assembler.parser.hexFromDec(code));
            }
            assembler.stateObject.symbolTable.decimal["__len_"+label] = arg.length;
            assembler.stateObject.symbolTable.hexadecimal["__len_"+label] = assembler.parser.hexFromDec(arg.length);
            return true;
        } else {
            assembler.stateObject.addError('AMSYM_INVALIDVALUE', at);
            return false;
        }
    } else {
        if(value.indexOf(',') !== -1) {
            value = (value + '').split(',');
            assembler.stateObject.symbolTable.decimal[label] = [];
            assembler.stateObject.symbolTable.hexadecimal[label] = [];
            for(var i in value) {
                assembler.stateObject.symbolTable.decimal[label].push(parseInt(value[i]));
                assembler.stateObject.symbolTable.hexadecimal[label].push(assembler.parser.hexFromDec(value[i]));
            }
            assembler.stateObject.symbolTable.decimal["__len_"+label] = value.length;
            assembler.stateObject.symbolTable.hexadecimal["__len_"+label] = assembler.parser.hexFromDec(value.length);
            return true;
        } else if(value == '' || value == 'NAN') {
            assembler.stateObject.addError('AMSYM_INVALIDVALUE', at);
            return false;
        } else {
            console.log("EVALUATED SYMBOL VALUE", value, assembler.stateObject.symbolTable.decimal);
            assembler.stateObject.symbolTable.hexadecimal[label] = value;
            assembler.stateObject.symbolTable.decimal[label] = assembler.parser.decFromHex(value);
            return true;
        }
    }
}

/* Parses an token with the help of the symbol table, replacing
** all instances of symbols in arg field with the corresponding values.

    USES SYMTAB FROM STATEOBJ AS IS CALLED MULTIPLE TIMES.
*/
assembler.symbol.processToken = (token) => {
    var startbrace = token.indexOf('{');
    var endbrace = token.indexOf('}');

    if(startbrace < endbrace) {
        var inbetween = (' ' + token).slice(startbrace + 2, endbrace + 1);
        try {
            var v = assembler.parser.parseVal(inbetween, assembler.stateObject.symbolTable.decimal);
            console.log("BRACEEXPANDING", inbetween, "TO", v);
            if(v !== false)
                token = token.slice(0,startbrace) + v + token.slice(endbrace + 1);
        } catch(err) {
            ;
        }
    }
    console.log("TOKEN", token);
    if(token[0] === '#')
        token = '__len_'+token.slice(1);
    var t = (' ' + token).slice(1);
    try {
        var val = assembler.parser.parseVal(t, assembler.stateObject.symbolTable.decimal);
        console.log(val);
        return val ? val + 'H' : token;
    } catch(err) {
        console.log("COULDNT EVALUATE");
        return token;
    }
}
module.exports.compileCode = mesg;
module.exports.errorParser = ;
