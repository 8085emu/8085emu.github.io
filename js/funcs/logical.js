/* Pass instr as ['OPCODE']
*/
dict['ANA'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];
	var A = registers.getRegister('A');
	var R = source == 'M' ? memory.readFrom(registers.getPair('H')): registers.getRegister(source);

	var result = logical.applyBitwise(A, R, logical.operations.and);

	registers.setRegister('A', result.value);
	registers.setFlag('CY', '0');
	registers.setFlag('AC', '1');
	registers.setFlag('P', result.flags.P);
	registers.setFlag('Z', result.flags.Z);
	registers.setFlag('S', result.flags.S);
}

/* Pass instr as ['OPCODE']
*/
dict['ANI'] = function(instr) {
	var A = registers.getRegister('A');
	var R = instr[1];

	var result = logical.applyBitwise(A, R, logical.operations.and);

	registers.setRegister('A', result.value);
	registers.setFlag('CY', '0');
	registers.setFlag('AC', '1');
	registers.setFlag('P', result.flags.P);
	registers.setFlag('Z', result.flags.Z);
	registers.setFlag('S', result.flags.S);
}

/* Pass instr as ['OPCODE']
*/
dict['ORA'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];
	var A = registers.getRegister('A');
	var R = source == 'M' ? memory.readFrom(registers.getPair('H')): registers.getRegister(source);

	var result = logical.applyBitwise(A, R, logical.operations.or);

	registers.setRegister('A', result.value);
	registers.setFlag('CY', '0');
	registers.setFlag('AC', '0');
	registers.setFlag('P', result.flags.P);
	registers.setFlag('Z', result.flags.Z);
	registers.setFlag('S', result.flags.S);
}

/* Pass instr as ['OPCODE']
*/
dict['ORI'] = function(instr) {
	var A = registers.getRegister('A');
	var R = instr[1];

	var result = logical.applyBitwise(A, R, logical.operations.or);

	registers.setRegister('A', result.value);
	registers.setFlag('CY', '0');
	registers.setFlag('AC', '0');
	registers.setFlag('P', result.flags.P);
	registers.setFlag('Z', result.flags.Z);
	registers.setFlag('S', result.flags.S);
}

/* Pass instr as ['OPCODE']
*/
dict['XRA'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];
	var A = registers.getRegister('A');
	var R = source == 'M' ? memory.readFrom(registers.getPair('H')): registers.getRegister(source);
	var result = logical.applyBitwise(A, R, logical.operations.xor);
	registers.setRegister('A', result.value);
	registers.setFlag('CY', '0');
	registers.setFlag('AC', '0');
	registers.setFlag('P', result.flags.P);
	registers.setFlag('Z', result.flags.Z);
	registers.setFlag('S', result.flags.S);
}

/* Pass instr as ['OPCODE']
*/
dict['XRI'] = function(instr) {
	var A = registers.getRegister('A');
	var R = instr[1];

	var result = logical.applyBitwise(A, R, logical.operations.xor);

	registers.setRegister('A', result.value);
	registers.setFlag('CY', '0');
	registers.setFlag('AC', '0');
	registers.setFlag('P', result.flags.P);
	registers.setFlag('Z', result.flags.Z);
	registers.setFlag('S', result.flags.S);
}

/* Pass instr as ['OPCODE']
*/
dict['CMA'] = function(instr) {
	var A = registers.getRegister('A');

	var result = logical.applyBitwise(A, logical.operations.not);

	registers.setRegister('A', result.value);
}

/* Pass instr as ['OPCODE']
*/
dict['CMC'] = function(instr) {
	registers.setFlag('CY', registers.getFlag('CY') == '0' ? '1': '0');
}

/* Pass instr as ['OPCODE']
*/
dict['STC'] = function(instr) {
	registers.setFlag('CY', '1');
}

/* Pass instr as ['OPCODE']
*/
dict['CMP'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];
	var minuend = registers.getRegister('A');
	var subtrahend = source == 'M' ? memory.readFrom(registers.getPair('H')): registers.getRegister(source);

	subtrahend = conversion.twosComplement(subtrahend);

	var result = adder.adder(minuend, subtrahend, '0');

	registers.setFlag('CY', result.flags.carry == '0' ? '1' : '0');
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE', 8-bit]
*/
dict['CPI'] = function(instr) {
	var minuend = registers.getRegister('A');
	var subtrahend =  conversion.twosComplement(instr[1]);

	var result = adder.adder(minuend, subtrahend, '0');

	registers.setFlag('CY', result.flags.carry == '0' ? '1' : '0');
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE']
*/
dict['RLC'] = function(instr) {
	var data = registers.getRegister('A');
	console.log(data, conversion.hexToBin(data)[0]);
	var result = shifter.shiftLeft(data, conversion.hexToBin(data)[0]);

	registers.setRegister('A', result.value);
	registers.setFlag('CY', data[0]);
}

/* Pass instr as ['OPCODE']
*/
dict['RRC'] = function(instr) {
	var data = registers.getRegister('A');
	var result = shifter.shiftRight(data, conversion.hexToBin(data)[7]);

	registers.setRegister('A', result.value);
	registers.setFlag('CY', data[0]);
}

/* Pass instr as ['OPCODE']
*/
dict['RAL'] = function(instr) {
	var data = registers.getRegister('A');
	var result = shifter.shiftLeft(data, registers.getFlag('CY'));

	registers.setRegister('A', result.value);
	registers.setFlag('CY', result.serialOut);
}

/* Pass instr as ['OPCODE']
*/
dict['RAR'] = function(instr) {
	var data = registers.getRegister('A');
	var result = shifter.shiftRight(data, registers.getFlag('CY'));

	registers.setRegister('A', result.value);
	registers.setFlag('CY', result.serialOut);
}

