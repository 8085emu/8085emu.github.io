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