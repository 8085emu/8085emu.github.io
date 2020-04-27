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
