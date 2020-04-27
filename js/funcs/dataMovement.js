//Requires memory(*), counter(*), registers(*)

/* Pass instr as ['OPCODE']
*/
dict['MOV'] = function(instr) {
	var template = Microcodes[instr[0]];
	var destination = template[1];
	var source = template[2];

	if(destination == 'M')
		memory.writeAt(registers.getPair('H'), registers.getRegister(source));
	else {
		if(source == 'M')
			registers.setRegister(destination, memory.readFrom(registers.getPair('H')));
		else
			registers.setRegister(destination, registers.getRegister(source));
	}
}

/* Pass instr as ['OPCODE', '8-bit']
*/
dict['MVI'] = function(instr) {
	var template = Microcodes[instr[0]];
	var destination = template[1];
	var data = instr[1];

	if(destination == 'M')
		memory.writeAt(registers.getPair('H'), data);
	else
		registers.setRegister(destination, data);
}

/* Pass instr as ['OPCODE', '16-bit']
*/
dict['LDA'] = function(instr) {
	registers.setRegister('A', memory.readFrom(instr[1]));
}

/* Pass instr as ['OPCODE', '16-bit']
*/
dict['LXI'] = function(instr) {
	var template = Microcodes[instr[0]];
	console.log(instr[0]);
	var destination = template[1];
	registers.setPair(destination, instr[1]);
}

/* Pass instr as ['OPCODE']
*/
dict['LDAX'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];
	registers.setRegister('A', memory.readFrom(registers.getPair(source)));
}

/*	Pass instr as ['OPCODE', '16-bit']
*/
dict['LHLD'] = function(instr) {
	registers.setPair('H', memory.readFrom(counter.incrementHex(instr[1])) + memory.readFrom(instr[1]))
}

/* Pass instr as ['OPCODE', '16-bit'] 
*/
dict['STA'] = function(instr) {
	memory.writeAt(instr[1], registers.getRegister('A'));
}

/* Pass instr as ['OPCODE']
*/
dict['STAX'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];
	memory.writeAt(registers.getPair(source), registers.getRegister('A'));
}

/* Pass instr as ['OPCODE', '16-bit']
*/
dict['SHLD'] = function(instr) {
	memory.writeAt(instr[1], registers.getRegister('L'));
	memory.writeAt(counter.incrementHex(instr[1]), registers.getRegister('H'));
}

/* Pass instr as ['OPCODE']
*/
dict['XCHG'] = function(instr) {
	var val = registers.getPair('H');

	registers.setPair('H', registers.getPair('D'));
	registers.setPair('D', val);
}

/* Pass instr as ['OPCODE']
*/
dict['PUSH'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];
	var data = registers.getPair(source);
	var higher = data.slice(0,2);
	var lower = data.slice(2,4);

	registers.decrementPair('SP');
	memory.writeAt(registers.getPair('SP'), higher);

	registers.decrementPair('SP');
	memory.writeAt(registers.getPair('SP'), lower);
}

/* Pass instr as ['OPCODE']
*/
dict['POP'] = function(instr) {
	var template = Microcodes[instr[0]];
	var destination = template[1];
	
	var val = memory.readFrom(registers.getPair('SP'));
	registers.incrementPair('SP');

	val = memory.readFrom(registers.getPair('SP')) + val;
	registers.incrementPair('SP');

	registers.setPair(destination, val);
}

/* UNDEFINED, WILL THROW ERROR*/
dict['IN'] = function(instr) {
	pbus.dispatchEvent(pbus.events.error);
}

dict['OUT'] = function(instr) {
	pbus.dispatchEvent(pbus.events.error);
}