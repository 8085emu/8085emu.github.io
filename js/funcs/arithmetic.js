//require: memory(*), registers(*), counter(*)

/* Pass instr as ['OPCODE']
*/
dict['ADD'] = function(instr) {
	var template = Microcodes[instr[0]];
	var augend = registers.getRegister('A');
	var nameAddend = template[1];
	var addend = nameAddend == 'M' ? memory.readFrom(registers.getPair('H')) : registers.getRegister(nameAddend);
	var result = adder.adder(augend, addend, "0");

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry);
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE']
*/
dict['ADC'] = function(instr) {
	var template = Microcodes[instr[0]];
	var augend = registers.getRegister('A');
	var nameAddend = template[1];
	var addend = nameAddend == 'M' ? memory.readFrom(registers.getPair('H')) : registers.getRegister(nameAddend);
	var result = adder.adder(augend, addend, registers.getFlag('C'));

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry);
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE', '8-bit']
*/
dict['ADI'] = function(instr) {
	var result = adder.adder(registers.getRegister('A'), instr[1], 0);

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry);
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE', 8-bit]
*/
dict['ACI'] = function(instr) {
	var result = adder.adder(registers.getRegister('A'), instr[1], registers.getFlag('C'));

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry);
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE']
*/
dict['SUB'] = function(instr) {
	var template = Microcodes[instr[0]];
	var minuend = registers.getRegister('A');
	var nameSubtrahend = template[1];
	var subtrahend = nameSubtrahend == 'M' ? memory.readFrom(registers.getPair('H')) : registers.getRegister(nameSubtrahend);

	subtrahend = conversion.onesComplement(subtrahend);

	var result = adder.adder(minuend, subtrahend, '1');
    console.log("::", result);

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry == '0' ? '1' : '0');
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE']
*/
dict['SBB'] = function(instr) {
	var template = Microcodes[instr[0]];
	var minuend = registers.getRegister('A');
	var nameSubtrahend = template[1];
	var subtrahend = nameSubtrahend == 'M' ? memory.readFrom(registers.getPair('H')) : registers.getRegister(nameSubtrahend);

	subtrahend = conversion.onesComplement(subtrahend);

	var result = adder.adder(minuend, subtrahend, registers.getFlag('CY') == '0' ? '1' : '0');

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry == '0' ? '1' : '0');
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}


/* Pass instr as ['OPCODE', 8-bit]
*/
dict['SUI'] = function(instr) {
	var template = Microcodes[instr[0]];
	var minuend = registers.getRegister('A');
	var subtrahend = instr[1];

	subtrahend = conversion.onesComplement(subtrahend);

	var result = adder.adder(minuend, subtrahend, '1');

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry == '0' ? '1' : '0');
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE', 8-bit]
*/
dict['SBI'] = function(instr) {
	var template = Microcodes[instr[0]];
	var minuend = registers.getRegister('A');
	var subtrahend = instr[1];

	subtrahend = conversion.onesComplement(subtrahend);

	var result = adder.adder(minuend, subtrahend, registers.getFlag('CY') == '0' ? '1' : '0');

	registers.setRegister('A', result.sum);
	registers.setFlag('CY', result.flags.carry == '0' ? '1' : '0');
	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE']
*/
dict['INR'] = function(instr) {
	var template = Microcodes[instr[0]];
	var target = template[1];
	var prev = target == 'M' ? memory.readFrom(registers.getPair('H')) : registers.getRegister(target);
	var result = adder.adder(prev, "01", "0");

	if(target == 'M')
		memory.writeTo(registers.getPair('H'), result.sum);
	else
		registers.increment(target);

	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE']
*/
dict['DCR'] = function(instr) {
	var template = Microcodes[instr[0]];
	var target = template[1];

	var prev = target == 'M' ? memory.readFrom(registers.getPair('H')) : registers.getRegister(target);
	var result = adder.adder(prev, conversion.onesComplement("01"), "1");

	if(target == 'M')
		memory.writeAt(registers.getPair('H'), result.sum);
	else
		registers.decrement(target);

	registers.setFlag('AC', result.flags.auxiliaryCarry);
	registers.setFlag('P', result.flags.parity);
	registers.setFlag('Z', result.flags.zero);
	registers.setFlag('S', result.flags.sign);
}

/* Pass instr as ['OPCODE']
*/ 
dict['INX'] = function(instr) {
	var template = Microcodes[instr[0]];
	var target = template[1];

	if(!['B', 'D', 'H', 'SP'].includes(target))
		return false;

	registers.setPair(target, adder.adder(registers.getPair(target), "0001", '0').sum);
}

/* Pass instr as ['OPCODE']
*/ 
dict['DCX'] = function(instr) {
	var template = Microcodes[instr[0]];
	var target = template[1];

	registers.setPair(target, adder.adder(registers.getPair(target), conversion.twosComplement("0001"), '0').sum);
}

/* Pass instr as ['OPCODE']
*/
dict['DAD'] = function(instr) {
	var template = Microcodes[instr[0]];
	var nameAddend = template[1];
	var augend = registers.getPair('H');
	var addend = registers.getPair(nameAddend);
	var result = adder.adder(augend, addend, '0');
	registers.setPair('H', result.sum);
	registers.setFlag('CY', result.flags.carry);
}

/* Pass instr as ['OPCODE']
*/
dict['DAA'] = function(instr) {
	/*From intel's documentation:
	IF 64-Bit Mode
	    THEN
	        #UD;
	    ELSE
	        old_AL ← AL;
	        old_CF ← CF;
	        CF ← 0;
	        IF (((AL AND 0FH) > 9) or AF = 1)
	                THEN
	                    AL ← AL + 6;
	                    CF ← old_CF or (Carry from AL ← AL + 6);
	                    AF ← 1;
	                ELSE
	                    AF ← 0;
	        FI;
	        IF ((old_AL > 99H) or (old_CF = 1))
	            THEN
	                    AL ← AL + 60H;
	                    CF ← 1;
	            ELSE
	                    CF ← 0;
	        FI;
	FI;
	This is a literal implementation
	*/
	var old = {
		data: registers.getRegister('A'),
		AC: registers.getFlag('AC'),
		CY: registers.getFlag('CY')
	};
	var result = false;

	registers.setFlag('CF', '0');
	if((conversion.hexToDec(old.data[1]) > 9) ||
	   (old.AC == '1')) {
		result = adder.adder(registers.getRegister('A'), '06', '0');
		registers.setRegister('A', result.sum);
		registers.setFlag('CY', old.CY == '1' ? '1': result.flags.carry)
		registers.setFlag('AC', '1');
	} else {
		registers.setFlag('AC', '0');
	}

	if(conversion.hexToDec(old.data) > 0x99 || old.CY == '1') {
		result = adder.adder(registers.getRegister('A'), '60', '0');
		registers.setRegister('A', result.sum);
		registers.setFlag('CY', '1');
	} else {
		registers.setFlag('CY', '0');
	}

	if(result){
		if(registers.getRegister('A') == '00' ) registers.setFlag('Z', '0');
		registers.setFlag('P', result.flags.parity);
		registers.setFlag('S', result.flags.sign);
	}
}
