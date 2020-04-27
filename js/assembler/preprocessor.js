/*
	SHOULD ONLY CALL:
		preprocessor.expandMacros();
		preprocessor.removeComments();
		preprocessor.unrollDups();
		preprocessor.getPreprocessorVars();
		preprocessor.conditionalize();
	EQU and DEF are handled by the assembler instead.
*/

/*
** 1: Cannot find matching ENDD
** 2: Cannot find matching ENDM
*/
function PreprocessorException(code, at) {
  const error = new Error('');
  error.code = code;
  error.at = at;
  return error;
}

PreprocessorException.prototype = Object.create(Error.prototype);

var preprocessor = { }

/*As with other preprocessor funcs pass the whole asm code as input string*/
preprocessor.removeComments = function(string) {
	var inComment = false;
	var final = '';

	for(var i in string) {
		if(string[i] == ';' && !inComment)
			inComment = true;
		else if(string[i] == '\n' && inComment)
			inComment = false;

		if(!inComment)
			final += string[i];
	}
	return final;
}

/* Technically a filter, not a parser
** Divides text -> lines @'\n'
** Divides lines -> tokens @' '
** Filters out empty lines
*/
preprocessor._parse = function(string, divideIntoTokens) {
	var lines = string.split('\n');
	var tokens = [];
	if(divideIntoTokens) {
		for(var i in lines) {
			tokens[i] = lines[i].trim().split(/[\s,]+/);
			tokens[i] = tokens[i].filter(n => n);
		}
		tokens = tokens.filter(n => n.length == 0 ? false : true);
	} else
		tokens = lines;
	return tokens;
}

/* Tokenize a single line
*/
preprocessor.tokenize = function(line) {
	line = line.trim().split(/[\s,]+/);
	return line;
}

/* Unrolls a single DUP statement
*/
preprocessor.unrollSingleDup = function(lines, index) {
	var i = index + 1;

	//Find the end of the DUP using a rudimentary stack
	//Stack is taken as a single int, we are interested in the position of top 
	//of the stack, not the actual values.
	var end;
	var sp = 1;
	while(i < lines.length && sp != 0){
		if(lines[i].includes('dup')||lines[i].includes('DUP'))
			++sp;
		if(lines[i].includes('endd') || lines[i].includes('ENDD'))
			--sp;
		if(sp == 0){
			end = i;
			break;
		}
		++i;
	}

	//End not found
	if(sp != 0){
		throw new PreprocessorException(1, index);
	}

	//Slice together the lines
	var toBeCopied = lines.slice(index + 1, end);
	var result = lines.slice(0,index);
	var times = preprocessor.tokenize(lines[index]).indexOf('DUP') != -1 ? 
				preprocessor.tokenize(lines[index]).indexOf('DUP') :
				preprocessor.tokenize(lines[index]).indexOf('dup');
	times = preprocessor.tokenize(lines[index])[times + 1];

	//Create final code output
	for(i = 0; i < times; ++i)
		result.push.apply(result, toBeCopied);
	result.push.apply(result, lines.slice(end + 1));
	return result;
}

//Process all DUP statements
preprocessor.unrollDups = function(string) {
	var  lines = preprocessor._parse(string, false);
	var i = 0;
	while(i < lines.length) {
		if(lines[i].includes('dup') || lines[i].includes('DUP')){
			var result = preprocessor.unrollSingleDup(lines, i);
			lines = result;
		} else {
			++i;
		}
		++step;
	}
	return lines.join('\n');
}

//Get the end line of the macro. This is computed using the same method
//as used in unrolling the DUPS
preprocessor.getMacroEndLine = function(lines, at) {
	var i = at + 1;
	var sp = 1;
	while(i < lines.length && sp != 0){
		if(lines[i].includes('MACRO')||lines[i].includes('macro'))
			++sp;
		if(lines[i].includes('ENDM') || lines[i].includes('endm'))
			--sp;
		if(sp == 0){
			return i;
		}
		++i;
	}

	if(sp != 0) throw new PreprocessorException(2, at);
}

//Extracts a macro from given line
preprocessor.getMacroFromLine = function(lines, at) {
	var end = preprocessor.getMacroEndLine(lines, at);

	var localsDirectory = [];

	var i = at + 1;
	while(i < end) {
		var processed = preprocessor.tokenize(lines[i]);
		if(processed[0][0] == '/')
			localsDirectory.push(processed[0].slice(0,-1));
		++i;
	}

	var definition = preprocessor.tokenize(lines[at]);

	return {
		definition: definition,
		name: definition[0].slice(0, -1),
		args: definition.slice(2),
		body: lines.slice(at+1, end),
		locals: localsDirectory,
		index: 0
	};
}

//Create and populate macro table
preprocessor.populateMacroTable = function(string) {
	var lines = preprocessor._parse(string, false);

	var macros = {}
	for(var i=0; i<lines.length; ++i){
		if(lines[i].includes('MACRO')|| lines[i].includes('macro')){
			var macro = preprocessor.getMacroFromLine(lines, i);
			macros[macro.name] = macro;
		}
	}

	for(var i in macros)
		macros[i] = preprocessor.cleanMacro(macros[i]);

	return macros;
}

step = 0;

//Clean the source code within all macros, ie removes nested declarations
preprocessor.cleanMacro = function(macro, at){
	if(at == undefined)
		at = 0;

	i = 0;
	while(i < macro.body.length) {
		if(macro.body[i].includes('MACRO') || macro.body[i].includes('macro')) {
			var endAt = preprocessor.getMacroEndLine(macro.body, i);
			var removed = macro.body.slice(0, i);
			removed.push()
			removed.push.apply(removed, macro.body.slice(endAt + 1));
			macro.body = removed;
		} else {
			++i;
		}
	}
	return macro;
}

