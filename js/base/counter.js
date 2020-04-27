// require none
// -warn duplication in counter as _pad for "Keeping modules standalone"

var counter = {}

//Decrement hexadecimal number with underflow
counter.decrementHex = function (hex, len) {
	if(len == undefined && (hex.length != 2 && hex.length != 4))
		len = 4;
	else
		len = hex.length;

	if(hex == '0000' && len == 4)
		return 'FFFF';
	else if(hex == '00' && len == 2)
		return 'FF';

	return counter._pad((parseInt(hex, 16) - 1).toString(16), len).toUpperCase();
}

//Increment hexadecimal number with overflow
counter.incrementHex = function (hex, len){
	if(len == undefined && (hex.length != 2 && hex.length != 4))
		len = 4;
	else
		len = hex.length;

	if(hex == 'FFFF' && len == 4)
		return '0000';
	else if(hex == 'FF' && len == 2)
		return '00';

	return counter._pad((parseInt(hex, 16) + 1).toString(16), len).toUpperCase();
}

//Same as conversion.pad
counter._pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}