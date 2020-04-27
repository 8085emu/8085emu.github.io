//require conversion(*)

var logical = {
	operations: {}
}

logical.applyBitwise = function (x, y, operation) {
	var result = {
		bin: '',
		flags: {
			CY: '0',
			P: '1',
			AC: operation === undefined ? y(): operation(),
			Z: '1',
			S: '0'
		}
	};

	x = {
		hex: x,
		bin: conversion.hexToBin(x, x.length * 4)
	}

	if(operation === undefined) {
		operation = y;
		if(x.bin.length != 8) 
			return false;

		for(var i = 0; i < x.bin.length; ++i)
			result.bin += operation(x.bin[i]);
	} else {

		y = {
			hex: y,
			bin: conversion.hexToBin(y, y.length * 4)
		}

		if((x.bin.length == 8 && y.bin.length == 8) || (x.bin.length == 16 && y.bin.length == 16)) 
			;
		else
			return false;

		for(var i = 0; i < x.bin.length; ++i){
			var current = operation(x.bin[i], y.bin[i])
			result.bin += current;
			if(current == '1') {
				result.flags.P = result.flags.P == '1' ? '0' : '1';
				result.flags.Z = '0';
			}
			if(i == 0)
				result.flags.S = current;
		}
	}

	result.value = conversion.binToHex(result.bin, x.hex.length);

	delete result.bin;

	return result;
}

logical.logicinator = logical.applyBitwise;

//For all functions, calling logical.operations.<operation>() returns AC flag
logical.operations.xor = function (a, b) {
	if(a == undefined && b == undefined)
		return '0';

		 if (a == '0' && b == '0') return '0';
	else if (a == '0' && b == '1') return '1';
	else if (a == '1' && b == '0') return '1';
	else if (a == '1' && b == '1') return '0';
	return false;
};

logical.operations.or = function (a, b) {
	if(a == undefined && b == undefined)
		return '0';

	     if (a == '0' && b == '0') return '0';
	else if (a == '0' && b == '1') return '1';
	else if (a == '1' && b == '0') return '1';
	else if (a == '1' && b == '1') return '1';
	return false;
};

logical.operations.and = function (a, b) {
	if(a == undefined && b == undefined)
		return '1';

	     if (a == '0' && b == '0') return '0';
	else if (a == '0' && b == '1') return '0';
	else if (a == '1' && b == '0') return '0';
	else if (a == '1' && b == '1') return '1';
	return false;
};

logical.operations.not = function (a) {
	if(a == undefined)
		return undefined;							//Flag not changed.

		 if(a == '0') return '1';
	else if(a == '1') return '0';
	return false;
};