//Removes a macro
preprocessor.macroRemovalUtility = function(lines, at) {
	var final = lines.slice(0, at);
	var end = preprocessor.getMacroEndLine(lines, at);
	final.push.apply(final, lines.slice(end + 1));
	return final;
}

//Remove macro definitions from source code
preprocessor.removeMacroDefs = function(string) {
	lines = preprocessor._parse(string, false);
	var i = 0;
	while(i < lines.length) {
		if(lines[i].includes('MACRO') || lines[i].includes('macro')) {
			lines = preprocessor.macroRemovalUtility(lines, i);
		} else {
			++i;
		}
	}
	return lines.join('\n');
}

//Mangle a local
//TODO allow changing of the mangled name
preprocessor.mangleLocal = function(local, index) {
	return local.slice(1) + "_indLocInstNo" + index;
}

//Mangle all locals in a macro during expansion
preprocessor.mangleLocals = function(body, macro, index) {
	var modlines = [];

	for(var i in body) {
		var line = body[i];
		for(var j in macro.locals) {
			var regex = new RegExp(macro.locals[j] + ":", "g");
			line = line.replace(regex, preprocessor.mangleLocal(macro.locals[j], index) + ': ');
			var regex = new RegExp(macro.locals[j], "g");
			line = line.replace(regex, preprocessor.mangleLocal(macro.locals[j], index));
		}
		modlines.push(line);
	}
	return modlines;
}

//Expand arguments in source code of macro during expansion
preprocessor.expandArgs = function(body, macro, arglist) {
	if(arglist.length != macro.args.length)
		return false;

	var modlines = [];
	for(var i in body) {
		var flag = body[i][0] == "\t" ? true : false;
		var line = preprocessor.tokenize(body[i]);
		for(var j = 0; j < macro.args.length; ++j) {
			for(var k = 0; k < line.length; ++k) {
				if(line[k].slice(0, -1) == macro.args[j]) {
					line[k] = arglist[j] + ':';
				} else if(line[k] == macro.args[j]) {
					line[k] = arglist[j];
				}
			}
		}
		line = (flag ? "\t" : "") + line.join(' ');
		modlines.push(line);
	}
	return modlines;
}

//Get the argument list given the tokens
preprocessor.getArgList = function(tokens){
	var i = 0;
	if(tokens[0].slice(-1) == ':')			//Includes label
		++i;
	return tokens.slice(i == 0 ? 1: 2);		//If label present, args start from 2 else 1
}

//Check if macro
preprocessor.isMacro = function(word, macroTable) {
	if(macroTable.hasOwnProperty(word))
		return true;
	return false;
}

//Expand macros
preprocessor.expandMacros = function(string, options) {

	if(options == undefined)
		options = {};
	if(!options.hasOwnProperty('maxMacroRecur'))
		options.maxMacroRecur = 5;

	var macroTable = preprocessor.populateMacroTable(string);
	string = preprocessor.removeMacroDefs(string);
	var lines = preprocessor._parse(string, false);
	var i = 0;
	var logs = [];
	var errFlag = false;
	var warnFlag = false;
	var last = '';
	var lastCount = 1;

	//Iterate over line
	while(i < lines.length) {
		var tokens = preprocessor.tokenize(lines[i]);
		var key = 0;
		if(tokens[0].slice(-1) == ':')
			key = 1;

		//If is macro
		if(preprocessor.isMacro(tokens[key], macroTable)){
			var macro = macroTable[tokens[key]];
			var args = preprocessor.getArgList(tokens);
			macroTable[tokens[key]].index++;

			//If maximum expansion rate exceeded
			if(macro.name == last && lastCount > options.maxMacroRecur) {
				if(options.hasOwnProperty('detectLoops') && options.detectLoops == true) {
					warnFlag = true;
					logs.push({
						line: i, type: 'fatal error',
						body: 'Looping/Recursive macro detected. Stopping expansion of macro after '+options.maxMacroRecur + ' expansions'
					})
					++i;
					continue;
					errFlag = true;
				}
			} else if(macro.name == last){
				++lastCount;
			} else {
				last = macro.name; lastCount = 1;
			}

			//Expand macro args and mangle locals
			var body = options.hasOwnProperty('mangleLocals') && options.mangleLocals == true? 
						preprocessor.mangleLocals(macro.body, macro, macro.index + 1):
						macro.body;

			//Empty macro body
				if(body.length == 0) {
				var final = lines.slice(0,i);
				final.push.apply(final, lines.slice(i+1));
				lines = final;
				continue;
			}

				body = preprocessor.expandArgs(body, macro, args);

			//If there was an error processing the arguments
			if(body == false) {
				errFlag = true;
				if(args.length > macro.args.length)
					logs.push({
						line: i, type: 'fatal error',
						body: 'Too many arguments for '+macro.name+'. Expected '+macro.args.length + ' got '+args.length+'.'
					});
				else
					logs.push({
						line: i, type: 'fatal error',
						body: 'Too few arguments for '+macro.name+'. Expected ' +macro.args.length + ' got '+args.length+'.'
					})
				++i;
				continue;
			}

			if(errFlag)
				continue;

			//Slice together the lines
			var final = lines.slice(0,i);
			final.push.apply(final, body);
			final.push.apply(final, lines.slice(i+1));
			lines = final;
		} else 
			++i;
	}
	return {
		lines: lines.join('\n'),
		success: !errFlag,
		warning: !warnFlag,
		logs: logs,
		debug: {
			macroTable: macroTable
		}
	};
}