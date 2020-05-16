//require conversion(*)

var adder = {}

//Adder, adds bit by bit
adder.adder = function (x, y, carry) {
	var result = {
		bin: ''
	}

	x = {
		hex: x,
		bin: conversion.hexToBin(x, x.length == 2 ? 8 : 16),
	};

	y = {
		hex: y,
		bin: conversion.hexToBin(y, y.length == 2 ? 8 : 16),
	};

	if((x.bin.length == 8 && y.bin.length == 8) || (x.bin.length == 16 && y.bin.length == 16))
		;
	else
		return false;

	var a = "";
	var b = "";
	var c = carry;
	var ac = false;
	var n = 0;
	var isZero = true;

	for(var i = x.bin.length - 1; i >= 0; --i) {
		a = x.bin[i];
		b = y.bin[i];

		var s = '';
		console.log("adding ", a, "&", b);
		if(a == '0' && b == '0' && c == '0') {				// 0 0 0 => 0 0
			c = '0';
			s = '0';
		} else if(a == '0' && b == '0' && c == '1') {		// 0 0 1 => 0 1
			c = '0';
			s = '1';
			isZero = false; ++n;
		} else if(a == '0' && b == '1' && c == '0') {		// 0 1 0 => 0 1
			c = '0';
			s = '1';
			isZero = false; ++n;
		} else if(a == '0' && b == '1' && c == '1') {		// 0 1 1 => 1 0
			c = '1';
			s = '0';
		} else if(a == '1' && b == '0' && c == '0') {		// 1 0 0 => 0 1
 			c = '0';
 			s = '1';
			isZero = false; ++n;
		} else if(a == '1' && b == '0' && c == '1') {		// 1 0 1 => 1 0
			c = '1';
			s = '0';
		} else if(a == '1' && b == '1' && c == '0') {		// 1 1 0 => 1 0
			c = '1';
			s = '0';
		} else if(a == '1' && b == '1' && c == '1') {		// 1 1 1 => 1 1
			c = '1';
			s = '1';
			isZero = false; ++n;
		}
		console.log("got ", c, ":", s);
		if((x.bin.length == 8 && i == 4 && c == '1') || (x.bin.length == 16 && i == 12 && c == '1'))
			ac = true;

		result.bin = s + result.bin;		
	}

	result.sum = conversion.binToHex(result.bin, x.hex.length);
	result.flags = {
		carry: c,
		auxiliaryCarry: ac ? '1' : '0',
		parity: n % 2 == 0 ? '1' : '0',
		zero: isZero ? '1' : '0',
		sign: result.bin[0]
	}
	delete result.bin;
	return result;
}
