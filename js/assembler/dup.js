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
