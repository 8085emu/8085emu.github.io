/* Pass instr as ['OPCODE']
*/
dict['PUSH'] = function(instr) {
	var template = Microcodes[instr[0]];
	var source = template[1];

	var address = registers.getPair('SP');
	var data = registers.getPair(source);
	var upper = data.slice(0,2);
	var lower = data.slice(2,4);

	address = counter.decrementHex(address);
	memory.writeAt(address, upper);
	address = counter.decrementHex(address);
	memory.writeAt(address, lower);
	registers.setPair('SP', address);
}

/* Pass instr as ['OPCODE']
*/
dict['POP'] = function(instr) {
	var template = Microcodes[instr[0]];
	var target = template[1];
	var data = '';
	var address = registers.getPair('SP');

	data += memory.readFrom(address);
	address = counter.incrementHex(address);
	data = memory.readFrom(address) + data;
	address = counter.incrementHex(address);

	console.log(data);

	registers.setPair(target, data);
	registers.setPair('SP', address);
}

/* Pass instr as ['OPCODE']
*/
dict['SPHL'] = function(instr) {
	registers.setPair('SP', registers.getPair('H'));
}

/* Pass instr as ['OPCODE']
*/
dict['XTHL'] = function(instr) {
	var lower = registers.getPair('L');
	var higher = registers.getPair('H');

	registers.setRegister('L', memory.readFrom(registers.getPair('SP')));
	registers.setRegister('H', memory.readFrom(counter.incrementHex(registers.getPair('SP'))));

	memory.writeAt(registers.getPair('SP'), lower);
	memory.writeAt(counter.incrementHex(registers.getPair('SP')), upper);
}