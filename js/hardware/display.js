//require DOM, counter(incrementHex, decrementHex), memory (*), microcodes

var displayCells = {
	cells: document.getElementsByClassName('display-cell'),
	length: 6,
	data: [4,5],
	address: [0,1,2,3],
	currentCell: 1,
	regex: /^[0-9a-fA-F]$/,
	helper: document.querySelector('.helper-text'),
	arrowMod: true
	/*
	changeFocusTo
	setup
	updateHelpText
	getData
	setData
	setDataFromMemoryAtAddr
	getAddress
	increment
	decrement
	shiftInInputData
	shiftInInputAddr
	*/
}

displayCells.reset = function () {
	displayCells.setData();
	displayCells.setAddress();
}

displayCells.setArrowMod = function(bool) {
	displayCells.arrowMod = bool;
}

displayCells.increment = function () {
	if(displayCells.getAddress() == '' || displayCells.getData() == '') {
		return;
	}
	var addr = displayCells.getAddress();
	var data = displayCells.getData();

	memory.writeAt(addr, data);

	addr = counter.incrementHex(addr);
	for(var i = 0; i < displayCells.address.length; ++i)
		displayCells.cells[displayCells.address[i]].value = addr[i];
	displayCells.setDataFromMemoryAtAddr();
	displayCells.updateHelpText();
}

displayCells.decrement = function () {
	if(displayCells.getAddress() == '' || displayCells.getData() == '') {
		return;
	}
	var addr = displayCells.getAddress();
	var data = displayCells.getData();

	memory.writeAt(addr, data);

	addr = counter.decrementHex(addr);
	for(var i = 0; i < displayCells.address.length; ++i)
		displayCells.cells[displayCells.address[i]].value = addr[i];
	displayCells.setDataFromMemoryAtAddr();
	displayCells.updateHelpText();
}

displayCells.setup = function (e) {
	for (let i = 0; i < displayCells.length; ++i) {
		displayCells.cells[i].addEventListener('input', function(e) {
			text = this.value;
			if(displayCells.regex.test(text)) {
				this.value = this.value.toUpperCase();
				if(i < 5)
					displayCells.changeFocusTo(i+1);
				else if(i === 5) {
					memory.writeAt(displayCells.getAddress(), displayCells.getData());
					displayCells.increment();
					displayCells.changeFocusTo(displayCells.data[0]);
				}
			} else {
				this.value = '';
			}
			displayCells.updateHelpText();
		});
	}
}

displayCells.getData = function () {
	var temp = '';
	for(var i = 0; i < displayCells.data.length; ++i) {
		temp += displayCells.cells[displayCells.data[i]].value;
	}
	return temp;
}

displayCells.setData = function (data) {
	if(data == undefined)
		data = '  ';

	data = conversion.pad(data, 2);

	for(var i = 0; i < displayCells.data.length; ++i) {
		displayCells.cells[displayCells.data[i]].value = data[i];
	}
}

displayCells.setDataFromMemoryAtAddr = function () {
	var addr = displayCells.getAddress();
	var data = memory.readFrom(addr);
	for(var i = 0; i < displayCells.data.length; ++i) {
		displayCells.cells[displayCells.data[i]].value = data[i];
	}
}

displayCells.getAddress = function () {
	var temp = '';
	for(var i = 0; i < displayCells.address.length; ++i) {
		temp += displayCells.cells[displayCells.address[i]].value;
	}
	return temp;
}

displayCells.setAddress = function (data) {
	if(data == undefined)
		data = '    ';

	data = conversion.pad(data, 4);

	for(var i = 0; i < displayCells.address.length; ++i) {
		displayCells.cells[displayCells.address[i]].value = data[i];
	}
}

displayCells.updateHelpText = function (data) {
	var str;
	if(data == undefined)
		str = displayCells.getData();
	else
		str = data;

	var addr = counter.incrementHex(displayCells.getAddress());
	var code = Microcodes["" + str];							//DO NOT TOUCH OTHER THAN
																//PLAIN ACCESS, JS makes reference
	if(code === undefined){
		console.log('Invalid opcode!');
		document.querySelector('#helper-microcode').textContent = str;
		document.querySelector('#complete-instruction').textContent = 'Data';
		document.querySelector('#instr-heading').textContent = '';
		document.querySelector('#instr-description').textContent = '';
		return;
	}

	var tinstr = '';
	for(var i = 0; i < code.length; ++i) 
		tinstr += code[i] + ((i > 0 && i < code.length - 1)?', ':'  ');

	document.querySelector('#helper-microcode').textContent = tinstr;

	var bytes = Bytes[str];										//DO NOT TOUCH JS makes reference
	
	var instr = code[0];
	for(var i = 1; i < code.length; ++i) {
		if(code[i] == '8-bit') {
			instr += ' ' + memory.readFrom(addr) + (((code.length - 1) > i) ? ',':' ');
			addr = counter.incrementHex(addr);
		} else if(code[i] == '16-bit') {
			var temp = '';
			temp = memory.readFrom(addr) + temp;
			addr = counter.incrementHex(addr);
			temp = memory.readFrom(addr) + temp;
			instr += ' ' + temp + (((code.length - 1) > i) ? ',':' ');
		} else {
			instr += ' ' + code[i] + (((code.length - 1) > i) ? ',':' ');
		}
	}

	document.querySelector('#complete-instruction').textContent = instr;

	document.querySelector('#instr-heading').textContent = code[0];
	document.querySelector('#instr-description').textContent = Instructions[code[0]].description;
}

displayCells.changeFocusTo = function (n) {
	displayCells.cells[n].select();
}

displayCells.shiftInInputData = function(data) {
	displayCells.setData(shifter.shiftLeftHex(displayCells.getData(), data));
}

displayCells.shiftInInputAddress = function(data) {
	displayCells.setAddress(shifter.shiftLeftHex(displayCells.getAddress(), data));
}

window.addEventListener('load', displayCells.setup);