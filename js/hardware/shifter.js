//requires conversion(*)

var shifter = {};

shifter.shiftLeft = function (hex, serialIn) {
	var bin = conversion.hexToBin(hex);

	var res = '';

	if(serialIn === undefined)
		serialIn = bin[0];

	for(var i = 1; i < bin.length; ++i)
		res += bin[i];

	res += serialIn;

	return {
		value: conversion.binToHex(res, hex.length),
		serialOut: bin[0]
	}
}

shifter.shiftRight = function (hex, serialIn) {
	var bin = conversion.hexToBin(hex);

	var res = '';

	if(serialIn === undefined)
		serialIn = bin[bin.length - 1];

	for(var i = 0; i < bin.length - 1; ++i)
		res += bin[i];

	res = serialIn + res;

	return {
		value: conversion.binToHex(res, hex.length),
		serialOut: bin[bin.length - 1]
	}
}


shifter.shiftLeftHex = function(hex, shiftIn) {
	var temp = '';
	temp += hex.slice(1);
	temp += shiftIn;
	return temp;
}