//require from conversion (binToHex), from counter (incrementHex, decrementHex)

var registers = {
	A: '00',
	F: '00',								//Flag register, use counter.hexToBin(F, 8)
	B: '00',
	C: '00',
	D: '00',
	E: '00',
	H: '00',
	L: '00',
	SP: '0000',								//Counts as register pair, use corresponding funcs
	PC: '0000',								//Counts as register pair, use corresponding funcs
	IR: '00',								//Internal registers DO NOT USE unless you are writing a runner.
	Z: '00',
	W: '00',
	isRegister: /^[A-EH-LWZF]$/,
	isRegisterPair: /^B|D|H|PSW|SP|PC|WZ$/,
	options: {
		startAt: 'F500'
	}
	/*
	Methods       
	-------------- 
	getRegister		
	setRegister		
	getFlag			
	setFlag			
	increment
	decrement
	getPair
	setPair
	incrementPair
	decrementPair
	_mask
	swapRegisters.HLDE
	*/
}

registers.reset = function() {
	registers.A = '00';
	registers.F = '00';
	registers.B = '00';
	registers.C = '00';
	registers.D = '00';
	registers.E = '00';
	registers.H = '00';
	registers.L = '00';
	registers.SP = '0000';
	registers.PC = registers.options.startAt;
	registers.IR = '00';
	registers.W = '00';
	registers.Z = '00';
	
}

registers.getRegister = function (register) {
	if(registers.isRegister.test(register)) {
		return registers[register];
	} else {
		return false;
	}
}

registers.setRegister = function (register, data) {
	console.log("SET R", register, " TO ", data);

	if(!registers.isRegister.test(register))
		return false;

	if(registers.isRegister.test(data)) {
		registers[register] = registers[data];
	} else {
		registers[register] = data;
	}
	pbus.dispatchEvent(pbus.events.updatedRegister);
	return registers[register];
}

registers.getFlag = function (flag) {
	var val;

	switch(flag){
		case 'S': val = conversion.hexToBin(registers.F, 8)[0];
				  break;
		case 'Z': val = conversion.hexToBin(registers.F, 8)[1];
				  break;
		case 'AC':val = conversion.hexToBin(registers.F, 8)[3];
				  break;
		case 'P': val = conversion.hexToBin(registers.F, 8)[5];
				  break;
		case 'CY':val = conversion.hexToBin(registers.F, 8)[7];
				  break;
		default:  val = false;
				  break;
	}
	return val;
}

registers.setFlag = function (flag, onOff) {
	switch(flag){
		case 'S': registers.F = registers._mask(registers.F, 0, onOff);
				  break;
		case 'Z': registers.F = registers._mask(registers.F, 1, onOff);
				  break;
		case 'AC':registers.F = registers._mask(registers.F, 3, onOff);
				  break;
		case 'P': registers.F = registers._mask(registers.F, 5, onOff);
				  break;
		case 'CY':registers.F = registers._mask(registers.F, 7, onOff);
				  break;
		default:  registers.F = false;
				  break;
	}

	pbus.dispatchEvent(pbus.events.updatedRegister);
	return registers.F;
}

registers.increment = function (register) {
	var val = registers.getRegister(register);
	val = counter.incrementHex(val, 2);
	registers.setRegister(register, val);
	pbus.dispatchEvent(pbus.events.updatedRegister);
	return val;
}

registers.decrement = function (register) {
	var val = registers.getRegister(register);
	val = counter.decrementHex(val, 2);
	registers.setRegister(register, val);
	pbus.dispatchEvent(pbus.events.updatedRegister);
	return val;
}

registers.getPair = function (pair) {
	if(!registers.isRegisterPair.test(pair))
		return False;
	var val = '';
	switch(pair) {
		case 'PSW': val += registers.A + registers.F;
					break;
		case 'B': val += registers.B + registers.C;
				  break;
		case 'D': val += registers.D + registers.E;
				  break;
		case 'H': val += registers.H + registers.L;
				  break; 
		case 'SP': val += registers.SP;
				   break; 
		case 'PC': val += registers.PC;
				   break;
		case 'WZ': val += registers.W + registers.Z;
				   break; 
	}
	return val;
}

registers.setPair = function (pair, value) {
	if(!registers.isRegisterPair.test(pair))
		return False;
	value = conversion.pad(value, 4);
	var higher = value.slice(0,2);
	var lower = value.slice(2,4);
	switch(pair) {
		case 'PSW': registers.A = higher;
					registers.F = lower;
					break;
		case 'B': registers.B = higher;
				  registers.C = lower;
				  break;
		case 'D': registers.D = higher;
				  registers.E = lower;
				  break;
		case 'H': registers.H = higher;
		          registers.L = lower;
				  break;
		case 'WZ': registers.W = higher;
		          registers.Z = lower;
				  break;
		case 'SP': registers.SP = higher + lower;
				   break;
		case 'PC': registers.PC = higher + lower;
				   break;
	}
	pbus.dispatchEvent(pbus.events.updatedRegister);
	return value ;
}

registers.incrementPair = function (pair) {
	var val = registers.getPair(pair);
	val = counter.incrementHex(val, 4);
	registers.setPair(pair, val);
	pbus.dispatchEvent(pbus.events.updatedRegister);
	return val;
}

registers.decrementPair = function (pair) {
	var val = registers.getPair(pair);
	val = counter.decrementHex(val, 4);
	registers.setPair(pair, val);
	pbus.dispatchEvent(pbus.events.updatedRegister);
	return val;
}

registers._mask = function (hex, bitNo, onOff) {
	var bin = conversion.hexToBin(hex);
	var temp = bin.slice(0, bitNo) + onOff + bin.slice(bitNo + 1, bin.length);
	return conversion.binToHex(temp, hex.length); 
}