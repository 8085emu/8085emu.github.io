/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JMP'] = function(instr) {
	registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JZ'] = function(instr) {
	if(registers.getFlag('Z') == '1')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JNZ'] = function(instr) {
	console.log(instr[1]);
	if(registers.getFlag('Z') == '0')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JC'] = function(instr) {
	if(registers.getFlag('CY') == '1')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JNC'] = function(instr) {
	if(registers.getFlag('CY') == '0')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JP'] = function(instr) {
	if(registers.getFlag('S') == '0')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JM'] = function(instr) {
	if(registers.getFlag('S') == '1')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JPE'] = function(instr) {
	if(registers.getFlag('P') == '1')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['JPO'] = function(instr) {
	if(registers.getFlag('P') == '0')
		registers.setPair('PC', instr[1]);
	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE', 16-bit]
*/
dict['CALL'] = function(instr) {
	addr = registers.getPair('PC');

	var higher = addr.slice(0,2);
	var lower = addr.slice(2,4);

	registers.decrementPair('SP');
	memory.writeAt(registers.getPair('SP'), higher);

	registers.decrementPair('SP');
	memory.writeAt(registers.getPair('SP'),lower);

	registers.setPair('PC', instr[1]);

	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE']
*/
dict['RET'] = function(instr) {
	var val = memory.readFrom(registers.getPair('SP'));
	registers.incrementPair('SP');

	val = memory.readFrom(registers.getPair('SP')) + val;
	registers.incrementPair('SP');

	registers.setPair('PC', val);

	return {
		nextInstr: 0
	}
}

/* Pass instr as ['OPCODE']
*/
dict['RZ'] = function(instr) {
	if(registers.getFlag('Z') == '1')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['RNZ'] = function(instr) {
	if(registers.getFlag('Z') == '0')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['RC'] = function(instr) {
	if(registers.getFlag('CY') == '1')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['RNC'] = function(instr) {
	if(registers.getFlag('CY') == '0')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['RP'] = function(instr) {
	if(registers.getFlag('S') == '0')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['RM'] = function(instr) {
	if(registers.getFlag('S') == '1')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['RPE'] = function(instr) {
	if(registers.getFlag('P') == '1')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['RPO'] = function(instr) {
	if(registers.getFlag('P') == '0')
		dict['RET']('C9');
}

/* Pass instr as ['OPCODE']
*/
dict['HLT'] = function(instr) {
	return {
		nextInstr: 0,
		state: 'stopped'
	}
}

/* Special, nonstandard opcode for Hardware-based vectored interrupt
** should only be called directly from a env if and when required
** should not be referenced or included in code
** opcode doesn't exist, so no microcode or bytes
** mode85asm doesn't support this for obvious reasons
*/

/* Pass instr as ['OPCODE', 'INTEGER', 'FRACTIONAL']
*/
dict['HRST'] = function(instr) {
	var value = parseInt(instr[1]);
	switch(value) {
		case 4: dict["CALL"](['CD', '0024']);
				break;
		case 5: dict["CALL"](['CD', '002C']);
				break;
		case 6: dict["CALL"](['CD', '0034']);
				break;
		case 7: dict["CALL"](['CD', '003C']);
				break;		
	}
}

/* Pass instr as ['OPCODE']
*/
dict['RST'] = function(instr) {
	var template = Microcodes[instr[0]];
	var value = parseInt(template[1]);

	switch(value) {
		case 0: dict["CALL"](['CD', '0000']);
				break;
		case 1: dict["CALL"](['CD', '0008']);
				break;
		case 2: dict["CALL"](['CD', '0010']);
				break;
		case 3: dict["CALL"](['CD', '0018']);
				break;
		case 4: dict["CALL"](['CD', '0020']);
				break;
		case 5: dict["CALL"](['CD', '0028']);
				break;
		case 6: dict["CALL"](['CD', '0030']);
				break;
		case 7: dict["CALL"](['CD', '0038']);
				break;
	}
}

/* Pass instr
*/

/* Pass instr as ['OPCODE']
*/
dict['NOP'] = function(instr) {
	; //Do nothing
		//Make sure this is actually not doing anything to avoid severe performance penalties
		//In regular programs
}