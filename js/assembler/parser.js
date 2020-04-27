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
	var hangingLabel = false;
	var hangedAt = 0;
	var hangedLabelIs = false;

	for(var i in lines) {
		if(hangingLabel) {
			var temp = assembler.parser.splitter(lines[i].trim())
			temp = temp.filter(n => n);
			var label = false;
			if(temp.length >= 1 && temp[0].slice(-1) == ':'){		//update label
				hangedLabelIs = temp[0];
				temp = temp.slice(1);
			}
			
			//Did not find proper line, try next line
			if(temp.length == 0)
				continue;

			tokens[hangedAt][1].push.apply(tokens[hangedAt][1], temp);
			tokens[hangedAt][1][0] = hangedLabelIs;
			hangingLabel = false;		//Only one hanging label line per label
		} else {
			tokens[i] = [];
			tokens[i][1] = assembler.parser.splitter(lines[i].trim());
			tokens[i][1] = tokens[i][1].filter(n => n);
			tokens[i][0] = i;

			/* Check for hanging label
			** Hanging label lines have same line number as label.
			*/
			if(tokens[i][1].length >= 1 && tokens[i][1][0].slice(-1) == ':') {
				if(tokens[i][1].length == 1) {
					hangingLabel = true;
					hangedAt = i;
					hangedLabelIs = tokens[i][1][0];
				}
			}
		}
	}

	tokens = tokens.filter(n => {
		if(n[1].length > 1){
			return true;
		} else if(n[1].length === 1) {
			if(n[1][0].slice(-1) == ':')
				return false;
			else
				return true;
		} else {
			return false;
		}
	});	
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
