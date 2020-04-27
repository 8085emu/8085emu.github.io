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
