// require none
// -warn duplication in counter as _pad for "Keeping modules standalone"

var __break_pts = []

var __raw_memory = {
	length: 65536,
	buffer: new ArrayBuffer(65536)
}

var memory = {
	length: 65536,
	data: new Uint8Array(__raw_memory.buffer),
}

memory.reset = function () {
	for(var i = 0; i < memory.length; ++i)
		memory.data[i] = 0;
}

//Function to return value as 2 hex digits
memory.readFrom = function (addr) {
	var address = parseInt(addr, 16);
	var num = memory.data[address];
	return memory._pad(num.toString(16), 2).toUpperCase();
}

//Function to read from raw memory address
memory.rawRead = function (addr) {
	var num = memory.data[addr];
	return memory._pad(num.toString(16), 2).toUpperCase();
}

//Function to write at address a byte (as hex string).
memory.writeAt = function (addr, data) {
	console.log("WRITTEN ", data, " AT ", addr);
	var address = parseInt(addr, 16);
	var num = parseInt(data, 16);
	memory.data[address] = num;
	return true;
}

//See conversion.pad
memory._pad = function (n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

memory.constructMinAssocArr = function(ignore) {
	if(ignore == undefined)
		ignore = '00';
	var obj = {};
	for(var i = 0; i < memory.length; ++i) {
		var data = memory.rawRead(i);
		if(data != '00')
			obj[memory._pad(i.toString(16), 4).toUpperCase()] = data;
	}
	return obj;
}

var breakpoints = {}

//Function to add a breakpoint
breakpoints.addBreakpoint = function (at) {
	console.log("ADDED BREAKPOINT @ ", at);
	__break_pts.push(at);
}	

//Function to check if at a breakpoint
breakpoints.checkIfBreakpointAt = function (loc) {
	return (__break_pts.includes(loc));
}