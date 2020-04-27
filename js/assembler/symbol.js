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

    if(assembler.parser.type(label.toUpperCase()) == 'name') {
        assembler.stateObject.addError('AMSYM_LABELISNAME', at);
        return false;
    }

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
