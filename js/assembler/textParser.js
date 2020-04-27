/* Specs: For this assembler, label and 16-bits are interchangable. While on second pass, labels are checked and replaced;
** For expression evaluation to work, include expr-eval.js
*/

/* Main assembler module
*/
var assembler = {
	helpers: {},
	parser: {},
	codeOf: {"LXI":{"length":3,"H":{"16-bit":{"code":"21"}},"SP":{"16-bit":{"code":"31"}},"B":{"16-bit":{"code":"01"}},"D":{"16-bit":{"code":"11"}}},"STAX":{"length":2,"D":{"code":"12"},"B":{"code":"02"}},"INX":{"length":2,"D":{"code":"13"},"H":{"code":"23"},"SP":{"code":"33"},"B":{"code":"03"}},"INR":{"length":2,"D":{"code":"14"},"H":{"code":"24"},"M":{"code":"34"},"A":{"code":"3C"},"B":{"code":"04"},"C":{"code":"0C"},"E":{"code":"1C"},"L":{"code":"2C"}},"DCR":{"length":2,"D":{"code":"15"},"H":{"code":"25"},"M":{"code":"35"},"A":{"code":"3D"},"B":{"code":"05"},"C":{"code":"0D"},"E":{"code":"1D"},"L":{"code":"2D"}},"MVI":{"length":3,"D":{"8-bit":{"code":"16"}},"H":{"8-bit":{"code":"26"}},"M":{"8-bit":{"code":"36"}},"A":{"8-bit":{"code":"3E"}},"B":{"8-bit":{"code":"06"}},"C":{"8-bit":{"code":"0E"}},"E":{"8-bit":{"code":"1E"}},"L":{"8-bit":{"code":"2E"}}},"RAL":{"length":1,"code":"17"},"DAD":{"length":2,"D":{"code":"19"},"H":{"code":"29"},"SP":{"code":"39"},"B":{"code":"09"}},"RIM":{"length":1,"code":"20"},"SHLD":{"length":2,"16-bit":{"code":"22"}},"DAA":{"length":1,"code":"27"},"SIM":{"length":1,"code":"30"},"STA":{"length":2,"16-bit":{"code":"32"}},"STC":{"length":1,"code":"37"},"MOV":{"length":3,"B":{"A":{"code":"47"},"B":{"code":"40"},"C":{"code":"41"},"D":{"code":"42"},"E":{"code":"43"},"H":{"code":"44"},"L":{"code":"45"},"M":{"code":"46"}},"C":{"M":{"code":"4E"},"B":{"code":"48"},"C":{"code":"49"},"A":{"code":"4F"},"D":{"code":"4A"},"E":{"code":"4B"},"H":{"code":"4C"},"L":{"code":"4D"}},"D":{"A":{"code":"57"},"B":{"code":"50"},"C":{"code":"51"},"D":{"code":"52"},"E":{"code":"53"},"H":{"code":"54"},"L":{"code":"55"},"M":{"code":"56"}},"E":{"M":{"code":"5E"},"B":{"code":"58"},"C":{"code":"59"},"A":{"code":"5F"},"D":{"code":"5A"},"E":{"code":"5B"},"H":{"code":"5C"},"L":{"code":"5D"}},"H":{"A":{"code":"67"},"B":{"code":"60"},"C":{"code":"61"},"D":{"code":"62"},"E":{"code":"63"},"H":{"code":"64"},"L":{"code":"65"},"M":{"code":"66"}},"L":{"M":{"code":"6E"},"B":{"code":"68"},"C":{"code":"69"},"A":{"code":"6F"},"D":{"code":"6A"},"E":{"code":"6B"},"H":{"code":"6C"},"L":{"code":"6D"}},"M":{"A":{"code":"77"},"B":{"code":"70"},"C":{"code":"71"},"D":{"code":"72"},"E":{"code":"73"},"H":{"code":"74"},"L":{"code":"75"}},"A":{"M":{"code":"7E"},"B":{"code":"78"},"C":{"code":"79"},"A":{"code":"7F"},"D":{"code":"7A"},"E":{"code":"7B"},"H":{"code":"7C"},"L":{"code":"7D"}}},"HLT":{"length":1,"code":"76"},"ADD":{"length":2,"B":{"code":"80"},"C":{"code":"81"},"D":{"code":"82"},"E":{"code":"83"},"H":{"code":"84"},"L":{"code":"85"},"M":{"code":"86"},"A":{"code":"87"}},"ADC":{"length":2,"B":{"code":"88"},"C":{"code":"89"},"A":{"code":"8F"},"D":{"code":"8A"},"E":{"code":"8B"},"H":{"code":"8C"},"L":{"code":"8D"},"M":{"code":"8E"}},"SUB":{"length":2,"B":{"code":"90"},"C":{"code":"91"},"D":{"code":"92"},"E":{"code":"93"},"H":{"code":"94"},"L":{"code":"95"},"M":{"code":"96"},"A":{"code":"97"}},"SBB":{"length":2,"B":{"code":"98"},"C":{"code":"99"},"A":{"code":"9F"},"D":{"code":"9A"},"E":{"code":"9B"},"H":{"code":"9C"},"L":{"code":"9D"},"M":{"code":"9E"}},"ACI":{"length":2,"8-bit":{"code":"CE"}},"ADI":{"length":2,"8-bit":{"code":"C6"}},"ANA":{"length":2,"A":{"code":"A7"},"B":{"code":"A0"},"C":{"code":"A1"},"D":{"code":"A2"},"E":{"code":"A3"},"H":{"code":"A4"},"L":{"code":"A5"},"M":{"code":"A6"}},"ANI":{"length":2,"8-bit":{"code":"E6"}},"CALL":{"length":2,"16-bit":{"code":"CD"}},"CC":{"length":2,"16-bit":{"code":"DC"}},"CM":{"length":2,"16-bit":{"code":"FC"}},"CMA":{"length":1,"code":"2F"},"CMC":{"length":1,"code":"3F"},"CMP":{"length":2,"A":{"code":"BF"},"B":{"code":"B8"},"C":{"code":"B9"},"D":{"code":"BA"},"E":{"code":"BB"},"H":{"code":"BC"}, "L":{"code":"BD"},"M":{"code":"BE"}},"CNC":{"length":2,"16-bit":{"code":"D4"}},"CNZ":{"length":2,"16-bit":{"code":"C4"}},"CP":{"length":2,"16-bit":{"code":"F4"}},"CPE":{"length":2,"16-bit":{"code":"EC"}},"CPI":{"length":2,"8-bit":{"code":"FE"}},"CPO":{"length":2,"16-bit":{"code":"E4"}},"CZ":{"length":2,"16-bit":{"code":"CC"}},"DCX":{"length":2,"B":{"code":"0B"},"D":{"code":"1B"},"H":{"code":"2B"},"SP":{"code":"3B"}},"DI":{"length":1,"code":"F3"},"EI":{"length":1,"code":"FB"},"IN":{"length":2,"8-bit":{"code":"DB"}},"JC":{"length":2,"16-bit":{"code":"DA"}},"JM":{"length":2,"16-bit":{"code":"FA"}},"JMP":{"length":2,"16-bit":{"code":"C3"}},"JNC":{"length":2,"16-bit":{"code":"D2"}},"JNZ":{"length":2,"16-bit":{"code":"C2"}},"JP":{"length":2,"16-bit":{"code":"F2"}},"JPE":{"length":2,"16-bit":{"code":"EA"}},"JPO":{"length":2,"16-bit":{"code":"E2"}},"JZ":{"length":2,"16-bit":{"code":"CA"}},"LDA":{"length":2,"16-bit":{"code":"3A"}},"LDAX":{"length":2,"B":{"code":"0A"},"D":{"code":"1A"}},"LHLD":{"length":2,"16-bit":{"code":"2A"}},"NOP":{"length":1,"code":"00"},"ORA":{"length":2,"A":{"code":"B7"},"B":{"code":"B0"},"C":{"code":"B1"},"D":{"code":"B2"},"E":{"code":"B3"},"H":{"code":"B4"},"L":{"code":"B5"},"M":{"code":"B6"}},"ORI":{"length":2,"8-bit":{"code":"F6"}},"OUT":{"length":2,"8-bit":{"code":"D3"}},"PCHL":{"length":1,"code":"E9"},"POP":{"length":2,"B":{"code":"C1"},"D":{"code":"D1"},"H":{"code":"E1"},"PSW":{"code":"F1"}},"PUSH":{"length":2,"B":{"code":"C5"},"D":{"code":"D5"},"H":{"code":"E5"},"PSW":{"code":"F5"}},"RAR":{"length":1,"code":"1F"},"RC":{"length":1,"code":"D8"},"RET":{"length":1,"code":"C9"},"RLC":{"length":1,"code":"07"},"RM":{"length":1,"code":"F8"},"RNC":{"length":1,"code":"D0"},"RNZ":{"length":1,"code":"C0"},"RP":{"length":1,"code":"F0"},"RPE":{"length":1,"code":"E8"},"RPO":{"length":1,"code":"E0"},"RRC":{"length":1,"code":"0F"},"RST":{"0":{"code":"C7"},"1":{"code":"CF"},"2":{"code":"D7"},"3":{"code":"DF"},"4":{"code":"E7"},"5":{"code":"EF"},"6":{"code":"F7"},"7":{"code":"FF"},"length":2},"RZ":{"length":1,"code":"C8"},"SBI":{"length":2,"8-bit":{"code":"DE"}},"SPHL":{"length":1,"code":"F9"},"SUI":{"length":2,"8-bit":{"code":"D6"}},"XCHG":{"length":1,"code":"EB"},"XRA":{"length":2,"A":{"code":"AF"},"B":{"code":"A8"},"C":{"code":"A9"},"D":{"code":"AA"},"E":{"code":"AB"},"H":{"code":"AC"},"L":{"code":"AD"},"M":{"code":"AE"}},"XRI":{"length":2,"8-bit":{"code":"EE"}},"XTHL":{"length":1,"code":"E3"}},
	format: {"LXI":["name","16-bit"],"STAX":["name"],"INX":["name"],"INR":["name"],"DCR":["name"],"MVI":["name","8-bit"],"RAL":[],"DAD":["name"],"RIM":[],"SHLD":["16-bit"],"DAA":[],"SIM":[],"STA":["16-bit"],"STC":[],"MOV":["name","name"],"HLT":[],"ADD":["name"],"ADC":["name"],"SUB":["name"],"SBB":["name"],"ACI":["8-bit"],"ADI":["8-bit"],"ANA":["name"],"ANI":["8-bit"],"CALL":["16-bit"],"CC":["16-bit"],"CM":["16-bit"],"CMA":[],"CMC":[],"CMP":["name"],"CNC":["16-bit"],"CNZ":["16-bit"],"CP":["16-bit"],"CPE":["16-bit"],"CPI":["8-bit"],"CPO":["16-bit"],"CZ":["16-bit"],"DCX":["name"],"DI":[],"EI":[],"IN":["8-bit"],"JC":["16-bit"],"JM":["16-bit"],"JMP":["16-bit"],"JNC":["16-bit"],"JNZ":["16-bit"],"JP":["16-bit"],"JPE":["16-bit"],"JPO":["16-bit"],"JZ":["16-bit"],"LDA":["16-bit"],"LDAX":["name"],"LHLD":["16-bit"],"NOP":[],"ORA":["name"],"ORI":["8-bit"],"OUT":["8-bit"],"PCHL":[],"POP":["name"],"PUSH":["name"],"RAR":[],"RC":[],"RET":[],"RLC":[],"RM":[],"RNC":[],"RNZ":[],"RP":[],"RPE":[],"RPO":[],"RRC":[],"RST":["integer"],"RZ":[],"SBI":["8-bit"],"SPHL":[],"SUI":["8-bit"],"XCHG":[],"XRA":["name"],"XRI":["8-bit"],"XTHL":[]},
}

