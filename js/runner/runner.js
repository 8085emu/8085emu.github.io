// requires: memory, Microcodes, Bytes, registers, counter, conversion, display
var runner = {};
/* Two functions:
** runner.runFrom()
** runner.runSingleLine()
*/

//Assume starting position to be 0000
runner.at = '0000';

/* Runs a single line
** See definition of runFrom for more details
*/
runner.runSingleLine = function() {
	runner.runFrom(runner.at, 1);
}

/* Run the code from `from` till `step` steps.
** Runs till a HLT is encountered if `step` is false.
** Does no checking on infinite loops, so _may_ crash
*/
runner.runFrom = function (from, step) {
	registers.PC = from;

	//If user hasn't defined any states then remove step-limit
	if(step == false || step == undefined)
		step = Infinity;

	var halt = false;													//Halt
	var ct = 0;															//Count number of steps
	do {

		if(breakpoints.checkIfBreakpointAt(registers.PC) == true && step != 1) {
			console.log("Halting...");
			halt = true;
			buttons.setMode('stepThrough');
		} else {
		registers.IR = memory.readFrom(registers.PC);					//Taps into internal Code, DO NOT DO THIS
		registers.PC = counter.incrementHex(registers.PC);				//Done here solely for speed.

		var instrText = Microcodes[registers.IR];						//Fetch instruction details
		
		if(instrText == undefined) {						//If no such op exists then show error
			buttons.setMode('error');
			displayCells.setAddress('ERR ');
			displayCells.setData(registers.IR);
			return
		}

		var instrName = instrText[0];
		var instrLength = Bytes[registers.IR];
		var instr = [];													//To pass to runner, all
																		//runner functions take an array of at most 2 inputs
		instr.push(registers.IR);
			if(instrLength == 1) {										//If instr is single byte, we're done!
				dict[instrName](instr);
			} else if(instrLength == 2) {
				registers.Z = memory.readFrom(registers.PC);
				registers.PC = counter.incrementHex(registers.PC, 4);
				instr.push(registers.Z);

				dict[instrName](instr);
			} else if(instrLength == 3) {
				registers.Z = memory.readFrom(registers.PC);
				registers.PC = counter.incrementHex(registers.PC, 4);
				registers.W = memory.readFrom(registers.PC);
				registers.PC = counter.incrementHex(registers.PC, 4);
				instr.push(registers.W + registers.Z);

				dict[instrName](instr);
			}
		}
		if(instrName == 'HLT') {
			halt = true;
			displayCells.setAddress('SUCC');
			displayCells.setData('ES');
			buttons.mode = "invalid";
		} else {
			displayCells.setAddress(registers.PC);
			displayCells.setDataFromMemoryAtAddr();
			displayCells.updateHelpText();
		}
		runner.at = registers.PC;
	} while(halt != true && ++ct < step); 
}