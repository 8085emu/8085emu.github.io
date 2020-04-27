//require: DOM, registers(*)

var registerDisplay = {
	cells: document.getElementsByClassName('register'),
	flags: document.getElementsByClassName('register-flags'),
	doUpdates: true,
	name: {
		flag: {}
	}
}

registerDisplay.updateRegisters = function(e) {
	if(!registerDisplay.doUpdates)
		return;

	registerDisplay.name.A.querySelector('i').textContent  = registers.getRegister('A');
	registerDisplay.name.B.querySelector('i').textContent  = registers.getRegister('B');
	registerDisplay.name.C.querySelector('i').textContent  = registers.getRegister('C');
	registerDisplay.name.D.querySelector('i').textContent  = registers.getRegister('D');
	registerDisplay.name.E.querySelector('i').textContent  = registers.getRegister('E');
	registerDisplay.name.H.querySelector('i').textContent  = registers.getRegister('H');
	registerDisplay.name.L.querySelector('i').textContent  = registers.getRegister('L');
	registerDisplay.name.SP.querySelector('i').textContent = registers.getPair('SP');
	registerDisplay.name.PC.querySelector('i').textContent = registers.getPair('PC');
	registerDisplay.name.flag.S.textContent  = registers.getFlag('S');
	registerDisplay.name.flag.Z.textContent  = registers.getFlag('Z');
	registerDisplay.name.flag.AC.textContent = registers.getFlag('AC');
	registerDisplay.name.flag.P.textContent  = registers.getFlag('P');
	registerDisplay.name.flag.CY.textContent = registers.getFlag('CY');
}

registerDisplay.setup = function(e) {
	pbus.addEventListener('register-updated', registerDisplay.updateRegisters);
	registerDisplay.name.A = registerDisplay.cells[0];
	registerDisplay.name.B = registerDisplay.cells[2];
	registerDisplay.name.C = registerDisplay.cells[3];
	registerDisplay.name.D = registerDisplay.cells[4];
	registerDisplay.name.E = registerDisplay.cells[5];
	registerDisplay.name.H = registerDisplay.cells[6];
	registerDisplay.name.L = registerDisplay.cells[7];

	registerDisplay.name.SP = registerDisplay.cells[8];
	registerDisplay.name.PC = registerDisplay.cells[9];

	registerDisplay.name.flag.S  = document.getElementById('flag-S');
	registerDisplay.name.flag.Z  = document.getElementById('flag-Z');
	registerDisplay.name.flag.AC = document.getElementById('flag-AC');
	registerDisplay.name.flag.P  = document.getElementById('flag-P');
	registerDisplay.name.flag.CY = document.getElementById('flag-CY');
}

registerDisplay.setEcho = function(value) {
	if(value) {
		registerDisplay.doUpdates = true;
		registerDisplay.updateRegisters();
	} else
		registerDisplay.doUpdates = false;
}

window.addEventListener('load', registerDisplay.setup);