assembler.helpers.isHex = function (token) {
	return /^[A-Fa-f0-9]+$/.test(token);
}

assembler.helpers.isHexWithSuffix = function(token) {
	return assembler.helpers.isHex(token) || 
		   (assembler.helpers.isHex(token.slice(0,-1)) && (token.slice(-1) == 'H'));
}

assembler.helpers.isDec = function (token) {
	return /^[0-9]+$/.test(token);
}

/*	Parser module
*/

/* Checks wether 16-bit, 8-bit, or label, or name
** If it cannot match to either 16-bit, 8-bit or name
** it will return label.
*/
assembler.helpers.type = function(token) {
	if(token.slice(-1) == 'H' && token.length > 1)
		token = token.slice(0,-1);

	if(['A', 'B', 'C', 'D', 'E', 'H', 'L', 'SP', 'PC', 'M'].includes(token))
		return('name');
	else if(token.length == 4 && assembler.helpers.isHex(token, 16))
		return '16-bit';
	else if(token.length == 2 && assembler.helpers.isHex(token, 16))
		return '8-bit';
	else
		return 'label';
}

assembler.helpers.isPreprocessorDirective = function(token) {
	if(['ORG', 'EQU', 'DEFMEM', 'DEFMEMWS', 'BRK'].includes(token))
		return true;
	return false;
}

