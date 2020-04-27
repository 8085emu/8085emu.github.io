// require none
// -warn duplication in conversion as pad for "Keeping modules standalone"

var conversion = {};

//Convert from binary to hexadecimal
conversion.binToHex = function (bin, len) {
	if(len == undefined)
		len = 4;

	if(bin == '00000000')
		return '00';
	return conversion.pad(parseInt(bin, 2).toString(16), len).toUpperCase();
}

//Conversion from hexadecimal to binary
conversion.hexToBin = function (hex, len) {
	if(len == undefined)
		len = 8;

	if(hex == '00')
		return '00000000';
	return conversion.pad(parseInt(hex, 16).toString(2), len).toUpperCase();
}

//Conversion to twosComplement
conversion.twosComplement = function (hex) {
	var length = hex.length;
	var bin = conversion.hexToBin(hex, hex.length * 4);
	var temp = '';

	var complement = false;
	for(var i = bin.length - 1; i >= 0; --i) {
		var current = bin[i];
		if(current == '0') {
			if(complement)
				temp = '1' + temp;
			else
				temp = '0' + temp;
		} else if(current == '1') {
			if(complement)
				temp = '0' + temp;
			else {
				temp = '1' + temp;
				complement = true;
			}
		}
	}

	return conversion.binToHex(temp, length);
}

//Simple bit inversion
conversion.onesComplement = function (hex){
	var length = hex.length;
	var bin = conversion.hexToBin(hex);
	var temp = '';

	for(var i = bin.length - 1; i >= 0; --i)
		if(bin[i] == '0')
			temp = '1' + temp;
		else
			temp = '0' + temp;

	return conversion.binToHex(temp, length);
}

//Hexadecimal to decimal conversion
conversion.hexToDec = function (hexDigit) {
	return parseInt(hexDigit, 16).toString(10);
}

//Pad a number with `z`
/* If less than width
//   Create a new array of length of missing number of padding elements
//   Join that with `z`
//		Since array contained `undefined` joining results in only `z`'s
//	 Append n to it
*/
conversion.pad = function (n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}