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
    assembler.stateObject.breakPointLineAt = [];
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