assembler.helpers.incrementHex = function (hex){

	if(hex == 'FFFF')
		return '0000';

	return pad((parseInt(hex, 16) + 1).toString(16), 4).toUpperCase();
}

assembler.parser.tokenize = function(string) {
	var lines = string.split('\n');
	var tokens = [];
	for(var i in lines) {
		tokens[i] = lines[i].trim().split(/[\s,]+/);
		tokens[i] = tokens[i].filter(n => n);
	}
	tokens = tokens.filter(n => n.length == 0 ? false : true);
	return tokens;
}

assembler.getArgList = function(tokens){
	var i = 0;
	if(tokens[0].slice(-1) == ':')
		++i;
	return tokens.slice(i == 0 ? 1: 2);
}

/* One pass assembler
*/
assembler.assemble = function(string) {

	//Frequently used function, included here for terseness of actually accessing it.
	pad = function (n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}

	var exprParser = new exprEval.Parser();
	var defmemWordSize = 2;

	let listing = [];

	string = preprocessor.removeComments(string);

	var logs = [];

	var log = (l, t, b) => logs.push({line: l, type: t, body: b});

	var errFlag = false;
	var warnFlag = false;
	var flag = 'assembling';
	var lines = assembler.parser.tokenize(string);

	var references = {};
	var referencesLines = {};
	var forwardReferences = {};
	var forwardReferencesLines = {};
	var forwardReferencesListing = {};
	var equReplaces = {};
	var symtab = {};
	var decimalSymTab = {};
	var breakPoints = [];

	var currentLine = 'F000';
	var finalCode = {};

	for(var i in lines){
		var start = 0;
		var label = '';
		var hasLabel = false;
		/*Process if label*/
		if(lines[i][0].slice(-1) == ":"){
			start = 1;
			label = lines[i][0].slice(0,-1);
			references[label] = currentLine;
			referencesLines[currentLine] = i;
			hasLabel = true;
		}
		var args = assembler.getArgList(lines[i]);
		var instr = lines[i][start];
		var types = [];
		var accessor = [];

		for(var j in args) {
			types.push(instr == 'RST' ? 'integer' : assembler.helpers.type(args[j]));
		}
		var instrCode;

		if(assembler.helpers.isPreprocessorDirective(instr)) {
			if(instr == 'ORG') {
				//Useless label warn
				if(hasLabel) {
					warnFlag = true;
					log(i, 'warning', "ORG instruction has a label. Note that this label will NOT be usable.");
				}

				//Check if hex
				var isHexFlag = false;
				if(args[0].slice(-1) == 'H' && 
				   args[0].length != 1 && 
				   assembler.helpers.isHex(args[0].slice(0,-1)))
				{
					args[0] = args[0].slice(0,-1);
					isHexFlag = true;
				}
				if(assembler.helpers.isHex(args[0]) && args[0].length <= 4 && args.length == 1){
					currentLine = pad(args[0], 4);
				} else {
					errFlag = true;
					log(i, 'fatal error', "Improperly formed ORG instruction. Must be followed by a max 4 digit hex address.");
				}

				if(!isHexFlag)
					log(i, 'warning', "No trailing H after address, but address is still assumed hex.");


			} else if(instr == 'EQU') {

				//Invalid number of args
				if(args.length != 1) {
					errFlag = true;

					log(i,'warning',"Improperly formed EQU statement. All EQU statements must have 1 and only 1 argument.");
					continue;
				}

				//No label
				if(!hasLabel) {
					warnFlag = true;

					log(i, 'warning', "Symbol has no label and cannot be used in the program. Label must be on same line as instruction.");
					continue;
				}

				var isHexFlag = false;
				if(args[0].slice(-1) == 'H' && 
				   args[0].length != 1 &&
				   assembler.helpers.isHex(args[0].slice(0,-1)))
				{
					args[0] = args[0].slice(0,-1);
					isHexFlag = true;
				}

				if(isHexFlag){
					//All symbols are stored with H for easier parsing down the road
					symtab[label] = args[0] + 'H';
					decimalSymTab[label] = parseInt(args[0], 16);
				} else if(assembler.helpers.isDec(args[0])) {
					//Is decimal, apply same convention
					decimalSymTab[label] = parseInt(args[0]);
					symtab[label] = parseInt(args[0]).toString(16).toUpperCase() + 'H';
				} else if(assembler.helpers.isHex(args[0])){
					//Is hex after all, apply convention
					symtab[label] = args[0] + 'H';
					decimalSymTab[label] = parseInt(args[0], 16);
				} else {
					var result;
					try {
						result = exprParser.evaluate(args[0], decimalSymTab);
					} catch (err) {
						errFlag = true;
						log(i, 'fatal error', "Cannot evaluate expression " + args[0] + '.');
						continue;	//onto next INSTRUCTION
					}
					symtab[label] = result.toString(16).toUpperCase() + 'H';
				}
			} else if(instr == 'DEFMEM') {
				//No Label
				if(!hasLabel) {
					warnFlag = true;
					log(i, 'warning', "DEFMEM statement has no label and will not be accessible without manual address calculation. This is not recommended.");
				}

				//No arguments
				if(args.length == 0) {
					warnFlag = true;
					log(i, 'warning', "DEFMEM has no arguments and will not define anything.");
				}

				//Init buffer
				var buffer = [];

				for(var j in args) {
					//Assume not hexadecimal
					var isHexFlag = false;


					if(args[j].slice(-1) == 'H' &&
					   args[j].length != 1 && 
					   assembler.helpers.isHex(args[j].slice(0,-1)))
					{
					   //If it is not a len(1) string and has a H suffix and is Hex
						args[j] = args[j].slice(0,-1);
						isHexFlag = true;
					}

					if(isHexFlag == true)
						args[j] = args[j];
					else if(assembler.helpers.isDec(args[j]))
						args[j] = parseInt(args[j], 10).toString(16).toUpperCase();
					else if(assembler.helpers.isHex(args[j]))
						args[j] = args[j];
					else {
						var result;
						
						//Try to evaluate it with known symbols(in decimal form)
						try {
							result = exprParser.evaluate(args[j], decimalSymTab);
							result = parseInt(result);				//Truncate decimal part
						} catch (err) {
							errFlag = true;

							log(i, 'fatal error', "Cannot evaluate expression " + args[j] + '.');

							continue;							//Could not eval
						}										//False inappropriate, may be 0
					}

					if(args[j].length > defmemWordSize) {
						warnFlag = true;

						log(i, 'warning', 'Expression ' + args[j] + ' is greater than defined DEFMEM word size. Truncating and using last ' + defmemWordSize + ' hex digits, that is '+ args[i].slice(-defmemWordSize) +'.');
					} 

					//.slice -> truncates it to defmemWordSize
					//.pad -> if it is smaller than defmemWordSize, rightpads it
					buffer.push(pad(args[j].slice(-defmemWordSize), defmemWordSize));
				}

				//Create a listing for the DEFMEM instruction
				listing[i] = {
					code: [],
					instr: instr + ' ' + args.join(', ')
				}

				//Write from buffer to memory.
				for(var element in buffer) {
					for(var pointer = buffer[element].length - 2; pointer >= 0; pointer -= 2) {
						finalCode[currentLine] = buffer[element].slice(pointer, pointer + 2);
						
						//Populate listing for DEFMEM
						listing[i].code.push({location: currentLine, code: buffer[element].slice(pointer, pointer + 2)});
						currentLine = assembler.helpers.incrementHex(currentLine);
					}
				}

			} else if(instr == 'DEFMEMWS') {

				//If invalid number of arguments. Flag for i18n
				if(args.length != 1) {
					errFlag = true;
					log(i, 'warning', "Improperly formed DEFMEMWS statement. All DEFMEMWS statements must have 1 and only 1 argument.");
					continue;
				}

				//Useless label check
				if(hasLabel) {
					warnFlag = true;
					log(i, 'warning', "DEFMEMWS Symbol has label. Note that this label will NOT be useable.");
				}

				//Check if hexadecimal
				var isHexFlag = false;
				if(args[0].slice(-1) == 'H' &&
				   args[0].length != 1 && 
				   assembler.helpers.isHex(arg[0].slice(0, -1))){
				   //If it ends with a H and actually IS a hex no.
					args[0] = args[0].slice(0,-1);
					isHexFlag = true;
				}


				if(isHexFlag)											//If already decided hex
					defmemWordSize = parseInt(args[0], 16);
				else if(assembler.helpers.isDec(args[0])) 			//Else if it may be dec
					defmemWordSize = parseInt(args[0], 10);
				else if(assembler.helpers.isHex(args[0]))			//Not dec, check for hex
					defmemWordSize = parseInt(args[0], 16);
				else {												//Not hex as well, may be expr
					var result;											//Evaluate it
					try {
						result = exprParser.evaluate(args[0], decimalSymTab);
					} catch (err) {
						result = false;									//Not any type
					}
					if(result === false) {								//So mark as error and move on.
						errFlag = true;
						log(i, 'fatal error', "Cannot evaluate expression " + args[0] + '.');
					} else {
						defmemWordSize = parseInt(result, 10);			//Otherwise, if WAS valid, set.
					}
				}

				//If is not even, Then error (avoid dealing with ambiguity of nonint.)
				if(defmemWordSize % 2 != 0){
					errFlag = true;
					log(i, 'fatal error', 'DEFMEM word size must be even, ' + defmemWordSize + ' isn\'t even.');
				}

			} else if(instr == 'BRK') {
				//Push onto breakpoints.
				breakPoints.push(currentLine);
			}
			continue;	//onto next instr.
		}				//this is to avoid yet another layer of if else`s

		/*EQU substitution*/
		//Linear on each arg, hopefully.
		for(var currentArg in args) {
			if(symtab.hasOwnProperty(args[currentArg])){

				//Creates table for replacements
				//Req.d. for debugging purposes
				//<<!MARK>> as obsolete (?)
				//<<!REASON>> increases complexity 
				if(equReplaces.hasOwnProperty(args[currentArg])) {
					equReplaces[args[currentArg]].push(i);
				} else {
					equReplaces[args[currentArg]] = [];
					equReplaces[args[currentArg]].push(i);
				}

				//Actual Substitution
				args[currentArg] = symtab[args[currentArg]];
			}
		}

		//Push types in accessor. This is what will be used to 
		//Actually find the instruction.
		for(var j in types) {
			if(args[j] == 'M') {
				accessor.push('M');										//EG MOV A, M 
			} else if(types[j] == 'integer') {
				accessor.push(args[j]);									//EG RST 1 
			} else if(types[j] == 'name') {
				accessor.push(args[j]);									//EG MOV A, B
			}else if(types[j] == '16-bit' || types[j] == 'label') {
				accessor.push('16-bit');								//EG LXI F500H
			} else if(types[j] == '8-bit') {
				accessor.push('8-bit');									//EG MVI A, F5H
			}
		}

		//type inferencing and checking
		var fmt = assembler.format[instr];

		//If instruction is wrogn
		if(fmt == undefined) {
			errFlag = true;
			log(i, 'fatal error', lines[i].join(" ") + " is not a valid instruction or directive.");
			continue;
		}

		if(fmt.length != args.length) {
			errFlag = true;
			console.log(errFlag, 'has been error @');
			log(i, 'fatal error','Mismatch in argument length, expected '+fmt.length+' got '+args.length+'.');
			continue;
		}

		//Type inferencing and casting
		for(var j = 0; j < args.length; ++j) {

			//Only typeinference 8 and 16 bit values
			if(fmt[j] != '8-bit' && fmt[j] != '16-bit')
				continue;

			//Check if label
			//Logic: If the format expects a 16-bit hex and the number cannot be cast
			//as such then it is automatically assumed as hex. 
			//Side effect: Fully numeric labels eg ABBA will be treated as hex numbers
			//not lables. This is intentional, to keep instruction format familiar to
			//students who expect hex numbers of form ####H, not 0x####, which would solve
			//said issue.
			if(fmt[j] == '16-bit' && !assembler.helpers.isHexWithSuffix(args[j])) {
				continue;
			}

			var temp = args[j];

			//If it isn't explicitly an hexadecimal number
			if(args[j].slice(-1) != 'H'){

				//But cannot be cast into a decimal number but
				//_can_ be cast into a hexadecimal number
				if(!assembler.helpers.isDec(args[j]) && 
					assembler.helpers.isHex(args[j]))
				{
					args[j] = args[j] + 'H';
					--j; continue;
				}

				//If it cannot be cast into anything
				if(!assembler.helpers.isDec(args[j]) &&
				   !assembler.helpers.isHex(args[j]))
				{
					errFlag = true;
					log(i, 'fatal error',args[j] + ' is not a valid number.');
					continue;
				}

				//Else assume it can be cast into a decimal number
				var maxLimitForArg = (fmt[j] == '8-bit') ? 0xFF : 0xFFFF;

				//If the cast integer is bigger than what is allowed
				if(parseInt(args[j], 10) > maxLimitForArg) {
					log(i, 'warning', 'Cannot convert '+args[j]+' to a valid ' + fmt[j] + ' number. Only taking last two digits '+parseInt(args[j], 10).toString(16).toUpperCase().slice(-2)+'H after conversion to hex.')
				}

				//Slice and set
				args[j] = parseInt(args[j], 10).toString(16).toUpperCase().slice((fmt[j] == '8-bit')? -2: -4);
				args[j] = pad( args[j], (fmt[j] == '8-bit')? 2: 4);

				accessor[j] = fmt[j];
				types[j] = fmt[j];

				//Else it _is_ explicitly an integer
			} else {
				var maxLengthForArg = (fmt[j] == '8-bit')? 2: 4;

				args[j] = pad(args[j].slice(0,-1), maxLengthForArg);

				//But is not valid
				if(!assembler.helpers.isHex(args[j])) {
					errFlag = true;
					log(i, 'fatal error', args[j] + ' is not a valid number.');
					continue;
				}

				//But is too large
				if(args[j].length > maxLengthForArg) {
					log(i, 'warning', ''+ args[j]+' too big to be ' + fmt[j] + '. Only taking last two digits '+args[j].slice(-2)+'H.');
					args[j] = args[j].slice(-1 * maxLengthForArg);
				}

				//Done
				accessor[j] = fmt[j];
				types[j] = fmt[j];
			}
		}


		console.log(">>", fmt);

		//Type checking
		for(var j in fmt) {

			var thistype = assembler.helpers.type(args[j]);

			//If the instruction is RST, that can only take 0-6.
			if(instr == 'RST') {
				var int = parseInt(args[0]);

				//The parseFloat part is to check for inputs like 5.5, which
				//In the other case would be accepted. This might cause issues
				//When the user is actually trying to get RST 5.5 (say) to work
				if(int < 0 || int > 7 || (parseFloat(args[0])%1) > 0) {
					errFlag = true;
					log(i, 'fatal error', 'Instruction Malformed, RST # expects 1 integer argument within range [0-7].');
				}

			//If the format is supposed to be 16-bit
			} else if(fmt[j] == '16-bit') {

				//If the type cannot be cast to either a 16-bit number
				//Or a label. Will never actually occur as _any_ value
				//that cannot be parsed as a number is treated as label
				//for 16-bit args.
				if(thistype != '16-bit' && thistype != 'label'){
					errFlag = true;
					log(i, 'fatal error', 'Instruction Malformed, ' + instr +' expects either 16-bit immidiate or label as argument '+(parseInt(j)+1).toString() + '.');
				}

			//If number is supposed to be 8-bit
			} else if(fmt[j] == '8-bit') {
				if(thistype != '8-bit') {
					errFlag = true;
					console.log(errFlag, 'has been error @');
					log(i, 'fatal error', 'Instruction Malformed, ' + instr +' expects 8-bit immidiate as argument '+(parseInt(j)+1).toString() +'.');
				}

			//if arg is supposed to be `name`
			} else if(fmt[j] != thistype) {
				errFlag = true;
				console.log(errFlag, 'has been error @');
				log(i, 'fatal error', 'Instruction Malformed, ' + instr +' expects register (or register pair) name as argument '+(parseInt(j)+1).toString() +'.');
			}
		}

		//Access the tree(ish?) structure to find the code
		if(!errFlag){
			try{
				switch(args.length) {
					case 0: instrCode = assembler.codeOf[instr].code;
							break;
					case 1: instrCode = assembler.codeOf[instr][accessor[0]].code;
							break;
					case 2: instrCode = assembler.codeOf[instr][accessor[0]][accessor[1]].code;
							break;
					default:errFlag = true;
							break;
				}

			//Couldn't find out code. Instruction probably malformed
			} catch(err) {
				errFlag = true;
				log(i, 'fatal error', 'Instruction Malformed, with unknown error. Contact support.');
				continue;
			}
		}

		//Assign code
		finalCode[currentLine] = instrCode;

		//Create listing for formatted output purposes
		listing[i] = {
			code: [],
			instr: instr + ' ' + args.join(', ')
		}

		//Push the code in
		listing[i].code.push({location: currentLine, code: instrCode});

		currentLine = assembler.helpers.incrementHex(currentLine);
	
		//Process arguments
		for(var j in types) {

			//Process 8-bit
			if(types[j] == '8-bit') {
				finalCode[currentLine] = args[j];								//Append code

				listing[i].code.push({location: currentLine, code: args[j]});	//Update listing

				currentLine = assembler.helpers.incrementHex(currentLine);		//Increment currentLine pointer

			//Process 16-bit
			} else if(types[j] == '16-bit') {
				finalCode[currentLine] = args[j].slice(2);
				listing[i].code.push({location: currentLine, code: args[j].slice(2)});
				currentLine = assembler.helpers.incrementHex(currentLine);

				finalCode[currentLine] = args[j].slice(0,2);
				listing[i].code.push({location: currentLine, code: args[j].slice(0,2)});
				currentLine = assembler.helpers.incrementHex(currentLine);

			//Process label
			} else if(types[j] == 'label' && (fmt[j] != '8-bit')) {

				//If already defined
				if(references.hasOwnProperty(args[j])) {
					args[j] = references[args[j]];				//No need to check, garunteed okay
					finalCode[currentLine] = args[j].slice(2);
					listing[i].code.push({location: currentLine, code: args[j].slice(2)});
					currentLine = assembler.helpers.incrementHex(currentLine);


					finalCode[currentLine] = args[j].slice(0,2);
					listing[i].code.push({location: currentLine, code: args[j].slice(0,2)});
					currentLine = assembler.helpers.incrementHex(currentLine);
				
				//If forward defined
				} else {

					//And actually has been used before
					if(forwardReferences.hasOwnProperty(args[j])) {

						//Mark for later solving
						forwardReferences[args[j]].push(currentLine);

						//Necessary for listing
						forwardReferencesListing[args[j]].at.push(i);
						forwardReferencesLines[currentLine] = i;

						//Increment pointer twice
						currentLine = assembler.helpers.incrementHex(currentLine);
						currentLine = assembler.helpers.incrementHex(currentLine);
					
					//But not yet defined
					} else {

						//Create entry and mark
						forwardReferences[args[j]] = [];
						forwardReferences[args[j]].push(currentLine);

						//Necessary for listing
						forwardReferencesListing[args[j]] = {at: [], foundAt: false};
						forwardReferencesListing[args[j]].at.push(i);
						forwardReferencesLines[currentLine] = i;

						//Increment pointer twice
						currentLine = assembler.helpers.incrementHex(currentLine);
						currentLine = assembler.helpers.incrementHex(currentLine);
					}
				}
			}
 		}
	}

	//Is handled after main assembling
	for(var label in forwardReferences) {
		for(var line in forwardReferences[label]) {

			//Get currentline from forwardReferences.
			currentLine = forwardReferences[label][line];

			//If the reference was encountered
			if(references.hasOwnProperty(label)) {
					var arg = references[label];

					//Mark it for final listing
					forwardReferencesListing[label].foundAt = arg;

					//List the address in the listing
					listing[forwardReferencesLines[currentLine]].code.push({location: currentLine, code: arg.slice(2)});
					listing[forwardReferencesLines[currentLine]].code.push({location: assembler.helpers.incrementHex(currentLine), code: arg.slice(0,2)});

					//Actually compute and add addresses
					finalCode[currentLine] = arg.slice(2);
					currentLine = assembler.helpers.incrementHex(currentLine);

					finalCode[currentLine] = arg.slice(0,2);
					currentLine = assembler.helpers.incrementHex(currentLine);
			
			//If the reference was NOT encountered
			} else {
				errFlag = true;
				log(forwardReferencesLines[currentLine],  'fatal error', 'Label ' + label + ' used without declaration.');
			}
		}
	}

	return {
		listing: finalCode,
		logs: logs,
		success: !errFlag,
		error: errFlag,
		warning: warnFlag,
		debug: {
			references: references,
			referencesLines: referencesLines,
			forwardReferences: forwardReferences,
			forwardReferencesListing: forwardReferencesListing,
			symbolTable: symtab,
			listing: listing,
			breakpoints: breakPoints,
			equReplaces: equReplaces
		}
	}
}

/*
**	
*/